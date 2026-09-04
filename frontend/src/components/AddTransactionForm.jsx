import { useState } from 'react';
import { Plus, IndianRupee, Tag } from 'lucide-react';
import api from '../api/axios';

function AddTransactionForm({ onTransactionAdded }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('1');
  const [error, setError] = useState('');
  const [anomalyWarning, setAnomalyWarning] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    { id: '1', name: 'Food' },
    { id: '2', name: 'Transport' },
    { id: '3', name: 'Shopping' },
    { id: '4', name: 'Bills' },
    { id: '5', name: 'Entertainment' },
    { id: '6', name: 'Health' },
    { id: '7', name: 'Other' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAnomalyWarning('');
    setSubmitting(true);

    try {
      try {
        const anomalyRes = await api.post('/transactions/check-anomaly', {
          category_id: parseInt(categoryId),
          amount: parseFloat(amount),
        });
        if (anomalyRes.data.is_anomaly) {
          setAnomalyWarning(
            `Unusual! Average for this category is ₹${anomalyRes.data.average_amount}, this is ₹${amount}.`
          );
        }
      } catch (err) {
        // ignore
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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
      <h3 className="text-zinc-100 font-semibold text-base mb-4 tracking-tight">Add Transaction</h3>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-3.5 py-2.5 text-zinc-100 text-sm placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="flex-[1.5] bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-100 text-sm placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
        />
        <div className="relative">
          <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-8 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-zinc-900">
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-lg px-5 py-2.5 transition-colors disabled:opacity-60 cursor-pointer"
        >
          {submitting ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {submitting ? 'Categorizing...' : 'Add'}
        </button>
      </form>
      {error && <p className="text-rose-400 text-sm mt-3">{error}</p>}
      {anomalyWarning && (
        <p className="text-amber-400 text-sm mt-3 flex items-center gap-1.5 font-medium">
          ⚠️ {anomalyWarning}
        </p>
      )}
    </div>
  );
}

export default AddTransactionForm;