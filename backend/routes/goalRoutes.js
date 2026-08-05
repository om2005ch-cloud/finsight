const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { createGoalSchema, updateGoalSchema } = require('../validators/goalValidator');

const router = express.Router();

// GET all goals for logged-in user + category spending profile for what-if calculations
router.get('/', authMiddleware, async (req, res) => {
  try {
    const goalsResult = await pool.query(
      `SELECT g.*, c.name AS category_name
       FROM goals g
       LEFT JOIN categories c ON g.category_id = c.id
       WHERE g.user_id = $1
       ORDER BY g.target_date ASC`,
      [req.userId]
    );

    // Calculate historical average monthly spend per category (last 3 months)
    const categoryAvgResult = await pool.query(
      `SELECT 
         t.category_id, 
         c.name AS category_name,
         ROUND(SUM(t.amount) / GREATEST(COUNT(DISTINCT DATE_TRUNC('month', t.transaction_date)), 1), 2) AS avg_monthly_spend
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = $1 AND t.transaction_date >= NOW() - INTERVAL '3 months'
       GROUP BY t.category_id, c.name`,
      [req.userId]
    );

    const now = new Date();
    const enrichedGoals = goalsResult.rows.map((goal) => {
      const targetDate = new Date(goal.target_date);
      const diffTime = targetDate - now;
      const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      const remainingAmount = Math.max(0, parseFloat(goal.target_amount) - parseFloat(goal.current_amount));
      const requiredDaily = daysRemaining > 0 ? (remainingAmount / daysRemaining) : 0;
      const requiredMonthly = requiredDaily * 30.4375;
      const progressPercent = Math.min(100, Math.round((parseFloat(goal.current_amount) / parseFloat(goal.target_amount)) * 100));

      return {
        ...goal,
        target_amount: parseFloat(goal.target_amount),
        current_amount: parseFloat(goal.current_amount),
        remaining_amount: parseFloat(remainingAmount.toFixed(2)),
        days_remaining: daysRemaining,
        required_daily_saving: parseFloat(requiredDaily.toFixed(2)),
        required_monthly_saving: parseFloat(requiredMonthly.toFixed(2)),
        progress_percent: progressPercent,
      };
    });

    res.json({
      goals: enrichedGoals,
      category_averages: categoryAvgResult.rows.map(r => ({
        category_id: r.category_id,
        category_name: r.category_name,
        avg_monthly_spend: parseFloat(r.avg_monthly_spend),
      })),
    });
  } catch (err) {
    console.error('Error fetching goals:', err);
    res.status(500).json({ error: 'Server error fetching goals' });
  }
});

// CREATE a goal
router.post('/', authMiddleware, validate(createGoalSchema), async (req, res) => {
  const { title, target_amount, current_amount, target_date, category_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO goals (user_id, title, target_amount, current_amount, target_date, category_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.userId, title, target_amount, current_amount || 0, target_date, category_id || null]
    );
    res.status(201).json({ message: 'Goal created successfully', goal: result.rows[0] });
  } catch (err) {
    console.error('Error creating goal:', err);
    res.status(500).json({ error: 'Server error creating goal' });
  }
});

