const validate = require('../middleware/validate');
const { createTransactionSchema, updateTransactionSchema } = require('../validators/transactionValidator');
const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// CREATE a transaction
router.post('/', authMiddleware, validate(createTransactionSchema), async (req, res) => {
  const { amount, description, category_id, transaction_date } = req.body;
  const userId = req.userId;

  if (!amount) {
    return res.status(400).json({ error: 'Amount is required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO transactions (user_id, category_id, amount, description, transaction_date)
       VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_DATE))
       RETURNING *`,
      [userId, category_id || null, amount, description || null, transaction_date || null]
    );

    res.status(201).json({ message: 'Transaction added', transaction: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
// GET all transactions for logged-in user (paginated)
router.get('/', authMiddleware, async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;

  try {
    const dataResult = await pool.query(
      `SELECT t.*, c.name AS category_name
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = $1
       ORDER BY t.transaction_date DESC
       LIMIT $2 OFFSET $3`,
      [req.userId, limit, offset]
    );

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM transactions WHERE user_id = $1',
      [req.userId]
    );

    const total = parseInt(countResult.rows[0].count);

    res.json({
      transactions: dataResult.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
// UPDATE a transaction
router.put('/:id', authMiddleware, validate(updateTransactionSchema), async (req, res) =>{
  const { amount, description, category_id, transaction_date } = req.body;
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE transactions
       SET amount = COALESCE($1, amount),
           description = COALESCE($2, description),
           category_id = COALESCE($3, category_id),
           transaction_date = COALESCE($4, transaction_date)
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [amount, description, category_id, transaction_date, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction updated', transaction: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
// DELETE a transaction
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
module.exports = router;