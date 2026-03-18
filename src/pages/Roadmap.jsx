import React, { useState } from 'react';
import { LESSONS } from '../data/lessons';
import { useUserContext } from '../context/UserContext';
import { Lock, CheckCircle, Play, Star, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SECTIONS = ['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Pro Code'];

const Roadmap = () => {
  const { isLessonUnlocked, completedLessons } = useUserContext();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('Beginner');

  const filteredLessons = LESSONS.filter(l => l.section === activeSection);
  
  // Stats for the sidebar
  const totalInProg = LESSONS.filter(l => isLessonUnlocked(l.id) && !completedLessons.includes(l.id)).length;

  const navigateToPractice = (lessonId) => {
    // Navigate and pass lesson ID in state
    navigate('/practice', { state: { lessonId } });
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 min-h-[80vh]">
      
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-64 flex flex-col gap-4">
        <div className="glass-panel p-6">
          <h2 className="text-xl font-bold mb-6">Roadmap</h2>
          <div className="flex flex-col gap-2">
            {SECTIONS.map((section, idx) => {
              const secLessons = LESSONS.filter(l => l.section === section);
              const secCompleted = secLessons.filter(l => completedLessons.includes(l.id)).length;
              
              return (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`flex flex-col items-start p-3 rounded-xl transition-all ${
                    activeSection === section 
                    ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span className="font-bold flex items-center justify-between w-full">
                    {section} 
                    {secCompleted === secLessons.length && <CheckCircle size={16} />}
                  </span>
                  <span className={`text-xs ${activeSection === section ? 'text-blue-100' : 'text-slate-400'}`}>
                    {secCompleted} / {secLessons.length} Completed
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="glass-panel p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
          <h3 className="font-semibold text-indigo-500 dark:text-indigo-400 mb-2">Current Objective</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Complete your {totalInProg} open lessons to unlock the next tiers.</p>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
             <div className="bg-indigo-500 h-full w-2/3"></div>
          </div>
        </div>
      </div>

      {/* Main Roadmap Area */}
      <div className="flex-1">
        <div className="glass-panel p-8 relative overflow-hidden min-h-[600px]">
          {/* Section Header */}
          <div className="mb-10 text-center relative z-10">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 mb-4">
              {activeSection} <span className="text-slate-300 dark:text-slate-600 font-light">Layer</span>
            </h1>
            <p className="text-slate-500 max-w-lg mx-auto">
              Progress sequentially. Meet the required WPM and Accuracy targets to earn XP and unlock the next lesson.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            <AnimatePresence mode="wait">
              {filteredLessons.map((lesson, index) => {
                const unlocked = isLessonUnlocked(lesson.id);
                const isCompleted = completedLessons.includes(lesson.id);

                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className={`
                      relative p-6 rounded-2xl border-2 transition-all duration-300
                      ${isCompleted ? 'bg-green-500/5 border-green-500/30' : 
                        unlocked ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary hover:shadow-xl' : 
                        'bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-70 grayscale'}
                    `}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                          ${isCompleted ? 'bg-green-500 text-white' : unlocked ? 'bg-primary text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-500'}
                        `}>
                          {isCompleted ? <CheckCircle size={20} /> : !unlocked ? <Lock size={20} /> : lesson.id}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{lesson.title}</h3>
                          <div className="flex items-center gap-1 text-xs font-semibold text-yellow-500">
                            <Star size={12} fill="currentColor"/> {lesson.xpReward} XP
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                      <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md">
                        Target WPM: <strong className="text-slate-700 dark:text-slate-300">{lesson.targetWpm}</strong>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md">
                        Accuracy: <strong className="text-slate-700 dark:text-slate-300">{lesson.targetAccuracy}%</strong>
                      </div>
                    </div>

                    {unlocked ? (
                      <button 
                         onClick={() => navigateToPractice(lesson.id)}
                         className={`w-full py-3 rounded-xl font-semibold flex flex-row items-center justify-center gap-2 transition-colors ${
                           isCompleted 
                           ? 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white' 
                           : 'btn-primary'
                         }`}
                      >
                         {isCompleted ? 'Practice Again' : 'Start Lesson'} <ArrowRight size={18} />
                      </button>
                    ) : (
                      <div className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed">
                        <Lock size={18} /> Locked (Clear previous)
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
