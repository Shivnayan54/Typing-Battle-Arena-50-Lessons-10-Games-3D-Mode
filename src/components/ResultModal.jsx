import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Trophy, Target, Zap } from 'lucide-react';

const ResultModal = ({ isOpen, stats, onClose, onRestart, customContent }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden border border-white/20 dark:border-slate-700/50"
        >
          {/* Confetti / background decoration abstract */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-tr from-primary to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30 text-white">
                <Trophy size={32} />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                Session Complete!
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-1 text-primary mb-1">
                  <Zap size={16} /> <span className="text-sm font-semibold uppercase tracking-wider">WPM</span>
                </div>
                <span className="text-4xl font-black text-slate-800 dark:text-white">{stats.wpm}</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-1 text-purple-500 mb-1">
                  <Target size={16} /> <span className="text-sm font-semibold uppercase tracking-wider">Accuracy</span>
                </div>
                <span className="text-4xl font-black text-slate-800 dark:text-white">{stats.accuracy}%</span>
              </div>
              
              <div className="col-span-2 flex justify-between px-4 py-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl text-sm border border-slate-100 dark:border-slate-700">
                <span className="text-slate-500">Total Characters: <strong className="text-slate-700 dark:text-slate-300">{stats.totalStrokes}</strong></span>
                <span className="text-slate-500">Errors: <strong className="text-red-500">{stats.errors}</strong></span>
              </div>
            </div>

            {/* Support for custom lesson-completion elements like XP rewards */}
            {customContent}

            <div className="flex gap-3 mt-8">
              <button 
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl font-semibold border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              >
                Close
              </button>
              <button 
                onClick={onRestart}
                className="flex-[2] py-3 px-4 rounded-xl font-semibold btn-primary flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} />
                Try Again
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ResultModal;
