import { PieChart } from 'lucide-react';

const CATEGORY_COLORS = {
  Food: '#10b981',       // emerald-500
  Transport: '#3b82f6',  // blue-500
  Shopping: '#ec4899',   // pink-500
  Bills: '#f59e0b',      // amber-500
  Entertainment: '#8b5cf6', // purple-500
  Health: '#06b6d4',     // cyan-500
  Other: '#71717a',      // zinc-500
};

function CategoryBreakdownBar({ transactions }) {
  if (!transactions || transactions.length === 0) return null;

  // Aggregate spending by category
  const categoryTotals = {};
  let grandTotal = 0;

  transactions.forEach((t) => {
    const catName = t.category_name || 'Other';
    const amount = parseFloat(t.amount || 0);
    categoryTotals[catName] = (categoryTotals[catName] || 0) + amount;
    grandTotal += amount;
  });

  if (grandTotal === 0) return null;

  const segments = Object.entries(categoryTotals).map(([name, amount]) => ({
    name,
    amount,
    percentage: ((amount / grandTotal) * 100).toFixed(1),
    color: CATEGORY_COLORS[name] || '#71717a',
  })).sort((a, b) => b.amount - a.amount);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <PieChart className="w-4 h-4 text-emerald-400" />
          <h3 className="text-zinc-100 font-semibold text-base tracking-tight">Category Breakdown</h3>
        </div>
        <span className="text-zinc-400 text-xs font-medium">Total: ₹{grandTotal.toLocaleString()}</span>
      </div>

      {/* Multi-segment bar */}
      <div className="w-full bg-zinc-950 border border-zinc-800 rounded-full h-3 flex overflow-hidden">
        {segments.map((seg) => (
          <div
            key={seg.name}
            style={{ width: `${seg.percentage}%`, backgroundColor: seg.color }}
            className="h-full transition-all duration-500"
            title={`${seg.name}: ₹${seg.amount} (${seg.percentage}%)`}
          />
        ))}
      </div>

      {/* Category Pills Grid */}
      <div className="flex flex-wrap gap-2.5 pt-1">
        {segments.map((seg) => (
          <div
            key={seg.name}
            className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs"
          >
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-zinc-200 font-medium">{seg.name}</span>
            <span className="text-zinc-400">{seg.percentage}%</span>
            <span className="text-zinc-500 font-mono">₹{seg.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryBreakdownBar;
