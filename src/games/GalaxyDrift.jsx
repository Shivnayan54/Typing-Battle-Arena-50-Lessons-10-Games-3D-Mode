/* eslint-disable */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateRandomWords } from '../utils/generateText';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Word pool ────────────────────────────────────────────────────────────────
const randWord = () => {
  const ws = generateRandomWords(12).split(' ').filter(w => w.length >= 3 && w.length <= 8);
  return ws[Math.floor(Math.random() * ws.length)] || 'nova';
};

// ─── Neon colors ──────────────────────────────────────────────────────────────
const NEON = ['#f0abfc', '#67e8f9', '#86efac', '#fde68a', '#fb923c', '#c4b5fd'];

// ─── Word bubble ──────────────────────────────────────────────────────────────
const WordBubble = ({ word, typed, isActive, color, x, y, drift, size }) => {
  const pct = typed / Math.max(1, word.length);
  return (
    <motion.div
      className="absolute pointer-events-none flex flex-col items-center"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
      animate={{ x: [0, drift, 0], y: [0, drift * 0.5, 0] }}
      transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Glow ring */}
      {isActive && (
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ border: `2px solid ${color}`, boxShadow: `0 0 20px ${color}`, width: size + 20, height: size + 20, top: -10, left: -10 }}
        />
      )}

      {/* Crystal/gem shape */}
      <svg width={size} height={size} viewBox="0 0 60 60">
        <defs>
          <radialGradient id={`g${Math.abs(x + y).toFixed(0)}`} cx="40%" cy="30%">
            <stop offset="0%" stopColor="white" stopOpacity="0.4"/>
            <stop offset="100%" stopColor={color} stopOpacity="0.15"/>
          </radialGradient>
        </defs>
        <polygon points="30,4 56,20 56,40 30,56 4,40 4,20"
          fill={`url(#g${Math.abs(x + y).toFixed(0)})`}
          stroke={color} strokeWidth="1.5"
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
        {/* Inner facets */}
        <polygon points="30,15 46,22 46,38 30,45 14,38 14,22"
          fill="none" stroke={color} strokeWidth="0.8" opacity="0.4"
        />
        {/* Progress fill */}
        <clipPath id={`clip${Math.abs(x + y).toFixed(0)}`}>
          <rect x="0" y={60 - 60 * pct} width="60" height={60 * pct}/>
        </clipPath>
        <polygon points="30,4 56,20 56,40 30,56 4,40 4,20"
          fill={color} opacity="0.35"
          clipPath={`url(#clip${Math.abs(x + y).toFixed(0)})`}
        />
      </svg>

      {/* Word label */}
      <div
        className={`mt-1 px-3 py-1 rounded-lg font-mono font-black text-sm tracking-widest backdrop-blur-sm border`}
        style={{
          background: isActive ? `${color}18` : 'rgba(2,6,23,0.75)',
          borderColor: isActive ? color : 'rgba(255,255,255,0.1)',
          boxShadow: isActive ? `0 0 12px ${color}55` : 'none',
        }}
      >
        {word.split('').map((c, i) => (
          <span key={i}
            style={{
              color: i < typed ? color : i === typed && isActive ? '#fff' : 'rgba(255,255,255,0.35)',
              textShadow: i < typed ? `0 0 8px ${color}` : 'none',
            }}
          >{c}</span>
        ))}
      </div>
    </motion.div>
  );
};

