import { useState, useMemo } from 'react';
import { Flame, Sparkles, TrendingUp, ShieldCheck, ChevronDown, ChevronUp, DollarSign, Calendar, Zap, Edit3, Sliders } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

function FireSimulator() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentAge, setCurrentAge] = useState(22);
  const [retireAge, setRetireAge] = useState(45);
  const [currentNetWorth, setCurrentNetWorth] = useState(50000);
  const [monthlyContribution, setMonthlyContribution] = useState(15000);
  const [expectedReturn, setExpectedReturn] = useState(12); // 12% equity CAGR
  const [expectedInflation, setExpectedInflation] = useState(6); // 6% India average
  const [monthlyExpenseToday, setMonthlyExpenseToday] = useState(30000);
  const [fireMultiplier, setFireMultiplier] = useState(25); // 25x standard, 20x lean, 33x fat

  // Manual FIRE Target Override
  const [isCustomTarget, setIsCustomTarget] = useState(false);
  const [customFireTarget, setCustomFireTarget] = useState(10000000); // Default 1 Crore

  const currentYear = new Date().getFullYear();

  // Run Compound Interest & FIRE Simulation
  const { chartData, fireTarget, projectedNetWorth, fireReachedAge, totalInvestedAtRetire } = useMemo(() => {
    const yearsToRetire = Math.max(1, retireAge - currentAge);
    
    // Future monthly expense adjusted for inflation at retirement
    const inflationFactor = Math.pow(1 + expectedInflation / 100, yearsToRetire);
    const monthlyExpenseAtRetire = monthlyExpenseToday * inflationFactor;
    
    // Target is either manual custom target (>= 1 Cr) or auto-calculated from expenses
    const target = isCustomTarget ? customFireTarget : (monthlyExpenseAtRetire * 12 * fireMultiplier);

    const data = [];
    let currentCorpus = currentNetWorth;
    let totalInvested = currentNetWorth;
    let achievedAge = null;
    const r = expectedReturn / 100;

    for (let age = currentAge; age <= Math.min(75, currentAge + 45); age++) {
      const year = currentYear + (age - currentAge);
      
      data.push({
        age,
        year,
        corpus: Math.round(currentCorpus),
        invested: Math.round(totalInvested),
        fireTarget: Math.round(target)
      });

      if (currentCorpus >= target && achievedAge === null) {
        achievedAge = age;
      }

      // Add 1 year of compounding + monthly SIP contributions
      const annualContribution = age < retireAge ? monthlyContribution * 12 : 0;
      currentCorpus = (currentCorpus + annualContribution) * (1 + r);
      if (age < retireAge) {
        totalInvested += annualContribution;
      }
    }

    const retireDataPoint = data.find(d => d.age === retireAge) || data[data.length - 1];

    return {
      chartData: data,
      fireTarget: target,
      projectedNetWorth: retireDataPoint ? retireDataPoint.corpus : currentCorpus,
      totalInvestedAtRetire: retireDataPoint ? retireDataPoint.invested : totalInvested,
      fireReachedAge: achievedAge
    };
  }, [currentAge, retireAge, currentNetWorth, monthlyContribution, expectedReturn, expectedInflation, monthlyExpenseToday, fireMultiplier, isCustomTarget, customFireTarget, currentYear]);

  // Format currency in Indian standard (Lakhs / Crores)
  const formatIndianCurrency = (num) => {
    if (!num || isNaN(num)) return '₹0';
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    }
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} L`;
    }
    return `₹${num.toLocaleString('en-IN')}`;
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm transition-all duration-300">
      {/* Header with Quick Summary */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-zinc-800/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-orange-950/60 border border-orange-800/80 text-orange-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-zinc-100 font-semibold text-base tracking-tight">
                FIRE (Financial Independence, Retire Early) Simulator
              </h3>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-orange-950/80 border border-orange-800 text-orange-400">
                Wealth Planner
              </span>
            </div>
            <p className="text-zinc-400 text-xs mt-0.5">
              Target: <span className="text-zinc-200 font-medium">{formatIndianCurrency(fireTarget)}</span> ({isCustomTarget ? 'Manual Goal' : 'Auto 25x'}) • Projected at {retireAge}: <span className="text-emerald-400 font-medium">{formatIndianCurrency(projectedNetWorth)}</span>
            </p>
          </div>
        </div>

        <button 
          type="button"
          className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Interactive Simulation Studio */}
      {isOpen && (
        <div className="p-5 border-t border-zinc-800 bg-zinc-950/40 space-y-6">
          {/* Top Target Mode Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <div>
              <span className="text-zinc-200 text-xs font-semibold block">FIRE Calculation Method</span>
              <span className="text-zinc-400 text-[11px]">
                {isCustomTarget 
                  ? 'Custom Manual Target (Set your exact dream retirement corpus starting from ₹1 Crore)' 
                  : 'Auto-Calculated (Based on your monthly living expenses + 4% Safe Withdrawal Rule)'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 p-1 bg-zinc-950 border border-zinc-800 rounded-lg">
              <button
                type="button"
                onClick={() => setIsCustomTarget(false)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  !isCustomTarget 
                    ? 'bg-orange-950 border border-orange-700 text-orange-300' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Auto (Expenses)
              </button>
              <button
                type="button"
                onClick={() => setIsCustomTarget(true)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  isCustomTarget 
                    ? 'bg-emerald-950 border border-emerald-700 text-emerald-300' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Manual Target (₹1 Cr+)
              </button>
            </div>
          </div>

          {/* Top Key Metrics Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* 1. FIRE Number */}
            <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800">
              <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">
                {isCustomTarget ? 'Custom FIRE Target' : 'Auto FIRE Target (25x)'}
              </span>
              <p className="text-2xl font-bold text-orange-400 tracking-tight mt-1">
                {formatIndianCurrency(fireTarget)}
              </p>
              <p className="text-zinc-400 text-[11px] mt-1">
                {isCustomTarget ? 'Manual target portfolio' : '25x annual living expenses (4% rule)'}
              </p>
            </div>

            {/* 2. Projected Wealth at Retirement */}
            <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800">
              <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Projected Wealth (Age {retireAge})</span>
              <p className="text-2xl font-bold text-emerald-400 tracking-tight mt-1">
                {formatIndianCurrency(projectedNetWorth)}
              </p>
              <p className="text-zinc-400 text-[11px] mt-1">
                From {formatIndianCurrency(totalInvestedAtRetire)} total invested
              </p>
            </div>

            {/* 3. Financial Freedom Age */}
            <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800">
              <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Freedom Milestone</span>
              <div className="flex items-center gap-2 mt-1">
                <Zap className="w-5 h-5 text-amber-400" />
                <p className="text-2xl font-bold text-zinc-100 tracking-tight">
                  {fireReachedAge ? `Age ${fireReachedAge}` : 'Age > 65'}
                </p>
              </div>
              <p className="text-zinc-400 text-[11px] mt-1">
                {fireReachedAge 
                  ? `Achievable in ${fireReachedAge - currentAge} years (${currentYear + (fireReachedAge - currentAge)})!` 
                  : 'Increase SIP to accelerate freedom'}
              </p>
            </div>
          </div>

          {/* Interactive Chart */}
          <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-zinc-200 text-sm font-semibold">Wealth Trajectory & Compounding</h4>
                <p className="text-zinc-400 text-xs">Comparison of principal invested vs compound investment growth</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-400 inline-block" />
                  Total Wealth
                </span>
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <span className="w-3 h-3 rounded-full bg-zinc-700 inline-block" />
                  Invested
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="wealthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#71717a" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#71717a" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="age" 
                    stroke="#71717a" 
                    fontSize={11}
                    tickFormatter={(val) => `Age ${val}`}
                  />
                  <YAxis 
                    stroke="#71717a" 
                    fontSize={11}
                    tickFormatter={(val) => formatIndianCurrency(val)}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '0.75rem', fontSize: '12px' }}
                    labelFormatter={(label) => `Age ${label} (${currentYear + (label - currentAge)})`}
                    formatter={(value, name) => [
                      formatIndianCurrency(value),
                      name === 'corpus' ? 'Total Wealth' : name === 'invested' ? 'Principal Invested' : 'FIRE Target'
                    ]}
                  />
                  <ReferenceLine y={fireTarget} stroke="#f97316" strokeDasharray="4 4" label={{ value: 'FIRE Goal', fill: '#f97316', fontSize: 11, position: 'insideTopRight' }} />
                  <Area type="monotone" dataKey="corpus" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#wealthGrad)" />
                  <Area type="monotone" dataKey="invested" stroke="#71717a" strokeWidth={1.5} fillOpacity={1} fill="url(#investedGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Interactive Sliders & Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
            {/* If Manual Mode Enabled: Custom Target Slider starting from 1 Crore */}
            {isCustomTarget && (
              <div className="space-y-1.5 sm:col-span-2 lg:col-span-3 p-3 rounded-lg bg-orange-950/20 border border-orange-900/40">
                <div className="flex justify-between text-xs items-center">
                  <span className="text-orange-300 font-medium">🎯 Manual FIRE Target (Starting from ₹1.00 Cr)</span>
                  <span className="text-orange-400 font-bold text-sm">{formatIndianCurrency(customFireTarget)}</span>
                </div>
                <input 
                  type="range" 
                  min={10000000} // 1 Crore
                  max={250000000} // 25 Crore
                  step={2500000} // 25 Lakhs step
                  value={customFireTarget} 
                  onChange={(e) => setCustomFireTarget(parseInt(e.target.value))}
                  className="w-full accent-orange-500 h-2 bg-zinc-800 rounded-lg cursor-pointer"
                />
                <div className="flex items-center justify-between gap-1 mt-1">
                  <span className="text-[10px] text-zinc-500">₹1 Cr</span>
                  <div className="flex gap-1.5">
                    {[10000000, 25000000, 50000000, 100000000, 200000000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setCustomFireTarget(val)}
                        className={`px-2 py-0.5 rounded text-[10px] font-medium border cursor-pointer ${
                          customFireTarget === val 
                            ? 'bg-orange-900/60 border-orange-600 text-orange-200' 
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {formatIndianCurrency(val)}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-zinc-500">₹25 Cr</span>
                </div>
              </div>
            )}

            {/* 1. Current Age & Target Age */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Current Age: <strong className="text-zinc-200">{currentAge}</strong></span>
                <span className="text-zinc-400">Target Age: <strong className="text-emerald-400">{retireAge}</strong></span>
              </div>
              <input 
                type="range" 
                min={18} 
                max={60} 
                value={currentAge} 
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setCurrentAge(val);
                  if (val >= retireAge) setRetireAge(val + 5);
                }}
                className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
              <input 
                type="range" 
                min={currentAge + 1} 
                max={70} 
                value={retireAge} 
                onChange={(e) => setRetireAge(parseInt(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* 2. Monthly Contribution */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Monthly SIP Contribution</span>
                <span className="text-emerald-400 font-semibold">{formatIndianCurrency(monthlyContribution)}</span>
              </div>
              <input 
                type="range" 
                min={2000} 
                max={200000} 
                step={1000}
                value={monthlyContribution} 
                onChange={(e) => setMonthlyContribution(parseInt(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>₹2k/mo</span>
                <span>₹1 Lakh/mo</span>
                <span>₹2 Lakh/mo</span>
              </div>
            </div>

            {/* 3. Current Monthly Expense (Only when auto mode) */}
            {!isCustomTarget && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Today's Monthly Expense</span>
                  <span className="text-zinc-200 font-semibold">{formatIndianCurrency(monthlyExpenseToday)}</span>
                </div>
                <input 
                  type="range" 
                  min={10000} 
                  max={200000} 
                  step={5000}
                  value={monthlyExpenseToday} 
                  onChange={(e) => setMonthlyExpenseToday(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>₹10k</span>
                  <span>₹1 Lakh</span>
                  <span>₹2 Lakh</span>
                </div>
              </div>
            )}

            {/* 4. Expected CAGR Return */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Expected Annual Return (CAGR)</span>
                <span className="text-emerald-400 font-semibold">{expectedReturn}%</span>
              </div>
              <input 
                type="range" 
                min={6} 
                max={18} 
                step={0.5}
                value={expectedReturn} 
                onChange={(e) => setExpectedReturn(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>6% (FD)</span>
                <span>12% (Nifty 50)</span>
                <span>18% (High Growth)</span>
              </div>
            </div>

            {/* 5. Expected Inflation */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Expected Inflation Rate</span>
                <span className="text-zinc-200 font-semibold">{expectedInflation}%</span>
              </div>
              <input 
                type="range" 
                min={4} 
                max={10} 
                step={0.5}
                value={expectedInflation} 
                onChange={(e) => setExpectedInflation(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>4% (Low)</span>
                <span>6% (Avg)</span>
                <span>10% (High)</span>
              </div>
            </div>

            {/* 6. FIRE Multiplier Mode (Auto Mode Only) */}
            {!isCustomTarget && (
              <div className="space-y-1.5">
                <span className="text-zinc-400 text-xs block">FIRE Rule Strategy</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: 'Lean FIRE', mul: 20, desc: '20x' },
                    { label: 'Standard', mul: 25, desc: '25x (4%)' },
                    { label: 'Fat FIRE', mul: 33, desc: '33x (3%)' },
                  ].map((mode) => (
                    <button
                      key={mode.mul}
                      type="button"
                      onClick={() => setFireMultiplier(mode.mul)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer text-center ${
                        fireMultiplier === mode.mul
                          ? 'bg-orange-950/80 border-orange-700 text-orange-300'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <div className="font-semibold">{mode.label}</div>
                      <div className="text-[10px] opacity-70">{mode.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FireSimulator;
