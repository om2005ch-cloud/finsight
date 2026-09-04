import { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Trophy, CheckCircle2, Circle, Award } from 'lucide-react';
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
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-zinc-400 text-sm">
        Calculating Financial Health Score...
      </div>
    );
  }

  if (!data) return null;

  const { total_score, tier, breakdown, micro_habits } = data;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 relative shadow-sm">
      <div className="grid md:grid-cols-12 gap-6 items-center">
        {/* Left Side: Score Display */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-5 bg-zinc-950 border border-zinc-800 rounded-lg text-center">
          <div className="flex items-center gap-2 text-emerald-400 font-medium text-xs mb-3">
            <Activity className="w-4 h-4" /> Financial Health Score
          </div>

          <div className="relative flex items-center justify-center my-2">
            <div className="w-28 h-28 rounded-full border-2 border-zinc-800 flex flex-col items-center justify-center bg-zinc-900">
              <span className="text-3xl font-bold text-zinc-100 tracking-tight">
                <AnimatedNumber value={total_score} />
              </span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mt-0.5">/ 100 PTS</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-emerald-950 border border-emerald-800 text-emerald-300 mt-2">
            <Award className="w-3.5 h-3.5" /> Tier: {tier}
          </div>
        </div>

        {/* Right Side: Score Breakdown Bars */}
        <div className="md:col-span-7 space-y-3.5">
          <h4 className="text-zinc-100 text-sm font-semibold mb-2 flex items-center gap-2 tracking-tight">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Score Components
          </h4>

          {/* Component 1: Budget Adherence */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-zinc-400">Budget Adherence</span>
              <span className="text-emerald-400 font-medium">{breakdown.budget_adherence} / 35 pts</span>
            </div>
            <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden border border-zinc-800">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(breakdown.budget_adherence / 35) * 100}%` }}
              />
            </div>
          </div>

          {/* Component 2: Goal Progress */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-zinc-400">Goal Velocity</span>
              <span className="text-emerald-400 font-medium">{breakdown.goal_progress} / 30 pts</span>
            </div>
            <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden border border-zinc-800">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(breakdown.goal_progress / 30) * 100}%` }}
              />
            </div>
          </div>

          {/* Component 3: Anomaly Stability */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-zinc-400">Spending Stability</span>
              <span className="text-emerald-400 font-medium">{breakdown.anomaly_stability} / 20 pts</span>
            </div>
            <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden border border-zinc-800">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(breakdown.anomaly_stability / 20) * 100}%` }}
              />
            </div>
          </div>

          {/* Component 4: Subscription Ratio */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-zinc-400">Subscription Efficiency</span>
              <span className="text-emerald-400 font-medium">{breakdown.subscription_ratio} / 15 pts</span>
            </div>
            <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden border border-zinc-800">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(breakdown.subscription_ratio / 15) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Gamified Micro-Habits Section */}
      <div className="mt-5 pt-4 border-t border-zinc-800">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-4 h-4 text-emerald-400" />
          <h4 className="text-zinc-100 text-sm font-semibold tracking-tight">Weekly Micro-Habits</h4>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          {micro_habits.map((habit) => {
            const isDone = !!completedHabits[habit.id];
            return (
              <div
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-colors ${
                  isDone
                    ? 'bg-zinc-950 border-emerald-800/60 opacity-80'
                    : 'bg-zinc-950 hover:bg-zinc-950/80 border-zinc-800'
                }`}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <span className={`text-xs font-medium ${isDone ? 'text-emerald-400 line-through' : 'text-zinc-200'}`}>
                    {habit.title}
                  </span>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-zinc-600 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed mb-2">{habit.desc}</p>
                <span className="inline-block text-[10px] font-medium text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900">
                  {habit.reward}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HealthScoreCard;
