import { TrendingUp, TrendingDown, CreditCard, Target, Activity } from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';

function KpiSummaryRow({ transactions, budgetStatus, forecast }) {
  // Calculate total spent current month
  const totalSpent = transactions.reduce((acc, t) => acc + parseFloat(t.amount || 0), 0);
  
  // Calculate savings velocity from budget or goals estimation
  const totalBudgeted = budgetStatus.reduce((acc, b) => acc + parseFloat(b.monthly_limit || 0), 0);
  const totalBudgetSpent = budgetStatus.reduce((acc, b) => acc + parseFloat(b.spent || 0), 0);
  const budgetRatio = totalBudgeted > 0 ? Math.round((totalBudgetSpent / totalBudgeted) * 100) : 0;

  // Comparison mock logic (e.g. -4.8% vs last month)
  const isIncreasing = forecast?.trend === 'increasing';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Monthly Spend */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Total Monthly Spend</span>
          <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-bold text-zinc-100 tracking-tight">
          <AnimatedNumber value={totalSpent} prefix="₹" />
        </p>
        <div className="flex items-center gap-1.5 mt-2">
          <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded border ${
            isIncreasing 
              ? 'bg-rose-950 border-rose-900 text-rose-400' 
              : 'bg-emerald-950 border-emerald-900 text-emerald-400'
          }`}>
            {isIncreasing ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {isIncreasing ? '+5.2% vs last mo' : '-4.8% vs last mo'}
          </span>
          <span className="text-zinc-500 text-[11px]">Real DB total</span>
        </div>
      </div>

      {/* 2. Budget Utilization */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Budget Utilization</span>
          <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-emerald-400">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-bold text-zinc-100 tracking-tight">
          {budgetRatio}%
        </p>
        <div className="w-full bg-zinc-950 border border-zinc-800 rounded-full h-1.5 mt-3 overflow-hidden">
          <div
            style={{ width: `${Math.min(budgetRatio, 100)}%` }}
            className={`h-full rounded-full transition-all duration-500 ${budgetRatio > 100 ? 'bg-rose-500' : 'bg-emerald-500'}`}
          />
        </div>
      </div>

      {/* 3. Forecast Trend */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Forecasted Food Spend</span>
          <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-emerald-400">
            <Target className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-bold text-zinc-100 tracking-tight">
          {forecast ? <AnimatedNumber value={forecast.predicted_amount} prefix="₹" /> : '₹0'}
        </p>
        <p className="text-zinc-400 text-xs mt-2">
          Range: ₹{forecast?.lower_bound || 0} - ₹{forecast?.upper_bound || 0}
        </p>
      </div>

      {/* 4. Financial Health Score */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Health Status</span>
          <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-emerald-400">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-bold text-zinc-100 tracking-tight">
          88 <span className="text-xs text-zinc-500 font-normal">/ 100 PTS</span>
        </p>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="inline-block text-[11px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-900 px-2 py-0.5 rounded">
            Tier: Emerald Prime
          </span>
        </div>
      </div>
    </div>
  );
}

export default KpiSummaryRow;
