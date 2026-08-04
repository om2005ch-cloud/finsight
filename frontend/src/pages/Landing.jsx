import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Brain, Bell, ArrowRight } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import MagneticButton from '../components/MagneticButton';
import RevealText from '../components/RevealText';
import logo from '../assets/logo.png';
import TiltCard from '../components/TiltCard';

function Landing() {
  const navigate = useNavigate();

  const features = [
    { icon: Brain, label: 'AI Auto-Categorization' },
    { icon: TrendingUp, label: 'Smart Spending Forecasts' },
    { icon: Bell, label: 'Anomaly Alerts' },
  ];

  return (
    <div className="min-h-screen relative flex items-center justify-center px-6 overflow-hidden">
      <AnimatedBackground />

      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex justify-center mb-8"
        >
          <img src={logo} alt="FinSight" className="w-20 h-20 rounded-2xl shadow-lg shadow-emerald-500/40" />
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight mb-6">
          <RevealText text="Your money, understood" delay={0.3} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
        >
          FinSight uses real machine learning to categorize spending, forecast your budget, and catch unusual transactions — before they surprise you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <MagneticButton
            onClick={() => navigate('/signup')}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl px-8 py-4 shadow-lg shadow-emerald-500/30 text-lg"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </MagneticButton>
          <MagneticButton
            onClick={() => navigate('/login')}
            className="bg-white/5 border border-white/10 backdrop-blur-sm text-white font-semibold rounded-xl px-8 py-4 text-lg hover:bg-white/10 transition-colors"
          >
            Login
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="grid sm:grid-cols-3 gap-4"
        >
          {features.map((f, i) => (
  <motion.div
    key={i}
    animate={{ y: [0, -8, 0] }}
    transition={{ duration: 3, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
    style={{ perspective: 800 }}
  >
    <TiltCard className="flex flex-col items-center gap-2 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-5 cursor-default">
      <f.icon className="w-6 h-6 text-emerald-400" />
      <span className="text-gray-300 text-sm font-medium">{f.label}</span>
    </TiltCard>
  </motion.div>
))}
        </motion.div>
      </div>
    </div>
  );
}

export default Landing;