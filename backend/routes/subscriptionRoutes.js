const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { createSubscriptionSchema } = require('../validators/subscriptionValidator');

const router = express.Router();

// Helper: Normalize merchant name (e.g. "Netflix Inc. #492" -> "netflix")
function normalizeMerchant(desc) {
  if (!desc) return 'unknown';
  let cleaned = desc.toLowerCase();
  cleaned = cleaned.replace(/[^a-z0-9\s]/g, ' ');
  cleaned = cleaned.replace(/\b(inc|ltd|co|com|pvt|corp|payment|sub|bill|auto|card)\b/g, '');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return cleaned || desc.toLowerCase().trim();
}

// GET all subscriptions (combines DB saved subscriptions + auto-detected from transactions)
router.get('/', authMiddleware, async (req, res) => {
  try {
    // 1. Fetch ALL saved subscriptions from DB for user (including cancelled ones)
    const dbSubRes = await pool.query(
      `SELECT s.*, c.name as category_name
       FROM subscriptions s
       LEFT JOIN categories c ON s.category_id = c.id
       WHERE s.user_id = $1
       ORDER BY s.next_billing_date ASC`,
      [req.userId]
    );

    const allDbSubs = dbSubRes.rows;
    const activeSavedSubscriptions = allDbSubs.filter((s) => s.status === 'active');
    const cancelledMerchantNames = new Set(
      allDbSubs.filter((s) => s.status === 'cancelled' || s.status === 'dismissed').map((s) => normalizeMerchant(s.name))
    );

    // 2. Fetch past 6 months transactions for auto-detection
    const txRes = await pool.query(
      `SELECT t.*, c.name as category_name
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = $1 AND t.transaction_date >= NOW() - INTERVAL '6 months'
       ORDER BY t.transaction_date DESC`,
      [req.userId]
    );

    const transactions = txRes.rows;

    // Group transactions by normalized merchant
    const merchantGroups = {};
    transactions.forEach((tx) => {
      const merchant = normalizeMerchant(tx.description);
      if (!merchantGroups[merchant]) {
        merchantGroups[merchant] = {
          raw_name: tx.description || merchant,
          category_id: tx.category_id,
          category_name: tx.category_name,
          instances: [],
        };
      }
      merchantGroups[merchant].instances.push(tx);
    });

    const detectedSubscriptions = [];

    // Analyze merchant groups for recurring periodicity
    Object.keys(merchantGroups).forEach((merchantKey) => {
      // Skip if user explicitly cancelled/dismissed this merchant
      if (cancelledMerchantNames.has(merchantKey)) return;

      const group = merchantGroups[merchantKey];
      const instances = group.instances;

      if (instances.length >= 2) {
        instances.sort((a, b) => new Date(a.transaction_date) - new Date(b.transaction_date));

        const intervals = [];
        for (let i = 1; i < instances.length; i++) {
          const d1 = new Date(instances[i - 1].transaction_date);
          const d2 = new Date(instances[i].transaction_date);
          const diffDays = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
          intervals.push(diffDays);
        }

        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const amounts = instances.map((t) => parseFloat(t.amount));
        const latestAmount = amounts[amounts.length - 1];
        const prevAvgAmount = amounts.slice(0, -1).reduce((a, b) => a + b, 0) / (amounts.length - 1);
        const hasPriceHike = amounts.length >= 2 && latestAmount > prevAvgAmount * 1.08;

        let billingCycle = null;
        if (avgInterval >= 24 && avgInterval <= 35) {
          billingCycle = 'monthly';
        } else if (avgInterval >= 340 && avgInterval <= 380) {
          billingCycle = 'yearly';
        }

        if (billingCycle) {
          const lastTxDate = new Date(instances[instances.length - 1].transaction_date);
          const nextBillingDate = new Date(lastTxDate);
          nextBillingDate.setDate(nextBillingDate.getDate() + Math.round(avgInterval));

          const alreadySaved = activeSavedSubscriptions.some(
            (s) => normalizeMerchant(s.name) === merchantKey
          );

          if (!alreadySaved) {
            detectedSubscriptions.push({
              name: group.raw_name,
              amount: latestAmount,
              billing_cycle: billingCycle,
              category_id: group.category_id,
              category_name: group.category_name,
              next_billing_date: nextBillingDate.toISOString().slice(0, 10),
              is_auto_detected: true,
              confidence: 'High',
              has_price_hike: hasPriceHike,
              price_hike_diff: hasPriceHike ? parseFloat((latestAmount - prevAvgAmount).toFixed(2)) : 0,
              occurrences_count: instances.length,
            });
          }
        }
      }
    });

    // Format all active subscriptions (Saved + Auto-Detected)
    const allSubscriptions = [
      ...activeSavedSubscriptions.map((s) => ({
        id: s.id,
        name: s.name,
        amount: parseFloat(s.amount),
        billing_cycle: s.billing_cycle,
        category_id: s.category_id,
        category_name: s.category_name || 'General',
        next_billing_date: s.next_billing_date ? new Date(s.next_billing_date).toISOString().slice(0, 10) : null,
        is_auto_detected: s.is_auto_detected,
        status: s.status,
      })),
      ...detectedSubscriptions,
    ];

    // Compute aggregated metrics
    let totalMonthly = 0;
    let totalYearly = 0;
    const now = new Date();
    const upcomingNext7Days = [];

    allSubscriptions.forEach((sub) => {
      const amt = parseFloat(sub.amount);
      if (sub.billing_cycle === 'monthly') {
        totalMonthly += amt;
        totalYearly += amt * 12;
      } else if (sub.billing_cycle === 'yearly') {
        totalMonthly += amt / 12;
        totalYearly += amt;
      }

      if (sub.next_billing_date) {
        const nextDate = new Date(sub.next_billing_date);
        const diffDays = Math.ceil((nextDate - now) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 7) {
          upcomingNext7Days.push({ ...sub, days_until_renewal: diffDays });
        }
      }
    });

    res.json({
      subscriptions: allSubscriptions,
      metrics: {
        total_active_count: allSubscriptions.length,
        total_monthly_spend: parseFloat(totalMonthly.toFixed(2)),
        total_annual_spend: parseFloat(totalYearly.toFixed(2)),
        upcoming_count_7days: upcomingNext7Days.length,
        upcoming_renewals: upcomingNext7Days,
      },
    });
  } catch (err) {
    console.error('Error in subscription detection:', err);
    res.status(500).json({ error: 'Server error detecting subscriptions' });
  }
});

