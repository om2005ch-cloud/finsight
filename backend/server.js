const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const initDb = require('./config/initDb');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const assistantRoutes = require('./routes/assistantRoutes');
const goalRoutes = require('./routes/goalRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const healthScoreRoutes = require('./routes/healthScoreRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize DB schema
initDb();

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/health-score', healthScoreRoutes);

app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Database connected!', time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