// UPDATE goal (e.g. deposit savings or modify goal target/date)
router.put('/:id', authMiddleware, validate(updateGoalSchema), async (req, res) => {
  const { id } = req.params;
  const { title, target_amount, current_amount, target_date, category_id } = req.body;

  try {
    const existing = await pool.query('SELECT * FROM goals WHERE id = $1 AND user_id = $2', [id, req.userId]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const current = existing.rows[0];
    const newTitle = title !== undefined ? title : current.title;
    const newTargetAmount = target_amount !== undefined ? target_amount : current.target_amount;
    const newCurrentAmount = current_amount !== undefined ? current_amount : current.current_amount;
    const newTargetDate = target_date !== undefined ? target_date : current.target_date;
    const newCategoryId = category_id !== undefined ? category_id : current.category_id;

    const result = await pool.query(
      `UPDATE goals
       SET title = $1, target_amount = $2, current_amount = $3, target_date = $4, category_id = $5
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [newTitle, newTargetAmount, newCurrentAmount, newTargetDate, newCategoryId, id, req.userId]
    );

    res.json({ message: 'Goal updated successfully', goal: result.rows[0] });
  } catch (err) {
    console.error('Error updating goal:', err);
    res.status(500).json({ error: 'Server error updating goal' });
  }
});

// DELETE a goal
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM goals WHERE id = $1 AND user_id = $2 RETURNING *', [id, req.userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    res.json({ message: 'Goal deleted successfully' });
  } catch (err) {
    console.error('Error deleting goal:', err);
    res.status(500).json({ error: 'Server error deleting goal' });
  }
});

// POST /api/goals/simulate — Pure deterministic What-If scenario engine
router.post('/simulate', authMiddleware, async (req, res) => {
  const { goal_id, category_cuts } = req.body;
  // category_cuts: [{ category_id: 1, cut_percent: 20 }]

  try {
    const goalRes = await pool.query('SELECT * FROM goals WHERE id = $1 AND user_id = $2', [goal_id, req.userId]);
    if (goalRes.rows.length === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const goal = goalRes.rows[0];
    const remainingAmount = Math.max(0, parseFloat(goal.target_amount) - parseFloat(goal.current_amount));
    const now = new Date();
    const targetDate = new Date(goal.target_date);
    const baselineDays = Math.max(1, Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24)));
    const baselineMonthlySavingsRate = (remainingAmount / baselineDays) * 30.4375;

    let extraMonthlySavings = 0;
    const categoryDetails = [];

    if (Array.isArray(category_cuts) && category_cuts.length > 0) {
      for (const cut of category_cuts) {
        const avgRes = await pool.query(
          `SELECT c.name, COALESCE(ROUND(AVG(sub.monthly_spend), 2), 0) as avg_spend
           FROM categories c
           LEFT JOIN (
             SELECT category_id, SUM(amount) as monthly_spend
             FROM transactions
             WHERE user_id = $1 AND category_id = $2 AND transaction_date >= NOW() - INTERVAL '3 months'
             GROUP BY category_id, DATE_TRUNC('month', transaction_date)
           ) sub ON sub.category_id = c.id
           WHERE c.id = $2
           GROUP BY c.name`,
          [req.userId, cut.category_id]
        );

        const avgSpend = avgRes.rows.length > 0 ? parseFloat(avgRes.rows[0].avg_spend) : 0;
        const categoryName = avgRes.rows.length > 0 ? avgRes.rows[0].name : `Category ${cut.category_id}`;
        const cutPercent = parseFloat(cut.cut_percent) || 0;
        const savedAmount = (avgSpend * cutPercent) / 100;

        extraMonthlySavings += savedAmount;
        categoryDetails.push({
          category_id: cut.category_id,
          category_name: categoryName,
          avg_monthly_spend: avgSpend,
          cut_percent: cutPercent,
          saved_amount: parseFloat(savedAmount.toFixed(2)),
        });
      }
    }

    const newMonthlySavingsRate = baselineMonthlySavingsRate + extraMonthlySavings;
    const newDaysNeeded = newMonthlySavingsRate > 0 ? Math.ceil((remainingAmount / newMonthlySavingsRate) * 30.4375) : baselineDays;
    const daysSaved = Math.max(0, baselineDays - newDaysNeeded);

    const projectedDate = new Date();
    projectedDate.setDate(projectedDate.getDate() + newDaysNeeded);

    res.json({
      goal_id: goal.id,
      goal_title: goal.title,
      remaining_amount: parseFloat(remainingAmount.toFixed(2)),
      baseline_days: baselineDays,
      new_days_needed: newDaysNeeded,
      days_saved: daysSaved,
      extra_monthly_savings: parseFloat(extraMonthlySavings.toFixed(2)),
      new_monthly_savings_rate: parseFloat(newMonthlySavingsRate.toFixed(2)),
      new_projected_date: projectedDate.toISOString().slice(0, 10),
      category_details: categoryDetails,
    });
  } catch (err) {
    console.error('Error simulating scenario:', err);
    res.status(500).json({ error: 'Server error simulating scenario' });
  }
});

module.exports = router;
