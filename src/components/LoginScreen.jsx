/* eslint-disable */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Zap, User, Mail, ArrowRight, Keyboard, Flame, Trophy, Star } from 'lucide-react';

const LoginScreen = () => {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState('welcome'); // 'welcome' | 'form'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || name.trim().length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 600)); // smooth UX delay
    login(name, email);
  };

  const features = [
    { icon: <Flame size={18} className="text-orange-400" />, text: 'Daily Streak System' },
    { icon: <Trophy size={18} className="text-amber-400" />, text: 'XP & Rank Progression' },
    { icon: <Star size={18} className="text-nova-400" />, text: '50+ Structured Lessons' },
    { icon: <Zap size={18} className="text-cyan-400" />, text: 'Timed Speed Tests' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #080b14 0%, #0c1120 50%, #080b14 100%)' }}>

      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <AnimatePresence mode="wait">
        {mode === 'welcome' ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg px-6 text-center"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="flex items-center justify-center gap-3 mb-10"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
                <Zap size={28} className="text-white" fill="white" />
              </div>
              <span className="text-4xl font-black text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(90deg, #8b5cf6, #06b6d4)' }}>
                TypeNova
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight"
            >
              Master Speed.{' '}
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(90deg, #8b5cf6, #06b6d4)' }}>
                Master Precision.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-slate-400 text-lg mb-10 leading-relaxed"
            >
              The premium gamified typing platform. Track your progress, earn XP, and become a typing legend.
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-3 mb-10"
            >
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.03]">
                  {f.icon}
                  <span className="text-sm font-semibold text-slate-300">{f.text}</span>
                </div>
              ))}
            </motion.div>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setMode('form')}
              className="w-full btn-primary !py-4 !text-lg !rounded-2xl flex items-center justify-center gap-3"
            >
              <Keyboard size={22} />
              Get Started — It's Free
              <ArrowRight size={18} />
            </motion.button>

            <p className="text-slate-600 text-xs mt-4">No backend required. Your progress is saved locally.</p>
          </motion.div>

        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md px-6"
          >
            {/* Card */}
            <div className="rounded-3xl p-8 border border-white/[0.08]"
              style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(24px)' }}>

              {/* Header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
                  <Zap size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Create Your Profile</h2>
                  <p className="text-xs text-slate-500">Or sign in to continue your journey.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Name field */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">
                    Your Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Alex Nova"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-slate-600 text-sm font-medium focus:outline-none focus:border-nova-500/50 focus:bg-white/[0.07] transition-all"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Email field */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-slate-600 text-sm font-medium focus:outline-none focus:border-nova-500/50 focus:bg-white/[0.07] transition-all"
                    />
                  </div>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-2.5"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary !py-4 !rounded-xl !text-base flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Zap size={18} />
                      Start Typing
                    </>
                  )}
                </motion.button>
              </form>

              <p className="text-slate-600 text-xs text-center mt-5">
                Your profile is saved locally. Same email restores your progress.
              </p>
            </div>

            <button
              onClick={() => setMode('welcome')}
              className="text-slate-600 hover:text-slate-400 text-sm mt-4 mx-auto block transition-colors"
            >
              ← Back
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginScreen;
