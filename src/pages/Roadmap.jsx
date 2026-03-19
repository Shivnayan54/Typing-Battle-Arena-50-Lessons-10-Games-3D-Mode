/* eslint-disable */
import React, { useState } from 'react';
import { LESSONS } from '../data/lessons';
import { useUserContext } from '../context/UserContext';
import { Lock, CheckCircle, Play, Star, ArrowRight, Crown, Zap, Flame, Shield, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SECTIONS = [
  { name: 'Beginner', emoji: '🌱', color: 'from-emerald-500/20 to-emerald-600/5', border: 'border-emerald-500/25', accent: 'bg-emerald-500', textAccent: 'text-emerald-400', minLessonId: 1 },
  { name: 'Intermediate', emoji: '⚡', color: 'from-cyan-500/20 to-cyan-600/5', border: 'border-cyan-500/25', accent: 'bg-cyan-500', textAccent: 'text-cyan-400', minLessonId: 11 },
  { name: 'Advanced', emoji: '🔥', color: 'from-amber-500/20 to-amber-600/5', border: 'border-amber-500/25', accent: 'bg-amber-500', textAccent: 'text-amber-400', minLessonId: 21 },
  { name: 'Pro', emoji: '💎', color: 'from-nova-500/20 to-nova-600/5', border: 'border-nova-500/25', accent: 'bg-nova-500', textAccent: 'text-nova-400', minLessonId: 36 },
  { name: 'Elite', emoji: '👑', color: 'from-rose-500/20 to-rose-600/5', border: 'border-rose-500/25', accent: 'bg-rose-500', textAccent: 'text-rose-400', minLessonId: 46 },
];

const Roadmap = () => {
  const { isLessonUnlocked, completedLessons } = useUserContext();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('Beginner');

  const safeCompleted = Array.isArray(completedLessons) ? completedLessons : [];
  const filteredLessons = LESSONS.filter(l => l.section === activeSection);
  const activeSectionData = SECTIONS.find(s => s.name === activeSection);

  const overallProgress = Math.round((safeCompleted.length / LESSONS.length) * 100);

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 page-enter">

      {/* Header */}
      <div className="glass-panel p-6 border border-white/[0.06] relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-nova-600/5 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-nova-400 font-bold uppercase tracking-widest mb-1">TypeNova Roadmap</div>
            <h1 className="text-3xl font-black text-white">50 Lessons of Mastery</h1>
            <p className="text-slate-500 mt-1 text-sm">Progress sequentially. Meet WPM & accuracy targets to advance.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-black text-white">{safeCompleted.length}</div>
              <div className="text-xs text-slate-500 font-semibold uppercase">Completed</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs text-slate-500 font-semibold mb-1">
                <span>Overall Progress</span>
                <span>{overallProgress}%</span>
              </div>
              <div className="w-40 progress-bar">
                <div className="progress-fill" style={{ width: `${overallProgress}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar: Tier Selection */}
        <div className="w-full lg:w-64 flex flex-col gap-3">
          {SECTIONS.map((section) => {
            const secLessons = LESSONS.filter(l => l.section === section.name);
            const secCompleted = secLessons.filter(l => safeCompleted.includes(l.id)).length;
            const secProgress = Math.round((secCompleted / secLessons.length) * 100);
            const isActive = activeSection === section.name;

            return (
              <motion.button
                key={section.name}
                whileHover={{ x: 3 }}
                onClick={() => setActiveSection(section.name)}
                className={`relative p-4 rounded-2xl border text-left transition-all duration-200 overflow-hidden ${
                  isActive
                    ? `bg-gradient-to-r ${section.color} ${section.border} shadow-lg`
                    : 'glass-card border-white/[0.06] hover:border-white/[0.1]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{section.emoji}</span>
                    <span className={`font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>{section.name}</span>
                  </div>
                  {secCompleted === secLessons.length && (
                    <CheckCircle size={16} className="text-emerald-400" />
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>{secCompleted}/{secLessons.length} done</span>
                  <span>{secProgress}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${secProgress}%` }} />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Main: Lesson Grid */}
        <div className="flex-1">
          {/* Section banner */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-panel p-6 mb-5 border bg-gradient-to-r ${activeSectionData.color} ${activeSectionData.border} relative overflow-hidden`}
          >
            <div className="absolute -right-10 -top-10 text-9xl opacity-10 select-none">{activeSectionData.emoji}</div>
            <div className="relative z-10">
              <div className={`flex items-center gap-2 font-black text-2xl ${activeSectionData.textAccent}`}>
                <span>{activeSectionData.emoji}</span> {activeSection} Tier
              </div>
              <p className="text-slate-400 text-sm mt-1">
                Complete lessons in sequence. Hit the WPM and accuracy targets to unlock the next level.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="wait">
              {filteredLessons.map((lesson, index) => {
                const unlocked = isLessonUnlocked(lesson.id);
                const isCompleted = safeCompleted.includes(lesson.id);

                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.04 }}
                    className={`relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer group ${
                      isCompleted
                        ? 'bg-emerald-500/[0.05] border-emerald-500/25 hover:border-emerald-400/40'
                        : unlocked
                        ? 'glass-card border-white/[0.08] hover:border-nova-500/30 hover:-translate-y-1 hover:shadow-glow-violet'
                        : 'bg-black/20 border-white/[0.04] opacity-60'
                    }`}
                    onClick={() => unlocked && navigate('/practice', { state: { lessonId: lesson.id } })}
                  >
                    {/* Locked overlay */}
                    {!unlocked && (
                      <div className="absolute inset-0 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                        <div className="flex items-center gap-2 text-slate-500 bg-black/40 px-4 py-2 rounded-xl border border-white/[0.06]">
                          <Lock size={14} /> <span className="text-xs font-bold">Complete Previous</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border ${
                          isCompleted
                            ? 'bg-emerald-500 border-emerald-400 text-white'
                            : unlocked
                            ? 'bg-nova-600/20 border-nova-500/30 text-nova-300'
                            : 'bg-white/[0.04] border-white/[0.06] text-slate-600'
                        }`}>
                          {isCompleted ? <CheckCircle size={18} /> : lesson.id}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-sm leading-tight">{lesson.title}</h3>
                          <div className="flex items-center gap-1 text-xs text-amber-400 mt-0.5">
                            <Star size={10} fill="currentColor" /> {lesson.xpReward} XP
                          </div>
                        </div>
                      </div>
                      {isCompleted && (
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                          ✓ Done
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                      <span className="bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-lg">
                        Target: <strong className="text-slate-300">{lesson.targetWpm} WPM</strong>
                      </span>
                      <span className="bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-lg">
                        <strong className="text-slate-300">{lesson.targetAccuracy}%</strong> ACC
                      </span>
                    </div>

                    {unlocked ? (
                      <button className={`w-full py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm transition-all ${
                        isCompleted
                          ? 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]'
                          : 'btn-primary !rounded-xl !py-2.5'
                      }`}>
                        {isCompleted ? 'Practice Again' : 'Start Lesson'} <ArrowRight size={14} />
                      </button>
                    ) : (
                      <div className="w-full py-2.5 rounded-xl text-center text-xs font-bold text-slate-600 bg-white/[0.02] border border-white/[0.04]">
                        🔒 Locked
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
