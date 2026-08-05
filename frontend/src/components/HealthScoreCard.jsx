import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Trophy, CheckCircle2, Circle, Sparkles, Award } from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';
import api from '../api/axios';

function HealthScoreCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedHabits, setCompletedHabits] = useState({});

  const fetchHealthScore = async () => {
    try {
      setLoading(true);
      const res = await api.get('/health-score');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load financial health score', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthScore();
  }, []);

  const toggleHabit = (habitId) => {
    setCompletedHabits((prev) => ({
      ...prev,
      [habitId]: !prev[habitId],
    }));
  };

  if (loading) {
    return (
      <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-gray-400 text-sm">
        Calculating Financial Health Score...
      </div>
    );
  }

  if (!data) return null;

  const { total_score, tier, breakdown, micro_habits } = data;

  const cardHover = {
    y: -3,
    boxShadow: '0 0 35px rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  };

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative">
      <div className="grid md:grid-cols-12 gap-6 items-center">
        {/* Left Side: Dynamic Score Ring & Tier */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-white/[0.02] border border-white/5 rounded-xl text-center relative overflow-hidden">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-2">
            <Activity className="w-4 h-4" /> Financial Health Score
          </div>

          <div className="relative flex items-center justify-center my-3">
            <div className="w-32 h-32 rounded-full border-4 border-white/10 flex flex-col items-center justify-center bg-emerald-950/30 relative">
              <span className="text-4xl font-extrabold text-white tracking-tight">
                <AnimatedNumber value={total_score} />
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mt-0.5">/ 100 PTS</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Award className="w-3.5 h-3.5" /> Tier: {tier}
          </div>
        </div>

        {/* Right Side: Score Breakdown Bars */}
        <div className="md:col-span-7 space-y-3">
          <h4 className="text-white text-sm font-semibold mb-1 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Score Components
          </h4>

          {/* Component 1: Budget Adherence */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-300">Budget Adherence</span>
              <span className="text-emerald-400 font-medium">{breakdown.budget_adherence} / 35 pts</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${(breakdown.budget_adherence / 35) * 100}%` }}
              />
            </div>
          </div>

          {/* Component 2: Goal Progress */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-300">Goal Velocity</span>
              <span className="text-emerald-400 font-medium">{breakdown.goal_progress} / 30 pts</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-teal-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${(breakdown.goal_progress / 30) * 100}%` }}
              />
            </div>
          </div>

          {/* Component 3: Anomaly Stability */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-300">Spending Stability</span>
              <span className="text-emerald-400 font-medium">{breakdown.anomaly_stability} / 20 pts</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${(breakdown.anomaly_stability / 20) * 100}%` }}
              />
            </div>
          </div>

          {/* Component 4: Subscription Ratio */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-300">Subscription Efficiency</span>
              <span className="text-emerald-400 font-medium">{breakdown.subscription_ratio} / 15 pts</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${(breakdown.subscription_ratio / 15) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Gamified Micro-Habits Section */}
      <div className="mt-6 pt-5 border-t border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-4 h-4 text-emerald-400" />
          <h4 className="text-white text-sm font-semibold">Weekly Gamified Micro-Habits</h4>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          {micro_habits.map((habit) => {
            const isDone = !!completedHabits[habit.id];
            return (
              <motion.div
                key={habit.id}
                whileHover={cardHover}
                onClick={() => toggleHabit(habit.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isDone
                    ? 'bg-emerald-950/40 border-emerald-500/40 opacity-80'
                    : 'bg-white/[0.02] hover:bg-white/[0.04] border-white/5'
                }`}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <span className={`text-xs font-semibold ${isDone ? 'text-emerald-300 line-through' : 'text-white'}`}>
                    {habit.title}
                  </span>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-500 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed mb-2">{habit.desc}</p>
                <span className="inline-block text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  {habit.reward}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HealthScoreCard;
