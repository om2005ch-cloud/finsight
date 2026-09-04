import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Command } from 'lucide-react';
import logo from '../assets/logo.png';

function Navbar({ onOpenQuickAdd }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3.5 bg-zinc-900 border-b border-zinc-800 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <img src={logo} alt="FinSight" className="w-8 h-8 rounded-lg" />
        <span className="text-zinc-100 font-semibold text-lg tracking-tight">FinSight</span>
      </div>

      <div className="flex items-center gap-3">
        {onOpenQuickAdd && (
          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-1.5 bg-zinc-950 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-medium rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Quick Add</span>
            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 flex items-center gap-0.5 ml-1">
              <Command className="w-2.5 h-2.5" /> K
            </span>
          </button>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 text-sm font-medium transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;