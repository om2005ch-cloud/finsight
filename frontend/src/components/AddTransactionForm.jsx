import { useState } from 'react';
import { motion } from 'framer-motion';
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
    <motion.div
      whileHover={{ boxShadow: '0 0 40px rgba(16, 185, 129, 0.1)' }}
      className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6"
    >
      <h3 className="text-white font-semibold mb-4">Add Transaction</h3>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/60 focus:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300"
          />
        </div>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="flex-[1.5] bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/60 focus:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300"
        />
        <div className="relative">
          <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500/60 transition-all duration-300 appearance-none cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-gray-900">
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(16, 185, 129, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl px-6 py-3 shadow-lg shadow-emerald-500/20 transition-shadow duration-300 disabled:opacity-60"
        >
          {submitting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
            />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {submitting ? 'Categorizing...' : 'Add'}
        </motion.button>
      </form>
      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      {anomalyWarning && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-amber-400 text-sm mt-3 flex items-center gap-1.5"
        >
          ⚠️ {anomalyWarning}
        </motion.p>
      )}
    </motion.div>
  );
}

export default AddTransactionForm;