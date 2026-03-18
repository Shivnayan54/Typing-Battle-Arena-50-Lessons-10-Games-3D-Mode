/* eslint-disable */
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { generateRandomWords } from '../utils/generateText';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';

// ─── Word generator ───────────────────────────────────────────────────────────
const WORD_POOL = "the way out over into your just time make some good only come back well think year look work people other more than then now give day most also new want any these back after use how our first even because two when know can like take get them see who that from will which what would there their".split(' ').filter(w => w.length >= 3 && w.length <= 7);
const randWord = () => WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)];
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// ─── Platform generator ──────────────────────────────────────────────────────
const getGap = (alt) => Math.min(260, 145 + Math.floor(alt / 40) * 5);
const getMinLen = (alt) => Math.min(8, 3 + Math.floor(alt / 100));
const getMaxLen = (alt) => Math.min(13, 6 + Math.floor(alt / 100));

const makePlatform = (id, y, alt = 0) => {
  const min = getMinLen(alt);
  const max = getMaxLen(alt);
  const words = generateRandomWords(15).split(' ').filter(w => w.length >= min && w.length <= max);
  return {
    id, y,
    word: words[Math.floor(Math.random() * words.length)] || 'jump',
    x: clamp(13 + Math.random() * 74, 12, 80),
    w: Math.max(120, 160 + Math.floor(Math.random() * 70) - Math.floor(alt / 50) * 4), // Platforms shrink slightly
  };
};

