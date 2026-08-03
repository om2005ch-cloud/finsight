const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
require('dotenv').config();

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/ask', authMiddleware, async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'question is required' });
  }

  try {
    // STEP 1: RETRIEVE — pull real data the user might be asking about
    const transactionsResult = await pool.query(
      `SELECT t.amount, t.description, t.transaction_date, c.name AS category
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = $1
       ORDER BY t.transaction_date DESC
       LIMIT 50`,
      [req.userId]
    );

    const budgetResult = await pool.query(
      `SELECT c.name AS category, b.monthly_limit, b.month
       FROM budgets b
       JOIN categories c ON b.category_id = c.id
       WHERE b.user_id = $1`,
      [req.userId]
    );

    // STEP 2: AUGMENT — build context from real data
    const context = `
Recent transactions (most recent 50):
${transactionsResult.rows.map(t => `- ${t.transaction_date.toISOString().split('T')[0]}: ₹${t.amount} on ${t.category} (${t.description})`).join('\n')}

Budgets set:
${budgetResult.rows.map(b => `- ${b.category}: ₹${b.monthly_limit}/month`).join('\n')}
    `.trim();

    const prompt = `You are a helpful personal finance assistant. Using ONLY the data below, answer the user's question accurately. If the data doesn't contain enough information to answer, say so honestly instead of guessing.

DATA:
${context}

QUESTION: ${question}`;

    // STEP 3: GENERATE
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    res.json({ answer: response.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
router.get('/monthly-insight', authMiddleware, async (req, res) => {
  try {
    const currentMonthResult = await pool.query(
      `SELECT c.name AS category, SUM(t.amount) AS total, COUNT(*) AS count
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = $1 
         AND DATE_TRUNC('month', t.transaction_date) = DATE_TRUNC('month', CURRENT_DATE)
       GROUP BY c.name`,
      [req.userId]
    );

    const lastMonthResult = await pool.query(
      `SELECT c.name AS category, SUM(t.amount) AS total
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = $1 
         AND DATE_TRUNC('month', t.transaction_date) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
       GROUP BY c.name`,
      [req.userId]
    );

    if (currentMonthResult.rows.length === 0 && lastMonthResult.rows.length === 0) {
      return res.json({ insight: "Not enough spending data yet to generate an insight." });
    }

    const context = `
This month's spending by category:
${currentMonthResult.rows.map(r => `- ${r.category}: ₹${r.total} (${r.count} transactions)`).join('\n') || 'No transactions yet this month'}

Last month's spending by category:
${lastMonthResult.rows.map(r => `- ${r.category}: ₹${r.total}`).join('\n') || 'No data'}
    `.trim();

    const prompt = `You are a personal finance assistant. Based ONLY on the data below, write a short, friendly 3-4 sentence summary of the user's spending this month compared to last month. Point out any notable increases or decreases by category. Be specific with numbers. Do not make up any information not present in the data.

DATA:
${context}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    res.json({ insight: response.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
module.exports = router;