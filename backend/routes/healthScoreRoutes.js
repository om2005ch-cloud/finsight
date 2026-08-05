const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/health-score — Deterministic Financial Health Score (0-100) & Gamified Micro-Habits
router.get('/', authMiddleware, async (req, res) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 8) + '01';

    // 1. Budget Adherence Data
    const budgetRes = await pool.query(
      `SELECT 
         b.monthly_limit,
         COALESCE(SUM(t.amount), 0) AS spent
       FROM budgets b
       LEFT JOIN transactions t 
         ON t.category_id = b.category_id 
         AND t.user_id = b.user_id
         AND DATE_TRUNC('month', t.transaction_date) = DATE_TRUNC('month', b.month::date)
       WHERE b.user_id = $1 AND DATE_TRUNC('month', b.month::date) = DATE_TRUNC('month', $2::date)
       GROUP BY b.id, b.monthly_limit`,
      [req.userId, currentMonth]
    );

    let budgetPoints = 35; // default max
    let overBudgetCategoriesCount = 0;
    if (budgetRes.rows.length > 0) {
      let totalLimit = 0;
      let totalSpent = 0;
      budgetRes.rows.forEach((b) => {
        totalLimit += parseFloat(b.monthly_limit);
        totalSpent += parseFloat(b.spent);
        if (parseFloat(b.spent) > parseFloat(b.monthly_limit)) {
          overBudgetCategoriesCount++;
        }
      });
      const ratio = totalLimit > 0 ? totalSpent / totalLimit : 1;
      if (ratio > 1) {
        budgetPoints = Math.max(0, Math.round(35 - (ratio - 1) * 35));
      }
    }

    // 2. Goal Progress Data
    const goalRes = await pool.query(
      `SELECT target_amount, current_amount FROM goals WHERE user_id = $1`,
      [req.userId]
    );

    let goalPoints = 25; // default starting score
    if (goalRes.rows.length > 0) {
      let totalTarget = 0;
      let totalSaved = 0;
      goalRes.rows.forEach((g) => {
        totalTarget += parseFloat(g.target_amount);
        totalSaved += parseFloat(g.current_amount);
      });
      const goalRatio = totalTarget > 0 ? totalSaved / totalTarget : 0;
      goalPoints = Math.min(30, Math.round(goalRatio * 30));
    }

    // 3. Anomaly & Stability Data (past 30 days high-spending spikes)
    const anomalyRes = await pool.query(
      `SELECT COUNT(*) as anomaly_count
       FROM transactions
       WHERE user_id = $1 AND transaction_date >= NOW() - INTERVAL '30 days' AND amount > 5000`,
      [req.userId]
    );
    const anomalyCount = parseInt(anomalyRes.rows[0].anomaly_count) || 0;
    const anomalyPoints = Math.max(0, 20 - anomalyCount * 5);

    // 4. Subscriptions to Monthly Income/Expense ratio
    const subRes = await pool.query(
      `SELECT SUM(amount) as monthly_sub_total FROM subscriptions WHERE user_id = $1 AND status = 'active'`,
      [req.userId]
    );
    const subTotal = parseFloat(subRes.rows[0].monthly_sub_total) || 0;
    let subPoints = 15;
    if (subTotal > 5000) {
      subPoints = 8;
    } else if (subTotal > 2500) {
      subPoints = 12;
    }

    const totalScore = Math.min(100, Math.max(0, budgetPoints + goalPoints + anomalyPoints + subPoints));

    let tier = 'Needs Attention';
    let tierColor = 'text-rose-400';
    if (totalScore >= 85) {
      tier = 'Excellent';
      tierColor = 'text-emerald-400';
    } else if (totalScore >= 70) {
      tier = 'Good';
      tierColor = 'text-teal-400';
    } else if (totalScore >= 55) {
      tier = 'Fair';
      tierColor = 'text-amber-400';
    }

    // Algorithmic Micro-Habits
    const microHabits = [];
    if (overBudgetCategoriesCount > 0) {
      microHabits.push({
        id: 'habit-1',
        title: 'Budget Recovery Challenge',
        desc: `You have ${overBudgetCategoriesCount} over-budget categories. Freeze non-essential spending for 3 days.`,
        reward: '+10 Score Pts',
        type: 'warning',
      });
    } else {
      microHabits.push({
        id: 'habit-1',
        title: 'Flawless Budget Streak',
        desc: 'All categories are under budget! Keep it going to lock in your score multiplier.',
        reward: '+5 Score Pts',
        type: 'success',
      });
    }

    if (goalRes.rows.length === 0) {
      microHabits.push({
        id: 'habit-2',
        title: 'Set Your First Goal',
        desc: 'Add a goal (e.g. Emergency Fund) to unlock +20 Goal Rate points.',
        reward: '+20 Score Pts',
        type: 'info',
      });
    } else {
      microHabits.push({
        id: 'habit-2',
        title: 'Weekly Micro-Deposit',
        desc: 'Deposit ₹500 into one of your savings goals today to boost your velocity.',
        reward: '+8 Score Pts',
        type: 'info',
      });
    }

    if (subTotal > 2000) {
      microHabits.push({
        id: 'habit-3',
        title: 'Subscription Trim Challenge',
        desc: `Your recurring bills total ₹${subTotal.toLocaleString()}/mo. Audit 1 unused service.`,
        reward: '+10 Score Pts',
        type: 'warning',
      });
    } else {
      microHabits.push({
        id: 'habit-3',
        title: 'Lean Subscriptions',
        desc: 'Great job maintaining lean recurring expenses under ₹2,000/mo.',
        reward: '+5 Score Pts',
        type: 'success',
      });
    }

    res.json({
      total_score: totalScore,
      tier,
      tier_color: tierColor,
      breakdown: {
        budget_adherence: budgetPoints, // out of 35
        goal_progress: goalPoints,      // out of 30
        anomaly_stability: anomalyPoints, // out of 20
        subscription_ratio: subPoints,  // out of 15
      },
      micro_habits: microHabits,
    });
  } catch (err) {
    console.error('Error calculating health score:', err);
    res.status(500).json({ error: 'Server error calculating health score' });
  }
});

module.exports = router;