// ─── Explosion effect ─────────────────────────────────────────────────────────
const Explosion = ({ x, y, color }) => (
  <motion.div
    className="absolute pointer-events-none rounded-full"
    style={{ left: `${x}%`, top: `${y}%`, width: 80, height: 80, transform: 'translate(-50%, -50%)', background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
    initial={{ scale: 0, opacity: 1 }}
    animate={{ scale: 4, opacity: 0 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  />
);

// ─── Star field ───────────────────────────────────────────────────────────────
const STARS = Array.from({ length: 120 }, (_, i) => ({
  id: i, x: Math.random() * 100, y: Math.random() * 100,
  size: Math.random() * 2 + 0.3,
  opacity: Math.random() * 0.7 + 0.1,
  delay: Math.random() * 4,
}));

// ─── Nebula patches ───────────────────────────────────────────────────────────
const NEBULAS = [
  { x: 20, y: 30, color: '#7c3aed', size: 300 },
  { x: 75, y: 60, color: '#0ea5e9', size: 250 },
  { x: 50, y: 10, color: '#ec4899', size: 200 },
];

// ─── Main Game ────────────────────────────────────────────────────────────────
const SPAWN_INTERVAL = 2600;
const MAX_ENEMIES = 8;

export const GalaxyDrift = ({ onGameOver }) => {
  const [words, setWords] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [explosions, setExplosions] = useState([]);
  const [shakeScreen, setShakeScreen] = useState(false);
  const [level, setLevel] = useState(1);
  const [activeWordId, setActiveWordId] = useState(null);

  const inputRef = useRef(null);
  const nextId = useRef(0);
  const deadRef = useRef(false);

  useEffect(() => { if (inputRef.current) inputRef.current.focus(); }, []);

  // Spawn words
  useEffect(() => {
    if (gameOver) return;
    const interval = Math.max(1000, SPAWN_INTERVAL - level * 150);
    const spawn = setInterval(() => {
      if (deadRef.current) return;
      setWords(prev => {
        if (prev.length >= MAX_ENEMIES) return prev;
        const word = randWord();
        const color = NEON[nextId.current % NEON.length];
        return [...prev, {
          id: nextId.current++,
          word, color,
          x: 10 + Math.random() * 80,
          y: 10 + Math.random() * 75,
          drift: (Math.random() - 0.5) * 30,
          size: 44 + Math.floor(Math.random() * 20),
        }];
      });
    }, interval);
    return () => clearInterval(spawn);
  }, [gameOver, level]);

  // Words drift off screen → damage
  useEffect(() => {
    if (gameOver) return;
    const check = setInterval(() => {
      setWords(prev => {
        // Words that have been alive > 15s get removed and deal damage
        return prev;
      });
    }, 5000);
    return () => clearInterval(check);
  }, [gameOver]);

  // Level up
  useEffect(() => {
    if (score > 0 && score >= level * 500) {
      setLevel(l => l + 1);
    }
  }, [score, level]);

  const handleInput = useCallback((e) => {
    if (gameOver) return;
    const val = e.target.value.toLowerCase().replace(/[^a-z]/g, '');

    // Find target: first one that starts with val
    const target = val.length > 0 ? words.find(w => w.word.startsWith(val)) : null;
    setActiveWordId(target ? target.id : null);

    // Wrong char
    if (val.length > 0 && !target) {
      setUserInput('');
      return;
    }

    setUserInput(val);

    if (target && val === target.word) {
      // Explode it!
      const pts = target.word.length * 10 * Math.max(1, combo + 1);
      setScore(p => p + pts);
      setCombo(p => p + 1);

      setExplosions(prev => [...prev, { id: Date.now(), x: target.x, y: target.y, color: target.color }]);
      setTimeout(() => setExplosions(prev => prev.filter(ex => ex.id !== Date.now())), 700);

      setWords(prev => prev.filter(w => w.id !== target.id));
      setActiveWordId(null);
      setUserInput('');
    }
  }, [gameOver, words, combo]);

  const timerColor = lives >= 4 ? '#4ade80' : lives >= 2 ? '#facc15' : '#ef4444';

  return (
    <div
      className="w-full h-full min-h-[520px] rounded-3xl overflow-hidden relative select-none flex flex-col"
      style={{ background: 'radial-gradient(ellipse at 40% 30%, #0f0c29, #302b63 50%, #24243e 100%)' }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* ── Nebula patches ── */}
      {NEBULAS.map((n, i) => (
        <div key={i} className="absolute pointer-events-none rounded-full opacity-10 blur-3xl"
          style={{ left: `${n.x}%`, top: `${n.y}%`, width: n.size, height: n.size, background: `radial-gradient(circle, ${n.color}, transparent)`, transform: 'translate(-50%,-50%)' }}
        />
      ))}

      {/* ── Stars ── */}
      {STARS.map(s => (
        <motion.div key={s.id}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          animate={{ opacity: [s.opacity, s.opacity * 0.3, s.opacity] }}
          transition={{ duration: 2 + s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* ── Grid ── */}
      <div className="absolute inset-0 pointer-events-none opacity-5"
        style={{ backgroundImage: 'linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)', backgroundSize: '50px 50px' }}
      />

      {/* ── HUD ── */}
      <div className="relative z-50 flex items-center justify-between px-5 py-2.5 border-b border-purple-900/50 bg-purple-950/40 backdrop-blur-md flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full border border-purple-500/40 bg-purple-900/40">
            <span className="text-purple-300 font-black text-lg">{score.toLocaleString()}</span>
            <span className="text-purple-600 text-xs ml-1">PTS</span>
          </div>
          <div className="text-xs text-slate-500 font-mono">LEVEL {level}</div>
          {combo > 1 && (
            <motion.div key={combo} initial={{ scale: 1.6 }} animate={{ scale: 1 }}
              className="text-sm font-black text-pink-400 bg-pink-500/20 border border-pink-500/40 px-2.5 py-0.5 rounded-full">
              ⚡ x{combo}
            </motion.div>
          )}
        </div>

        <div className="flex gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.span key={i} animate={i >= lives ? { scale: 0.4, opacity: 0.15 } : { scale: 1, opacity: 1 }} className="text-lg">💎</motion.span>
          ))}
        </div>

        <div className="text-purple-300 text-sm font-mono">{words.length} targets</div>
      </div>

      {/* ── Game area ── */}
      <div className="relative flex-1">
        {/* Explosions */}
        {explosions.map(ex => <Explosion key={ex.id} x={ex.x} y={ex.y} color={ex.color} />)}

        {/* Words */}
        {words.map(w => (
          <WordBubble
            key={w.id}
            word={w.word}
            typed={activeWordId === w.id ? userInput.length : 0}
            isActive={activeWordId === w.id}
            color={w.color}
            x={w.x} y={w.y}
            drift={w.drift}
            size={w.size}
          />
        ))}

        {/* Input */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 w-[85%] max-w-md">
          <div className="flex items-center gap-2 rounded-2xl px-5 py-2.5 backdrop-blur-xl border"
            style={{ background: 'rgba(15,12,41,0.85)', borderColor: 'rgba(139,92,246,0.5)', boxShadow: '0 0 30px rgba(139,92,246,0.12)' }}>
            <span className="text-purple-400 text-lg">✦</span>
            <input
              ref={inputRef}
              type="text" value={userInput} onChange={handleInput}
              disabled={gameOver}
              autoFocus autoComplete="off" autoCorrect="off" spellCheck="false"
              placeholder="Type glowing words to destroy them..."
              className="flex-1 bg-transparent text-purple-200 text-2xl font-mono font-bold focus:outline-none placeholder:text-purple-900 caret-purple-400"
            />
          </div>
        </div>

        {/* Game over */}
        <AnimatePresence>
          {gameOver && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 z-[200] flex flex-col items-center justify-center"
              style={{ background: 'rgba(15,12,41,0.92)', backdropFilter: 'blur(16px)' }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}
                className="text-8xl mb-4">🌌</motion.div>
              <h1 className="text-6xl font-black text-purple-400" style={{ textShadow: '0 0 30px rgba(139,92,246,0.8)' }}>Galaxy Lost</h1>
              <p className="text-white/60 mt-3 font-mono text-xl">Score: <span className="text-pink-400 font-black">{score.toLocaleString()}</span></p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
