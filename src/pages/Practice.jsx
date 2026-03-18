import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { LESSONS } from '../data/lessons';
import { calculateXPReward } from '../utils/gamification';
import Keyboard from '../components/Keyboard';
import ResultModal from '../components/ResultModal';
import { RefreshCw, ArrowLeft, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

const Practice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addXp, markLessonComplete, addHistoryEntry } = useUserContext();
  
  // Get lesson ID from router state, default to null (free practice mode)
  const initialLessonId = location.state?.lessonId || null;
  const [currentLesson, setCurrentLesson] = useState(
    initialLessonId ? LESSONS.find(l => l.id === initialLessonId) : null
  );

  const [showModal, setShowModal] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [passed, setPassed] = useState(false);
  const inputRef = useRef(null);

  const defaultText = "Select a lesson from the roadmap to begin your structured typing journey. Otherwise, practice freely here.";
  const textToType = currentLesson ? currentLesson.text : defaultText;

  const {
    userInput, status, wpm, accuracy, errors, 
    correctKeyStrokes, totalKeyStrokes,
    handleCharInput, reset
  } = useTypingEngine(textToType);

  // Focus on mount
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [currentLesson]);

  // Handle Finish Logic
  useEffect(() => {
    if (status === 'finished' && !showModal) {
      let xpGained = 0;
      let hasPassed = false;

      // Mode: Lesson
      if (currentLesson) {
        if (wpm >= currentLesson.targetWpm && accuracy >= currentLesson.targetAccuracy) {
          hasPassed = true;
          xpGained = currentLesson.xpReward;
          // Calculate bonus XP for exceeding targets
          if (wpm > currentLesson.targetWpm * 1.2) xpGained += 50; 
          
          markLessonComplete(currentLesson.id);
          addXp(xpGained);
          
          triggerConfetti();
        }
      } 
      // Mode: Free Practice
      else {
        xpGained = calculateXPReward(wpm, accuracy, 1);
        addXp(xpGained);
      }

      addHistoryEntry({ 
        type: currentLesson ? 'lesson' : 'practice',
        lessonId: currentLesson?.id,
        wpm, 
        accuracy, 
        errors
      });

      setEarnedXp(xpGained);
      setPassed(hasPassed);
      setShowModal(true);
    }
  }, [status]); // Only run when status changes to finished

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleRestart = () => {
    reset();
    setShowModal(false);
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  const renderText = () => {
    return textToType.split('').map((char, index) => {
      let colorClass = "text-slate-400 dark:text-slate-500 opacity-50"; 
      
      if (index < userInput.length) {
         colorClass = userInput[index] === char 
           ? "text-slate-800 dark:text-slate-200 font-bold opacity-100 shadow-sm" // correct
           : "text-red-500 bg-red-100/30 dark:bg-red-900/30 border-b border-red-500 opacity-100"; // incorrect
      } else if (index === userInput.length) {
         colorClass = "text-primary dark:text-primary border-b-2 border-primary animate-pulse opacity-100"; // cursor
      }

      return (
        <span key={index} className={`transition-all duration-75 ${colorClass}`}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-8 glass-panel p-4 rounded-2xl">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/roadmap')}
            className="p-2 text-slate-500 hover:text-primary transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={18} /> <span className="hidden sm:inline">Back to Roadmap</span>
          </button>
          
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
          
          {currentLesson ? (
            <div className="flex flex-col">
              <span className="text-xs text-primary font-bold uppercase tracking-wider">Lesson {currentLesson.id}</span>
              <span className="font-semibold">{currentLesson.title}</span>
            </div>
          ) : (
            <span className="font-semibold text-slate-500">Free Practice Mode</span>
          )}
        </div>

        <div className="flex items-center gap-4">
          {currentLesson && (
            <div className="items-center gap-4 hidden md:flex text-sm font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl">
               <span title="Target WPM">T-WPM: <strong className="text-slate-800 dark:text-slate-200">{currentLesson.targetWpm}</strong></span>
               <span title="Target Accuracy">T-ACC: <strong className="text-slate-800 dark:text-slate-200">{currentLesson.targetAccuracy}%</strong></span>
            </div>
          )}
          <button 
            onClick={handleRestart}
            className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:text-primary hover:rotate-180 transition-all duration-300"
            title="Restart Instance"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Main Typing Area */}
      <div 
        className="w-full relative group cursor-text"
        onClick={() => inputRef.current && inputRef.current.focus()}
      >
        <div className="glass-panel p-8 min-h-[300px] text-2xl sm:text-3xl leading-loose tracking-wide font-mono select-none relative overflow-hidden shadow-2xl shadow-primary/5">
          {renderText()}
        </div>
        
        <input 
          ref={inputRef}
          type="text" 
          value={userInput} 
          onChange={(e) => handleCharInput(e.target.value)}
          disabled={status === "finished"}
          className="absolute opacity-0 -z-10 focus:outline-none"
          autoFocus
        />
      </div>

      {/* Live Stats Row */}
      <div className="flex justify-center gap-12 mt-8 mb-8 text-center text-slate-500 dark:text-slate-400 glass-panel px-12 py-4 rounded-full">
        <div className="flex flex-col items-center">
          <span className="text-3xl font-black text-slate-800 dark:text-white">{wpm}</span>
          <span className="text-xs uppercase tracking-widest font-bold text-primary">WPM</span>
        </div>
        <div className="flex flex-col items-center">
          <span className={`text-3xl font-black ${accuracy < (currentLesson?.targetAccuracy || 0) ? 'text-red-500' : 'text-slate-800 dark:text-white'}`}>
            {accuracy}%
          </span>
          <span className="text-xs uppercase tracking-widest font-bold text-purple-500">Accuracy</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-black text-slate-800 dark:text-white">{errors}</span>
          <span className="text-xs uppercase tracking-widest font-bold text-orange-500">Errors</span>
        </div>
      </div>

      <Keyboard />

      {/* Extracted Results Modal Override for specific lesson functionality */}
      <ResultModal 
        isOpen={showModal} 
        onClose={() => { setShowModal(false); navigate('/roadmap'); }} 
        onRestart={handleRestart}
        stats={{ wpm, accuracy, totalStrokes: totalKeyStrokes, errors }}
        customContent={currentLesson && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
            {passed ? (
               <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-xl border border-green-200 dark:border-green-800 mb-4">
                  <p className="font-bold text-lg mb-1">🎉 Lesson Passed!</p>
                  <p className="text-sm">You met the required limits for this lesson.</p>
               </div>
            ) : (
               <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-800 mb-4">
                  <p className="font-bold text-lg mb-1">❌ Targets Not Met</p>
                  <p className="text-sm">Required: {currentLesson.targetWpm} WPM & {currentLesson.targetAccuracy}% Accuracy.</p>
               </div>
            )}
            
            <div className="flex items-center justify-center gap-2 text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
               <Star fill="currentColor" size={24} className="text-yellow-500" /> +{earnedXp} XP 
            </div>
            
            {passed && currentLesson.id < 50 && (
              <button 
                onClick={() => {
                  setCurrentLesson(LESSONS.find(l => l.id === currentLesson.id + 1));
                  handleRestart();
                }}
                className="mt-6 w-full py-3 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white rounded-xl font-bold shadow-lg shadow-primary/30"
              >
                Next Lesson
              </button>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default Practice;