// POST /api/subscriptions — Add a custom tracked subscription
router.post('/', authMiddleware, validate(createSubscriptionSchema), async (req, res) => {
  const { name, amount, billing_cycle, category_id, next_billing_date, status } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO subscriptions (user_id, name, amount, billing_cycle, category_id, next_billing_date, is_auto_detected, status)
       VALUES ($1, $2, $3, $4, $5, $6, false, $7)
       RETURNING *`,
      [req.userId, name, amount, billing_cycle || 'monthly', category_id || null, next_billing_date || null, status || 'active']
    );
    res.status(201).json({ message: 'Subscription added successfully', subscription: result.rows[0] });
  } catch (err) {
    console.error('Error adding subscription:', err);
    res.status(500).json({ error: 'Server error adding subscription' });
  }
});

// POST /api/subscriptions/dismiss — Dismiss/Delete an auto-detected or saved subscription by name/ID
router.post('/dismiss', authMiddleware, async (req, res) => {
  const { id, name } = req.body;
  try {
    if (id) {
      await pool.query('UPDATE subscriptions SET status = $1 WHERE id = $2 AND user_id = $3', ['cancelled', id, req.userId]);
    } else if (name) {
      await pool.query(
        `INSERT INTO subscriptions (user_id, name, amount, billing_cycle, status, is_auto_detected)
         VALUES ($1, $2, 0, 'monthly', 'cancelled', true)
         ON CONFLICT DO NOTHING`,
        [req.userId, name]
      );
    }
    res.json({ message: 'Subscription removed successfully' });
  } catch (err) {
    console.error('Error dismissing subscription:', err);
    res.status(500).json({ error: 'Server error dismissing subscription' });
  }
});

// DELETE /api/subscriptions/:id — Remove saved subscription
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM subscriptions WHERE id = $1 AND user_id = $2 RETURNING *', [id, req.userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    res.json({ message: 'Subscription deleted successfully' });
  } catch (err) {
    console.error('Error deleting subscription:', err);
    res.status(500).json({ error: 'Server error deleting subscription' });
  }
});

module.exports = router;
