/* eslint-disable */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Zap, ArrowRight, Trophy, Shield, Target, Timer, Flame, Star,
  TrendingUp, Globe, Award, Brain, Infinity, Lock, ChevronRight,
  Keyboard, Play, Layers, Map
} from 'lucide-react';
import { LESSONS } from '../data/lessons';
import { useUserContext } from '../context/UserContext';

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

// Quick test mode data
const QUICK_MODES = [
  {
    label: '15s',
    title: 'Lightning',
    desc: 'Extreme speed burst',
    icon: <Zap size={24} className="text-amber-400" />,
    color: 'from-amber-500/20 to-amber-600/5',
    border: 'border-amber-500/25',
    glow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]',
    duration: 15,
  },
  {
    label: '30s',
    title: 'Sprint',
    desc: 'Quick precision test',
    icon: <Timer size={24} className="text-cyan-400" />,
    color: 'from-cyan-500/20 to-cyan-600/5',
    border: 'border-cyan-500/25',
    glow: 'hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]',
    duration: 30,
  },
  {
    label: '60s',
    title: 'Classic',
    desc: 'Standard speed test',
    icon: <Target size={24} className="text-nova-400" />,
    color: 'from-nova-500/20 to-nova-600/5',
    border: 'border-nova-500/25',
    glow: 'hover:shadow-[0_0_20px_rgba(124,58,237,0.25)]',
    duration: 60,
  },
  {
    label: '∞',
    title: 'Endless',
    desc: 'Infinite hard vocabulary',
    icon: <Infinity size={24} className="text-emerald-400" />,
    color: 'from-emerald-500/20 to-emerald-600/5',
    border: 'border-emerald-500/25',
    glow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]',
    duration: -1,
  },
];

// Feature cards
const FEATURES = [
  {
    icon: <Layers size={28} />,
    title: '3D Typing Mode',
    desc: 'Immersive 3D space environment with typing-powered gameplay.',
    color: 'text-cyan-400',
    bg: 'from-cyan-500/15 to-transparent',
    border: 'border-cyan-500/20',
  },
  {
    icon: <Flame size={28} />,
    title: 'Daily Streak System',
    desc: 'Complete 5 tests daily to maintain your streak and earn bonus XP.',
    color: 'text-orange-400',
    bg: 'from-orange-500/15 to-transparent',
    border: 'border-orange-500/20',
  },
  {
    icon: <Trophy size={28} />,
    title: 'XP & Ranking',
    desc: 'Earn XP, unlock ranks from Novice to Legend, climb the ladder.',
    color: 'text-amber-400',
    bg: 'from-amber-500/15 to-transparent',
    border: 'border-amber-500/20',
  },
  {
    icon: <TrendingUp size={28} />,
    title: 'Advanced Analytics',
    desc: 'Track WPM history, accuracy trends, and error patterns over time.',
    color: 'text-nova-400',
    bg: 'from-nova-500/15 to-transparent',
    border: 'border-nova-500/20',
  },
  {
    icon: <Infinity size={28} />,
    title: 'Endless Practice',
    desc: 'Never-ending stream of advanced vocabulary for limitless training.',
    color: 'text-emerald-400',
    bg: 'from-emerald-500/15 to-transparent',
    border: 'border-emerald-500/20',
  },
];

// Coming soon features
const COMING_SOON = [
  { icon: <Globe size={22} />, title: 'Multiplayer Mode', desc: 'Race live against players worldwide' },
  { icon: <Trophy size={22} />, title: 'Global Ranking', desc: 'Compete on the worldwide leaderboard' },
  { icon: <Award size={22} />, title: 'Certification', desc: 'Earn verified typing certificates' },
  { icon: <Brain size={22} />, title: 'AI Typing Coach', desc: 'AI analyzes your weaknesses & trains you' },
];

