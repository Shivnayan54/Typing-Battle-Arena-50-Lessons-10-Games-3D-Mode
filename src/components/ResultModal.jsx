/* eslint-disable */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Trophy, Target, Zap } from 'lucide-react';

const ResultModal = ({ isOpen, stats, onClose, onRestart, customContent }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(8, 11, 20, 0.85)', backdropFilter: 'blur(16px)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative max-w-md w-full rounded-3xl p-8 overflow-hidden border border-white/[0.1]"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(8,11,20,0.97))' }}
          >
            {/* Background glows */}
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-30"
              style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.6), transparent)' }} />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-3xl opacity-20"
              style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.5), transparent)' }} />

            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-7">
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
                  className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
                >
                  <Trophy size={30} />
                </motion.div>
                <h2 className="text-2xl font-black text-white">Session Complete!</h2>
                <p className="text-slate-500 text-sm mt-1">Here are your results</p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card p-4 text-center border border-nova-500/20"
                >
                  <div className="flex items-center justify-center gap-1.5 text-nova-400 text-xs font-bold uppercase tracking-widest mb-2">
                    <Zap size={12} /> WPM
                  </div>
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35, type: 'spring', stiffness: 200 }}
                    className="text-5xl font-black text-white block"
                  >
                    {stats.wpm}
                  </motion.span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  className="glass-card p-4 text-center border border-emerald-500/20"
                >
                  <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">
                    <Target size={12} /> Accuracy
                  </div>
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                    className="text-5xl font-black text-white block"
                  >
                    {stats.accuracy}%
                  </motion.span>
                </motion.div>

                <div className="col-span-2 flex items-center justify-between glass-card px-5 py-3 text-sm border border-white/[0.04]">
                  <span className="text-slate-500">Keystrokes: <strong className="text-slate-300">{stats.totalStrokes}</strong></span>
                  <span className="text-slate-500">Errors: <strong className="text-rose-400">{stats.errors}</strong></span>
                </div>
              </div>

              {/* Custom lesson content */}
              {customContent}

              {/* Action buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={onClose}
                  className="flex-1 btn-secondary py-3 rounded-xl font-bold text-sm"
                >
                  Close
                </button>
                <button
                  onClick={onRestart}
                  className="flex-[2] btn-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm"
                >
                  <RotateCcw size={16} />
                  Try Again
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResultModal;
