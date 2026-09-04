import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import api from '../api/axios';
import AnimatedBackground from '../components/AnimatedBackground';
import logo from '../assets/logo.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center relative px-4">
      <AnimatedBackground />

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-sm">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="FinSight" className="w-12 h-12 rounded-lg border border-zinc-800" />
        </div>

        <h1 className="text-2xl font-bold text-zinc-100 mb-1 text-center tracking-tight">
          Welcome back
        </h1>
        <p className="text-zinc-400 text-sm mb-6 text-center">
          Log in to your FinSight account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-zinc-100 text-sm placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-zinc-100 text-sm placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg px-4 py-2.5 text-sm transition-colors cursor-pointer"
          >
            Login
          </button>
        </form>

        {error && (
          <p className="text-rose-400 text-sm mt-4 text-center">
            {error}
          </p>
        )}

        <p className="text-zinc-400 text-sm mt-6 text-center">
          Don't have an account?{' '}
          <Link to="/signup" className="text-emerald-400 hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;