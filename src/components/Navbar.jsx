/* eslint-disable */
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTypingContext } from '../context/TypingContext';
import { useUserContext } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { Zap, Gamepad2, Home, Moon, Sun, Map, Volume2, VolumeX, Flame, BarChart2, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRankData } from '../utils/gamification';

const Navbar = () => {
  const { theme, toggleTheme } = useTypingContext();
  const { xp, level, rank, streak, soundEnabled, toggleSound } = useUserContext();
  const { user, logout } = useAuth();
  const rankData = getRankData(xp);
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={15} /> },
    { name: 'Practice', path: '/practice', icon: <Zap size={15} /> },
    { name: 'Roadmap', path: '/roadmap', icon: <Map size={15} /> },
    { name: 'Games', path: '/games', icon: <Gamepad2 size={15} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <BarChart2 size={15} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 px-4 pt-3 pb-0">
      <div
        className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between rounded-2xl border border-white/[0.07]"
        style={{ backdropFilter: 'blur(24px)', background: 'rgba(8,11,20,0.9)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <motion.div
            whileHover={{ rotate: 15, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
          >
            <Zap size={18} className="text-white" fill="white" />
          </motion.div>
          <span className="text-lg font-black tracking-tight text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(90deg, #a78bfa, #06b6d4)' }}>
            TypeNova
          </span>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-nova-600/20 text-nova-300 border border-nova-500/25'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.05]'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5">
          {/* Streak */}
          {streak > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/15">
              <Flame size={13} className="text-orange-400 animate-flame" />
              <span className="text-sm font-bold text-orange-400">{streak}</span>
            </div>
          )}

          {/* Sound toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl hover:bg-white/[0.06] transition-colors text-slate-500 hover:text-slate-300"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-white/[0.06] transition-colors text-slate-500 hover:text-slate-300"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* User profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(prev => !prev)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-nova-500/25 bg-nova-600/10 hover:bg-nova-600/20 transition-all"
            >
              <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black"
                style={{ background: `${rankData.color}30`, color: rankData.color, border: `1px solid ${rankData.color}40` }}>
                {rankData.emoji}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-black text-white leading-none">{user?.name?.split(' ')[0]}</div>
                <div className="text-[10px] text-nova-400 leading-none mt-0.5">Lv.{level} · {rank}</div>
              </div>
              <ChevronDown size={12} className={`text-slate-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/[0.08] overflow-hidden shadow-xl"
                  style={{ background: 'rgba(10,14,24,0.97)', backdropFilter: 'blur(24px)', zIndex: 100 }}
                >
                  <div className="px-4 py-3 border-b border-white/[0.06]">
                    <div className="font-bold text-white text-sm">{user?.name}</div>
                    <div className="text-xs text-slate-500 truncate">{user?.email}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-bold" style={{ color: rankData.color }}>{rankData.emoji} {rank}</span>
                      <span className="text-xs text-slate-600">· {xp.toLocaleString()} XP</span>
                    </div>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => { navigate('/dashboard'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
                    >
                      <BarChart2 size={15} /> My Dashboard
                    </button>
                    <button
                      onClick={() => { logout(); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-xl text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all mt-1"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
