import { useState } from 'react';
import api from '../api/axios';

function AddTransactionForm({ onTransactionAdded }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('1');
  const [error, setError] = useState('');
  const [anomalyWarning, setAnomalyWarning] = useState('');

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setAnomalyWarning('');

  try {
    // check for anomaly first
    try {
      const anomalyRes = await api.post('/transactions/check-anomaly', {
        category_id: parseInt(categoryId),
        amount: parseFloat(amount),
      });
      if (anomalyRes.data.is_anomaly) {
        setAnomalyWarning(
          `This is unusual! Average for this category is ₹${anomalyRes.data.average_amount}, but this is ₹${amount}.`
        );
      }
    } catch (err) {
      // silently ignore anomaly check failure — don't block adding the transaction
    }

    const res = await api.post('/transactions', {
      amount: parseFloat(amount),
      description,
      category_id: parseInt(categoryId),
    });
    setAmount('');
    setDescription('');
    onTransactionAdded(res.data.transaction);
  } catch (err) {
    setError(err.response?.data?.error || 'Failed to add transaction');
  }
};
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
        <option value="1">Food</option>
        <option value="2">Transport</option>
        <option value="3">Shopping</option>
        <option value="4">Bills</option>
        <option value="5">Entertainment</option>
        <option value="6">Health</option>
        <option value="7">Other</option>
      </select>
      <button type="submit">Add</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    {anomalyWarning && <p style={{ color: 'orange' }}>⚠️ {anomalyWarning}</p>}
    </form>
  );
}

export default AddTransactionForm;