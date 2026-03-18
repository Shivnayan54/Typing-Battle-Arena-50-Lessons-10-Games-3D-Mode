/* eslint-disable */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateRandomWords } from '../utils/generateText';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Helpers ────────────────────────────────────────────────────────────────
const randBetween = (min, max) => min + Math.random() * (max - min);
const randWord = (lvl = 1) => {
  const min = Math.min(8, 3 + Math.floor(lvl / 3));
  const max = Math.min(14, 6 + Math.floor(lvl / 2));
  const words = generateRandomWords(10).split(' ').filter(w => w.length >= min && w.length <= max);
  return words[Math.floor(Math.random() * words.length)] || 'fire';
};

// ─── Starship SVG ────────────────────────────────────────────────────────────
const ShipSVG = () => (
  <svg width="60" height="70" viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Thruster flames */}
    <ellipse cx="21" cy="62" rx="5" ry="9" fill="#f97316" opacity="0.8">
      <animate attributeName="ry" values="9;14;9" dur="0.2s" repeatCount="indefinite" />
    </ellipse>
    <ellipse cx="39" cy="62" rx="5" ry="9" fill="#f97316" opacity="0.8">
      <animate attributeName="ry" values="9;13;9" dur="0.25s" repeatCount="indefinite" />
    </ellipse>
    <ellipse cx="30" cy="66" rx="4" ry="12" fill="#fbbf24" opacity="0.6">
      <animate attributeName="ry" values="12;18;12" dur="0.15s" repeatCount="indefinite" />
    </ellipse>
    {/* Hull */}
    <path d="M30 2 L48 55 L30 47 L12 55 Z" fill="#0ea5e9" />
    <path d="M30 2 L38 40 L30 47 L22 40 Z" fill="#38bdf8" />
    {/* Wings */}
    <path d="M12 55 L2 68 L18 58Z" fill="#0369a1" />
    <path d="M48 55 L58 68 L42 58Z" fill="#0369a1" />
    {/* Cockpit */}
    <ellipse cx="30" cy="28" rx="7" ry="10" fill="#7dd3fc" opacity="0.9" />
    <ellipse cx="30" cy="28" rx="4" ry="7" fill="#e0f2fe" opacity="0.7" />
    {/* Cannons */}
    <rect x="15" y="46" width="4" height="10" rx="2" fill="#64748b" />
    <rect x="41" y="46" width="4" height="10" rx="2" fill="#64748b" />
    {/* Canon glow tips */}
    <circle cx="17" cy="45" r="2.5" fill="#22d3ee">
      <animate attributeName="opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="43" cy="45" r="2.5" fill="#22d3ee">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="0.5s" repeatCount="indefinite" />
    </circle>
  </svg>
);

// ─── Asteroid SVG ──────────────────────────────────────────────────────────
const AsteroidSVG = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <polygon points="20,2 36,10 38,26 28,38 10,36 2,22 8,6" fill="#7c3aed" stroke="#a78bfa" strokeWidth="1.5" />
    <polygon points="18,6 30,12 32,24 22,34 10,30 8,16 16,8" fill="#6d28d9" />
    <circle cx="15" cy="15" r="3" fill="#8b5cf6" opacity="0.6"/>
    <circle cx="25" cy="23" r="2" fill="#a78bfa" opacity="0.5"/>
  </svg>
);

