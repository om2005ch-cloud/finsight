import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User } from 'lucide-react';
import api from '../api/axios';
import AnimatedBackground from '../components/AnimatedBackground';
import logo from '../assets/logo.png';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/signup', { name, email, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1], staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4">
      <AnimatedBackground />

      <motion.div
        className="w-full max-w-md bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl p-9 shadow-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex justify-center mb-5">
          <img src={logo} alt="FinSight" className="w-16 h-16 rounded-2xl shadow-lg shadow-emerald-500/30" />
        </motion.div>

        <motion.h1
          className="text-4xl font-bold text-white mb-2 text-center tracking-tight"
          variants={itemVariants}
        >
          Create Account
        </motion.h1>
        <motion.p
          className="text-gray-400 text-sm mb-9 text-center"
          variants={itemVariants}
        >
          Start tracking your finances with FinSight
        </motion.p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div variants={itemVariants} className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/60 focus:bg-white/[0.07] focus:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/60 focus:bg-white/[0.07] focus:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/60 focus:bg-white/[0.07] focus:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              whileHover={{
                scale: 1.02,
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.6)',
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl px-4 py-3.5 mt-3 shadow-lg shadow-emerald-500/20 transition-shadow duration-300"
            >
              Sign Up
            </motion.button>
          </motion.div>
        </form>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-sm mt-4 text-center"
          >
            {error}
          </motion.p>
        )}

        <motion.p
          variants={itemVariants}
          className="text-gray-400 text-sm mt-7 text-center"
        >
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
            Login
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}

export default Signup;