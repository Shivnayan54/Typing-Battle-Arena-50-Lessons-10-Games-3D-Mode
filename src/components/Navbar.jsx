import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTypingContext } from '../context/TypingContext';
import { Keyboard, Trophy, Gamepad2, Home, Moon, Sun, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { theme, toggleTheme } = useTypingContext();

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Practice', path: '/practice', icon: <Keyboard size={18} /> },
    { name: 'Games', path: '/games', icon: <Gamepad2 size={18} /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={18} /> }
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel mx-4 mt-4 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <motion.div 
          whileHover={{ rotate: 15 }}
          className="p-2 bg-primary rounded-xl text-white shadow-lg shadow-primary/30"
        >
          <Keyboard size={24} />
        </motion.div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
          TypingMaster
        </span>
      </div>

      <div className="hidden md:flex items-center gap-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive 
                ? 'bg-primary/10 text-primary dark:bg-primary/20' 
                : 'text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="flex items-center gap-2 btn-primary !py-1.5 !px-3 !rounded-full text-sm">
          <UserCircle size={18} />
          <span>Login</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
