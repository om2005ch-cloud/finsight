import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Repeat, Plus, AlertCircle, Calendar, ShieldAlert, Trash2, Zap, X, CreditCard } from 'lucide-react';
import api from '../api/axios';

function SubscriptionTracker() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [metrics, setMetrics] = useState({
    total_active_count: 0,
    total_monthly_spend: 0,
    total_annual_spend: 0,
    upcoming_count_7days: 0,
    upcoming_renewals: [],
  });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [cycle, setCycle] = useState('monthly');
  const [nextDate, setNextDate] = useState('');

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/subscriptions');
      setSubscriptions(res.data.subscriptions || []);
      setMetrics(res.data.metrics || {});
    } catch (err) {
      console.error('Failed to load subscriptions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleAddSubscription = async (e) => {
    e.preventDefault();
    if (!name || !amount) return;

    try {
      await api.post('/subscriptions', {
        name,
        amount: parseFloat(amount),
        billing_cycle: cycle,
        next_billing_date: nextDate || null,
      });

      setName('');
      setAmount('');
      setCycle('monthly');
      setNextDate('');
      setShowAddModal(false);
      fetchSubscriptions();
    } catch (err) {
      console.error('Error adding subscription', err);
    }
  };

  const handleDeleteOrDismiss = async (sub) => {
    try {
      if (sub.id) {
        await api.delete(`/subscriptions/${sub.id}`);
      } else {
        await api.post('/subscriptions/dismiss', { name: sub.name });
      }
      fetchSubscriptions();
    } catch (err) {
      console.error('Error removing subscription', err);
    }
  };

  const cardHover = {
    y: -3,
    boxShadow: '0 0 35px rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  };

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Repeat className="w-5 h-5 text-emerald-400" />
            <h3 className="text-white font-semibold text-lg">Subscriptions & Recurring Bills</h3>
          </div>
          <p className="text-gray-400 text-xs mt-0.5">
            Algorithmic detection of recurring bills, price hikes & annual cost audits
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" /> Add Subscription
        </button>
      </div>

      {/* Summary Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3.5 text-center">
          <p className="text-gray-400 text-[11px]">Monthly Recurring</p>
          <p className="text-emerald-400 font-bold text-lg mt-0.5">₹{metrics.total_monthly_spend?.toLocaleString()}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3.5 text-center">
          <p className="text-gray-400 text-[11px]">Annualized Total</p>
          <p className="text-white font-bold text-lg mt-0.5">₹{metrics.total_annual_spend?.toLocaleString()}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3.5 text-center">
          <p className="text-gray-400 text-[11px]">Active Subscriptions</p>
          <p className="text-teal-300 font-bold text-lg mt-0.5">{metrics.total_active_count}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3.5 text-center">
          <p className="text-gray-400 text-[11px]">Renewing in 7 Days</p>
          <p className={metrics.upcoming_count_7days > 0 ? 'text-amber-400 font-bold text-lg mt-0.5' : 'text-gray-300 font-bold text-lg mt-0.5'}>
            {metrics.upcoming_count_7days}
          </p>
        </div>
      </div>

      {/* Upcoming Renewals Alert Banner (if any) */}
      {metrics.upcoming_renewals && metrics.upcoming_renewals.length > 0 && (
        <div className="mb-4 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Upcoming Renewal:</strong> {metrics.upcoming_renewals[0].name} (₹{metrics.upcoming_renewals[0].amount}) renews in {metrics.upcoming_renewals[0].days_until_renewal} days!
            </span>
          </div>
        </div>
      )}

      {/* Subscriptions List */}
      {loading ? (
        <p className="text-gray-400 text-sm">Detecting recurring transactions...</p>
      ) : subscriptions.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
          <CreditCard className="w-10 h-10 text-gray-500 mx-auto mb-2 opacity-50" />
          <p className="text-gray-300 text-sm font-medium">No recurring subscriptions detected yet</p>
          <p className="text-gray-500 text-xs mt-1">Add transactions with repeating titles (e.g. Netflix, Gym) or add manually above</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {subscriptions.map((sub, idx) => (
            <motion.div
              key={sub.id || idx}
              whileHover={cardHover}
              className="flex justify-between items-center bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-xl p-3.5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Repeat className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium">{sub.name}</span>
                    {sub.is_auto_detected && (
                      <span className="bg-teal-500/20 text-teal-300 text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Auto-Detected
                      </span>
                    )}
                    {sub.has_price_hike && (
                      <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" /> Price Hike (+₹{sub.price_hike_diff})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-gray-400 text-xs mt-0.5">
                    <span>{sub.category_name || 'General'}</span>
                    <span>•</span>
                    <span className="capitalize">{sub.billing_cycle}</span>
                    {sub.next_billing_date && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-gray-300">
                          <Calendar className="w-3 h-3 text-emerald-400" /> Next: {new Date(sub.next_billing_date).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-white font-semibold text-sm">₹{sub.amount}</span>
                  <p className="text-[10px] text-gray-400">
                    {sub.billing_cycle === 'monthly' ? `₹${(sub.amount * 12).toLocaleString()}/yr` : `₹${(sub.amount / 12).toFixed(0)}/mo`}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteOrDismiss(sub)}
                  className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  title="Delete / Dismiss Subscription"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal: Add Manual Subscription */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                  <Repeat className="w-5 h-5 text-emerald-400" /> Track Subscription
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubscription} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Service / Bill Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Netflix, Spotify, Internet Bill"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-emerald-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      placeholder="649"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-emerald-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Billing Cycle</label>
                    <select
                      value={cycle}
                      onChange={(e) => setCycle(e.target.value)}
                      className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-400"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1">Next Renewal Date (Optional)</label>
                  <input
                    type="date"
                    value={nextDate}
                    onChange={(e) => setNextDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm rounded-xl transition-all"
                >
                  Track Subscription
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SubscriptionTracker;
