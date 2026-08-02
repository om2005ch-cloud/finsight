import { useState, useEffect } from 'react';
import api from '../api/axios';
import AddTransactionForm from '../components/AddTransactionForm';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [budgetStatus, setBudgetStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentMonth = new Date().toISOString().slice(0, 8) + '01'; // "2026-08-01"

  const fetchData = async () => {
    try {
      const [txRes, budgetRes] = await Promise.all([
        api.get('/transactions'),
        api.get(`/budgets/status?month=${currentMonth}`),
      ]);
      setTransactions(txRes.data.transactions);
      setBudgetStatus(budgetRes.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTransactionAdded = (newTransaction) => {
    setTransactions([newTransaction, ...transactions]); // add to top of list instantly
    fetchData(); // re-fetch budget status since spending changed
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Dashboard</h2>

      <h3>Add Transaction</h3>
      <AddTransactionForm onTransactionAdded={handleTransactionAdded} />

      <h3>Budget Status</h3>
      {budgetStatus.length === 0 ? (
        <p>No budgets set for this month.</p>
      ) : (
        <ul>
          {budgetStatus.map((b) => (
            <li key={b.category_id}>
              {b.category_name}: ₹{b.spent} / ₹{b.monthly_limit}
              {parseFloat(b.spent) > parseFloat(b.monthly_limit) && ' ⚠️ Over budget!'}
            </li>
          ))}
        </ul>
      )}

      <h3>Your Transactions</h3>
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <ul>
          {transactions.map((t) => (
            <li key={t.id}>
              {t.description || 'No description'} — ₹{t.amount} ({t.category_name})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;