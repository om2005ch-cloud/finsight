const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { createBudgetSchema } = require('../validators/budgetValidator');

const router = express.Router();

// CREATE a budget
router.post('/', authMiddleware, validate(createBudgetSchema), async (req, res) => {
  const { category_id, monthly_limit, month } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO budgets (user_id, category_id, monthly_limit, month)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.userId, category_id, monthly_limit, month]
    );
    res.status(201).json({ message: 'Budget created', budget: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') { // Postgres unique violation code
      return res.status(409).json({ error: 'Budget already exists for this category and month' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET budget status — spent vs limit, per category, for a given month
router.get('/status', authMiddleware, async (req, res) => {
  const { month } = req.query; // e.g. ?month=2026-08-01

  if (!month) {
    return res.status(400).json({ error: 'month query param required' });
  }

  try {
    const result = await pool.query(
      `SELECT 
         b.category_id,
         c.name AS category_name,
         b.monthly_limit,
         COALESCE(SUM(t.amount), 0) AS spent
       FROM budgets b
       JOIN categories c ON b.category_id = c.id
       LEFT JOIN transactions t 
         ON t.category_id = b.category_id 
         AND t.user_id = b.user_id
         AND DATE_TRUNC('month', t.transaction_date) = DATE_TRUNC('month', b.month::date)
       WHERE b.user_id = $1 AND DATE_TRUNC('month', b.month::date) = DATE_TRUNC('month', $2::date)
       GROUP BY b.category_id, c.name, b.monthly_limit`,
      [req.userId, month]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;