const Home = () => {
  const navigate = useNavigate();
  const { isLessonUnlocked, completedLessons, streak, dailyAttempts } = useUserContext();

  const safeCompleted = Array.isArray(completedLessons) ? completedLessons : [];
  const nextLessons = LESSONS.filter(l => !safeCompleted.includes(l.id) && isLessonUnlocked(l.id)).slice(0, 3);
  if (nextLessons.length === 0) {
    nextLessons.push(LESSONS[0], LESSONS[1], LESSONS[2]);
  }

  const roadmapTiers = [
    { name: 'Beginner', range: '1–10', emoji: '🌱', locked: false },
    { name: 'Intermediate', range: '11–20', emoji: '⚡', locked: false },
    { name: 'Advanced', range: '21–35', emoji: '🔥', locked: safeCompleted.length < 10 },
    { name: 'Pro', range: '36–45', emoji: '💎', locked: safeCompleted.length < 20 },
    { name: 'Elite', range: '46–50', emoji: '👑', locked: safeCompleted.length < 35 },
  ];

  return (
    <div className="flex flex-col items-center w-full min-h-screen pb-24 overflow-x-hidden">

      {/* ─── HERO ─────────────────────────────────────── */}
      <motion.section
        initial="hidden" animate="visible" variants={fadeUp}
        className="w-full max-w-7xl px-6 pt-16 pb-20 text-center relative"
      >
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none -z-10"
          style={{ background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.12) 0%, transparent 70%)' }} />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-nova-500/30 bg-nova-600/10 text-nova-300 text-sm font-bold mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nova-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-nova-400" />
          </span>
          Next-Generation Typing Platform
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
          className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight mb-6 leading-[0.95]"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          <span className="text-white">Master Speed.</span>{' '}
          <br />
          <span className="text-transparent bg-clip-text animate-gradient-text"
            style={{ backgroundImage: 'linear-gradient(90deg, #8b5cf6, #06b6d4, #8b5cf6)', backgroundSize: '200% 100%' }}>
            Master Precision.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12 font-medium"
        >
          50+ structured lessons, daily challenges, timed sprints, and endless practice — engineered to transform any typist into a precision machine.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => navigate('/practice', { state: { mode: 'quick', duration: 60 } })}
            className="group flex items-center gap-3 btn-primary !px-8 !py-4 !text-lg !rounded-2xl"
          >
            <Keyboard size={22} />
            Start Typing
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => navigate('/roadmap')}
            className="flex items-center gap-3 btn-secondary !px-8 !py-4 !text-lg !rounded-2xl"
          >
            <Map size={20} />
            View Roadmap
          </button>
        </motion.div>

        {/* Daily streak & attempts mini info */}
        {streak > 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="mt-8 inline-flex items-center gap-4 px-5 py-2.5 rounded-2xl border border-white/[0.06] bg-white/[0.03]"
          >
            <span className="flex items-center gap-1.5 text-sm font-semibold text-orange-400">
              <Flame size={16} className="animate-flame" /> {streak} day streak
            </span>
            <div className="w-px h-4 bg-white/10" />
            <span className="text-sm font-semibold text-slate-400">
              {dailyAttempts}/5 tests today
            </span>
          </motion.div>
        )}
      </motion.section>

      {/* ─── QUICK TYPING MODES ──────────────────────── */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}
        variants={stagger}
        className="w-full max-w-7xl px-6 pb-20"
      >
        <motion.div variants={fadeUp} className="text-center mb-10">
          <div className="section-label mb-4">
            <Timer size={14} /> Quick Typing Modes
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            Test Your Speed <span className="text-gradient">Right Now</span>
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto">Choose your challenge. Every keystroke counts.</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_MODES.map((mode, i) => (
            <motion.button
              key={mode.label}
              variants={scaleIn}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/practice', { state: { mode: 'quick', duration: mode.duration } })}
              className={`glass-card p-6 text-left bg-gradient-to-br ${mode.color} border ${mode.border} ${mode.glow} transition-all duration-300 group`}
            >
              <div className="mb-4 p-3 rounded-xl bg-white/[0.06] inline-block group-hover:scale-110 transition-transform">
                {mode.icon}
              </div>
              <div className="text-3xl font-black text-white mb-1">{mode.label}</div>
              <div className="text-base font-bold text-slate-200 mb-1">{mode.title}</div>
              <div className="text-sm text-slate-500">{mode.desc}</div>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* ─── FEATURE CARDS ───────────────────────────── */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="w-full max-w-7xl px-6 pb-20"
      >
        <motion.div variants={fadeUp} className="text-center mb-10">
          <div className="section-label mb-4">
            <Star size={14} /> Features
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            Everything You Need to <span className="text-gradient">Dominate</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className={`nova-card bg-gradient-to-br ${f.bg} border ${f.border}`}
            >
              <div className={`${f.color} mb-5`}>{f.icon}</div>
              <h3 className={`text-lg font-bold text-white mb-2`}>{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              <div className={`absolute bottom-0 right-0 w-32 h-32 rounded-full opacity-5 blur-2xl bg-current`} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ─── ROADMAP PREVIEW ─────────────────────────── */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeUp}
        className="w-full max-w-7xl px-6 pb-20"
      >
        <div className="glass-panel p-8 md:p-12 border border-nova-500/15 relative overflow-hidden">
          {/* Background accent */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-nova-600/5 blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-5 relative z-10">
            <div>
              <div className="section-label mb-3"><Map size={14} /> Structured Roadmap</div>
              <h2 className="text-3xl md:text-4xl font-black text-white">
                50+ Structured Lessons
              </h2>
              <p className="text-slate-500 mt-2">Progress from Beginner to Elite across 5 tiers of mastery.</p>
            </div>
            <button
              onClick={() => navigate('/roadmap')}
              className="flex items-center gap-2 btn-primary !rounded-xl whitespace-nowrap"
            >
              Full Roadmap <ArrowRight size={16} />
            </button>
          </div>

          {/* Tier cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            {roadmapTiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                whileHover={!tier.locked ? { y: -3 } : {}}
                onClick={() => !tier.locked && navigate('/roadmap')}
                className={`relative p-4 rounded-2xl border text-center transition-all duration-300 ${
                  tier.locked
                    ? 'border-white/[0.05] bg-white/[0.02] opacity-50 cursor-not-allowed'
                    : 'border-nova-500/20 bg-nova-500/[0.06] cursor-pointer hover:border-nova-400/30'
                }`}
              >
                {tier.locked && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/30 backdrop-blur-sm">
                    <Lock size={20} className="text-slate-500" />
                  </div>
                )}
                <div className="text-3xl mb-2">{tier.emoji}</div>
                <div className="font-bold text-white text-sm">{tier.name}</div>
                <div className="text-xs text-slate-500 mt-1">Lessons {tier.range}</div>
              </motion.div>
            ))}
          </div>

          {/* Next lesson previews */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nextLessons.map((lesson, i) => (
              <motion.div
                key={lesson.id}
                whileHover={{ y: -3 }}
                onClick={() => navigate('/practice', { state: { lessonId: lesson.id } })}
                className="glass-card p-5 border border-white/[0.06] cursor-pointer hover:border-nova-500/25 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="w-9 h-9 rounded-xl bg-nova-600/20 border border-nova-500/25 flex items-center justify-center text-nova-300 font-black text-sm">
                    {lesson.id}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg">
                    <Star size={10} fill="currentColor" /> {lesson.xpReward} XP
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm mb-2">{lesson.title}</h4>
                <div className="flex gap-3 text-xs text-slate-500">
                  <span>{lesson.targetWpm} WPM</span>
                  <span>{lesson.targetAccuracy}% ACC</span>
                </div>
                <div className="flex items-center gap-1 text-nova-400 text-xs font-semibold mt-3">
                  Start <ChevronRight size={12} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ─── COMING SOON ─────────────────────────────── */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={stagger}
        className="w-full max-w-7xl px-6 pb-20"
      >
        <motion.div variants={fadeUp} className="text-center mb-10">
          <div className="section-label mb-4 opacity-70">
            🚀 Coming Soon
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            More Features <span className="text-gradient">On The Way</span>
          </h2>
          <p className="text-slate-500">TypeNova is constantly evolving. Here's what's next.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COMING_SOON.map((item, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              className="glass-card p-6 border border-white/[0.05] relative overflow-hidden group"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none" />
              
              <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-400 mb-4">
                {item.icon}
              </div>
              <h3 className="font-bold text-slate-300 mb-1">{item.title}</h3>
              <p className="text-sm text-slate-600">{item.desc}</p>
              
              <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-600 border border-white/[0.06] px-2 py-1 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600 animate-pulse" />
                In development
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

    </div>
  );
};

export default Home;
