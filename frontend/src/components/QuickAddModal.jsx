import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, IndianRupee, Tag, X, Command } from 'lucide-react';
import api from '../api/axios';

function QuickAddModal({ isOpen, onClose, onTransactionAdded }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('1');
  const [error, setError] = useState('');
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

  // Esc key closes modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await api.post('/transactions', {
        amount: parseFloat(amount),
        description,
        category_id: parseInt(categoryId),
      });
      setAmount('');
      setDescription('');
      onTransactionAdded(res.data.transaction);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add transaction');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full shadow-xl relative"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-zinc-100 font-semibold text-base flex items-center gap-2 tracking-tight">
                <Plus className="w-4 h-4 text-emerald-400" /> Quick Add Transaction
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 flex items-center gap-1">
                  <Command className="w-3 h-3" /> K
                </span>
                <button onClick={onClose} className="text-zinc-400 hover:text-zinc-100">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Amount (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="number"
                    placeholder="250"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    autoFocus
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-3.5 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Lunch with team"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Category</label>
                <div className="relative">
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-8 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="bg-zinc-900">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-lg transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {submitting ? 'Adding...' : 'Add Transaction'}
              </button>
            </form>

            {error && <p className="text-rose-400 text-xs mt-3 text-center">{error}</p>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default QuickAddModal;
