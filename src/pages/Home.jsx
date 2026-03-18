/* eslint-disable */
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Keyboard, ArrowRight, Zap, Trophy, Shield, Play, Star, Gamepad2 } from 'lucide-react';
import { LESSONS } from '../data/lessons';
import { useUserContext } from '../context/UserContext';

const Home = () => {
  const navigate = useNavigate();
  const { isLessonUnlocked, completedLessons } = useUserContext();

  const features = [
    { icon: <Zap className="text-yellow-500" size={32} />, title: 'Real-time Stats', desc: 'Track your WPM, accuracy, and see errors as you type.' },
    { icon: <Shield className="text-green-500" size={32} />, title: '50 Progress Levels', desc: 'Strict scaling from absolute beginner to coding pro.' },
    { icon: <Trophy className="text-purple-500" size={32} />, title: 'Global Ranks', desc: 'Gain XP and climb from Novice all the way to Legend.' },
    { icon: <Trophy className="text-rose-500" size={32} />, title: 'Daily Streaks', desc: 'Maintain your streak for massive XP multipliers.' }
  ];
  const gamesPreview = [
    { id: '3D', name: 'Type3D: Space Fleet', icon: <Zap className="text-blue-500" size={24} /> },
    { id: 'HERO', name: 'Spider Climb', icon: <Shield className="text-red-500" size={24} /> },
    { id: 'MP', name: 'Multiplayer Arena', icon: <Trophy className="text-sky-500" size={24} /> },
  ];
  // Get a preview of the first few uncompleted lessons
  const safeCompleted = Array.isArray(completedLessons) ? completedLessons : [];
  const nextLessons = LESSONS.filter(l => !safeCompleted.includes(l.id) && isLessonUnlocked(l.id)).slice(0, 3);
  if (nextLessons.length === 0) {
     nextLessons.push(LESSONS[0], LESSONS[1], LESSONS[2]); // Fallback if all done or fresh
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen pb-20 overflow-hidden">
      
      {/* 1. Hero Section */}
      <motion.section 
        initial="hidden" animate="visible" variants={fadeInUp}
        className="w-full max-w-6xl px-6 pt-20 pb-24 text-center relative"
      >
        {/* Decorative background glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-10 w-[300px] h-[300px] bg-purple-500/20 blur-[100px] rounded-full -z-10 pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel text-sm font-bold border-primary/40 text-primary mb-8 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:scale-105 transition-transform cursor-pointer">
          <span className="relative flex h-3 w-3 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
          Next Generation Typing Experience
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6 leading-tight">
          Master Your <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-purple-500 animate-gradient-x">
            Typing Skills
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-12 font-medium">
          A premium, gamified platform designed to permanently elevate your WPM and accuracy through strict progression and intense arcade challenges.
        </p>

        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, type: "spring" }}
        >
          <button 
            onClick={() => navigate('/practice')}
            className="w-full sm:w-auto flex items-center justify-center gap-3 btn-primary !px-10 !py-5 text-xl font-bold rounded-2xl group shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_60px_rgba(99,102,241,0.6)]"
          >
            Start Training <Keyboard size={24} className="group-hover:rotate-12 transition-transform duration-300" />
          </button>
          
          <button 
            onClick={() => navigate('/games')}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-2xl text-xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600 transition-all group"
          >
            Arcade Zone <Zap size={24} className="group-hover:text-yellow-500 transition-colors" />
          </button>
        </motion.div>
      </motion.section>

      {/* 2. Feature Highlights */}
      <motion.section 
        variants={staggerContainer} initial="hidden" animate="visible"
        className="w-full max-w-6xl px-6 py-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div key={idx} variants={fadeInUp} className="glass-panel p-8 text-left rounded-3xl hover:-translate-y-3 transition-transform duration-300 border border-slate-200/50 dark:border-slate-700/50">
              <div className="bg-white dark:bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-white">{feature.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 3. Roadmap Preview Section */}
      <motion.section 
        initial="hidden" animate="visible" variants={fadeInUp}
        className="w-full max-w-6xl px-6 py-20"
      >
        <div className="glass-panel rounded-3xl p-8 md:p-12 border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent relative overflow-hidden">
           
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
              <div>
                 <h2 className="text-4xl font-black mb-2">The <span className="text-purple-500">Roadmap</span></h2>
                 <p className="text-slate-500 text-lg uppercase tracking-wider font-bold">50 Tiers of Mastery</p>
              </div>
              <button onClick={() => navigate('/roadmap')} className="flex items-center gap-2 font-bold text-purple-500 hover:text-purple-400 bg-purple-500/10 px-6 py-3 rounded-xl transition-colors">
                 View Full Map <ArrowRight size={20} />
              </button>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {nextLessons.map((lesson, idx) => (
                 <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/practice', { state: { lessonId: lesson.id } })}>
                    <div className="flex justify-between items-start mb-4">
                       <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-500 flex items-center justify-center font-black text-xl">
                          {lesson.id}
                       </div>
                       <div className="flex items-center text-yellow-500 font-bold bg-yellow-500/10 px-3 py-1 rounded-lg text-sm">
                          <Star size={14} className="mr-1" fill="currentColor"/> {lesson.xpReward} XP
                       </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{lesson.title}</h3>
                    <div className="flex items-center gap-4 text-sm font-semibold text-slate-500 mb-6">
                       <span>Target: {lesson.targetWpm} WPM</span>
                       <span>Acc: {lesson.targetAccuracy}%</span>
                    </div>
                    <div className="flex items-center justify-between text-primary font-bold">
                       Start Lesson <Play size={18} className="text-primary" />
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </motion.section>

      {/* 4. Arcade Preview Section */}
      <motion.section 
        initial="hidden" animate="visible" variants={fadeInUp}
        className="w-full max-w-6xl px-6 py-20"
      >
        <div className="glass-panel rounded-3xl p-8 md:p-12 border-2 border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent flex flex-col lg:flex-row items-center gap-12">
           
           <div className="flex-1 space-y-6 text-center lg:text-left">
              <div className="inline-block bg-orange-500/20 text-orange-500 font-black px-4 py-1 rounded-full text-sm uppercase tracking-widest mb-2">10 Mini-Games</div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">The <span className="text-orange-500">Arcade Zone</span></h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                 Bored of standard practice? Put your fingers to the ultimate test in high-octane 2D and 3D typing games. Defend the earth, race cars, or climb skyscrapers.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                 {gamesPreview.map((gp, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white dark:bg-slate-800 px-5 py-3 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm font-bold">
                       {gp.icon} <span className="text-sm">{gp.name}</span>
                    </div>
                 ))}
              </div>

              <div className="pt-6">
                 <button onClick={() => navigate('/games')} className="w-full sm:w-auto flex items-center justify-center gap-2 font-black text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-orange-500/30 hover:scale-105">
                    Enter the Arcade <ArrowRight size={20} />
                 </button>
              </div>
           </div>

           <div className="flex-1 w-full relative h-[400px] rounded-2xl overflow-hidden glass-panel border border-slate-200 dark:border-slate-700 flex items-center justify-center bg-slate-900 group">
              {/* Mock generic game view visual */}
              <div className="absolute inset-0 opacity-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-700 via-slate-900 to-black"></div>
              
              <motion.div 
                 animate={{ y: [-10, 10, -10], rotate: [0, 2, -2, 0] }} 
                 transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                 className="relative z-10 text-center"
              >
                 <Gamepad2 size={120} className="text-orange-500 mx-auto mb-6 drop-shadow-[0_0_30px_rgba(249,115,22,0.6)]" />
                 <div className="text-2xl font-black text-white tracking-widest uppercase">Select Your Game</div>
              </motion.div>
              
              {/* Overlay hover play button effect */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 cursor-pointer" onClick={() => navigate('/games')}>
                  <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center pl-2 scale-75 group-hover:scale-100 transition-transform">
                     <Play size={40} className="text-white" fill="white" />
                  </div>
              </div>
           </div>
           
        </div>
      </motion.section>

    </div>
  );
};

export default Home;
