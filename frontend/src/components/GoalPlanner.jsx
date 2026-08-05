import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Sliders, Calendar, TrendingDown, Sparkles, Trash2, DollarSign, CheckCircle2, X } from 'lucide-react';
import api from '../api/axios';

function GoalPlanner() {
  const [goals, setGoals] = useState([]);
  const [categoryAverages, setCategoryAverages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newCurrent, setNewCurrent] = useState('');
  const [newDate, setNewDate] = useState('');

  // What-If Simulation State
  const [cuts, setCuts] = useState({}); // { category_id: cut_percent }
  const [simResult, setSimResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await api.get('/goals');
      setGoals(res.data.goals || []);
      setCategoryAverages(res.data.category_averages || []);
    } catch (err) {
      console.error('Failed to load goals', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!newTitle || !newTarget || !newDate) return;

    try {
      await api.post('/goals', {
        title: newTitle,
        target_amount: parseFloat(newTarget),
        current_amount: newCurrent ? parseFloat(newCurrent) : 0,
        target_date: newDate,
      });

      setNewTitle('');
      setNewTarget('');
      setNewCurrent('');
      setNewDate('');
      setShowAddModal(false);
      fetchGoals();
    } catch (err) {
      console.error('Error creating goal', err);
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      fetchGoals();
    } catch (err) {
      console.error('Error deleting goal', err);
    }
  };

  const handleQuickAddSavings = async (goal) => {
    const amountStr = prompt(`Add savings towards "${goal.title}" (₹):`);
    if (!amountStr || isNaN(amountStr)) return;
    const addedAmount = parseFloat(amountStr);
    if (addedAmount <= 0) return;

    try {
      await api.put(`/goals/${goal.id}`, {
        current_amount: goal.current_amount + addedAmount,
      });
      fetchGoals();
    } catch (err) {
      console.error('Error updating goal savings', err);
    }
  };

  const openSimulator = (goal) => {
    setSelectedGoal(goal);
    // Initialize cut sliders to 0 for available categories
    const initialCuts = {};
    categoryAverages.forEach(cat => {
      initialCuts[cat.category_id] = 0;
    });
    setCuts(initialCuts);
    setSimResult(null);
    setShowSimulateModal(true);
  };

  const handleCutChange = (categoryId, percent) => {
    const updatedCuts = { ...cuts, [categoryId]: percent };
    setCuts(updatedCuts);
    runLiveSimulation(selectedGoal, updatedCuts);
  };

  const runLiveSimulation = async (goal, updatedCuts) => {
    if (!goal) return;
    const categoryCutsPayload = Object.entries(updatedCuts)
      .filter(([_, percent]) => percent > 0)
      .map(([catId, percent]) => ({ category_id: parseInt(catId), cut_percent: percent }));

    try {
      setSimulating(true);
      const res = await api.post('/goals/simulate', {
        goal_id: goal.id,
        category_cuts: categoryCutsPayload,
      });
      setSimResult(res.data);
    } catch (err) {
      console.error('Simulation failed', err);
    } finally {
      setSimulating(false);
    }
  };

  const cardHover = {
    y: -4,
    boxShadow: '0 0 35px rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  };

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <h3 className="text-white font-semibold text-lg">Smart Financial Goals</h3>
          </div>
          <p className="text-gray-400 text-xs mt-0.5">
            Plan savings goals & run 0-latency "What-If" spending cut simulations
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" /> Add Goal
        </button>
      </div>

      {/* Goals Grid */}
      {loading ? (
        <p className="text-gray-400 text-sm">Loading financial goals...</p>
      ) : goals.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
          <Target className="w-10 h-10 text-gray-500 mx-auto mb-2 opacity-50" />
          <p className="text-gray-300 text-sm font-medium">No savings goals yet</p>
          <p className="text-gray-500 text-xs mt-1">Add a goal (e.g., Emergency Fund or Japan Trip) to get started</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {goals.map((g) => (
            <motion.div
              key={g.id}
              whileHover={cardHover}
              className="bg-white/[0.03] border border-white/10 rounded-xl p-5 relative group"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-white font-semibold text-base">{g.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" /> {new Date(g.target_date).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>{g.days_remaining} days left</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openSimulator(g)}
                    title="Run What-If Simulator"
                    className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                  >
                    <Sliders className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(g.id)}
                    title="Delete Goal"
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-emerald-400 font-medium">₹{g.current_amount.toLocaleString()} saved</span>
                  <span className="text-gray-400">Target: ₹{g.target_amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${g.progress_percent}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full"
                  />
                </div>
              </div>

              {/* Action & Rate Footer */}
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5 text-xs">
                <div className="text-gray-400">
                  Required: <span className="text-white font-medium">₹{g.required_daily_saving}/day</span>
                </div>
                <button
                  onClick={() => handleQuickAddSavings(g)}
                  className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline flex items-center gap-1"
                >
                  + Add Savings
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal: Add Goal */}
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
                  <Target className="w-5 h-5 text-emerald-400" /> Create Savings Goal
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateGoal} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Goal Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Emergency Fund, New Laptop"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-emerald-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Target Amount (₹)</label>
                    <input
                      type="number"
                      placeholder="50000"
                      value={newTarget}
                      onChange={(e) => setNewTarget(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-emerald-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Current Saved (₹)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={newCurrent}
                      onChange={(e) => setNewCurrent(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1">Target Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-emerald-400"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm rounded-xl transition-all"
                >
                  Create Goal
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: What-If Scenario Simulator */}
      <AnimatePresence>
        {showSimulateModal && selectedGoal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-gray-900 border border-emerald-500/30 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-emerald-400" /> "What-If" Spending Cut Simulator
                  </h3>
                  <p className="text-xs text-emerald-400/80">Simulating goal: <span className="text-white font-medium">{selectedGoal.title}</span></p>
                </div>
                <button onClick={() => setShowSimulateModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {categoryAverages.length === 0 ? (
                <p className="text-gray-400 text-xs py-4 text-center">
                  Add some transaction history across categories to enable Spending Cut simulations!
                </p>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-300 text-xs">
                    Adjust the sliders to simulate cutting monthly category spending. See how many days faster you'll reach your goal!
                  </p>

                  <div className="space-y-3 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                    {categoryAverages.map((cat) => {
                      const currentCut = cuts[cat.category_id] || 0;
                      const monthlySaved = ((cat.avg_monthly_spend * currentCut) / 100).toFixed(2);
                      return (
                        <div key={cat.category_id} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-300 font-medium">{cat.category_name}</span>
                            <span className="text-emerald-400">
                              Cut {currentCut}% (Saves ₹{monthlySaved}/mo)
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min="0"
                              max="50"
                              step="5"
                              value={currentCut}
                              onChange={(e) => handleCutChange(cat.category_id, parseInt(e.target.value))}
                              className="w-full accent-emerald-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                            />
                            <span className="text-xs text-gray-400 w-8 text-right">{currentCut}%</span>
                          </div>
                          <p className="text-[10px] text-gray-500">Avg Monthly Spend: ₹{cat.avg_monthly_spend}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Simulation Output Card */}
                  {simResult && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl space-y-3"
                    >
                      <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm">
                        <Sparkles className="w-4 h-4" /> Simulation Projection
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="bg-black/30 p-2.5 rounded-lg">
                          <p className="text-gray-400 text-[11px]">Extra Monthly Savings</p>
                          <p className="text-emerald-400 font-bold text-base mt-0.5">
                            +₹{simResult.extra_monthly_savings.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-black/30 p-2.5 rounded-lg">
                          <p className="text-gray-400 text-[11px]">Time Saved</p>
                          <p className="text-emerald-400 font-bold text-base mt-0.5">
                            🚀 {simResult.days_saved} days earlier
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-gray-300 leading-relaxed text-center pt-1 border-t border-emerald-500/20">
                        Target completion moves from <span className="text-gray-400">{simResult.baseline_days} days</span> to{' '}
                        <span className="text-emerald-400 font-semibold">{simResult.new_days_needed} days</span> ({simResult.new_projected_date})!
                      </p>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GoalPlanner;
