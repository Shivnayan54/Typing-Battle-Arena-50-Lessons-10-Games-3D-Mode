/* eslint-disable */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateRandomWords } from '../utils/generateText';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Word pool ────────────────────────────────────────────────────────────────
const WORDS = "jump flip run dash leap kick slash duck roll spin dodge".split(' ');
const rand = (a, b) => a + Math.random() * (b - a);
const randWord = () => {
  const pool = generateRandomWords(10).split(' ').filter(w => w.length >= 3 && w.length <= 6);
  return pool[Math.floor(Math.random() * pool.length)] || WORDS[Math.floor(Math.random() * WORDS.length)];
};

// ─── Ninja SVG (side view) ───────────────────────────────────────────────────
const Ninja = ({ running, jumping, dead }) => (
  <svg width="52" height="80" viewBox="0 0 52 80" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))' }}>
    {/* Scarf / cape */}
    <motion.path
      d="M26 14 Q40 20 50 14 Q44 30 38 28"
      fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"
      animate={running ? { d: ['M26 14 Q40 20 52 12 Q46 30 38 28', 'M26 14 Q40 18 50 16 Q44 32 37 30', 'M26 14 Q40 20 52 12 Q46 30 38 28'] } : {}}
      transition={{ duration: 0.4, repeat: Infinity }}
    />

    {/* Body */}
    <rect x="16" y="26" width="20" height="26" rx="4" fill="#111827"/>
    {/* Chest X */}
    <line x1="16" y1="26" x2="36" y2="52" stroke="#374151" strokeWidth="1" opacity="0.5"/>
    <line x1="36" y1="26" x2="16" y2="52" stroke="#374151" strokeWidth="1" opacity="0.5"/>

    {/* Head */}
    <circle cx="26" cy="14" r="12" fill="#111827"/>
    {/* Headband */}
    <rect x="14" y="8" width="24" height="5" rx="2" fill="#ef4444"/>
    {/* Eyes - just a slit */}
    <rect x="18" y="12" width="8" height="2.5" rx="1" fill="white"/>
    <line x1="22" y1="12" x2="22" y2="14.5" stroke="#111" strokeWidth="1"/>

    {/* Left arm */}
    <motion.g
      animate={jumping ? { rotate: -90 } : running ? { rotate: [-30, 30, -30] } : { rotate: -20 }}
      transition={{ duration: 0.35, repeat: running ? Infinity : 0 }}
      style={{ originX: '18px', originY: '30px' }}
    >
      <rect x="8" y="30" width="10" height="20" rx="5" fill="#111827"/>
      {/* Shuriken */}
      {jumping && (
        <motion.g animate={{ rotate: 360 }} transition={{ duration: 0.4, repeat: Infinity, ease: 'linear' }}>
          <polygon points="8,20 10,16 12,20 10,24" fill="#9ca3af"/>
          <polygon points="6,22 10,20 14,22 10,24" fill="#6b7280"/>
        </motion.g>
      )}
    </motion.g>
    {/* Right arm */}
    <motion.g
      animate={jumping ? { rotate: 90 } : running ? { rotate: [30, -30, 30] } : { rotate: 20 }}
      transition={{ duration: 0.35, repeat: running ? Infinity : 0, delay: 0.175 }}
      style={{ originX: '34px', originY: '30px' }}
    >
      <rect x="34" y="30" width="10" height="20" rx="5" fill="#111827"/>
    </motion.g>

    {/* Legs */}
    <motion.g
      animate={jumping ? { y: -8 } : running ? { rotate: [-25, 25, -25] } : { y: 0 }}
      transition={{ duration: 0.3, repeat: running ? Infinity : 0 }}
      style={{ originX: '26px', originY: '52px' }}
    >
      <rect x="16" y="52" width="10" height="22" rx="5" fill="#1f2937"/>
      <rect x="28" y="52" width="10" height="22" rx="5" fill="#1f2937"/>
      <ellipse cx="21" cy="75" rx="7" ry="5" fill="#111827"/>
      <ellipse cx="33" cy="75" rx="7" ry="5" fill="#111827"/>
    </motion.g>
  </svg>
);