// ─── Character SVG ───────────────────────────────────────────────────────────
const Panda = ({ jumping, landing, scaleX = 1 }) => {
  const bodyScaleY = landing ? 0.75 : jumping ? 1.15 : 1;
  const bodyScaleX = landing ? 1.25 : jumping ? 0.88 : 1;

  return (
    <svg
      width="58" height="76"
      viewBox="0 0 58 76"
      style={{ transform: `scaleX(${scaleX})`, filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.4))' }}
    >
      {/* Shadow */}
      <ellipse cx="29" cy="74" rx="13" ry="3.5" fill="rgba(0,0,0,0.25)" />

      {/* Tail */}
      <path d="M16 58 Q2 66 6 74 Q11 66 20 62Z" fill="#b83c0c"/>
      <path d="M16 58 Q3 62 5 70 Q9 63 20 60Z" fill="#fff0e8" opacity="0.5"/>

      {/* Body */}
      <g style={{ transform: `scaleX(${bodyScaleX}) scaleY(${bodyScaleY})`, transformOrigin: '29px 58px', transition: 'transform 0.1s' }}>
        <ellipse cx="29" cy="53" rx="15" ry="18" fill="#d4521a"/>
        <ellipse cx="29" cy="56" rx="9" ry="13" fill="#fff8f0"/>
        {/* Belt stripe */}
        <rect x="16" y="50" width="26" height="4" rx="2" fill="#b83c0c" opacity="0.4"/>
      </g>

      {/* Left arm - swings during jump */}
      <motion.g
        animate={jumping ? { rotate: -65 } : landing ? { rotate: 30 } : { rotate: [-18, 18, -18] }}
        transition={jumping || landing ? { duration: 0.18, ease: 'easeOut' } : { duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: '16px', originY: '44px' }}
      >
        <rect x="9" y="44" width="8" height="22" rx="4" fill="#d4521a"/>
        <ellipse cx="13" cy="67" rx="5.5" ry="4.5" fill="#c2440f"/>
      </motion.g>

      {/* Right arm */}
      <motion.g
        animate={jumping ? { rotate: 65 } : landing ? { rotate: -30 } : { rotate: [18, -18, 18] }}
        transition={jumping || landing ? { duration: 0.18, ease: 'easeOut' } : { duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: '42px', originY: '44px' }}
      >
        <rect x="41" y="44" width="8" height="22" rx="4" fill="#d4521a"/>
        <ellipse cx="45" cy="67" rx="5.5" ry="4.5" fill="#c2440f"/>
      </motion.g>

      {/* Legs */}
      <motion.g animate={jumping ? { y: -10, rotate: 15 } : landing ? { y: 2 } : { y: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }}>
        <rect x="18" y="65" width="9" height="11" rx="4.5" fill="#c2440f"/>
        <rect x="31" y="65" width="9" height="11" rx="4.5" fill="#c2440f"/>
        <ellipse cx="22.5" cy="76" rx="7" ry="4.5" fill="#8B4513"/>
        <ellipse cx="35.5" cy="76" rx="7" ry="4.5" fill="#8B4513"/>
      </motion.g>

      {/* Head (squashes on land) */}
      <g style={{ transform: `scaleY(${landing ? 0.88 : jumping ? 1.1 : 1})`, transformOrigin: '29px 24px', transition: 'transform 0.12s' }}>
        {/* Ears */}
        <ellipse cx="13" cy="9" rx="7" ry="8" fill="#d4521a"/>
        <ellipse cx="45" cy="9" rx="7" ry="8" fill="#d4521a"/>
        <ellipse cx="13" cy="9" rx="4" ry="5" fill="#ff8c42" opacity="0.65"/>
        <ellipse cx="45" cy="9" rx="4" ry="5" fill="#ff8c42" opacity="0.65"/>

        <ellipse cx="29" cy="24" rx="19" ry="18" fill="#d4521a"/>
        {/* Eye patches */}
        <ellipse cx="19.5" cy="20" rx="7.5" ry="6" fill="#7a2f00" opacity="0.45"/>
        <ellipse cx="38.5" cy="20" rx="7.5" ry="6" fill="#7a2f00" opacity="0.45"/>
        {/* White face */}
        <ellipse cx="29" cy="27" rx="13" ry="11" fill="#fff8f0"/>
        {/* Eyes */}
        <circle cx="20" cy="22" r="4" fill="white"/>
        <circle cx="38" cy="22" r="4" fill="white"/>
        <circle cx="21.2" cy="23" r="2.4" fill="#111"/>
        <circle cx="39.2" cy="23" r="2.4" fill="#111"/>
        <circle cx="22" cy="22" r="0.9" fill="white"/>
        <circle cx="40" cy="22" r="0.9" fill="white"/>
        {/* Mouth */}
        {jumping
          ? <ellipse cx="29" cy="32" rx="4" ry="3.5" fill="#7a2f00"/>
          : <path d="M24 32 Q29 36 34 32" stroke="#7a2f00" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        }
        {/* Nose */}
        <ellipse cx="29" cy="28" rx="4" ry="3" fill="#111"/>

        {/* Aviator goggles band */}
        <rect x="10" y="14" width="38" height="6" rx="3" fill="#4a2200"/>
        {/* Goggle lenses */}
        <ellipse cx="20" cy="18" rx="6" ry="5.5" fill="#bae6fd" opacity="0.85" stroke="#334155" strokeWidth="1.2"/>
        <ellipse cx="38" cy="18" rx="6" ry="5.5" fill="#bae6fd" opacity="0.85" stroke="#334155" strokeWidth="1.2"/>
        {/* Googgle shine */}
        <ellipse cx="18" cy="16" rx="2" ry="1.5" fill="white" opacity="0.6"/>
        <ellipse cx="36" cy="16" rx="2" ry="1.5" fill="white" opacity="0.6"/>
        <line x1="26" y1="18" x2="32" y2="18" stroke="#4a2200" strokeWidth="1.8"/>
      </g>
    </svg>
  );
};

