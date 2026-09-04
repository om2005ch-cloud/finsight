import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 shadow-md">
        <p className="text-zinc-400 text-xs">{label}</p>
        <p className="text-emerald-400 font-semibold text-sm mt-0.5">₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
}

function SpendingChart({ data }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
      <h3 className="text-zinc-100 font-semibold text-base mb-4 tracking-tight">Spending Trend (Last 6 Months)</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="month" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#spendGradient)"
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SpendingChart;