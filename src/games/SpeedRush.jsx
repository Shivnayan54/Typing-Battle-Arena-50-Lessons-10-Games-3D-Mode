/* eslint-disable */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateRandomWords } from '../utils/generateText';
import { Clock, Zap, Target, CheckCircle } from 'lucide-react';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Time selector screen ─────────────────────────────────────────────────────
const TimeSelector = ({ onStart }) => {
  const [minutes, setMinutes] = useState(1);

  return (
    <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center gap-8"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' }}>
      {/* Title */}
      <div className="text-center">
        <div className="text-6xl mb-3">⚡</div>
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
          Speed Rush
        </h1>
        <p className="text-slate-400 mt-2 text-lg">Type as fast as you can before time runs out</p>
      </div>

      {/* Time picker */}
      <div className="flex flex-col items-center gap-5 bg-slate-900/70 border border-slate-700/60 rounded-3xl px-12 py-8 backdrop-blur-md shadow-2xl">
        <div className="text-slate-400 font-bold uppercase tracking-widest text-sm">Select Time</div>

        {/* Slider */}
        <div className="flex items-center gap-5 w-72">
          <span className="text-slate-500 font-mono text-sm">1m</span>
          <input
            type="range" min="1" max="20" value={minutes}
            onChange={e => setMinutes(Number(e.target.value))}
            className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: '#f97316' }}
          />
          <span className="text-slate-500 font-mono text-sm">20m</span>
        </div>

        {/* Display */}
        <motion.div
          key={minutes}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          className="text-7xl font-black text-orange-400 font-mono"
          style={{ textShadow: '0 0 30px rgba(249,115,22,0.5)' }}
        >
          {minutes}:{String(0).padStart(2, '0')}
        </motion.div>

        {/* Quick picks */}
        <div className="flex gap-3 flex-wrap justify-center">
          {[1, 2, 3, 5, 10, 15, 20].map(m => (
            <button
              key={m}
              onClick={() => setMinutes(m)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${minutes === m ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
              {m}m
            </button>
          ))}
        </div>
      </div>

      {/* Start button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onStart(minutes)}
        className="px-16 py-4 rounded-2xl text-white text-2xl font-black shadow-2xl"
        style={{ background: 'linear-gradient(to right, #f97316, #eab308)', boxShadow: '0 0 40px rgba(249,115,22,0.4)' }}
      >
        Start Rush! ⚡
      </motion.button>
    </div>
  );
};

// ─── Celebration overlay ──────────────────────────────────────────────────────
const Celebration = ({ wpm, accuracy, wordsTyped, timeUsed, onContinue }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-3xl"
    style={{ background: 'rgba(5,46,22,0.95)', backdropFilter: 'blur(20px)' }}
  >
    <motion.div
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', bounce: 0.5 }}
      className="text-8xl mb-4"
    >🎉</motion.div>
    <motion.h1
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.15 }}
      className="text-6xl font-black text-emerald-400 tracking-tight"
      style={{ textShadow: '0 0 30px rgba(74,222,128,0.6)' }}
    >
      Text Complete!
    </motion.h1>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.25 }}
      className="text-white/60 mt-2 text-xl font-mono"
    >
      You typed all the words with time to spare! 🚀
    </motion.p>

    {/* Stats */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="flex gap-6 mt-8"
    >
      {[['⚡ WPM', wpm], ['🎯 Accuracy', `${accuracy}%`], ['📝 Words', wordsTyped], ['⏱ Time', `${timeUsed}s`]].map(([label, val]) => (
        <div key={label} className="text-center bg-slate-900/60 border border-slate-700/50 rounded-2xl px-6 py-4">
          <div className="text-slate-400 text-xs font-bold uppercase mb-1">{label}</div>
          <div className="text-3xl font-black text-white">{val}</div>
        </div>
      ))}
    </motion.div>

    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      whileHover={{ scale: 1.05 }}
      onClick={onContinue}
      className="mt-8 px-10 py-3 rounded-2xl text-white font-black text-lg"
      style={{ background: 'linear-gradient(to right, #059669, #10b981)', boxShadow: '0 0 30px rgba(16,185,129,0.4)' }}
    >
      Continue Typing ✏️
    </motion.button>
  </motion.div>
);

// ─── Main Game ────────────────────────────────────────────────────────────────
const WORDS_PER_CHUNK = 150;

export const SpeedRush = ({ onGameOver }) => {
  const [selectedMinutes, setSelectedMinutes] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [textChunks, setTextChunks] = useState([generateRandomWords(WORDS_PER_CHUNK)]);
  const [chunkIndex, setChunkIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [wordsTypedTotal, setWordsTypedTotal] = useState(0);
  const [timeUsedAtCompletion, setTimeUsedAtCompletion] = useState(0);

  const currentText = textChunks[chunkIndex] || textChunks[0];

  const {
    userInput, wpm, accuracy, correctKeyStrokes,
    handleCharInput, reset
  } = useTypingEngine(currentText);

  const inputRef = useRef(null);
  const textContainerRef = useRef(null);
  const [totalSeconds, setTotalSeconds] = useState(0);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [selectedMinutes]);

  // Start timer on first keystroke
  useEffect(() => {
    if (userInput.length > 0 && !isActive && selectedMinutes) {
      setIsActive(true);
    }
  }, [userInput, isActive, selectedMinutes]);

  // Timer countdown
  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;
    const t = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) {
          clearInterval(t);
          const finalScore = Math.floor(wpm * (accuracy / 100) * 10);
          setTimeout(() => onGameOver({
            score: finalScore,
            wpm,
            accuracy,
            errors,
            totalStrokes: userInput.length
          }), 200);
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [isActive, timeLeft, wpm, accuracy, onGameOver]);

  // Detect full completion of current text chunk
  useEffect(() => {
    if (!isActive) return;
    if (userInput.length >= currentText.length && currentText.length > 0) {
      const totalTyped = selectedMinutes ? selectedMinutes * 60 - timeLeft : 0;
      setTimeUsedAtCompletion(totalTyped);
      const wordCount = currentText.split(' ').length;
      setWordsTypedTotal(p => p + wordCount);
      setShowCelebration(true);
    }
  }, [userInput, currentText, isActive, selectedMinutes, timeLeft]);

  // ─── Auto-scroll cursor into view (Optimized)
  useEffect(() => {
    if (!textContainerRef.current) return;
    const cursor = textContainerRef.current.querySelector('.char-cursor');
    if (cursor) {
      // nearest is less aggressive than center and prevents jitter
      cursor.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [userInput.length]);

  const handleStart = (minutes) => {
    setSelectedMinutes(minutes);
    setTimeLeft(minutes * 60);
    setTotalSeconds(minutes * 60);
  };

  const handleContinue = useCallback(() => {
    setShowCelebration(false);
    // Generate a new chunk and advance
    setTextChunks(prev => {
      const next = [...prev, generateRandomWords(WORDS_PER_CHUNK)];
      return next;
    });
    setChunkIndex(p => p + 1);
    reset();
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [reset]);

  // Format mm:ss
  // Format mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const progress = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;

  // Render text with highlights
  const renderText = () => {
    return currentText.split('').map((char, index) => {
      let colorClass = 'text-slate-500';
      if (index < userInput.length) {
        colorClass = userInput[index] === char
          ? 'text-white font-bold'
          : 'text-red-400 bg-red-500/20';
      } else if (index === userInput.length) {
        colorClass = 'text-orange-400 border-b-2 border-orange-400 char-cursor';
      }
      return (
        <span key={index} className={`transition-colors duration-75 ${colorClass}`}>
          {char}
        </span>
      );
    });
  };

  // ── Time selector screen ──
  if (!selectedMinutes) {
    return <TimeSelector onStart={handleStart} />;
  }

  return (
    <div className="w-full h-full min-h-[500px] rounded-3xl overflow-hidden relative flex flex-col gap-5 p-6"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' }}>

      {/* ── HUD ── */}
      <div className="w-full flex items-center gap-4">
        {/* Timer */}
        <div className="flex flex-col items-center bg-slate-900/70 border border-slate-700/50 rounded-2xl px-5 py-3 min-w-[110px]">
          <div className="flex items-center gap-1.5 text-orange-400 mb-1">
            <Clock size={16}/> <span className="font-bold text-xs uppercase tracking-widest">Time</span>
          </div>
          <div className={`text-4xl font-black font-mono tabular-nums ${timeLeft <= 10 && isActive ? 'text-red-500 animate-pulse' : 'text-white'}`}>
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex justify-between text-xs font-mono text-slate-500 mb-0.5">
            <span>Rush Progress</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(to right, #f97316, #eab308)' }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-600 mt-0.5">
            <span>0:00</span>
            <span>{selectedMinutes}:00</span>
          </div>
        </div>

        {/* WPM */}
        <div className="flex flex-col items-center bg-slate-900/70 border border-yellow-500/30 rounded-2xl px-5 py-3 min-w-[90px]">
          <div className="flex items-center gap-1.5 text-yellow-400 mb-1">
            <Zap size={16}/> <span className="font-bold text-xs uppercase tracking-widest">WPM</span>
          </div>
          <div className="text-4xl font-black text-white tabular-nums">{wpm}</div>
        </div>

        {/* Accuracy */}
        <div className="flex flex-col items-center bg-slate-900/70 border border-emerald-500/30 rounded-2xl px-5 py-3 min-w-[100px]">
          <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
            <Target size={16}/> <span className="font-bold text-xs uppercase tracking-widest">Accuracy</span>
          </div>
          <div className="text-4xl font-black text-white tabular-nums">{accuracy}%</div>
        </div>

        {/* Words typed */}
        <div className="flex flex-col items-center bg-slate-900/70 border border-slate-700/50 rounded-2xl px-5 py-3 min-w-[90px]">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <CheckCircle size={16}/> <span className="font-bold text-xs uppercase tracking-widest">Words</span>
          </div>
          <div className="text-4xl font-black text-white tabular-nums">
            {wordsTypedTotal + (userInput.split(' ').filter(Boolean).length)}
          </div>
        </div>
      </div>

      <div
        ref={textContainerRef}
        className="flex-1 w-full bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 text-2xl leading-loose tracking-wide font-mono overflow-y-hidden cursor-text relative"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Start hint */}
        {!isActive && userInput.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/85 z-10 backdrop-blur-sm rounded-2xl">
            <div className="text-center">
              <div className="text-4xl mb-3">⚡</div>
              <div className="text-2xl font-bold text-white">Start typing to begin the rush!</div>
              <div className="text-slate-500 mt-2 font-mono text-lg">{selectedMinutes} minute{selectedMinutes > 1 ? 's' : ''} on the clock</div>
            </div>
          </div>
        )}

        {renderText()}

        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={e => handleCharInput(e.target.value)}
          disabled={timeLeft === 0}
          className="fixed opacity-0 pointer-events-none"
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />
      </div>

      {/* ── Completion celebration ── */}
      <AnimatePresence>
        {showCelebration && (
          <Celebration
            wpm={wpm}
            accuracy={accuracy}
            wordsTyped={wordsTypedTotal + currentText.split(' ').length}
            timeUsed={timeUsedAtCompletion}
            onContinue={handleContinue}
          />
        )}
      </AnimatePresence>

    </div>
  );
};