// ─── Main Component ──────────────────────────────────────────────────────────
export const StarshipDefender = ({ onGameOver }) => {
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(5); // 5 health hearts
  const [enemies, setEnemies] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [lasers, setLasers] = useState([]); // active laser beams { id, x, targetX, targetY }
  const [hitEffects, setHitEffects] = useState([]); // explosion circles
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [shipX, setShipX] = useState(50); // % from left
  const [activeTarget, setActiveTarget] = useState(null); // id of enemy being targeted

  const inputRef = useRef(null);
  const gameRef = useRef({ enemies: [], score: 0, health: 5, level: 1, gameOver: false });
  const loopRef = useRef(null);
  const spawnTimerRef = useRef(null);

  // ─── Input Handler ───────────────────────────────────────────────────────
  const handleInput = useCallback((e) => {
    if (gameRef.current.gameOver) return;
    const val = e.target.value.toLowerCase().replace(/[^a-z]/g, '');
    setUserInput(val);

    const currentEnemies = gameRef.current.enemies;

    // Find the best matching enemy (one whose word starts with val)
    const target = val.length > 0 ? currentEnemies.find(en => en.word.startsWith(val)) : null;
    setActiveTarget(target ? target.id : null);
    if (target) setShipX(target.x);

    // Exact match → destroy
    if (val.length > 0) {
      const exactMatch = currentEnemies.find(en => en.word === val);
      if (exactMatch) {
        shootAt(exactMatch);
        setUserInput('');
        setActiveTarget(null);
      }
    }
  }, []);

  // ─── Shoot Laser ────────────────────────────────────────────────────────
  const shootAt = (enemy) => {
    const laserId = Date.now();
    setLasers(prev => [...prev, {
      id: laserId,
      targetId: enemy.id,
      x: enemy.x,
      y: enemy.y,
    }]);

    // Remove enemy + show hit effect after short delay
    setTimeout(() => {
      setEnemies(prev => {
        const found = prev.find(e => e.id === enemy.id);
        if (found) {
          setHitEffects(hx => [...hx, { id: Date.now(), x: found.x, y: found.y }]);
          setScore(s => {
            const ns = s + found.word.length * 10;
            gameRef.current.score = ns;
            return ns;
          });
        }
        const next = prev.filter(e => e.id !== enemy.id);
        gameRef.current.enemies = next;
        return next;
      });
      setLasers(prev => prev.filter(l => l.id !== laserId));
    }, 350);

    // Remove hit effect
    setTimeout(() => {
      setHitEffects(prev => prev.filter(h => h.x !== enemy.x)); // cleanup by x (approximate)
    }, 800);
  };

  // ─── Game Loop: Move enemies ─────────────────────────────────────────────
  useEffect(() => {
    if (gameOver) return;

    loopRef.current = setInterval(() => {
      if (gameRef.current.gameOver) return;

      setEnemies(prev => {
        const speed = 0.15 + gameRef.current.level * 0.05 + Math.min(0.3, gameRef.current.score / 15000);
        const next = prev.map(e => ({ ...e, y: e.y + speed }));

        const survived = [];
        let damage = 0;

        next.forEach(e => {
          if (e.y >= 90) {
            damage++;
          } else {
            survived.push(e);
          }
        });

        if (damage > 0) {
          setHealth(h => {
            const nh = Math.max(0, h - damage);
            gameRef.current.health = nh;
            if (nh <= 0 && !gameRef.current.gameOver) {
              gameRef.current.gameOver = true;
              setGameOver(true);
              setTimeout(() => onGameOver(gameRef.current.score), 2000);
            }
            return nh;
          });
        }

        gameRef.current.enemies = survived;
        return survived;
      });
    }, 50); // 20 fps movement

    return () => clearInterval(loopRef.current);
  }, [gameOver, onGameOver]);

  // ─── Spawn Loop ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (gameOver) return;

    const spawnInterval = Math.max(1200, 3000 - level * 300);
    spawnTimerRef.current = setInterval(() => {
      if (gameRef.current.gameOver) return;
      const word = randWord(gameRef.current.level);
      const newEnemy = {
        id: Date.now() + Math.random(),
        word,
        x: randBetween(8, 88),
        y: 2,
        size: randBetween(32, 48),
      };
      setEnemies(prev => {
        const next = [...prev, newEnemy];
        gameRef.current.enemies = next;
        return next;
      });
    }, spawnInterval);

    return () => clearInterval(spawnTimerRef.current);
  }, [level, gameOver]);

  // ─── Level Up ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (score > 0 && score >= level * 400) {
      setLevel(l => {
        const nl = l + 1;
        gameRef.current.level = nl;
        return nl;
      });
    }
  }, [score, level]);

  // ─── Star field ──────────────────────────────────────────────────────────
  const stars = useRef(
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      delay: Math.random() * 3,
    }))
  );

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div
      className="w-full h-full min-h-[600px] rounded-3xl overflow-hidden relative select-none cursor-text flex flex-col"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #0a0f2e 0%, #020617 100%)' }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* ── Stars ── */}
      {stars.current.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`, top: `${s.top}%`,
            width: s.size, height: s.size,
            opacity: s.opacity,
            animation: `pulse ${2 + s.delay}s ease-in-out infinite`,
          }}
        />
      ))}

      {/* ── Grid lines ── */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Nebula glow ── */}
      <div className="absolute top-[-10%] left-[30%] w-[40%] h-[50%] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }}
      />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[40%] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #0ea5e9 0%, transparent 70%)' }}
      />

      {/* ── HUD: Top Bar ── */}
      <div className="relative z-50 flex items-center justify-between px-6 py-3 border-b border-slate-800/60 bg-slate-950/50 backdrop-blur-md flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="text-cyan-400 font-black text-lg">⚡ LVL {level}</div>
          <div className="h-4 w-px bg-slate-700" />
          <div className="text-white font-black text-xl">{score.toLocaleString()} PTS</div>
        </div>

        {/* Hearts */}
        <div className="flex gap-2 items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ scale: i < health ? 1 : 0.5, opacity: i < health ? 1 : 0.2 }}
              className="text-2xl"
            >
              ❤️
            </motion.div>
          ))}
        </div>

        <div className="text-slate-400 text-sm font-mono uppercase tracking-wider">Starship Defender</div>
      </div>

      {/* ── Game Area ── */}
      <div className="relative flex-1 overflow-hidden">

        {/* ─ Enemies ─ */}
        {enemies.map(en => {
          const isTarget = activeTarget === en.id;
          const pct = userInput.length > 0 && en.word.startsWith(userInput) ? userInput.length : 0;

          return (
            <div
              key={en.id}
              className="absolute flex flex-col items-center gap-1 pointer-events-none"
              style={{ left: `${en.x}%`, top: `${en.y}%`, transform: 'translate(-50%, 0)' }}
            >
              {/* Word label */}
              <div
                className={`
                  px-3 py-1 rounded-lg font-mono font-black text-lg tracking-widest border backdrop-blur-sm
                  ${isTarget
                    ? 'bg-cyan-950/90 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)]'
                    : 'bg-slate-950/80 border-slate-600/60 shadow-lg'
                  }
                `}
              >
                {en.word.split('').map((char, i) => (
                  <span
                    key={i}
                    className={
                      i < pct
                        ? 'text-cyan-300 drop-shadow-[0_0_6px_#22d3ee]'
                        : isTarget
                          ? 'text-orange-300'
                          : 'text-slate-200'
                    }
                  >{char}</span>
                ))}
              </div>

              {/* Asteroid icon */}
              <div className={`${isTarget ? 'drop-shadow-[0_0_12px_#a78bfa]' : ''}`}>
                <AsteroidSVG size={en.size} />
              </div>

              {/* Rotation ring */}
              {isTarget && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  className="absolute top-full mt-1 w-10 h-10 rounded-full border-2 border-dashed border-cyan-400/50"
                />
              )}
            </div>
          );
        })}

        {/* ─ Laser Beams ─ */}
        {lasers.map(laser => (
          <motion.div
            key={laser.id}
            initial={{ opacity: 1, scaleY: 0 }}
            animate={{ opacity: [1, 0.8, 0], scaleY: 1 }}
            transition={{ duration: 0.35, ease: 'easeIn' }}
            className="absolute pointer-events-none"
            style={{
              left: `${laser.x}%`,
              top: `${laser.y}%`,
              bottom: '60px',
              width: '4px',
              marginLeft: '-2px',
              background: 'linear-gradient(to top, #22d3ee, #7c3aed)',
              boxShadow: '0 0 12px #22d3ee, 0 0 30px #7c3aed',
              transformOrigin: 'bottom',
            }}
          />
        ))}

        {/* ─ Hit Explosions ─ */}
        <AnimatePresence>
          {hitEffects.map(hx => (
            <motion.div
              key={hx.id}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute pointer-events-none rounded-full"
              style={{
                left: `${hx.x}%`, top: `${hx.y}%`,
                width: 50, height: 50,
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, #f97316 0%, #ef4444 40%, transparent 70%)',
                filter: 'blur(4px)',
              }}
            />
          ))}
        </AnimatePresence>

        {/* ─ Ship ─ */}
        <motion.div
          animate={{ left: `${shipX}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="absolute bottom-5 pointer-events-none"
          style={{ transform: 'translateX(-50%)' }}
        >
          <motion.div
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="filter drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]"
          >
            <ShipSVG />
          </motion.div>
        </motion.div>

        {/* ─ Typing Input Area ─ */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end pb-4 pointer-events-none">
          <div className="bg-slate-950/80 border border-cyan-500/40 rounded-2xl px-6 py-2 backdrop-blur-md shadow-[0_0_30px_rgba(34,211,238,0.15)] pointer-events-auto">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInput}
              disabled={gameOver}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              placeholder="Type enemy words to blast them..."
              className="bg-transparent text-cyan-300 text-2xl font-mono font-bold text-center w-72 focus:outline-none placeholder:text-slate-600 caret-cyan-400"
            />
          </div>
        </div>

        {/* ─ Game Over Overlay ─ */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-red-950/85 backdrop-blur-xl"
            >
              <motion.h1
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', bounce: 0.4 }}
                className="text-7xl font-black text-red-400 tracking-tight mb-3 uppercase italic drop-shadow-[0_0_30px_red]"
              >
                Ship Destroyed!
              </motion.h1>
              <p className="text-white/70 text-xl font-mono">Final Score: <span className="text-yellow-400 font-black">{score}</span> at Level {level}</p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
