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

// MULTIMODAL RECEIPT & BILL SCANNER
router.post('/scan-receipt', authMiddleware, async (req, res) => {
  const { imageBase64, mimeType = 'image/jpeg' } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: 'imageBase64 image data is required' });
  }

  try {
    const catResult = await pool.query('SELECT id, name FROM categories');
    const categories = catResult.rows;

    const prompt = `You are a financial document parser. Analyze this receipt or bill image and extract the following details accurately:
1. merchant: The store, restaurant, or business name (string, concise)
2. amount: The total final amount paid (number, float). Strip any currency symbols.
3. date: The transaction date in YYYY-MM-DD format (if not found or unclear, use today's date ${new Date().toISOString().split('T')[0]})
4. category: Best matching category from this exact list: [${categories.map(c => c.name).join(', ')}]
5. summary: A brief 1-line itemized description (e.g. "Grocery items - Milk, Bread" or "Dinner at Restaurant")

Respond with ONLY a valid JSON object without backticks or markdown, in this exact format:
{
  "merchant": "Merchant Name",
  "amount": 123.45,
  "date": "YYYY-MM-DD",
  "category": "Food",
  "summary": "Short description"
}`;

    // Clean base64 string if it includes data URL prefix
    const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
    const detectedMime = imageBase64.startsWith('data:')
      ? imageBase64.substring(5, imageBase64.indexOf(';'))
      : (mimeType || 'image/jpeg');

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: detectedMime,
                data: cleanBase64
              }
            },
            {
              text: prompt
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    let rawText = (response.text || '').trim();
    let parsed = {};
    try {
      parsed = JSON.parse(rawText);
    } catch (e) {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse JSON from vision response');
      }
    }

    // Match category to existing DB category
    const matchedCategory = categories.find(
      c => c.name.toLowerCase() === (parsed.category || '').toLowerCase()
    );
    const category_id = matchedCategory ? matchedCategory.id : (categories.find(c => c.name === 'Other')?.id || 7);

    res.json({
      merchant: parsed.merchant || 'Scanned Receipt',
      amount: typeof parsed.amount === 'number' ? parsed.amount : parseFloat(parsed.amount) || 0,
      date: parsed.date || new Date().toISOString().split('T')[0],
      category: matchedCategory ? matchedCategory.name : 'Other',
      category_id: category_id,
      description: parsed.summary || parsed.merchant || 'Receipt expense'
    });
  } catch (err) {
    console.error('Error scanning receipt with Gemini Vision:', err);
    res.status(500).json({ error: 'Failed to scan receipt image. Please try a clearer picture.' });
  }
});

module.exports = router;