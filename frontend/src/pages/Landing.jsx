import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  TrendingUp,
  Brain,
  Shield,
  Zap,
  BarChart3,
  SlidersHorizontal,
  Database,
  Cpu,
  Terminal,
  AlertTriangle,
  Layers,
  Lock,
  RefreshCw,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  CreditCard,
  Clock,
  Search,
  Command,
  Activity,
  Check,
} from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import logo from '../assets/logo.png';

export default function Landing() {
  const navigate = useNavigate();

  // Interactive Product Showcase State
  const [activeTab, setActiveTab] = useState('classify');
  const [customQuery, setCustomQuery] = useState('Swiggy gourmet dinner');
  const [classifiedCategory, setClassifiedCategory] = useState({ name: 'Food & Dining', conf: 98.6, tags: ['swiggy', 'dinner', 'restaurant'] });
  
  // What-If Simulator state inside Bento card
  const [cutbackPercent, setCutbackPercent] = useState(15);
  const baseMonthlySpend = 42000;
  const targetGoal = 150000;
  const currentMonthlySavings = 8000;
  const extraSaved = Math.round((baseMonthlySpend * cutbackPercent) / 100);
  const totalMonthlySavings = currentMonthlySavings + extraSaved;
  const monthsToGoal = (targetGoal / totalMonthlySavings).toFixed(1);
  const baselineMonths = (targetGoal / currentMonthlySavings).toFixed(1);
  const monthsSaved = (baselineMonths - monthsToGoal).toFixed(1);

  // Anomaly Shield state
  const [resolvedAnomalies, setResolvedAnomalies] = useState({});

  // Copilot Interactive State
  const [copilotQueryIndex, setCopilotQueryIndex] = useState(0);

  const sampleTransactions = [
    { text: 'Uber Trip Koramangala', cat: 'Transport', conf: 99.2, tags: ['uber', 'trip', 'cab'] },
    { text: 'Swiggy Gourmet Dinner', cat: 'Food & Dining', conf: 98.6, tags: ['swiggy', 'food', 'restaurant'] },
    { text: 'AWS Cloud EC2 Hosting', cat: 'Bills & Utilities', conf: 99.7, tags: ['aws', 'cloud', 'server'] },
    { text: 'Cult Fit Gym Membership', cat: 'Health & Fitness', conf: 96.4, tags: ['fitness', 'gym', 'health'] },
    { text: 'Zara Premium Apparel', cat: 'Shopping', conf: 97.1, tags: ['zara', 'clothing', 'retail'] },
  ];

  const copilotSamples = [
    {
      query: 'What is my projected end-of-month cash surplus?',
      answer: 'Based on your 60-day historical run-rate of ₹38,450/month and confirmed recurring bills of ₹6,200, your projected surplus is ₹18,350 (±₹1,200 variance).',
      source: 'SELECT SUM(amount) FROM transactions WHERE date >= NOW() - INTERVAL 60 DAY',
      metric: '₹18,350 Projected Surplus',
    },
    {
      query: 'Did any subscription increase in price this month?',
      answer: 'Yes. Netflix 4K upgraded from ₹649/mo to ₹799/mo on Aug 18 (+23.1% variance). No other recurring drift detected across 6 active services.',
      source: 'SELECT name, amount, last_billed FROM subscriptions WHERE price_delta > 0',
      metric: '+₹150/mo Subscription Drift',
    },
    {
      query: 'How much can I allocate towards my Emergency Fund goal?',
      answer: 'By trimming 15% across Dining & Shopping categories, you can safely deploy ₹6,300 additional capital each month, reaching your ₹1.5L target 6.2 months sooner.',
      source: 'OPTIMIZE budget_allocation BY category_elasticity(dining, shopping)',
      metric: '6.2 Months Accelerated',
    },
  ];

  const handleTestClassify = (item) => {
    setCustomQuery(item.text);
    setClassifiedCategory({ name: item.cat, conf: item.conf, tags: item.tags });
  };

  const handleCustomClassifyInput = (text) => {
    setCustomQuery(text);
    const lower = text.toLowerCase();
    if (lower.includes('uber') || lower.includes('ola') || lower.includes('flight') || lower.includes('metro') || lower.includes('cab')) {
      setClassifiedCategory({ name: 'Transport', conf: 98.9, tags: ['transit', 'mobility', 'urban'] });
    } else if (lower.includes('swiggy') || lower.includes('zomato') || lower.includes('starbucks') || lower.includes('coffee') || lower.includes('food')) {
      setClassifiedCategory({ name: 'Food & Dining', conf: 99.1, tags: ['culinary', 'dining', 'beverage'] });
    } else if (lower.includes('aws') || lower.includes('cloud') || lower.includes('github') || lower.includes('wifi') || lower.includes('bill')) {
      setClassifiedCategory({ name: 'Bills & Utilities', conf: 99.4, tags: ['infrastructure', 'utility', 'saas'] });
    } else if (lower.includes('gym') || lower.includes('cult') || lower.includes('pharma') || lower.includes('doctor')) {
      setClassifiedCategory({ name: 'Health & Fitness', conf: 96.8, tags: ['wellness', 'medical', 'fitness'] });
    } else if (lower.includes('netflix') || lower.includes('spotify') || lower.includes('prime') || lower.includes('movie')) {
      setClassifiedCategory({ name: 'Entertainment', conf: 97.8, tags: ['media', 'streaming', 'subscription'] });
    } else {
      setClassifiedCategory({ name: 'Shopping & Retail', conf: 94.5, tags: ['general_merchandise', 'retail'] });
    }
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-300">
      <AnimatedBackground />

      {/* 1. Precision Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#070d16]/85 border-b border-emerald-900/30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div 
              onClick={() => navigate('/')} 
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <img src={logo} alt="FinSight" className="w-8 h-8 rounded-lg border border-emerald-500/30 group-hover:border-emerald-400/60 transition-colors shadow-sm shadow-emerald-500/10" />
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-base tracking-tight font-sans">FinSight</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 font-medium">CORE v2.4</span>
              </div>
            </div>

            {/* Live System Heartbeat */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-emerald-300/90 pl-4 border-l border-slate-800 bg-emerald-950/30 px-3 py-1 rounded-full border border-emerald-900/40">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span>PostgreSQL & ML Engine Online</span>
            </div>
          </div>

          {/* Quick Nav Anchors */}
          <nav className="hidden md:flex items-center gap-6 text-xs text-slate-300 font-medium">
            <a href="#interactive-demo" className="hover:text-emerald-300 transition-colors">Interactive Demo</a>
            <a href="#features" className="hover:text-emerald-300 transition-colors">Capabilities</a>
            <a href="#architecture" className="hover:text-emerald-300 transition-colors">Architecture</a>
            <a href="#security" className="hover:text-emerald-300 transition-colors">Security</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-slate-300 hover:text-white text-xs font-medium px-3.5 py-2 transition-colors cursor-pointer"
            >
              Log in
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold text-xs px-4 py-2 rounded-lg transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              Get Started <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 w-full text-center relative">
        {/* Color-graded Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-950/80 via-teal-950/60 to-slate-900 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 mb-8 shadow-sm shadow-emerald-950/40">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>AUTONOMOUS FINANCIAL TELEMETRY & ML CLASSIFICATION</span>
        </div>

        {/* Hero Title with Vibrant Gradient */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
          Precision Financial Intelligence{' '}
          <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-400 bg-clip-text text-transparent">
            for Modern Money.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
          Pair deterministic PostgreSQL ledger integrity with real-time scikit-learn models. Automatically categorize transactions, simulate runway, and catch statistical spend anomalies.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
          <button
            onClick={() => navigate('/signup')}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-lg px-7 py-3.5 text-sm transition-all cursor-pointer w-full sm:w-auto shadow-lg shadow-emerald-500/25 active:scale-95"
          >
            Launch Live Dashboard <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center justify-center gap-2 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-emerald-500/50 text-slate-200 font-medium rounded-lg px-6 py-3.5 text-sm transition-all cursor-pointer w-full sm:w-auto active:scale-95 shadow-sm"
          >
            Explore Demo Sandbox
          </button>
        </div>

        {/* Keyboard Quick-Add Hint */}
        <div className="inline-flex items-center gap-2 text-xs text-slate-400 font-mono bg-slate-900/90 px-3.5 py-1.5 rounded-lg border border-slate-800 shadow-inner">
          <Command className="w-3.5 h-3.5 text-emerald-400" />
          <span>Global Quick-Entry: Press <kbd className="text-emerald-300 font-bold bg-slate-800 px-1.5 py-0.5 rounded border border-emerald-900/50">⌘K</kbd> / <kbd className="text-emerald-300 font-bold bg-slate-800 px-1.5 py-0.5 rounded border border-emerald-900/50">Ctrl+K</kbd> anywhere</span>
        </div>
      </section>

      {/* 2. Interactive Product Stage (Revolut / ConsenSys inspired) */}
      <section id="interactive-demo" className="max-w-5xl mx-auto px-6 mb-20 w-full">
        <div className="bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-[#0b131e]/95 border border-emerald-500/30 rounded-xl overflow-hidden shadow-2xl shadow-emerald-950/40">
          {/* Stage Top Bar & Module Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-emerald-900/30 bg-[#070e17]/90 px-4 py-3 gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-slate-400 text-xs font-mono ml-2">finsight-engine://interactive-workspace</span>
            </div>

            {/* Workspace Module Selector */}
            <div className="flex items-center gap-1 bg-[#060c14] p-1 rounded-lg border border-emerald-900/40 overflow-x-auto">
              <button
                onClick={() => setActiveTab('classify')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'classify'
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 shadow-sm border border-emerald-500/50 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-emerald-400" /> ML Classifier
                </span>
              </button>

              <button
                onClick={() => setActiveTab('forecast')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'forecast'
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-teal-300 shadow-sm border border-teal-500/50 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-teal-400" /> Cashflow Forecast
                </span>
              </button>

              <button
                onClick={() => setActiveTab('anomaly')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'anomaly'
                    ? 'bg-gradient-to-r from-rose-500/20 to-amber-500/20 text-rose-300 shadow-sm border border-rose-500/50 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-rose-400" /> Anomaly Shield
                </span>
              </button>

              <button
                onClick={() => setActiveTab('copilot')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'copilot'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-300 shadow-sm border border-cyan-500/50 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Intelligence Copilot
                </span>
              </button>
            </div>
          </div>

          {/* Tab 1: ML Classifier Interactive Sandbox */}
          {activeTab === 'classify' && (
            <div className="p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" /> Real-Time TF-IDF & Logistic Regression Classifier
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Type or click any merchant description below to watch the local model categorize and score confidence in real-time.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/70 border border-emerald-700/60 px-2.5 py-1 rounded shadow-sm">
                  ⚡ Latency: 18ms (Local CPU)
                </span>
              </div>

              {/* Interactive Input Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={customQuery}
                  onChange={(e) => handleCustomClassifyInput(e.target.value)}
                  placeholder="e.g. Swiggy gourmet dinner, Uber airport ride, AWS monthly invoice..."
                  className="w-full bg-[#060b12] border border-emerald-500/30 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 transition-colors font-mono"
                />
              </div>

              {/* Sample Quick Chips */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-slate-400 font-mono">Test samples:</span>
                {sampleTransactions.map((tx, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleTestClassify(tx)}
                    className="text-xs px-2.5 py-1 rounded bg-[#070e17] border border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-950/40 text-slate-200 hover:text-emerald-200 transition-colors cursor-pointer font-medium"
                  >
                    {tx.text}
                  </button>
                ))}
              </div>

              {/* Real-time Inference Result Card with Color Grading */}
              <div className="bg-gradient-to-br from-[#070e17] via-[#091522] to-[#070e17] border border-emerald-500/30 rounded-lg p-5 shadow-inner">
                <div className="grid sm:grid-cols-3 gap-4 mb-4 pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 block">ASSIGNED CATEGORY</span>
                    <span className="text-base font-bold text-emerald-300 mt-1 inline-block bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/60">
                      {classifiedCategory.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 block">MODEL CONFIDENCE</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-base font-bold text-cyan-300 font-mono">
                        {classifiedCategory.conf}%
                      </span>
                      <div className="flex-1 max-w-[90px] h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 rounded-full transition-all duration-300 shadow-sm"
                          style={{ width: `${classifiedCategory.conf}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 block">VECTORIZED N-GRAMS</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {classifiedCategory.tags.map((tag, i) => (
                        <span key={i} className="text-[10px] font-mono bg-teal-950/60 text-teal-300 px-2 py-0.5 rounded border border-teal-800/60">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  Engine Pipeline: Scikit-learn Pipeline(TfidfVectorizer(ngram_range=(1,2)), LogisticRegression(C=1.0))
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Cashflow Forecast Preview */}
          {activeTab === 'forecast' && (
            <div className="p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-teal-400" /> Linear Regression Spend & Runway Trajectory
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Multi-period spend regression trained on verified PostgreSQL ledger records with confidence intervals.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-teal-300 bg-teal-950/70 border border-teal-700/60 px-2.5 py-1 rounded">
                  📈 R² Score: 0.942
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-[#08131d] to-[#060c14] p-4 rounded-lg border border-teal-500/30">
                  <span className="text-[11px] font-mono text-teal-300">PROJECTED NEXT MONTH</span>
                  <p className="text-2xl font-bold text-white mt-1">₹37,800</p>
                  <span className="text-xs text-emerald-300 font-mono mt-1 block">↓ 3.2% vs 90d baseline</span>
                </div>
                <div className="bg-gradient-to-br from-[#08131d] to-[#060c14] p-4 rounded-lg border border-teal-500/30">
                  <span className="text-[11px] font-mono text-teal-300">ESTIMATED RUNWAY</span>
                  <p className="text-2xl font-bold text-white mt-1">11.4 Mos</p>
                  <span className="text-xs text-cyan-300 font-mono mt-1 block">Based on liquid reserves</span>
                </div>
                <div className="bg-gradient-to-br from-[#08131d] to-[#060c14] p-4 rounded-lg border border-teal-500/30">
                  <span className="text-[11px] font-mono text-teal-300">CONFIDENCE BOUNDS</span>
                  <p className="text-2xl font-bold text-white mt-1">± ₹1,450</p>
                  <span className="text-xs text-slate-400 font-mono mt-1 block">95% Confidence Band</span>
                </div>
              </div>

              {/* Trajectory visualization bars */}
              <div className="bg-gradient-to-br from-[#070e17] via-[#091522] to-[#070e17] p-5 rounded-lg border border-teal-500/30 space-y-4">
                <div className="flex justify-between items-center text-xs font-mono text-slate-300">
                  <span>HISTORICAL RUN-RATE VS PREDICTED HORIZON</span>
                  <span className="text-emerald-300 font-semibold">Target Budget: ₹40,000</span>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="w-24 font-mono text-slate-400">2 Mos Ago</span>
                    <div className="flex-1 bg-slate-900 h-6 rounded overflow-hidden flex items-center px-3 border border-slate-800">
                      <div className="h-full bg-slate-600 rounded-sm" style={{ width: '78%' }} />
                      <span className="ml-3 font-mono text-slate-200 font-medium">₹39,200</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="w-24 font-mono text-slate-400">Last Month</span>
                    <div className="flex-1 bg-slate-900 h-6 rounded overflow-hidden flex items-center px-3 border border-slate-800">
                      <div className="h-full bg-teal-600 rounded-sm" style={{ width: '74%' }} />
                      <span className="ml-3 font-mono text-teal-200 font-medium">₹38,100</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="w-24 font-mono text-emerald-300 font-bold">Forecast (Next)</span>
                    <div className="flex-1 bg-emerald-950/40 h-6 rounded overflow-hidden flex items-center px-3 border border-emerald-500/60 shadow-sm">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-sm" style={{ width: '69%' }} />
                      <span className="ml-3 font-mono text-emerald-200 font-bold">₹37,800 (Predicted)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Anomaly Shield Sandbox */}
          {activeTab === 'anomaly' && (
            <div className="p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-rose-400" /> Statistical Z-Score Outlier Radar
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Continuous standard deviation calculation over category histories to flag unexpected spikes.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-rose-300 bg-rose-950/80 border border-rose-700/60 px-2.5 py-1 rounded">
                  ⚠️ Alert Trigger: Z-Score &gt; 2.5σ
                </span>
              </div>

              <div className="space-y-3">
                <div className="bg-gradient-to-r from-rose-950/40 via-slate-900/90 to-amber-950/20 border border-rose-500/50 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded bg-rose-900/80 text-rose-200 border border-rose-600/80 mt-0.5">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">Apple Store Regent St</span>
                        <span className="text-[10px] font-mono bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-700 font-bold">
                          Z-Score: +3.82σ
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Amount: <strong className="text-rose-300">₹14,990</strong> (Typical category average: ₹1,850)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {resolvedAnomalies['apple'] ? (
                      <span className="text-xs font-mono text-emerald-300 flex items-center gap-1.5 bg-emerald-950/60 px-3 py-1.5 rounded border border-emerald-700 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Verified Legitimate
                      </span>
                    ) : (
                      <button
                        onClick={() => setResolvedAnomalies(prev => ({ ...prev, apple: true }))}
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white rounded cursor-pointer transition-colors shadow-sm"
                      >
                        Confirm Transaction
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#070e17] to-slate-900/80 border border-emerald-900/50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-200">Starbucks Roastery</span>
                      <p className="text-xs text-slate-400 font-mono">Amount: ₹380 • Z-Score: +0.21σ (Normal Distribution)</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/60">Clean Status</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Intelligence Copilot Query Simulator */}
          {activeTab === 'copilot' && (
            <div className="p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" /> Grounded Financial Query Synthesis
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Directly queries PostgreSQL ledger data to answer conversational natural-language inquiries.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/70 border border-cyan-700/60 px-2.5 py-1 rounded">
                  ✨ SQL Grounded Context
                </span>
              </div>

              {/* Clickable Prompts */}
              <div className="grid sm:grid-cols-3 gap-2">
                {copilotSamples.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCopilotQueryIndex(idx)}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      copilotQueryIndex === idx
                        ? 'bg-gradient-to-br from-[#081824] to-[#060c14] border-cyan-500/80 text-cyan-200 shadow-md'
                        : 'bg-[#060c14] border-slate-800 hover:border-cyan-700/50 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-[11px] font-mono text-cyan-400/80 block mb-1 font-semibold">PROMPT #{idx + 1}</span>
                    <p className="text-xs font-medium line-clamp-2">{sample.query}</p>
                  </button>
                ))}
              </div>

              {/* Synthesized Output Preview */}
              <div className="bg-gradient-to-br from-[#070e17] via-[#091522] to-[#070e17] border border-cyan-500/40 rounded-lg p-5 space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-cyan-300 flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> GROUNDED SYNTHESIS
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-700/60 font-semibold">
                    {copilotSamples[copilotQueryIndex].metric}
                  </span>
                </div>
                <p className="text-sm text-slate-100 leading-relaxed font-sans">
                  {copilotSamples[copilotQueryIndex].answer}
                </p>
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-mono text-cyan-400/80 block">GROUNDING SQL QUERY:</span>
                  <code className="text-[11px] font-mono text-cyan-200 bg-[#060b12] px-3 py-1.5 rounded border border-cyan-900/50 block mt-1 overflow-x-auto">
                    {copilotSamples[copilotQueryIndex].source}
                  </code>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. FinTech Telemetry Strip (ConsenSys / Verifone style) */}
      <section className="border-y border-emerald-900/30 bg-gradient-to-r from-[#070e17]/90 via-slate-900/90 to-[#070e17]/90 py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-[#091624]/60 to-[#060c14]/80 p-4 rounded-xl border border-emerald-500/20 space-y-1 shadow-sm">
            <span className="text-3xl sm:text-4xl font-bold font-mono bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">&lt; 35ms</span>
            <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider font-mono">Classification Latency</p>
            <p className="text-[11px] text-slate-400">In-process vectorized inference with zero network hops.</p>
          </div>
          <div className="bg-gradient-to-br from-[#091624]/60 to-[#060c14]/80 p-4 rounded-xl border border-teal-500/20 space-y-1 shadow-sm">
            <span className="text-3xl sm:text-4xl font-bold font-mono bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">99.2%</span>
            <p className="text-xs font-bold text-teal-300 uppercase tracking-wider font-mono">Categorization F1</p>
            <p className="text-[11px] text-slate-400">Trained on cross-merchant normalized datasets.</p>
          </div>
          <div className="bg-gradient-to-br from-[#091624]/60 to-[#060c14]/80 p-4 rounded-xl border border-emerald-500/20 space-y-1 shadow-sm">
            <span className="text-3xl sm:text-4xl font-bold font-mono bg-gradient-to-r from-emerald-300 to-emerald-400 bg-clip-text text-transparent">100%</span>
            <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider font-mono">Deterministic Ledger</p>
            <p className="text-[11px] text-slate-400">ACID PostgreSQL transactional compliance without drift.</p>
          </div>
          <div className="bg-gradient-to-br from-[#091624]/60 to-[#060c14]/80 p-4 rounded-xl border border-cyan-500/20 space-y-1 shadow-sm">
            <span className="text-3xl sm:text-4xl font-bold font-mono bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">0.00</span>
            <p className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono">Third-Party Data Sale</p>
            <p className="text-[11px] text-slate-400">Self-contained encrypted storage with user data sovereignty.</p>
          </div>
        </div>
      </section>

      {/* 4. Modular Bento Grid (Revolut-style Feature Modules) */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20 w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-950/80 via-teal-950/60 to-slate-900 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 mb-3 shadow-sm">
            <Layers className="w-3.5 h-3.5 text-emerald-400" /> CORE CAPABILITY MATRIX
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Engineered for Financial Rigor.
          </h2>
          <p className="text-slate-300 text-sm mt-3">
            Every feature is designed around statistical verification, predictive accuracy, and instant clarity.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: Autonomous Expense Ledger (Wide 2-col) with Emerald grading */}
          <div className="md:col-span-2 bg-gradient-to-br from-[#091624]/80 via-slate-900/90 to-[#060c14]/90 border border-emerald-500/30 hover:border-emerald-400/60 transition-all rounded-xl p-6 flex flex-col justify-between shadow-lg shadow-emerald-950/30">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-lg bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-sm">
                  <Brain className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono bg-emerald-950/80 text-emerald-300 px-2.5 py-1 rounded border border-emerald-800/60 font-semibold">
                  AUTO-NORMALIZED
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Autonomous Ledger Classification</h3>
              <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">
                Raw bank feeds are automatically cleaned, normalized, and categorized across 7 core expense tiers with confidence metadata.
              </p>
            </div>

            {/* Micro visual widget */}
            <div className="mt-6 bg-[#060b12] border border-emerald-900/40 rounded-lg p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-200 font-medium">Spotify Premium Monthly</span>
                <span className="text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/70 font-semibold">Entertainment • 99.4%</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-200 font-medium">Blinkit Grocery Express</span>
                <span className="text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800/70 font-semibold">Groceries • 98.8%</span>
              </div>
            </div>
          </div>

          {/* Card 2: Interactive What-If Savings Simulator with Teal grading */}
          <div className="bg-gradient-to-br from-[#07171d]/80 via-slate-900/90 to-[#060c14]/90 border border-teal-500/30 hover:border-teal-400/60 transition-all rounded-xl p-6 flex flex-col justify-between shadow-lg shadow-teal-950/30">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-lg bg-teal-950/70 border border-teal-500/40 flex items-center justify-center text-teal-300 shadow-sm">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-teal-300 font-semibold bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800/60">SIMULATOR</span>
              </div>
              <h3 className="text-lg font-bold text-white">"What-If" Goal Runway</h3>
              <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">
                Slide to simulate cutbacks and watch your goal arrival date accelerate in real time.
              </p>
            </div>

            {/* Live Interactive Slider Card */}
            <div className="mt-6 bg-[#060b12] border border-teal-900/40 rounded-lg p-3.5 space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300">Discretionary Cut:</span>
                <span className="text-teal-300 font-bold bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/50">{cutbackPercent}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                step="5"
                value={cutbackPercent}
                onChange={(e) => setCutbackPercent(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="pt-2 border-t border-slate-800 flex justify-between text-[11px] font-mono">
                <span className="text-slate-300">+₹{extraSaved.toLocaleString()}/mo Saved</span>
                <span className="text-emerald-300 font-bold">{monthsSaved} Mos Sooner</span>
              </div>
            </div>
          </div>

          {/* Card 3: Subscription & Recurring Audit with Amber/Teal grading */}
          <div className="bg-gradient-to-br from-[#181309]/50 via-slate-900/90 to-[#060c14]/90 border border-amber-500/30 hover:border-amber-400/60 transition-all rounded-xl p-6 flex flex-col justify-between shadow-lg shadow-amber-950/20">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-lg bg-amber-950/70 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-sm">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-amber-300 font-semibold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">CYCLE AUDIT</span>
              </div>
              <h3 className="text-lg font-bold text-white">Recurring Drift Detector</h3>
              <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">
                Detect stealth price hikes, uncancelled free trials, and hidden cadence renewals automatically.
              </p>
            </div>

            <div className="mt-6 bg-[#060b12] border border-amber-900/40 rounded-lg p-3.5 space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center text-slate-200">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-400" /> Figma Pro</span>
                <span className="text-amber-300 font-medium">Renews in 4d</span>
              </div>
              <div className="flex justify-between items-center text-slate-200">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-emerald-400" /> AWS Services</span>
                <span className="text-emerald-300 font-medium">Auto-audited</span>
              </div>
            </div>
          </div>

          {/* Card 4: Statistical Anomaly Protection (Wide 2-col) with Rose/Emerald grading */}
          <div className="md:col-span-2 bg-gradient-to-br from-[#18090d]/50 via-slate-900/90 to-[#060c14]/90 border border-rose-500/30 hover:border-rose-400/60 transition-all rounded-xl p-6 flex flex-col justify-between shadow-lg shadow-rose-950/20">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-lg bg-rose-950/70 border border-rose-500/40 flex items-center justify-center text-rose-300 shadow-sm">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono bg-rose-950/80 text-rose-300 px-2.5 py-1 rounded border border-rose-800/60 font-semibold">
                  Z-SCORE SHIELD
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Outlier & Double-Charge Protection</h3>
              <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">
                Standard deviation algorithms instantly detect anomalous single charges, unintentional duplicate swipes, and billing discrepancies before they compound.
              </p>
            </div>

            <div className="mt-6 bg-[#060b12] border border-rose-900/40 rounded-lg p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-slate-200">60-Day Rolling Variance Baseline: σ = ₹640</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800/70 font-semibold">Clean Status</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. End-to-End Processing Architecture (ConsenSys / Verifone Pipeline) */}
      <section id="architecture" className="border-t border-emerald-900/30 bg-gradient-to-b from-[#070e17]/90 via-slate-900/95 to-[#070e17]/90 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-950/80 via-teal-950/60 to-slate-900 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 mb-3 shadow-sm">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" /> SYSTEM DATAFLOW
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Deterministic Pipeline Architecture
            </h2>
            <p className="text-slate-300 text-sm mt-3">
              From raw payment payload to actionable grounded intelligence in 3 structured phases.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-gradient-to-b from-[#07131a] to-slate-900/90 border-t-2 border-t-emerald-400 border-x border-b border-emerald-900/30 rounded-xl p-6 space-y-4 shadow-lg shadow-emerald-950/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">01 / INGESTION</span>
                <Database className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white">PostgreSQL 18 ACID Ledger</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Immutable, timestamped transaction ingestion with strict deduplication, category foreign keys, and multi-user isolation.
              </p>
              <div className="pt-3 border-t border-slate-800 font-mono text-[11px] text-slate-400">
                • Row-level encryption<br />
                • Fast index B-tree lookup
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-gradient-to-b from-[#071717] to-slate-900/90 border-t-2 border-t-teal-400 border-x border-b border-teal-900/30 rounded-xl p-6 space-y-4 shadow-lg shadow-teal-950/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-teal-300 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/60">02 / INFERENCE</span>
                <Cpu className="w-4 h-4 text-teal-400" />
              </div>
              <h3 className="text-base font-bold text-white">Scikit-Learn ML Engines</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                TF-IDF vectorizer + Logistic Regression classifies merchants, while Linear Regression computes next-month trajectory and Z-score triggers.
              </p>
              <div className="pt-3 border-t border-slate-800 font-mono text-[11px] text-slate-400">
                • 18ms inference latency<br />
                • Confidence scoring bounds
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-gradient-to-b from-[#08121f] to-slate-900/90 border-t-2 border-t-cyan-400 border-x border-b border-cyan-900/30 rounded-xl p-6 space-y-4 shadow-lg shadow-cyan-950/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">03 / CONTEXT & ACTION</span>
                <Terminal className="w-4 h-4 text-cyan-400" />
              </div>
              <h3 className="text-base font-bold text-white">Grounded Synthesis</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Gemini 3.6 Flash context engine synthesizes SQL aggregate outputs to deliver grounded financial advice with zero hallucination.
              </p>
              <div className="pt-3 border-t border-slate-800 font-mono text-[11px] text-slate-400">
                • Citations to SQL records<br />
                • Dynamic what-if simulations
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Security & Sovereignty Pillar (PayPal / Verifone style) */}
      <section id="security" className="max-w-6xl mx-auto px-6 py-20 w-full">
        <div className="bg-gradient-to-br from-[#08131d] via-slate-900/95 to-[#060c14] border border-emerald-500/30 rounded-2xl p-8 sm:p-12 relative overflow-hidden shadow-2xl shadow-emerald-950/40">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-mono text-emerald-300">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> BANK-GRADE DATA INTEGRITY
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Your financial data belongs exclusively to you.
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                FinSight executes all statistical modeling and categorization inside your secure environment. No telemetry is packaged, sold, or shared with third-party advertisers.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Self-hostable Stack</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero Data Mining</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>AES-256 Storage</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Exportable Data</span>
                </div>
              </div>
            </div>

            {/* Terminal Security Verification Card with Color-graded Code Lines */}
            <div className="bg-[#050910] border border-emerald-900/50 rounded-xl p-5 font-mono text-xs space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                <span>SECURITY PROTOCOL AUDIT</span>
                <span className="text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 font-bold">PASSED</span>
              </div>
              <div className="space-y-1.5 text-slate-300 text-[11px]">
                <p><span className="text-emerald-400 font-bold">[01]</span> DB Integrity: PostgreSQL ACID Verified</p>
                <p><span className="text-teal-400 font-bold">[02]</span> ML Vectorization: Local CPU Execution</p>
                <p><span className="text-cyan-400 font-bold">[03]</span> Auth Standard: Signed JWT + Secure Cookies</p>
                <p><span className="text-emerald-400 font-bold">[04]</span> Third-Party Trackers: 0 Detected</p>
              </div>
              <div className="pt-2 border-t border-slate-800 text-emerald-300 text-[11px] flex items-center justify-between">
                <span>All Security Controls Verified</span>
                <span className="text-teal-300">SHA256: 8f4a...92b1</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. High-Conversion Bottom Banner with Color Grading */}
      <section className="max-w-6xl mx-auto px-6 pb-20 w-full">
        <div className="bg-gradient-to-br from-emerald-950/60 via-slate-900/90 to-[#070e17] border border-emerald-500/40 rounded-2xl p-8 sm:p-14 text-center space-y-6 shadow-2xl shadow-emerald-950/50">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-2xl mx-auto">
            Ready to bring scientific clarity to your capital?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Launch the FinSight dashboard today or explore our demo sandbox with instant pre-loaded sample telemetry.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
            <button
              onClick={() => navigate('/signup')}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-lg px-8 py-3.5 text-sm transition-all cursor-pointer w-full sm:w-auto shadow-lg shadow-emerald-500/30 active:scale-95"
            >
              Get Started Now <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center justify-center bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-slate-200 font-medium rounded-lg px-8 py-3.5 text-sm transition-all cursor-pointer w-full sm:w-auto active:scale-95"
            >
              Sign In to Demo
            </button>
          </div>
        </div>
      </section>

      {/* 8. Systems Footer */}
      <footer className="border-t border-emerald-900/30 bg-[#060b12] py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <img src={logo} alt="FinSight" className="w-6 h-6 rounded border border-emerald-500/30" />
            <span className="font-semibold text-slate-200">FinSight</span>
            <span>•</span>
            <span className="text-emerald-300">Deterministic Financial Intelligence</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-slate-300">
            <a href="#interactive-demo" className="hover:text-emerald-300 transition-colors">Demo</a>
            <a href="#features" className="hover:text-emerald-300 transition-colors">Capabilities</a>
            <a href="#architecture" className="hover:text-emerald-300 transition-colors">Pipeline</a>
            <a href="#security" className="hover:text-emerald-300 transition-colors">Security</a>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span className="text-emerald-300">PostgreSQL 18</span>
            <span>•</span>
            <span className="text-teal-300">Scikit-Learn ML</span>
            <span>•</span>
            <span className="text-cyan-300">Gemini 3.6 Flash</span>
          </div>
        </div>
      </footer>
    </div>
  );
}