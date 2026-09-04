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

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Repeat className="w-4 h-4 text-emerald-400" />
            <h3 className="text-zinc-100 font-semibold text-base tracking-tight">Subscriptions & Recurring Bills</h3>
          </div>
          <p className="text-zinc-400 text-xs mt-0.5">
            Algorithmic detection of recurring bills, price hikes & annual cost audits
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Subscription
        </button>
      </div>

      {/* Summary Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-center">
          <p className="text-zinc-400 text-[11px]">Monthly Recurring</p>
          <p className="text-emerald-400 font-bold text-base mt-0.5">₹{metrics.total_monthly_spend?.toLocaleString()}</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-center">
          <p className="text-zinc-400 text-[11px]">Annualized Total</p>
          <p className="text-zinc-100 font-bold text-base mt-0.5">₹{metrics.total_annual_spend?.toLocaleString()}</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-center">
          <p className="text-zinc-400 text-[11px]">Active Subscriptions</p>
          <p className="text-zinc-100 font-bold text-base mt-0.5">{metrics.total_active_count}</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-center">
          <p className="text-zinc-400 text-[11px]">Renewing in 7 Days</p>
          <p className={metrics.upcoming_count_7days > 0 ? 'text-amber-400 font-bold text-base mt-0.5' : 'text-zinc-300 font-bold text-base mt-0.5'}>
            {metrics.upcoming_count_7days}
          </p>
        </div>
      </div>

      {/* Upcoming Renewals Alert Banner (if any) */}
      {metrics.upcoming_renewals && metrics.upcoming_renewals.length > 0 && (
        <div className="mb-4 bg-zinc-950 border border-amber-800/50 rounded-lg p-3 flex items-center justify-between text-xs text-amber-300">
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
        <p className="text-zinc-400 text-sm">Detecting recurring transactions...</p>
      ) : subscriptions.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-zinc-800 rounded-lg">
          <CreditCard className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
          <p className="text-zinc-300 text-sm font-medium">No recurring subscriptions detected yet</p>
          <p className="text-zinc-500 text-xs mt-1">Add transactions with repeating titles (e.g. Netflix, Gym) or add manually above</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {subscriptions.map((sub, idx) => (
            <div
              key={sub.id || idx}
              className="flex justify-between items-center bg-zinc-950 border border-zinc-800 rounded-lg p-3.5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                  <Repeat className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-100 text-sm font-medium">{sub.name}</span>
                    {sub.is_auto_detected && (
                      <span className="bg-zinc-900 border border-zinc-800 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-medium flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Auto-Detected
                      </span>
                    )}
                    {sub.has_price_hike && (
                      <span className="bg-rose-950 border border-rose-900 text-rose-400 text-[10px] px-2 py-0.5 rounded font-medium flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" /> Price Hike (+₹{sub.price_hike_diff})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400 text-xs mt-0.5">
                    <span>{sub.category_name || 'General'}</span>
                    <span>•</span>
                    <span className="capitalize">{sub.billing_cycle}</span>
                    {sub.next_billing_date && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-zinc-300">
                          <Calendar className="w-3 h-3 text-emerald-400" /> Next: {new Date(sub.next_billing_date).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-zinc-100 font-semibold text-sm">₹{sub.amount}</span>
                  <p className="text-[10px] text-zinc-500">
                    {sub.billing_cycle === 'monthly' ? `₹${(sub.amount * 12).toLocaleString()}/yr` : `₹${(sub.amount / 12).toFixed(0)}/mo`}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteOrDismiss(sub)}
                  className="p-1.5 rounded-lg bg-zinc-900 hover:bg-rose-950 text-zinc-400 hover:text-rose-400 border border-zinc-800 transition-colors"
                  title="Delete / Dismiss Subscription"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Manual Subscription */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full shadow-xl relative"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-zinc-100 font-semibold text-base flex items-center gap-2 tracking-tight">
                  <Repeat className="w-4 h-4 text-emerald-400" /> Track Subscription
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-zinc-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddSubscription} className="space-y-4">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Service / Bill Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Netflix, Spotify, Internet Bill"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-zinc-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      placeholder="649"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-zinc-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Billing Cycle</label>
                    <select
                      value={cycle}
                      onChange={(e) => setCycle(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Next Renewal Date (Optional)</label>
                  <input
                    type="date"
                    value={nextDate}
                    onChange={(e) => setNextDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-zinc-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-lg transition-colors cursor-pointer"
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
