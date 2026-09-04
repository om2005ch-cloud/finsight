import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Sliders, Calendar, Trash2, Sparkles, X } from 'lucide-react';
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
  const [cuts, setCuts] = useState({});
  const [simResult, setSimResult] = useState(null);

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
    const initialCuts = {};
    categoryAverages.forEach(cat => {
      initialCuts[cat.category_id] = 0;
    });
    setCuts(initialCuts);
    setSimResult(null);
    setShowSimulateModal(true);
  };

  const handleCutChange = (categoryId, cutVal) => {
    const updatedCuts = { ...cuts, [categoryId]: cutVal };
    setCuts(updatedCuts);

    // Calculate simulation immediately
    let extraMonthlySavings = 0;
    categoryAverages.forEach(cat => {
      const cutPercent = updatedCuts[cat.category_id] || 0;
      extraMonthlySavings += (cat.avg_monthly_spend * cutPercent) / 100;
    });

    const remainingToGoal = selectedGoal.target_amount - selectedGoal.current_amount;
    if (remainingToGoal <= 0) return;

    const currentMonthlyRate = 3000; // estimated baseline monthly saving rate
    const newMonthlyRate = currentMonthlyRate + extraMonthlySavings;

    const baselineMonths = remainingToGoal / currentMonthlyRate;
    const newMonths = remainingToGoal / newMonthlyRate;

    const baselineDays = Math.round(baselineMonths * 30);
    const newDaysNeeded = Math.round(newMonths * 30);
    const daysSaved = Math.max(0, baselineDays - newDaysNeeded);

    const projectedDateObj = new Date();
    projectedDateObj.setDate(projectedDateObj.getDate() + newDaysNeeded);

    setSimResult({
      extra_monthly_savings: Math.round(extraMonthlySavings),
      baseline_days: baselineDays,
      new_days_needed: newDaysNeeded,
      days_saved: daysSaved,
      new_projected_date: projectedDateObj.toLocaleDateString(),
    });
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <h3 className="text-zinc-100 font-semibold text-base tracking-tight">Savings Goals & "What-If" Simulator</h3>
          </div>
          <p className="text-zinc-400 text-xs mt-0.5">
            Track goals and simulate how cutbacks accelerate completion
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Goal
        </button>
      </div>

      {/* Goals Grid */}
      {loading ? (
        <p className="text-zinc-400 text-sm">Loading financial goals...</p>
      ) : goals.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-zinc-800 rounded-lg">
          <Target className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
          <p className="text-zinc-300 text-sm font-medium">No savings goals yet</p>
          <p className="text-zinc-500 text-xs mt-1">Add a goal (e.g., Emergency Fund or Japan Trip) to get started</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {goals.map((g) => (
            <div
              key={g.id}
              className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 relative group"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-zinc-100 font-semibold text-sm">{g.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" /> {new Date(g.target_date).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>{g.days_remaining} days left</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openSimulator(g)}
                    title="Run What-If Simulator"
                    className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400 hover:bg-zinc-800 transition-colors"
                  >
                    <Sliders className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(g.id)}
                    title="Delete Goal"
                    className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-rose-400 hover:bg-rose-950 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-emerald-400 font-medium">₹{g.current_amount.toLocaleString()} saved</span>
                  <span className="text-zinc-400">Target: ₹{g.target_amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-zinc-900 border border-zinc-800 rounded-full h-2 overflow-hidden">
                  <div
                    style={{ width: `${g.progress_percent}%` }}
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>

              {/* Action & Rate Footer */}
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-zinc-800 text-xs">
                <div className="text-zinc-400">
                  Required: <span className="text-zinc-100 font-medium">₹{g.required_daily_saving}/day</span>
                </div>
                <button
                  onClick={() => handleQuickAddSavings(g)}
                  className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline flex items-center gap-1"
                >
                  + Add Savings
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Goal */}
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
                  <Target className="w-4 h-4 text-emerald-400" /> Create Savings Goal
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-zinc-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateGoal} className="space-y-4">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Goal Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Emergency Fund, New Laptop"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-zinc-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Target Amount (₹)</label>
                    <input
                      type="number"
                      placeholder="50000"
                      value={newTarget}
                      onChange={(e) => setNewTarget(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-zinc-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Current Saved (₹)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={newCurrent}
                      onChange={(e) => setNewCurrent(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-zinc-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Target Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-zinc-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-lg transition-colors cursor-pointer"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-lg w-full shadow-xl relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-zinc-100 font-semibold text-base flex items-center gap-2 tracking-tight">
                    <Sliders className="w-4 h-4 text-emerald-400" /> "What-If" Spending Cut Simulator
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Simulating goal: <span className="text-zinc-100 font-medium">{selectedGoal.title}</span></p>
                </div>
                <button onClick={() => setShowSimulateModal(false)} className="text-zinc-400 hover:text-zinc-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {categoryAverages.length === 0 ? (
                <p className="text-zinc-400 text-xs py-4 text-center">
                  Add some transaction history across categories to enable Spending Cut simulations!
                </p>
              ) : (
                <div className="space-y-4">
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Adjust the sliders to simulate cutting monthly category spending. See how many days faster you'll reach your goal!
                  </p>

                  <div className="space-y-3 bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                    {categoryAverages.map((cat) => {
                      const currentCut = cuts[cat.category_id] || 0;
                      const monthlySaved = ((cat.avg_monthly_spend * currentCut) / 100).toFixed(2);
                      return (
                        <div key={cat.category_id} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-zinc-200 font-medium">{cat.category_name}</span>
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
                              className="w-full accent-emerald-500 h-1.5 bg-zinc-900 rounded-lg cursor-pointer"
                            />
                            <span className="text-xs text-zinc-400 w-8 text-right">{currentCut}%</span>
                          </div>
                          <p className="text-[10px] text-zinc-500">Avg Monthly Spend: ₹{cat.avg_monthly_spend}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Simulation Output Card */}
                  {simResult && (
                    <div className="bg-zinc-950 border border-emerald-800 p-4 rounded-lg space-y-3">
                      <div className="flex items-center gap-2 text-emerald-400 font-medium text-xs">
                        <Sparkles className="w-4 h-4" /> Simulation Projection
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="bg-zinc-900 p-2.5 rounded-lg border border-zinc-800">
                          <p className="text-zinc-400 text-[11px]">Extra Monthly Savings</p>
                          <p className="text-emerald-400 font-bold text-sm mt-0.5">
                            +₹{simResult.extra_monthly_savings.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-zinc-900 p-2.5 rounded-lg border border-zinc-800">
                          <p className="text-zinc-400 text-[11px]">Time Saved</p>
                          <p className="text-emerald-400 font-bold text-sm mt-0.5">
                            🚀 {simResult.days_saved} days earlier
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed text-center pt-1 border-t border-zinc-800">
                        Target completion moves from <span className="text-zinc-400">{simResult.baseline_days} days</span> to{' '}
                        <span className="text-emerald-400 font-semibold">{simResult.new_days_needed} days</span> ({simResult.new_projected_date})!
                      </p>
                    </div>
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
