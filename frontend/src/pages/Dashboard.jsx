import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Wallet } from 'lucide-react';
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
import KpiSummaryRow from '../components/KpiSummaryRow';
import CategoryBreakdownBar from '../components/CategoryBreakdownBar';
import TransactionListSection from '../components/TransactionListSection';
import QuickAddModal from '../components/QuickAddModal';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [budgetStatus, setBudgetStatus] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [insight, setInsight] = useState('');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const currentMonth = new Date().toISOString().slice(0, 8) + '01';

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsQuickAddOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const TrendIcon = forecast?.trend === 'increasing' ? TrendingUp : forecast?.trend === 'decreasing' ? TrendingDown : Minus;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <AnimatedBackground />
        <p className="text-zinc-400 text-sm">Loading financial data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <AnimatedBackground />
        <p className="text-rose-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <AnimatedBackground />
      <Navbar onOpenQuickAdd={() => setIsQuickAddOpen(true)} />

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* 1. Feature 1: Top KPI Summary Header Row */}
        <KpiSummaryRow transactions={transactions} budgetStatus={budgetStatus} forecast={forecast} />

        {/* Add transaction form */}
        <AddTransactionForm onTransactionAdded={handleTransactionAdded} />

        {/* Forecast + Insight row */}
        <div className="grid md:grid-cols-2 gap-6">
          {forecast && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <TrendIcon className="w-4 h-4 text-emerald-400" />
                <h3 className="text-zinc-100 font-semibold text-base tracking-tight">Food Spending Forecast</h3>
              </div>
              <p className="text-3xl font-bold text-zinc-100 tracking-tight mb-1">
                <AnimatedNumber value={forecast.predicted_amount} prefix="₹" />
              </p>
              <p className="text-zinc-400 text-xs">
                Range: ₹{forecast.lower_bound} - ₹{forecast.upper_bound}
              </p>
              <span className={`inline-block mt-3 px-2.5 py-0.5 rounded text-xs font-medium border ${
                forecast.trend === 'increasing' ? 'bg-rose-950 border-rose-900 text-rose-400' :
                forecast.trend === 'decreasing' ? 'bg-emerald-950 border-emerald-900 text-emerald-400' :
                'bg-zinc-800 border-zinc-700 text-zinc-400'
              }`}>
                {forecast.trend}
              </span>
            </div>
          )}

          {insight && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <h3 className="text-zinc-100 font-semibold text-base tracking-tight">This Month's Insight</h3>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed">{insight}</p>
            </div>
          )}
        </div>

        {/* 2. Feature 2: Category Spending Breakdown Bar */}
        <CategoryBreakdownBar transactions={transactions} />

        {/* Spending chart */}
        {chartData.length > 0 && <SpendingChart data={chartData} />}

        {/* Goal Planner & What-If Simulator */}
        <GoalPlanner />

        {/* Subscription & Recurring Bill Detector */}
        <SubscriptionTracker />

        {/* Financial Health Score & Gamified Micro-Habits */}
        <HealthScoreCard />

        {/* Budget status */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
          <h3 className="text-zinc-100 font-semibold text-base mb-4 tracking-tight">Budget Status</h3>
          {budgetStatus.length === 0 ? (
            <p className="text-zinc-400 text-sm">No budgets set for this month.</p>
          ) : (
            <div className="space-y-3.5">
              {budgetStatus.map((b) => {
                const percent = Math.min((parseFloat(b.spent) / parseFloat(b.monthly_limit)) * 100, 100);
                const overBudget = parseFloat(b.spent) > parseFloat(b.monthly_limit);
                return (
                  <div key={b.category_id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-zinc-300 font-medium">{b.category_name}</span>
                      <span className={overBudget ? 'text-rose-400 font-medium' : 'text-zinc-400'}>
                        ₹{b.spent} / ₹{b.monthly_limit}
                        {overBudget && <AlertTriangle className="inline w-3.5 h-3.5 ml-1 -mt-0.5 text-rose-400" />}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-950 border border-zinc-800 rounded-full h-2 overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${overBudget ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. & 4. Feature 3 & 4: Transaction Search, Filtering, Sorting & Export */}
        <TransactionListSection transactions={transactions} />

        {/* AI Assistant floating chat */}
        <FloatingChat />

        {/* 5. Feature 5: Quick-Add Modal Overlay */}
        <QuickAddModal
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
          onTransactionAdded={handleTransactionAdded}
        />
      </div>
    </div>
  );
}

export default Dashboard;