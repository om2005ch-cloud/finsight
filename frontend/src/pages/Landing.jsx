import { useNavigate } from 'react-router-dom';
import { TrendingUp, Brain, Bell, ArrowRight, Sliders, Sparkles, Command, ShieldCheck, Database, Cpu, Terminal } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import logo from '../assets/logo.png';

function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'ML Auto-Categorization',
      desc: 'TF-IDF + Logistic Regression model auto-assigns uncategorized transactions to 7 core expense categories with confidence scoring.',
    },
    {
      icon: TrendingUp,
      title: 'Predictive Forecasting',
      desc: 'Scikit-learn Linear Regression model aggregates monthly spend data to predict next month expenditure bounds and trend direction.',
    },
    {
      icon: Bell,
      title: 'Statistical Anomaly Shield',
      desc: 'Z-score statistical anomaly detection checks live historical transaction standard deviation to catch unusual high-value charges.',
    },
    {
      icon: Sliders,
      title: '"What-If" Goal Simulator',
      desc: 'Zero-latency interactive sliders project how 5–50% category cutbacks accelerate savings goals and pull forward target completion dates.',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between px-6 py-12 relative overflow-hidden">
      <AnimatedBackground />

      {/* Navigation Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="FinSight" className="w-8 h-8 rounded-lg border border-zinc-800" />
          <span className="text-zinc-100 font-semibold text-lg tracking-tight">FinSight</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-zinc-400 hover:text-zinc-100 text-xs font-medium px-3 py-1.5 transition-colors cursor-pointer"
          >
            Log in
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-5xl mx-auto text-center my-12">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-emerald-400 mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Machine Learning & Gemini 3.6 RAG Engine</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-zinc-100 tracking-tight leading-tight mb-6">
          Your money, <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
            understood precisely.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-zinc-400 text-base md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
          FinSight connects PostgreSQL transaction history with Python scikit-learn models and Gemini 3.6 Flash RAG context to auto-categorize spending, forecast monthly budgets, and audit recurring subscriptions.
        </p>

        {/* Hero Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
          <button
            onClick={() => navigate('/signup')}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg px-6 py-3 text-base transition-colors cursor-pointer w-full sm:w-auto shadow-sm"
          >
            Launch Dashboard <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-medium rounded-lg px-6 py-3 text-base transition-colors cursor-pointer w-full sm:w-auto"
          >
            Sign In to Demo
          </button>
        </div>

        {/* Hotkey prompt preview */}
        <div className="inline-flex items-center gap-2 text-xs text-zinc-500 bg-zinc-900/60 px-3 py-1 rounded-md border border-zinc-800/80 mb-16">
          <Command className="w-3 h-3 text-zinc-400" />
          <span>Press <kbd className="font-mono text-zinc-300">⌘K</kbd> / <kbd className="font-mono text-zinc-300">Ctrl+K</kbd> anywhere to trigger Quick Add drawer</span>
        </div>

        {/* Hero Interactive Preview Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl text-left max-w-4xl mx-auto mb-16">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-zinc-500 text-xs font-mono ml-2">finsight.app/dashboard</span>
            </div>
            <span className="text-emerald-400 text-xs font-mono">Status: Connected (DB + ML Service)</span>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
              <p className="text-zinc-500 text-[11px] font-mono">TOTAL MONTHLY SPEND</p>
              <p className="text-xl font-bold text-zinc-100 mt-1">₹34,850</p>
              <p className="text-emerald-400 text-[11px] mt-1">↓ 4.8% vs last month</p>
            </div>
            <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
              <p className="text-zinc-500 text-[11px] font-mono">ML CATEGORY CONFIDENCE</p>
              <p className="text-xl font-bold text-emerald-400 mt-1">94.2%</p>
              <p className="text-zinc-400 text-[11px] mt-1">TF-IDF + Logistic Reg</p>
            </div>
            <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
              <p className="text-zinc-500 text-[11px] font-mono">FINANCIAL HEALTH SCORE</p>
              <p className="text-xl font-bold text-zinc-100 mt-1">88 / 100 PTS</p>
              <p className="text-emerald-400 text-[11px] mt-1">Tier: Emerald Prime</p>
            </div>
          </div>

          <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 flex items-center justify-between text-xs text-zinc-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Gemini 3.6 Assistant Query:</strong> "How much did I spend on food this month?"</span>
            </div>
            <span className="text-emerald-400 font-mono text-[11px]">Grounded RAG Answer →</span>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 gap-4 text-left">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-2 hover:border-zinc-700 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 text-emerald-400 flex items-center justify-center">
                <f.icon className="w-4 h-4" />
              </div>
              <h3 className="text-zinc-100 font-semibold text-base tracking-tight">{f.title}</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer & Tech Bar */}
      <footer className="max-w-6xl mx-auto w-full pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <span>FinSight © 2026</span>
          <span>•</span>
          <span>Open Finance & Intelligence</span>
        </div>
        <div className="flex items-center gap-4 text-zinc-400">
          <span className="flex items-center gap-1"><Database className="w-3 h-3 text-emerald-400" /> PostgreSQL 18</span>
          <span className="flex items-center gap-1"><Cpu className="w-3 h-3 text-emerald-400" /> scikit-learn ML</span>
          <span className="flex items-center gap-1"><Terminal className="w-3 h-3 text-emerald-400" /> Gemini 3.6 RAG</span>
        </div>
      </footer>
    </div>
  );
}

export default Landing;