// ─── Log Platform ─────────────────────────────────────────────────────────────
const LogPlatform = ({ width, isTarget, typed, total, wobble }) => {
  const pct = total > 0 ? clamp(typed / total, 0, 1) : 0;

  return (
    <motion.div
      animate={wobble ? { y: [0, -6, 3, -2, 0] } : {}}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ width }}
    >
      <svg width={width} height={36} viewBox={`0 0 ${width} 36`}>
        {/* Drop shadow */}
        <ellipse cx={width / 2} cy={33} rx={width / 2 - 4} ry={5} fill="black" opacity="0.18"/>

        {/* Main log */}
        <rect x="0" y="2" width={width} height="22" rx="8" fill="#6b3d14"/>

        {/* Wood grain highlight (top) */}
        <rect x="4" y="4" width={width - 8} height="7" rx="5" fill="#8b5523" opacity="0.75"/>

        {/* Grain lines */}
        {Array.from({ length: Math.floor(width / 28) }).map((_, i) => (
          <ellipse key={i} cx={18 + i * 28} cy="13" rx="3" ry="8" fill="#5a3010" opacity="0.2"/>
        ))}

        {/* Bark ridges */}
        {[0.2, 0.45, 0.7].map((f, i) => (
          <rect key={i} x={f * width} y="3" width="3" height="21" rx="1.5" fill="#4a2200" opacity="0.18"/>
        ))}

        {/* Bottom edge bark */}
        <rect x="0" y="20" width={width} height="4" rx="0" fill="#4a2200" opacity="0.3"/>

        {/* Moss / texture on sides */}
        <rect x="0" y="2" width="6" height="22" rx="4" fill="#5c7a2e" opacity="0.25"/>
        <rect x={width - 6} y="2" width="6" height="22" rx="4" fill="#5c7a2e" opacity="0.25"/>

        {/* Progress bar */}
        {isTarget && pct > 0 && (
          <rect x="4" y="20" width={(width - 8) * pct} height="4" rx="2" fill="#22c55e" opacity="0.85"/>
        )}

        {/* Target glow border */}
        {isTarget && (
          <>
            <rect x="0" y="2" width={width} height="22" rx="8" fill="none" stroke="#4ade80" strokeWidth="2.5" opacity="0.8"/>
            <rect x="0" y="2" width={width} height="22" rx="8" fill="none" stroke="#86efac" strokeWidth="6" opacity="0.15"/>
          </>
        )}
      </svg>
    </motion.div>
  );
};

// ─── Ambient particles (leaves, fireflies, petals) ───────────────────────────
const LEAF_EMOJI = ['🍃', '🍂', '🍁', '🌿', '🌱'];
const usedLeafIds = new Set();
const AmbientParticles = ({ cameraOffset }) => {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const timer = setInterval(() => {
      const id = Date.now() + Math.random();
      const emoji = LEAF_EMOJI[Math.floor(Math.random() * LEAF_EMOJI.length)];
      setParticles(p => [...p.slice(-18), { id, emoji, x: Math.random() * 100, delay: 0 }]);
    }, 700);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute text-xl select-none"
          initial={{ x: `${p.x}vw`, y: -30, opacity: 0.8, rotate: 0 }}
          animate={{ x: `${p.x + (Math.random() - 0.5) * 20}vw`, y: '110%', opacity: 0, rotate: (Math.random() - 0.5) * 540 }}
          transition={{ duration: 4 + Math.random() * 3, ease: 'linear' }}
          onAnimationComplete={() => setParticles(prev => prev.filter(l => l.id !== p.id))}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
};

// ─── Landing burst ────────────────────────────────────────────────────────────
const LandBurst = ({ x, y, visible }) => {
  if (!visible) return null;
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const dist = 30 + Math.random() * 30;
        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-green-400 pointer-events-none"
            style={{ left: x, top: y }}
            initial={{ scale: 1, opacity: 1, x: 0, y: 0 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              scale: 0,
              opacity: 0,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        );
      })}
      <motion.div
        className="absolute rounded-full bg-green-300 pointer-events-none"
        style={{ left: x - 25, top: y - 25, width: 50, height: 50 }}
        initial={{ scale: 0, opacity: 0.6 }}
        animate={{ scale: 2.5, opacity: 0 }}
        transition={{ duration: 0.4 }}
      />
    </>
  );
};

// ─── Dynamic sky gradient based on altitude ──────────────────────────────────
const getSkyGradient = (altitude) => {
  if (altitude < 400) return 'linear-gradient(to bottom, #87ceeb 0%, #b5e8ff 60%, #c8f5c0 100%)';
  if (altitude < 900) return 'linear-gradient(to bottom, #6bb8e8 0%, #96d8f0 60%, #aaeaa0 100%)';
  if (altitude < 1600) return 'linear-gradient(to bottom, #4a8fc4 0%, #78b8e0 60%, #90d890 100%)';
  return 'linear-gradient(to bottom, #2a5090 0%, #5080b8 60%, #6ab06a 100%)';
};

