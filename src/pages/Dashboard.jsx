/* eslint-disable */
import React, { useMemo } from 'react';
import { useUserContext } from '../context/UserContext';
import { getXPForNextLevel, getRankData, DAILY_LIMIT } from '../utils/gamification';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Trophy, Flame, Target, Star, Keyboard, ArrowRight, Zap, TrendingUp, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, unit, icon, accent }) => (
  <motion.div
    whileHover={{ y: -3 }}
    className="glass-card p-5 border border-white/[0.06] relative overflow-hidden group"
  >
    <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10 blur-xl ${accent}`} />
    <div className="flex items-center gap-2 mb-3 text-slate-500">
      {icon}
      <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
    </div>
    <div className="flex items-end gap-1">
      <span className="text-4xl font-black text-white">{value}</span>
      {unit && <span className="text-slate-500 text-sm mb-1 font-semibold">{unit}</span>}
    </div>
  </motion.div>
);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel border border-white/[0.1] p-3 rounded-xl text-sm">
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-400">{p.name}:</span>
            <span className="text-white font-bold">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { xp, level, rank, streak, history, completedLessons, dailyAttempts, bestWpm, avgWpm, avgAccuracy } = useUserContext();
  const navigate = useNavigate();
  const rankData = getRankData(xp);

  const xpNeeded = getXPForNextLevel(level);
  const xpCurrentLevel = getXPForNextLevel(level - 1);
  const progressPercent = Math.min(100, Math.max(0, ((xp - xpCurrentLevel) / (xpNeeded - xpCurrentLevel)) * 100));

  const recentHistory = useMemo(() => {
    return [...history].reverse().slice(0, 15).map((h, i) => ({
      ...h,
      name: `#${i + 1}`,
      wpm: h.wpm || 0,
      accuracy: h.accuracy || 0,
    }));
  }, [history]);

  const safeCompleted = Array.isArray(completedLessons) ? completedLessons : [];

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 w-full page-enter pb-12">

      {/* Header */}
      <div className="flex items-center justify-between glass-panel px-6 py-5 border border-white/[0.06]">
        <div>
          <h1 className="text-3xl font-black text-white">
            Your Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">Track your TypeNova journey</p>
        </div>
        <button
          onClick={() => navigate('/roadmap')}
          className="btn-primary flex items-center gap-2"
        >
          Continue Lessons <ArrowRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

        {/* Profile Card */}
        <div className="glass-panel p-6 border border-white/[0.06] col-span-1 flex flex-col gap-5 relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl"
            style={{ background: rankData.color + '15' }} />

          {/* Avatar */}
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full border-2 flex items-center justify-center text-4xl"
                style={{ borderColor: rankData.color, background: rankData.color + '15' }}>
                {rankData.emoji}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-nova-600 border-2 border-background-dark flex items-center justify-center text-xs font-black text-white">
                {level}
              </div>
            </div>
            <div className="text-xl font-black text-white">{rank}</div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">Level {level} Typist</div>
          </div>

          {/* XP Progress */}
          <div className="relative z-10">
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
              <span>{xp.toLocaleString()} XP</span>
              <span>{xpNeeded.toLocaleString()} XP</span>
            </div>
            <div className="progress-bar mb-1.5">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
              />
            </div>
            <p className="text-xs text-center text-slate-600">
              {(xpNeeded - xp).toLocaleString()} XP to Level {level + 1}
            </p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3 relative z-10">
            <div className="bg-orange-500/10 border border-orange-500/20 p-3 rounded-xl text-center">
              <Flame size={18} className="text-orange-400 mx-auto mb-1 animate-flame" />
              <div className="text-xl font-black text-orange-300">{streak}</div>
              <div className="text-xs font-bold text-orange-500/70 uppercase tracking-wide">Streak</div>
            </div>
            <div className="bg-nova-500/10 border border-nova-500/20 p-3 rounded-xl text-center">
              <Keyboard size={18} className="text-nova-400 mx-auto mb-1" />
              <div className="text-xl font-black text-nova-300">{safeCompleted.length}/50</div>
              <div className="text-xs font-bold text-nova-500/70 uppercase tracking-wide">Lessons</div>
            </div>
          </div>

          {/* Daily progress */}
          <div className="relative z-10">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
              <span className="flex items-center gap-1"><Flame size={12} className="text-orange-400" /> Daily Tests</span>
              <span className="text-white">{Math.min(dailyAttempts, DAILY_LIMIT)}/{DAILY_LIMIT}</span>
            </div>
            <div className="flex gap-1.5">
              {Array(DAILY_LIMIT).fill(0).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                    i < dailyAttempts ? 'bg-gradient-to-r from-orange-500 to-amber-400' : 'bg-white/[0.06]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-5">
          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Best WPM" value={bestWpm} unit="wpm" icon={<Zap size={14} className="text-amber-400" />} accent="bg-amber-500" />
            <StatCard label="Avg WPM" value={avgWpm} unit="wpm" icon={<TrendingUp size={14} className="text-cyan-400" />} accent="bg-cyan-500" />
            <StatCard label="Avg Accuracy" value={avgAccuracy} unit="%" icon={<Target size={14} className="text-emerald-400" />} accent="bg-emerald-500" />
            <StatCard label="Tests Done" value={history.length} unit="" icon={<Award size={14} className="text-nova-400" />} accent="bg-nova-500" />
          </div>

          {/* Performance Chart */}
          <div className="glass-panel p-6 border border-white/[0.06] flex-1">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
              <TrendingUp size={16} className="text-nova-400" /> Performance History
            </h3>
            {recentHistory.length >= 2 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={recentHistory} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="name" stroke="#334155" tick={{ fill: '#475569', fontSize: 11 }} />
                  <YAxis yAxisId="left" stroke="#334155" tick={{ fill: '#475569', fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#334155" tick={{ fill: '#475569', fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    yAxisId="left" type="monotone" dataKey="wpm" stroke="#7c3aed"
                    strokeWidth={2.5} dot={{ r: 3, fill: '#7c3aed', strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: '#7c3aed' }} name="WPM"
                  />
                  <Line
                    yAxisId="right" type="monotone" dataKey="accuracy" stroke="#10b981"
                    strokeWidth={2.5} dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: '#10b981' }} name="Accuracy %"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex flex-col items-center justify-center text-slate-600">
                <Keyboard size={40} className="mb-3 opacity-20" />
                <p className="text-sm">Complete more tests to see your performance chart.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