// ─── Obstacle types ───────────────────────────────────────────────────────────
const OBSTACLES = [
  // Spinning blade
  (word, pct) => (
    <div className="flex flex-col items-center gap-1">
      <div className={`px-3 py-1 rounded-lg font-mono font-black text-base border-2 ${pct > 0 ? 'bg-red-900/90 border-red-400' : 'bg-slate-900/80 border-slate-600'}`}>
        {word.split('').map((c, i) => (
          <span key={i} className={i < pct ? 'text-red-400' : 'text-slate-200'}>{c}</span>
        ))}
      </div>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-10 h-10 relative">
        <div className="absolute inset-0" style={{ background: 'conic-gradient(#ef4444, #7c3aed, #2563eb, #ef4444)', borderRadius: '50%', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)' }}/>
      </motion.div>
    </div>
  ),
  // Rock
  (word, pct) => (
    <div className="flex flex-col items-center gap-1">
      <div className={`px-3 py-1 rounded-lg font-mono font-black text-base border-2 ${pct > 0 ? 'bg-orange-900/90 border-orange-400' : 'bg-slate-900/80 border-slate-600'}`}>
        {word.split('').map((c, i) => (
          <span key={i} className={i < pct ? 'text-orange-400' : 'text-slate-200'}>{c}</span>
        ))}
      </div>
      <svg width="50" height="40" viewBox="0 0 50 40">
        <polygon points="5,40 15,10 30,5 45,15 48,40" fill="#57534e" stroke="#292524" strokeWidth="2"/>
        <polygon points="12,30 20,12 35,8 42,22" fill="#6b7280" opacity="0.4"/>
        <circle cx="20" cy="28" r="3" fill="#44403c" opacity="0.6"/>
      </svg>
    </div>
  ),
  // Fire wall
  (word, pct) => (
    <div className="flex flex-col items-center gap-1">
      <div className={`px-3 py-1 rounded-lg font-mono font-black text-base border-2 ${pct > 0 ? 'bg-yellow-900/90 border-yellow-400' : 'bg-slate-900/80 border-slate-600'}`}>
        {word.split('').map((c, i) => (
          <span key={i} className={i < pct ? 'text-yellow-400' : 'text-slate-200'}>{c}</span>
        ))}
      </div>
      <motion.div
        animate={{ scaleY: [1, 1.2, 0.9, 1.15, 1], scaleX: [1, 0.95, 1.05, 0.98, 1] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
        className="text-4xl"
      >🔥</motion.div>
    </div>
  ),
];

// ─── Ground decoration ────────────────────────────────────────────────────────
const groundDeco = Array.from({ length: 18 }, (_, i) => ({
  id: i, type: i % 4,
  x: i * 6 + Math.random() * 3,
}));

// ─── Main Component ───────────────────────────────────────────────────────────
const OBSTACLE_SPEED_BASE = 1.8;
const SPAWN_INTERVAL = 2800;

export const NinjaRun = ({ onGameOver }) => {
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [obstacles, setObstacles] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isJumping, setIsJumping] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [dust, setDust] = useState([]);
  const [shakeScreen, setShakeScreen] = useState(false);
  const [distance, setDistance] = useState(0);

  const inputRef = useRef(null);
  const deadRef = useRef(false);
  const nextId = useRef(0);
  const gameSpeedRef = useRef(OBSTACLE_SPEED_BASE);

  useEffect(() => { if (inputRef.current) inputRef.current.focus(); }, []);

  // Distance counter
  useEffect(() => {
    if (gameOver) return;
    const t = setInterval(() => setDistance(p => p + 1), 100);
    return () => clearInterval(t);
  }, [gameOver]);

  // Obstacle movement loop
  useEffect(() => {
    if (gameOver) return;
    const loop = setInterval(() => {
      setObstacles(prev => {
        const speed = gameSpeedRef.current;
        const moved = prev.map(o => ({ ...o, x: o.x - speed }));
        const survived = [];
        let hit = false;
        moved.forEach(o => {
          if (o.x < -120) return; // off screen left
          if (o.x < 90 && o.x > 30 && !o.cleared) {
            // Ninja zone – if not cleared, damage
            hit = true;
            o.cleared = true;
          } else {
            survived.push(o);
          }
        });
        if (hit) {
          setShakeScreen(true);
          setTimeout(() => setShakeScreen(false), 500);
          setLives(l => {
            const nl = Math.max(0, l - 1);
            if (nl <= 0 && !deadRef.current) {
              deadRef.current = true;
              setGameOver(true);
              setTimeout(() => onGameOver(score), 1800);
            }
            return nl;
          });
          setCombo(0);
          setUserInput('');
        }
        return survived;
      });
    }, 35);
    return () => clearInterval(loop);
  }, [gameOver, score, onGameOver]);

  // Spawn obstacles
  useEffect(() => {
    if (gameOver) return;
    const spawn = setInterval(() => {
      const word = randWord();
      setObstacles(prev => [...prev, {
        id: nextId.current++,
        word,
        x: 920,
        type: Math.floor(Math.random() * OBSTACLES.length),
        cleared: false,
      }]);
      gameSpeedRef.current = Math.min(4.5, gameSpeedRef.current + 0.08);
    }, SPAWN_INTERVAL);
    return () => clearInterval(spawn);
  }, [gameOver]);

  const handleInput = useCallback((e) => {
    if (gameOver) return;
    const val = e.target.value.toLowerCase().replace(/[^a-z]/g, '');

    // Find the nearest obstacle (smallest x > 0)
    const sorted = [...obstacles].filter(o => !o.cleared).sort((a, b) => a.x - b.x);
    const target = sorted[0];
    if (!target) { setUserInput(''); return; }

    // Wrong char
    if (val.length > 0 && target.word[val.length - 1] !== val[val.length - 1]) {
      setUserInput('');
      return;
    }
    setUserInput(val);

    if (val === target.word) {
      // Clear obstacle - jump over it!
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 500);
      // Dust particles
      const newDust = Array.from({ length: 5 }, (_, i) => ({ id: Date.now() + i, x: 70, y: 40 }));
      setDust(p => [...p, ...newDust]);
      setTimeout(() => setDust(p => p.filter(d => !newDust.find(n => n.id === d.id))), 600);

      setObstacles(prev => prev.filter(o => o.id !== target.id));
      const pts = target.word.length * 10 * Math.max(1, combo + 1);
      setScore(p => p + pts);
      setCombo(p => p + 1);
      setUserInput('');
    }
  }, [gameOver, obstacles, combo]);

  // Active target
  const sortedObs = [...obstacles].filter(o => !o.cleared).sort((a, b) => a.x - b.x);
  const activeTarget = sortedObs[0];
  const typedLen = activeTarget ? userInput.length : 0;

  const timerColor = lives === 3 ? '#4ade80' : lives === 2 ? '#facc15' : '#ef4444';

  return (
    <div
      className="w-full h-full min-h-[520px] rounded-3xl overflow-hidden relative select-none flex flex-col"
      style={{ background: 'linear-gradient(to bottom, #1c1917 0%, #0c0a09 100%)' }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* ── Sky with stars ── */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 60}%`, width: rand(1, 2.5), height: rand(1, 2.5), opacity: rand(0.2, 0.7) }}
          />
        ))}
        {/* Moon */}
        <div className="absolute top-6 right-12 w-14 h-14 rounded-full"
          style={{ background: 'radial-gradient(circle at 35% 35%, #f0fdf4, #d1fae5)', boxShadow: '0 0 30px 8px rgba(167,243,208,0.25)' }}
        />
        {/* Silhouette mountain range */}
        <div className="absolute bottom-[30%] w-full h-[25%] opacity-40"
          style={{ background: 'linear-gradient(to top, #292524, transparent)', clipPath: 'polygon(0%100%,0%60%,8%35%,18%70%,28%25%,40%65%,52%15%,65%60%,75%30%,88%55%,100%20%,100%100%)' }}
        />
        {/* Closer pagoda silhouette */}
        <div className="absolute bottom-[30%] left-[10%] w-24 h-32 opacity-30"
          style={{ background: '#1c1917', clipPath: 'polygon(40%100%,40%60%,20%60%,50%10%,80%60%,60%60%,60%100%)' }}
        />
        <div className="absolute bottom-[30%] right-[15%] w-18 h-24 opacity-30"
          style={{ background: '#1c1917', clipPath: 'polygon(40%100%,40%60%,20%60%,50%10%,80%60%,60%60%,60%100%)' }}
        />
      </div>

      {/* ── HUD ── */}
      <div className="relative z-50 flex items-center justify-between px-5 py-2.5 bg-slate-950/70 backdrop-blur border-b border-slate-800/50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-slate-900/60 border border-red-500/40">
            <span className="text-red-300 font-black text-lg">{score.toLocaleString()}</span>
            <span className="text-slate-600 text-xs ml-1">PTS</span>
          </div>
          {combo > 1 && (
            <motion.div key={combo} initial={{ scale: 1.6 }} animate={{ scale: 1 }}
              className="text-sm font-black text-orange-400 bg-orange-500/20 border border-orange-500/40 px-2.5 py-0.5 rounded-full">
              🔥 x{combo}
            </motion.div>
          )}
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.span key={i}
              animate={i >= lives ? { scale: 0.5, opacity: 0.2 } : { scale: 1, opacity: 1 }}
              className="text-xl">❤️</motion.span>
          ))}
        </div>
        <div className="font-mono text-slate-400 text-sm">{distance * 3}m</div>
      </div>

      {/* ── Game world ── */}
      <motion.div
        className="relative flex-1"
        animate={shakeScreen ? { x: [-8, 8, -5, 5, -2, 2, 0] } : {}}
        transition={{ duration: 0.45 }}
      >
        {/* ── Ground ── */}
        <div className="absolute bottom-16 left-0 right-0 h-2 bg-gradient-to-r from-red-900 via-red-700 to-red-900 opacity-70"/>
        <div className="absolute left-0 right-0 bg-gradient-to-b from-[#1c1917] to-[#0c0a09]"
          style={{ bottom: 0, height: '4rem' }}
        />
        {/* Ground pattern */}
        {groundDeco.map(d => (
          <div key={d.id} className="absolute bottom-[4.2rem] text-lg" style={{ left: `${d.x}%` }}>
            {d.type === 0 ? '🌾' : d.type === 1 ? '⛩' : d.type === 2 ? '🎋' : '🏮'}
          </div>
        ))}

        {/* ── Obstacles ── */}
        {obstacles.map(obs => {
          const isActive = activeTarget?.id === obs.id;
          const ObsRender = OBSTACLES[obs.type];
          const pctTyped = isActive ? typedLen : 0;
          return (
            <div
              key={obs.id}
              className="absolute pointer-events-none flex flex-col items-center"
              style={{ left: obs.x, bottom: '4.5rem', transform: 'translateX(-50%)' }}
            >
              {ObsRender(obs.word, pctTyped)}
            </div>
          );
        })}

        {/* ── Dust particles ── */}
        {dust.map(d => (
          <motion.div key={d.id}
            className="absolute w-3 h-3 rounded-full bg-stone-500/60 pointer-events-none"
            style={{ left: d.x, bottom: '4.5rem' }}
            initial={{ opacity: 0.8, scale: 1, x: 0, y: 0 }}
            animate={{ opacity: 0, scale: 0.2, x: (Math.random() - 0.5) * 60, y: -30 + Math.random() * -20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        ))}

        {/* ── Ninja character ── */}
        <motion.div
          className="absolute pointer-events-none z-20"
          style={{ left: 70, bottom: '4.5rem' }}
          animate={{ y: isJumping ? -100 : 0, rotate: isJumping ? -15 : 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        >
          <Ninja running={isRunning && !isJumping} jumping={isJumping} />
        </motion.div>

        {/* ── Input ── */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-50 w-[80%] max-w-sm">
          <div className="flex items-center gap-2 rounded-2xl px-4 py-2 backdrop-blur-md"
            style={{ background: 'rgba(12,10,9,0.85)', border: '1.5px solid rgba(239,68,68,0.4)' }}>
            <span className="text-red-500">🥷</span>
            <input
              ref={inputRef}
              type="text" value={userInput} onChange={handleInput}
              disabled={gameOver}
              autoFocus autoComplete="off" autoCorrect="off" spellCheck="false"
              placeholder={activeTarget ? `Type: "${activeTarget.word}"` : 'Get ready...'}
              className="flex-1 bg-transparent text-red-300 text-xl font-mono font-bold focus:outline-none placeholder:text-slate-700 caret-red-400"
            />
          </div>
        </div>

        {/* ── Game over ── */}
        <AnimatePresence>
          {gameOver && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 z-[200] flex flex-col items-center justify-center"
              style={{ background: 'rgba(12,10,9,0.92)', backdropFilter: 'blur(16px)' }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}
                className="text-8xl mb-4">🥷</motion.div>
              <h1 className="text-6xl font-black text-red-400" style={{ textShadow: '0 0 30px rgba(239,68,68,0.7)' }}>Mission Failed</h1>
              <p className="text-white/60 mt-3 font-mono text-xl">Score: <span className="text-orange-400 font-black">{score.toLocaleString()}</span></p>
              <p className="text-slate-500 text-sm mt-1">{distance * 3}m covered</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
