import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Wallet, Receipt } from 'lucide-react';
import api from '../api/axios';
import AddTransactionForm from '../components/AddTransactionForm';
import GoalPlanner from '../components/GoalPlanner';
import SubscriptionTracker from '../components/SubscriptionTracker';
import HealthScoreCard from '../components/HealthScoreCard';
import FloatingChat from '../components/FloatingChat';
import AnimatedBackground from '../components/AnimatedBackground';
import Navbar from '../components/Navbar';
import SpendingChart from '../components/SpendingChart';
import AnimatedNumber from '../components/AnimatedNumber';
import TiltCard from '../components/TiltCard';
function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [budgetStatus, setBudgetStatus] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [insight, setInsight] = useState('');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentMonth = new Date().toISOString().slice(0, 8) + '01';

  const fetchData = async () => {
    try {
      const [txRes, budgetRes] = await Promise.all([
        api.get('/transactions'),
        api.get(`/budgets/status?month=${currentMonth}`),
      ]);
      setTransactions(txRes.data.transactions);
      setBudgetStatus(budgetRes.data);

      try {
        const forecastRes = await api.get('/transactions/forecast/1');
        setForecast(forecastRes.data);
      } catch (err) {
        setForecast(null);
      }

      try {
        const insightRes = await api.get('/assistant/monthly-insight');
        setInsight(insightRes.data.insight);
      } catch (err) {
        setInsight('');
      }

      try {
        const chartRes = await api.get('/transactions/history-overview');
        setChartData(chartRes.data.map(row => ({ month: row.month, total: parseFloat(row.total) })));
      } catch (err) {
        setChartData([]);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTransactionAdded = (newTransaction) => {
    setTransactions([newTransaction, ...transactions]);
    fetchData();
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const cardHover = {
    y: -4,
    boxShadow: '0 0 40px rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  };

  const TrendIcon = forecast?.trend === 'increasing' ? TrendingUp : forecast?.trend === 'decreasing' ? TrendingDown : Minus;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <AnimatedBackground />
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <AnimatedBackground />
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Add transaction */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <AddTransactionForm onTransactionAdded={handleTransactionAdded} />
        </motion.div>

        {/* Forecast + Insight row */}
        <div className="grid md:grid-cols-2 gap-6">
          {forecast && (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    animate="visible"
    transition={{ delay: 0.1 }}
    style={{ perspective: 1000 }}
  >
    <TiltCard className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6 cursor-default">
      <div className="flex items-center gap-2 mb-4">
        <TrendIcon className="w-5 h-5 text-emerald-400" />
        <h3 className="text-white font-semibold">Food Spending Forecast</h3>
      </div>
      <p className="text-3xl font-bold text-white mb-1">
        <AnimatedNumber value={forecast.predicted_amount} prefix="₹" />
      </p>
      <p className="text-gray-400 text-sm">
        Range: ₹{forecast.lower_bound} - ₹{forecast.upper_bound}
      </p>
      <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${
        forecast.trend === 'increasing' ? 'bg-red-500/20 text-red-400' :
        forecast.trend === 'decreasing' ? 'bg-emerald-500/20 text-emerald-400' :
        'bg-gray-500/20 text-gray-400'
      }`}>
        {forecast.trend}
      </span>
    </TiltCard>
  </motion.div>
)}

          {insight && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              whileHover={cardHover}
              className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <h3 className="text-white font-semibold">This Month's Insight</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{insight}</p>
            </motion.div>
          )}
        </div>

        {/* Spending chart */}
        {chartData.length > 0 && <SpendingChart data={chartData} />}

        {/* Goal Planner & What-If Simulator */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.25 }}>
          <GoalPlanner />
        </motion.div>

        {/* Subscription & Recurring Bill Detector */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.28 }}>
          <SubscriptionTracker />
        </motion.div>

        {/* Financial Health Score & Gamified Micro-Habits */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
          <HealthScoreCard />
        </motion.div>

        {/* Budget status */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          whileHover={cardHover}
          className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-white font-semibold mb-4">Budget Status</h3>
          {budgetStatus.length === 0 ? (
            <p className="text-gray-400 text-sm">No budgets set for this month.</p>
          ) : (
            <div className="space-y-3">
              {budgetStatus.map((b) => {
                const percent = Math.min((parseFloat(b.spent) / parseFloat(b.monthly_limit)) * 100, 100);
                const overBudget = parseFloat(b.spent) > parseFloat(b.monthly_limit);
                return (
                  <div key={b.category_id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{b.category_name}</span>
                      <span className={overBudget ? 'text-red-400' : 'text-gray-400'}>
                        ₹{b.spent} / ₹{b.monthly_limit}
                        {overBudget && <AlertTriangle className="inline w-3.5 h-3.5 ml-1 -mt-0.5" />}
                      </span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${overBudget ? 'bg-red-500' : 'bg-emerald-500'}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Transactions list */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          whileHover={cardHover}
          className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Receipt className="w-5 h-5 text-emerald-400" />
            <h3 className="text-white font-semibold">Your Transactions</h3>
          </div>
          {transactions.length === 0 ? (
            <p className="text-gray-400 text-sm">No transactions yet.</p>
          ) : (
            <div className="space-y-2">
              {transactions.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.05)' }}
                  className="flex justify-between items-center py-2.5 px-3 rounded-lg transition-colors"
                >
                  <div>
                    <p className="text-white text-sm">{t.description || 'No description'}</p>
                    <p className="text-gray-500 text-xs">{t.category_name}</p>
                  </div>
                  <span className="text-white font-medium">₹{t.amount}</span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* AI Assistant */}
        {/* AI Assistant floating chat */}
<FloatingChat />
      </div>
    </div>
  );
}

export default Dashboard;