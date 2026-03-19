/* eslint-disable */
import React, { useEffect, useState, useRef, useCallback, useMemo, useId } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { LESSONS } from '../data/lessons';
import { calculateXPReward } from '../utils/gamification';
import { generateHardWords } from '../utils/generateText';
import { sounds } from '../utils/sounds';
import ResultModal from '../components/ResultModal';
import { RefreshCw, ArrowLeft, Zap, Timer, Target, Infinity, Star, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════ TEXT GENERATION ═══════════════ */
const genText = (mode, lesson) => {
  if (mode === 'lesson' && lesson) return lesson.text;
  return generateHardWords(mode === '15' ? 40 : mode === '30' ? 60 : 80);
};

/* ═══════════════ MODE CONFIG ═══════════════ */
const TIMED_MODES = [
  { key: '15', label: '15s', duration: 15, icon: <Zap size={13} />, color: 'text-amber-400' },
  { key: '30', label: '30s', duration: 30, icon: <Timer size={13} />, color: 'text-cyan-400' },
  { key: '60', label: '60s', duration: 60, icon: <Target size={13} />, color: 'text-nova-400' },
  { key: 'endless', label: '∞', duration: -1, icon: <Infinity size={13} />, color: 'text-emerald-400' },
];

/* ═══════════════ CHAR STATE RENDERER ═══════════════ */
const CharSpan = React.memo(({ char, state }) => {
  const cls =
    state === 'correct' ? 'char-correct' :
    state === 'incorrect' ? 'char-incorrect' :
    state === 'cursor' ? 'char-cursor' :
    'char-pending';
  return <span className={cls}>{char === ' ' ? '\u00A0' : char}</span>;
});

/* ═══════════════ MAIN COMPONENT ═══════════════ */
const Practice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addXp, markLessonComplete, addHistoryEntry, recordDailyAttempt, dailyAttempts, soundEnabled } = useUserContext();
  const { user } = useAuth();

  // ─── Setup
  const initialLessonId = location.state?.lessonId ?? null;
  const initialModeKey = location.state?.modeKey ?? (initialLessonId ? 'lesson' : '60');
  const initialLesson = initialLessonId ? LESSONS.find(l => l.id === initialLessonId) : null;

  const [modeKey, setModeKey] = useState(initialModeKey);
  const [currentLesson, setCurrentLesson] = useState(initialLesson);
  const mode = currentLesson ? 'lesson' : modeKey;
  const isEndless = modeKey === 'endless' && !currentLesson;
  const modeConfig = TIMED_MODES.find(m => m.key === modeKey) ?? TIMED_MODES[2];
  const duration = currentLesson ? -1 : modeConfig.duration;

  // ─── Typing state
  const [textKey, setTextKey] = useState(0); // bumping this forces a full reset
  const [text, setText] = useState(() => genText(modeKey, currentLesson));
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState('idle'); // idle | typing | finished
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(modeConfig.duration);
  const [activeElapsed, setActiveElapsed] = useState(0);
  const [errors, setErrors] = useState(0);
  const [totalKeys, setTotalKeys] = useState(0);
  const [correctKeys, setCorrectKeys] = useState(0);

  // ─── Result modal
  const [showModal, setShowModal] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [passed, setPassed] = useState(false);
  const sessionFinishedRef = useRef(false);

  // ─── Refs
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const textContainerRef = useRef(null);

  // ─── WPM + accuracy derivation
  const wpm = useMemo(() => {
    if (status === 'idle') return 0;
    let minutesElap = 0;
    if (status === 'finished' && startTime && endTime) {
      minutesElap = (endTime - startTime) / 60000;
    } else {
      minutesElap = activeElapsed / 60;
    }
    if (minutesElap <= 0) return 0;
    return Math.round((correctKeys / 5) / minutesElap);
  }, [correctKeys, activeElapsed, status, startTime, endTime]);

  const accuracy = useMemo(() => {
    if (totalKeys === 0) return 100;
    return Math.round((correctKeys / totalKeys) * 100);
  }, [correctKeys, totalKeys]);

  // ─── RESET (complete)
  const startFresh = useCallback((newText) => {
    // Clear timer
    if (timerRef.current) clearInterval(timerRef.current);
    // Reset all state atomically
    setUserInput('');
    setStatus('idle');
    setStartTime(null);
    setEndTime(null);
    setErrors(0);
    setTotalKeys(0);
    setCorrectKeys(0);
    setTimeLeft(duration > 0 ? duration : modeConfig.duration);
    setActiveElapsed(0);
    setShowModal(false);
    sessionFinishedRef.current = false;
    if (newText) setText(newText);
    setTextKey(k => k + 1); // forces char re-render
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [duration, modeConfig.duration]);

  // ─── Timer countdown
  useEffect(() => {
    if (status === 'typing') {
      timerRef.current = setInterval(() => {
        setActiveElapsed(prev => prev + 1);
        if (duration > 0) {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              setStatus('finished');
              setEndTime(Date.now());
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status, duration]);

  // ─── Auto-finish watch
  useEffect(() => {
    if (status === 'finished' && !sessionFinishedRef.current) {
      sessionFinishedRef.current = true;
      finishSession();
    }
  }, [status]);

  // ─── Endless text auto-append
  useEffect(() => {
    if (isEndless && status === 'typing' && userInput.length > 0) {
      const remaining = text.length - userInput.length;
      if (remaining < 300) {
        setText(prev => prev + ' ' + generateHardWords(60));
      }
    }
  }, [userInput.length, isEndless, status, text.length]);

  // ─── Auto-scroll cursor into view
  useEffect(() => {
    if (!textContainerRef.current) return;
    const cursor = textContainerRef.current.querySelector('.char-cursor');
    if (cursor) {
      cursor.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [userInput.length]);

  // ─── Mode switch restarts
  useEffect(() => {
    const newText = genText(currentLesson ? 'lesson' : modeKey, currentLesson);
    setText(newText);
    setTimeLeft(duration > 0 ? duration : modeKey === '15' ? 15 : modeKey === '30' ? 30 : 60);
    startFresh(newText);
  }, [modeKey, currentLesson]);

  // ─── Input handler
  const handleCharInput = useCallback((e) => {
    const value = e.target.value;
    if (status === 'finished') return;

    if (status === 'idle') {
      setStatus('typing');
      setStartTime(Date.now());
    }

    const isBack = value.length < userInput.length;
    if (!isBack) {
      const idx = value.length - 1;
      setTotalKeys(k => k + 1);
      if (value[idx] === text[idx]) {
        setCorrectKeys(k => k + 1);
        if (soundEnabled) sounds.keyPress();
      } else {
        setErrors(k => k + 1);
        if (soundEnabled) sounds.keyError();
      }
    }

    setUserInput(value);

    // Lesson/endless: finish on text complete
    if (duration <= 0 && value.length === text.length) {
      setStatus('finished');
      setEndTime(Date.now());
    }
  }, [status, text, userInput.length, duration, soundEnabled]);

  // ─── Finish session logic
  const finishSession = useCallback(() => {
    let xpGained = 0;
    let hasPassed = false;

    if (currentLesson) {
      if (wpm >= currentLesson.targetWpm && accuracy >= currentLesson.targetAccuracy) {
        hasPassed = true;
        xpGained = currentLesson.xpReward + (wpm > currentLesson.targetWpm * 1.2 ? 50 : 0);
        markLessonComplete(currentLesson.id);
        addXp(xpGained);
        triggerConfetti();
      }
    } else {
      const diff = modeKey === '15' ? 1.5 : modeKey === '30' ? 1.2 : isEndless ? 1.4 : 1;
      xpGained = calculateXPReward(wpm, accuracy, diff);
      addXp(xpGained);
    }

    addHistoryEntry({ type: mode, lessonId: currentLesson?.id, wpm, accuracy, errors });
    recordDailyAttempt();
    if (soundEnabled) sounds.testComplete();

    setEarnedXp(xpGained);
    setPassed(hasPassed);
    setShowModal(true);
  }, [currentLesson, wpm, accuracy, errors, mode, modeKey, isEndless, soundEnabled]);

  const triggerConfetti = () => {
    const end = Date.now() + 2500;
    const frame = () => {
      if (Date.now() > end) return;
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#7c3aed', '#06b6d4', '#f59e0b'] });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#7c3aed', '#06b6d4', '#f59e0b'] });
      requestAnimationFrame(frame);
    };
    frame();
  };

  const handleRestart = useCallback(() => {
    const newText = genText(currentLesson ? 'lesson' : modeKey, currentLesson);
    startFresh(newText);
  }, [currentLesson, modeKey, startFresh]);

  const selectModeKey = useCallback((key) => {
    setModeKey(key);
    setCurrentLesson(null);
  }, []);

  // ─── Build char states array (memoized)
  const charStates = useMemo(() => {
    return text.split('').map((char, i) => ({
      char,
      state: i < userInput.length
        ? (userInput[i] === char ? 'correct' : 'incorrect')
        : i === userInput.length ? 'cursor' : 'pending'
    }));
  }, [text, userInput]);

  // ─── Timer ring
  const maxDur = modeConfig.duration > 0 ? modeConfig.duration : 60;
  const timerPercent = duration > 0 ? (timeLeft / duration) * 100 : 100;
  const timerColor = timeLeft <= 5 ? '#f43f5e' : timeLeft <= 10 ? '#f59e0b' : '#7c3aed';

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col items-center gap-5 page-enter">

      {/* ─── Top bar ─── */}
      <div className="w-full flex items-center justify-between glass-panel px-5 py-3 rounded-2xl border border-white/[0.06]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-slate-500 hover:text-white text-sm font-semibold transition-colors">
            <ArrowLeft size={15} /> Back
          </button>
          <div className="h-4 w-px bg-white/[0.08]" />
          {currentLesson ? (
            <div>
              <span className="text-xs text-nova-400 font-bold uppercase tracking-widest">Lesson {currentLesson.id}</span>
              <p className="text-sm font-bold text-white leading-none mt-0.5">{currentLesson.title}</p>
            </div>
          ) : (
            <span className="text-sm font-semibold text-slate-400">
              {modeKey === 'endless' ? 'Endless Mode' : `${modeKey}s Quick Test`}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-slate-600">
            <Flame size={11} className="text-orange-400" />{dailyAttempts}/5
          </div>
          {currentLesson && (
            <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white/[0.04] border border-white/[0.05] px-2.5 py-1.5 rounded-xl">
              <span>Target: <strong className="text-white">{currentLesson.targetWpm} WPM</strong></span>
              <span>· <strong className="text-white">{currentLesson.targetAccuracy}%</strong></span>
            </div>
          )}
          <button onClick={handleRestart} className="p-2 rounded-xl hover:bg-white/[0.06] text-slate-500 hover:text-white transition-all hover:rotate-180 duration-300">
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* ─── Mode selector ─── */}
      {!currentLesson && (
        <div className="flex items-center gap-1.5 glass-panel px-3 py-2 rounded-2xl border border-white/[0.06]">
          {TIMED_MODES.map(m => (
            <button key={m.key} onClick={() => selectModeKey(m.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                modeKey === m.key
                  ? 'bg-nova-600/25 border border-nova-500/35 text-white'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
              }`}>
              <span className={modeKey === m.key ? m.color : ''}>{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>
      )}

      {/* ─── Timer ring ─── */}
      {!currentLesson && !isEndless && (
        <div className="relative w-16 h-16">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
            <circle cx="32" cy="32" r="28" fill="none" stroke={timerColor} strokeWidth="4" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - timerPercent / 100)}`}
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-black" style={{ color: timerColor }}>{timeLeft}</span>
          </div>
        </div>
      )}

      {/* ─── Typing area ─── */}
      <div className="w-full cursor-text" onClick={() => inputRef.current?.focus()}>
        <div
          ref={textContainerRef}
          key={textKey}
          className="glass-panel border border-white/[0.06] p-7 relative overflow-hidden"
          style={{
            maxHeight: '200px',
            overflowY: 'hidden',
            fontFamily: "'Fira Code', monospace",
            fontSize: '1.25rem',
            lineHeight: '2.2',
            letterSpacing: '0.02em',
            wordBreak: 'break-word',
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-8 pointer-events-none z-10"
            style={{ background: 'linear-gradient(to bottom, rgba(8,11,20,0.9), transparent)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-10"
            style={{ background: 'linear-gradient(to top, rgba(8,11,20,0.7), transparent)' }} />
          <div className="relative z-0">
            {charStates.map((c, i) => <CharSpan key={i} char={c.char} state={c.state} />)}
          </div>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleCharInput}
          disabled={status === 'finished'}
          className="absolute opacity-0 -z-10 pointer-events-none"
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>

      {/* ─── Live stats ─── */}
      <motion.div
        className="flex items-center justify-center gap-10 sm:gap-16 glass-panel px-10 py-4 rounded-full border border-white/[0.06]"
        layout
      >
        {[
          { value: wpm, label: 'WPM', color: 'text-white' },
          { value: `${accuracy}%`, label: 'Accuracy', color: accuracy < 80 ? 'text-rose-400' : 'text-white' },
          { value: errors, label: 'Errors', color: errors > 5 ? 'text-rose-400' : 'text-white' },
        ].map(s => (
          <div key={s.label} className="flex flex-col items-center">
            <span className={`text-3xl font-black ${s.color}`}>{s.value}</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-600 mt-0.5">{s.label}</span>
          </div>
        ))}
      </motion.div>

      {/* ─── Result Modal ─── */}
      <ResultModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); if (currentLesson) navigate('/roadmap'); }}
        onRestart={handleRestart}
        stats={{ wpm, accuracy, totalStrokes: totalKeys, errors }}
        customContent={
          <div className="mt-5 pt-5 border-t border-white/[0.06] space-y-3">
            {currentLesson && (
              passed ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-center">
                  <p className="font-bold">🎉 Lesson Passed!</p>
                  <p className="text-sm text-emerald-300/70 mt-0.5">You met all requirements.</p>
                </div>
              ) : (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-center">
                  <p className="font-bold">❌ Targets Not Met</p>
                  <p className="text-sm mt-0.5 text-rose-300/70">Need {currentLesson.targetWpm} WPM & {currentLesson.targetAccuracy}% accuracy.</p>
                </div>
              )
            )}
            <div className="flex items-center justify-center gap-2 text-2xl font-black text-amber-400">
              <Star fill="currentColor" size={20} /> +{earnedXp} XP
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <Flame size={15} className="text-orange-400" />
              <div className="flex-1">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-400">Daily Progress</span>
                  <span className="text-white">{Math.min(dailyAttempts, 5)}/5</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.min(dailyAttempts / 5, 1) * 100}%` }} />
                </div>
              </div>
            </div>
            {currentLesson && passed && currentLesson.id < 50 && (
              <button
                onClick={() => {
                  const next = LESSONS.find(l => l.id === currentLesson.id + 1);
                  if (next) { setCurrentLesson(next); handleRestart(); }
                }}
                className="w-full btn-primary !py-3 !rounded-xl !text-sm"
              >
                Next Lesson →
              </button>
            )}
          </div>
        }
      />
    </div>
  );
};

export default Practice;