// ────────────────────────────────────────────────────────────────────────────
const INIT_PLATFORM_COUNT = 22;

function initPlatforms() {
  const plats = [{ id: 0, y: 100, word: '', x: 50, w: 240 }];
  for (let i = 1; i < INIT_PLATFORM_COUNT; i++) {
    const prevY = plats[i - 1].y;
    plats.push(makePlatform(i, prevY + getGap(i * 10), i * 10));
  }
  return plats;
}

export const TreeJumper = ({ onGameOver }) => {
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameTime, setGameTime] = useState(90);
  const [gameOver, setGameOver] = useState(false);
  const [platforms, setPlatforms] = useState(() => initPlatforms());
  const [playerIdx, setPlayerIdx] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isJumping, setIsJumping] = useState(false);
  const [isLanding, setIsLanding] = useState(false);
  const [shake, setShake] = useState(false);
  const [wobblePlatId, setWobblePlatId] = useState(null);
  const [burstPos, setBurstPos] = useState(null);
  const [facingRight, setFacingRight] = useState(true);
  const [altitude, setAltitude] = useState(0);

  const inputRef = useRef(null);
  const nextId = useRef(INIT_PLATFORM_COUNT);
  const gameOverRef = useRef(false);

  // ─── Timer ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (gameOver) return;
    if (gameTime <= 0 || lives <= 0) {
      gameOverRef.current = true;
      setGameOver(true);
      setTimeout(() => onGameOver(score), 1800);
      return;
    }
    const t = setInterval(() => setGameTime(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [gameTime, lives, gameOver, score, onGameOver]);

  // ─── Input handler ────────────────────────────────────────────────────────
  const handleInput = useCallback((e) => {
    if (isJumping || gameOver) return;
    const val = e.target.value.toLowerCase().replace(/[^a-z]/g, '');

    const target = platforms[playerIdx + 1];
    if (!target?.word) return;

    // Wrong char
    if (val.length > 0 && target.word[val.length - 1] !== val[val.length - 1]) {
      setShake(true);
      setLives(p => Math.max(0, p - 1));
      setCombo(0);
      setUserInput('');
      setTimeout(() => setShake(false), 500);
      return;
    }

    setUserInput(val);

    // Word complete → jump
    if (val === target.word) {
      const currentPlat = platforms[playerIdx];
      const nextPlat = target;
      const goRight = nextPlat.x > currentPlat.x;
      setFacingRight(goRight);

      setIsJumping(true);
      setUserInput('');

      setTimeout(() => {
        const newIdx = playerIdx + 1;
        setPlayerIdx(newIdx);
        const pts = target.word.length * 10 * Math.max(1, combo + 1);
        setScore(p => p + pts);
        setCombo(p => p + 1);
        setAltitude(p => p + target.word.length * 4);

        setIsJumping(false);
        setIsLanding(true);
        setWobblePlatId(target.id);

        // Burst effect at landing position (approximate)
        setBurstPos({ x: (target.x / 100) * 600, y: 200 });
        setTimeout(() => setBurstPos(null), 600);
        setTimeout(() => setIsLanding(false), 350);
        setTimeout(() => setWobblePlatId(null), 500);

        // Extend track
        setPlatforms(prev => {
          const last = prev[prev.length - 1];
          return [...prev, makePlatform(nextId.current++, last.y + getGap(altitude), altitude)];
        });

        if (inputRef.current) inputRef.current.focus();
      }, 380);
    }
  }, [isJumping, gameOver, platforms, playerIdx, combo]);

  // ─── Camera ──────────────────────────────────────────────────────────────
  // Keep current platform 200px above the bottom → world scrolls up as player climbs
  // platforms are positioned with `bottom: plat.y`, so translating world by -(plat.y - 200)
  // pins that platform 200px from the bottom of the visible area (≈60% from top in 500px viewport)
  const currentPlat = platforms[playerIdx];
  const cameraY = currentPlat ? (currentPlat.y - 180) : 0;

  // ─── Sky color based on altitude ─────────────────────────────────────────
  const skyGradient = getSkyGradient(altitude);

  // ─── Static backgrounds (memoized) ───────────────────────────────────────
  const farTrees = useMemo(() => Array.from({ length: 16 }, (_, i) => ({
    id: i, x: i * 6.5, h: 60 + Math.sin(i * 1.7) * 24, w: 10 + Math.sin(i * 2.3) * 4,
  })), []);
  const midTrees = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    id: i, x: i * 8.5 + 2, h: 90 + Math.sin(i * 1.3) * 30, w: 14 + i % 3 * 3,
  })), []);
  const clouds = useRef(Array.from({ length: 8 }, (_, i) => ({
    id: i, x: 5 + i * 13, y: 80 + i * 210, scale: 0.7 + (i % 3) * 0.3, opacity: 0.35 + (i % 4) * 0.1,
  })));

  // ─── Timer color ─────────────────────────────────────────────────────────
  const timerColor = gameTime > 30 ? '#4ade80' : gameTime > 15 ? '#facc15' : '#ef4444';

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div
      className="w-full h-full min-h-[600px] rounded-3xl overflow-hidden relative select-none flex flex-col"
      style={{ background: skyGradient, transition: 'background 1.5s ease' }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* ── Ambient leaf particles ── */}
      <AmbientParticles />

      {/* ── Static sky elements ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Sun with glow */}
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-8 right-16 w-20 h-20 rounded-full"
          style={{ background: 'radial-gradient(circle, #fffde7 30%, #fde68a 70%)', boxShadow: '0 0 60px 20px rgba(253,230,138,0.55)' }}
        />

        {/* Sunbeams */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.06, 0.15, 0.06], rotate: [i * 45, i * 45 + 2, i * 45] }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity }}
            className="absolute origin-top-right"
            style={{
              top: 18, right: 66, width: 3, height: 250,
              background: 'linear-gradient(to bottom, rgba(253,230,138,0.7), transparent)',
              transform: `rotate(${i * 40}deg)`,
              borderRadius: 3,
            }}
          />
        ))}
      </div>

      {/* ── HUD ── */}
      <div className="relative z-50 flex items-center justify-between px-5 py-2.5 bg-gradient-to-r from-emerald-950/70 to-teal-950/70 backdrop-blur-md border-b border-emerald-700/30 flex-shrink-0">
        {/* Score + combo */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/40">
            <span className="text-emerald-300 font-black text-lg tabular-nums">{score.toLocaleString()}</span>
            <span className="text-emerald-600 text-xs ml-1">PTS</span>
          </div>
          <AnimatePresence>
            {combo > 1 && (
              <motion.div
                key={combo}
                initial={{ scale: 1.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                className="px-2.5 py-0.5 rounded-full text-sm font-black border border-orange-400/70 text-orange-300"
                style={{ background: 'rgba(234,88,12,0.35)' }}
              >
                x{combo} 🔥
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hearts */}
        <div className="flex gap-1.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.span
              key={i}
              animate={i >= lives ? { scale: 0.45, opacity: 0.2, filter: 'grayscale(1)' } : { scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="text-xl"
            >❤️</motion.span>
          ))}
        </div>

        {/* Altitude + timer */}
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-xs font-mono">{altitude}m ↑</span>
          <span className="font-black text-2xl font-mono tabular-nums" style={{ color: timerColor }}>{gameTime}s</span>
        </div>
      </div>

      {/* ── Game World ── */}
      <div className="relative flex-1 overflow-hidden">

        {/* Landing burst effect */}
        {burstPos && <LandBurst x={burstPos.x} y={burstPos.y} visible={true} />}

        {/* ─ Far mountain layer (very slow parallax) ─ */}
        <motion.div
          className="absolute bottom-0 w-full pointer-events-none"
          animate={{ y: cameraY * 0.08 }}
          transition={{ type: 'tween', ease: 'linear', duration: 0 }}
          style={{ height: '38%' }}
        >
          <div className="absolute bottom-0 w-full h-full"
            style={{
              background: 'linear-gradient(to top, #1a6638, transparent)',
              clipPath: 'polygon(0%100%,0%50%,8%22%,18%60%,30%10%,44%55%,57%8%,68%48%,80%14%,92%50%,100%18%,100%100%)',
              opacity: 0.45,
            }}
          />
          <div className="absolute bottom-0 w-full h-3/4"
            style={{
              background: 'linear-gradient(to top, #145c30, transparent)',
              clipPath: 'polygon(0%100%,0%65%,12%30%,24%70%,38%20%,52%65%,65%18%,76%58%,89%22%,100%55%,100%100%)',
              opacity: 0.55,
            }}
          />
        </motion.div>

        {/* ─ Far trees (slow parallax) ─ */}
        <motion.div
          className="absolute bottom-0 w-full h-1/2 pointer-events-none flex items-end"
          animate={{ y: cameraY * 0.12 }}
          transition={{ type: 'tween', ease: 'linear', duration: 0 }}
        >
          {farTrees.map(t => (
            <div key={t.id} className="relative flex-shrink-0" style={{ width: `${t.w / 3}%`, marginLeft: '2.2%' }}>
              {/* Pine tree */}
              <div style={{
                width: 0, height: 0,
                borderLeft: `${t.w * 1.8}px solid transparent`,
                borderRight: `${t.w * 1.8}px solid transparent`,
                borderBottom: `${t.h * 0.6}px solid #2d6a4f`,
              }}/>
              <div style={{
                width: 0, height: 0,
                borderLeft: `${t.w * 1.2}px solid transparent`,
                borderRight: `${t.w * 1.2}px solid transparent`,
                borderBottom: `${t.h * 0.7}px solid #1b4332`,
                marginTop: -t.h * 0.3,
                marginLeft: t.w * 0.6,
              }}/>
              <div style={{ width: t.w * 0.55, height: t.h * 0.25, background: '#5c3317', margin: '0 auto' }}/>
            </div>
          ))}
        </motion.div>

        {/* ─ Clouds (medium parallax) ─ */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ y: cameraY * 0.2 }}
          transition={{ type: 'tween', ease: 'linear', duration: 0 }}
        >
          {clouds.current.map(c => (
            <div key={c.id} className="absolute" style={{ left: `${c.x}%`, bottom: c.y }}>
              <motion.div
                animate={{ x: [0, 12, 0] }}
                transition={{ duration: 8 + c.id * 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transform: `scale(${c.scale})`, opacity: c.opacity }}
              >
                <div className="flex items-end">
                  <div className="w-14 h-8 rounded-full bg-white"/>
                  <div className="w-20 h-12 rounded-full bg-white -ml-4 -mt-3"/>
                  <div className="w-14 h-8 rounded-full bg-white -ml-4"/>
                  <div className="w-10 h-6 rounded-full bg-white/80 -ml-3"/>
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>

        {/* ─ Mid trees (medium parallax) ─ */}
        <motion.div
          className="absolute bottom-0 w-full pointer-events-none"
          animate={{ y: cameraY * 0.3 }}
          transition={{ type: 'tween', ease: 'linear', duration: 0 }}
        >
          {midTrees.map(t => (
            <div key={t.id} className="absolute bottom-0" style={{ left: `${t.x}%` }}>
              {/* Layered pine */}
              <div style={{ width: 0, height: 0, borderLeft: `${t.w * 2.2}px solid transparent`, borderRight: `${t.w * 2.2}px solid transparent`, borderBottom: `${t.h * 0.55}px solid #184d37` }}/>
              <div style={{ width: 0, height: 0, borderLeft: `${t.w * 1.5}px solid transparent`, borderRight: `${t.w * 1.5}px solid transparent`, borderBottom: `${t.h * 0.65}px solid #1e6142`, marginTop: -t.h * 0.35, marginLeft: t.w * 0.7 }}/>
              <div style={{ width: 0, height: 0, borderLeft: `${t.w}px solid transparent`, borderRight: `${t.w}px solid transparent`, borderBottom: `${t.h * 0.55}px solid #155233`, marginTop: -t.h * 0.25, marginLeft: t.w * 1.2 }}/>
              <div style={{ width: t.w * 0.7, height: t.h * 0.22, background: '#4a2800', margin: '0 auto' }}/>
            </div>
          ))}
        </motion.div>

        {/* ─ Tree trunk borders (close parallax, fast) ─ */}
        <motion.div
          className="absolute bottom-0 left-0 w-14 h-full pointer-events-none"
          animate={{ y: cameraY * 0.7 }}
          transition={{ type: 'spring', stiffness: 85, damping: 18 }}
        >
          <div className="w-full h-full bg-gradient-to-r from-[#4a2200] to-[#7c4a20] border-r-4 border-[#3E2723] relative overflow-hidden">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className="absolute w-full opacity-20" style={{ top: i * 36, height: 1, background: '#000' }}/>
            ))}
            {/* Bark bumps */}
            {[60, 160, 280, 420, 540].map((top, i) => (
              <div key={i} className="absolute right-0 w-5 h-10 rounded-l-full bg-[#4a2200] border border-[#3E2723]" style={{ top }}/>
            ))}
            {/* Moss patches */}
            {[100, 250, 380].map((top, i) => (
              <div key={i} className="absolute right-0 w-8 h-5 rounded-l-full bg-[#2d6a4f] opacity-50" style={{ top }}/>
            ))}
          </div>
        </motion.div>
        {/* Far Mountains (Slowest) */}
        <motion.div
          className="absolute inset-0 opacity-40 pointer-events-none"
          animate={{ y: cameraY * 0.15 }}
          transition={{ type: 'spring', stiffness: 40, damping: 25 }}
        >
          <div className="w-full h-full bg-gradient-to-l from-[#4a2200] to-[#7c4a20] border-l-4 border-[#3E2723] relative overflow-hidden">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className="absolute w-full opacity-20" style={{ top: i * 36, height: 1, background: '#000' }}/>
            ))}
            {[80, 200, 350, 480].map((top, i) => (
              <div key={i} className="absolute left-0 w-5 h-10 rounded-r-full bg-[#4a2200] border border-[#3E2723]" style={{ top }}/>
            ))}
            {[140, 310].map((top, i) => (
              <div key={i} className="absolute left-0 w-8 h-5 rounded-r-full bg-[#2d6a4f] opacity-50" style={{ top }}/>
            ))}
          </div>
        </motion.div>

        {/* ─ Ground layer ─ */}
        <div className="absolute bottom-0 left-14 right-14 pointer-events-none" style={{ zIndex: 0 }}>
          <div className="w-full h-24 rounded-t-[60%]" style={{ background: 'linear-gradient(to top, #0d4f1e, #1a7a3c)' }}/>
          <div className="w-full h-14 -mt-6 rounded-t-[40%]" style={{ background: '#155233' }}/>
          {/* Ground flowers */}
          {['🌼', '🌸', '🌺', '🌻'].map((f, i) => (
            <span key={i} className="absolute text-lg" style={{ left: `${10 + i * 23}%`, bottom: 18 }}>{f}</span>
          ))}
        </div>

        {/* ─ Main scrolling game elements ─ */}
        <motion.div
          className="absolute inset-0"
          animate={{ y: cameraY }}
          transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          style={{ willChange: 'transform' }}
        >
          {/* Platforms */}
          {platforms.map((plat, idx) => {
            const isTarget = idx === playerIdx + 1;
            const isPast = idx < playerIdx;
            const typedLen = isTarget ? userInput.length : 0;
            if (isPast && playerIdx - idx > 4) return null; // cull far-past

            return (
              <div
                key={plat.id}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${plat.x}%`,
                  bottom: plat.y,
                  transform: 'translateX(-50%)',
                  opacity: isPast ? 0.3 : 1,
                  zIndex: isTarget ? 20 : 10,
                  filter: isPast ? 'grayscale(0.8)' : 'none',
                  pointerEvents: 'none',
                }}
              >
                {/* Word label */}
                {plat.word && !isPast && (
                  <motion.div
                    animate={isTarget ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className={`mb-1.5 px-3 py-1.5 rounded-xl font-mono font-black text-xl tracking-widest border-2 backdrop-blur-sm shadow-xl ${
                      isTarget
                        ? 'bg-emerald-950/90 border-emerald-400 shadow-[0_0_20px_rgba(74,222,128,0.3)]'
                        : 'bg-slate-900/75 border-slate-600/50 text-slate-400'
                    }`}
                  >
                    {plat.word.split('').map((c, ci) => (
                      <span key={ci} className={
                        ci < typedLen
                          ? 'text-emerald-400 drop-shadow-[0_0_8px_#4ade80]'
                          : ci === typedLen && isTarget
                          ? 'text-white underline decoration-2 decoration-cyan-400'
                          : isTarget ? 'text-orange-200' : 'text-slate-500'
                      }>{c}</span>
                    ))}
                  </motion.div>
                )}

                {/* Log */}
                <LogPlatform
                  width={plat.w}
                  isTarget={isTarget}
                  typed={typedLen}
                  total={plat.word?.length || 1}
                  wobble={wobblePlatId === plat.id}
                />

                {/* Hanging vines */}
                <div className="flex gap-1.5 -mt-0.5 opacity-75">
                  {Array.from({ length: Math.max(3, Math.floor(plat.w / 44)) }).map((_, li) => (
                    <motion.span
                      key={li}
                      animate={{ rotate: [li % 2 === 0 ? -5 : 5, li % 2 === 0 ? 5 : -5, li % 2 === 0 ? -5 : 5] }}
                      transition={{ duration: 2 + li * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ fontSize: 17 }}
                    >🌿</motion.span>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Player character */}
          {currentPlat && (
            <motion.div
              className="absolute z-40 pointer-events-none"
              animate={{
                left: `${currentPlat.x}%`,
                bottom: currentPlat.y + 32,
                y: isJumping ? -115 : 0,
                x: isJumping && platforms[playerIdx + 1]
                  ? `${(platforms[playerIdx + 1].x - currentPlat.x) * 0.4}%`
                  : '0%',
              }}
              transition={{
                left: { type: 'spring', stiffness: 180, damping: 22 },
                bottom: { type: 'spring', stiffness: 160, damping: 20 },
                y: { type: 'spring', stiffness: 140, damping: 14 },
                x: { type: 'spring', stiffness: 110, damping: 14 },
              }}
              style={{ translateX: '-50%' }}
            >
              <motion.div animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}} transition={{ duration: 0.45 }}>
                <Panda jumping={isJumping} landing={isLanding} scaleX={facingRight ? 1 : -1} />
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* ─ Semi-transparent input box ─ */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 w-[88%] max-w-sm">
          <motion.div
            animate={shake ? { x: [-8, 8, -5, 5, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 rounded-2xl px-4 py-2.5 backdrop-blur-md border-2"
            style={{
              background: 'rgba(5, 46, 22, 0.82)',
              borderColor: shake ? '#ef4444' : 'rgba(74, 222, 128, 0.5)',
              boxShadow: shake ? '0 0 20px rgba(239,68,68,0.3)' : '0 0 20px rgba(74,222,128,0.12)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          >
            <span className="text-emerald-500 flex-shrink-0">🐾</span>
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInput}
              disabled={gameOver || gameTime <= 0 || lives <= 0}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              placeholder={`Type: "${platforms[playerIdx + 1]?.word ?? '...'}"`}
              className="flex-1 bg-transparent text-emerald-300 text-xl font-mono font-bold focus:outline-none placeholder:text-emerald-800 caret-emerald-400 min-w-0"
            />
            <span className="text-slate-600 text-xs font-mono flex-shrink-0">↵</span>
          </motion.div>
        </div>

        {/* ─ Game Over ─ */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-[200] flex flex-col items-center justify-center gap-5"
              style={{ background: 'rgba(2, 31, 10, 0.92)', backdropFilter: 'blur(16px)' }}
            >
              <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring' }}
                className="text-8xl"
              >
                {lives > 0 ? '⏳' : '💀'}
              </motion.div>
              <motion.h1
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
                className="text-6xl font-black tracking-tight"
                style={{ color: '#4ade80', textShadow: '0 0 30px rgba(74,222,128,0.6)' }}
              >
                {lives > 0 ? 'Time Up!' : 'Fell Down!'}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-center"
              >
                <p className="text-2xl font-mono text-white/70">
                  Score: <span className="text-yellow-400 font-black">{score.toLocaleString()}</span>
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Height: <span className="text-cyan-400">{altitude}m</span>
                  {combo > 1 && <span className="ml-3">Best Combo: <span className="text-orange-400">x{combo}</span></span>}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
