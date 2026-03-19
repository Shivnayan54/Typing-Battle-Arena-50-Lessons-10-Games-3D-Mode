/* eslint-disable */
import React from 'react';
import { useTypingContext } from '../context/TypingContext';
import { useUserContext } from '../context/UserContext';
import { Trophy, Zap, Target, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const Leaderboard = () => {
  const { highScores } = useTypingContext();
  const { history } = useUserContext();

  // Build leaderboard from local history sorted by WPM
  const allScores = [...(highScores || []), ...history]
    .sort((a, b) => (b.wpm || 0) - (a.wpm || 0))
    .slice(0, 20);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="max-w-3xl mx-auto w-full page-enter">

      {/* Header */}
      <div className="glass-panel p-6 border border-white/[0.06] mb-6 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.1), transparent)' }} />
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
            <Trophy size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">TypeNova Leaderboard</h1>
            <p className="text-slate-500 text-sm">Your personal best scores ranked by WPM</p>
          </div>
        </div>
      </div>

      {/* Scores table */}
      <div className="glass-panel border border-white/[0.06] overflow-hidden">
        {allScores.length > 0 ? (
          <>
            {/* Table header */}
            <div className="grid grid-cols-5 px-5 py-3 border-b border-white/[0.04] text-xs font-bold text-slate-600 uppercase tracking-widest">
              <span>#</span>
              <span className="col-span-2">Type</span>
              <span className="flex items-center gap-1"><Zap size={11} /> WPM</span>
              <span className="flex items-center gap-1"><Target size={11} /> ACC</span>
            </div>

            {allScores.map((score, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                className={`grid grid-cols-5 px-5 py-4 border-b border-white/[0.03] items-center transition-colors hover:bg-white/[0.03] ${
                  idx === 0 ? 'bg-amber-500/[0.04]' : idx === 1 ? 'bg-slate-400/[0.02]' : idx === 2 ? 'bg-orange-500/[0.03]' : ''
                }`}
              >
                <span className="text-lg font-black">
                  {idx < 3 ? medals[idx] : <span className="text-slate-600 text-sm">#{idx + 1}</span>}
                </span>
                <span className="col-span-2 text-slate-400 text-sm font-semibold capitalize">
                  {score.type || 'Test'}{score.lessonId ? ` · L${score.lessonId}` : ''}
                  <span className="text-slate-700 block text-xs">
                    {score.date ? new Date(score.date).toLocaleDateString() : ''}
                  </span>
                </span>
                <span className={`text-xl font-black ${idx === 0 ? 'text-amber-400' : 'text-white'}`}>
                  {score.wpm}
                </span>
                <span className={`text-sm font-bold ${(score.accuracy || 0) >= 95 ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {score.accuracy}%
                </span>
              </motion.div>
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-600">
            <Trophy size={48} className="mb-4 opacity-20" />
            <p className="font-semibold">No scores yet</p>
            <p className="text-sm mt-1">Complete your first practice session to appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
