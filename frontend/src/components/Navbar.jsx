import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import logo from '../assets/logo.png';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between px-6 py-4 bg-white/[0.03] backdrop-blur-xl border-b border-white/10 sticky top-0 z-50"
    >
      <div className="flex items-center gap-3">
        <img src={logo} alt="FinSight" className="w-9 h-9 rounded-lg" />
        <span className="text-white font-bold text-lg tracking-tight">FinSight</span>
      </div>
      <motion.button
        onClick={handleLogout}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </motion.button>
    </motion.nav>
  );
}

export default Navbar;