/* eslint-disable */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateRandomWords } from '../utils/generateText';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Word bank ───────────────────────────────────────────────────────────────
const WORDS = "the way out over into your just time make some good only come back well think year look people other more than then now give day also new want any these after use how our first even because two when know can like take get them".split(' ').filter(w => w.length >= 3 && w.length <= 7);
const randWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

// ─── Side-view Spider-Man SVG ────────────────────────────────────────────────
const Spiderman = ({ climbing, jumping, dead, side }) => {
  const flip = side === 'right' ? -1 : 1;
  return (
    <svg
      width="72" height="110"
      viewBox="0 0 72 110"
      style={{ transform: `scaleX(${flip})`, filter: 'drop-shadow(0 8px 20px rgba(220,38,38,0.5)) drop-shadow(0 0 6px rgba(0,0,0,0.8))' }}
    >
      {/* Web trail when climbing */}
      {climbing && (
        <motion.line x1="36" y1="0" x2="36" y2={dead ? 200 : -80}
          stroke="#fff" strokeWidth="2.5" strokeOpacity="0.5"
          strokeDasharray="6 4"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* ── Legs ── */}
      {/* back left leg */}
      <motion.g
        animate={climbing ? { rotate: [0, 30, 0] } : { rotate: 0 }}
        transition={{ duration: 0.4, repeat: climbing ? Infinity : 0 }}
        style={{ originX: '22px', originY: '68px' }}
      >
        <line x1="22" y1="68" x2="8" y2="96" stroke="#1d4ed8" strokeWidth="7" strokeLinecap="round"/>
        <line x1="8" y1="96" x2="3" y2="109" stroke="#1d4ed8" strokeWidth="6" strokeLinecap="round"/>
        <ellipse cx="3" cy="109" rx="4" ry="3" fill="#1e3a8a"/>
      </motion.g>
      {/* back right leg */}
      <motion.g
        animate={climbing ? { rotate: [0, -30, 0] } : { rotate: 0 }}
        transition={{ duration: 0.4, repeat: climbing ? Infinity : 0, delay: 0.2 }}
        style={{ originX: '50px', originY: '68px' }}
      >
        <line x1="50" y1="68" x2="64" y2="96" stroke="#1d4ed8" strokeWidth="7" strokeLinecap="round"/>
        <line x1="64" y1="96" x2="69" y2="109" stroke="#1d4ed8" strokeWidth="6" strokeLinecap="round"/>
        <ellipse cx="69" cy="109" rx="4" ry="3" fill="#1e3a8a"/>
      </motion.g>

      {/* ── Body (legs + torso) ── */}
      {/* Blue shorts / hips */}
      <rect x="22" y="65" width="28" height="20" rx="6" fill="#1d4ed8"/>
      {/* Red torso */}
      <rect x="18" y="38" width="36" height="32" rx="10" fill="#dc2626"/>
      {/* Spider emblem */}
      <g opacity="0.9">
        <ellipse cx="36" cy="53" rx="5" ry="4" fill="#111"/>
        {[-1,1].map(d => (
          <g key={d}>
            <line x1="36" y1="53" x2={36 + d * 12} y2="47" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="36" y1="53" x2={36 + d * 14} y2="54" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="36" y1="53" x2={36 + d * 11} y2="61" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/>
          </g>
        ))}
      </g>
      {/* Blue legs */}
      <rect x="20" y="80" width="13" height="22" rx="6" fill="#1d4ed8"/>
      <rect x="39" y="80" width="13" height="22" rx="6" fill="#1d4ed8"/>
      {/* Red boots */}
      <rect x="18" y="96" width="16" height="13" rx="5" fill="#dc2626"/>
      <rect x="38" y="96" width="16" height="13" rx="5" fill="#dc2626"/>

      {/* ── Arms ── */}
      {/* Left arm – swings when climbing */}
      <motion.g
        animate={jumping
          ? { rotate: -80 }
          : climbing
          ? { rotate: [-50, -10, -50] }
          : { rotate: -30 }
        }
        transition={{ duration: 0.35, repeat: climbing && !jumping ? Infinity : 0 }}
        style={{ originX: '20px', originY: '44px' }}
      >
        <line x1="20" y1="44" x2="4" y2="30" stroke="#dc2626" strokeWidth="9" strokeLinecap="round"/>
        {/* Web hand */}
        <circle cx="4" cy="30" r="5.5" fill="#dc2626"/>
        {jumping && <circle cx="4" cy="30" r="9" fill="white" opacity="0.35"/>}
      </motion.g>
      {/* Right arm – opposite swing */}
      <motion.g
        animate={jumping
          ? { rotate: 80 }
          : climbing
          ? { rotate: [40, 10, 40] }
          : { rotate: 30 }
        }
        transition={{ duration: 0.35, delay: 0.15, repeat: climbing && !jumping ? Infinity : 0 }}
        style={{ originX: '52px', originY: '44px' }}
      >
        <line x1="52" y1="44" x2="68" y2="30" stroke="#dc2626" strokeWidth="9" strokeLinecap="round"/>
        <circle cx="68" cy="30" r="5.5" fill="#dc2626"/>
        {jumping && <circle cx="68" cy="30" r="9" fill="white" opacity="0.35"/>}
      </motion.g>

      {/* ── Head ── */}
      <ellipse cx="36" cy="24" rx="18" ry="20" fill="#dc2626"/>
      {/* Webbing lines */}
      {[0,1,2,3].map(i => (
        <line key={i} x1="36" y1="4"
          x2={36 + Math.cos((i / 4) * Math.PI * 2) * 18}
          y2={24 + Math.sin((i / 4) * Math.PI * 2) * 20}
          stroke="#991b1b" strokeWidth="0.8" opacity="0.5"
        />
      ))}
      <path d="M20 16 Q36 2 52 16" stroke="#991b1b" strokeWidth="0.8" fill="none" opacity="0.5"/>
      <path d="M18 24 Q36 10 54 24" stroke="#991b1b" strokeWidth="0.8" fill="none" opacity="0.5"/>
      {/* Eyes */}
      <path d="M22 20 Q28 14 32 20Z" fill="white" opacity="0.95"/>
      <path d="M40 20 Q46 14 50 20Z" fill="white" opacity="0.95"/>
      {!dead && <path d="M22 20 Q28 15 32 20Z" fill="white"/>}
      {!dead && <path d="M40 20 Q46 15 50 20Z" fill="white"/>}
    </svg>
  );
};

// ─── Web strand ───────────────────────────────────────────────────────────────
const WebStrand = ({ from, to, visible }) => {
  if (!visible) return null;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 1 }}
      animate={{ scaleX: 1, opacity: [1, 0.7, 0] }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        left: from.x,
        top: from.y,
        width: len,
        height: 3,
        background: 'linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.2))',
        boxShadow: '0 0 10px rgba(255,255,255,0.8)',
        transformOrigin: 'left center',
        transform: `rotate(${angle}deg)`,
        borderRadius: 4,
        pointerEvents: 'none',
        zIndex: 50,
      }}
    />
  );
};

// ────────────────────────────────────────────────────────────────────────────
export const HeroClimb = ({ onGameOver }) => {
  const [altitude, setAltitude] = useState(0);
  const maxAltitude = 1000;
  const [targetWord, setTargetWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [fallingSpeed, setFallingSpeed] = useState(0.6);
  const [climbing, setClimbing] = useState(false);
  const [jumping, setJumping] = useState(false);
  const [isDead, setIsDead] = useState(false);
  const [shake, setShake] = useState(false);
  const [side, setSide] = useState('left');
  const [webStrand, setWebStrand] = useState(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [cityLights, setCityLights] = useState([]);
  const [particles, setParticles] = useState([]);

  const inputRef = useRef(null);
  const altRef = useRef(0);
  const deadRef = useRef(false);

  // Static city windows
  const windows = useRef(
    Array.from({ length: 40 }, (_, i) => ({
      id: i, side: i % 2 === 0 ? 'left' : 'right',
      row: Math.floor(i / 6), col: i % 5,
      lit: Math.random() > 0.35,
      color: Math.random() > 0.7 ? '#fde68a' : Math.random() > 0.5 ? '#e0f2fe' : '#fef9c3',
    }))
  );

  const stars = useRef(
    Array.from({ length: 60 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 60,
      size: Math.random() * 1.8 + 0.5, opacity: Math.random() * 0.7 + 0.3,
    }))
  );

  useEffect(() => {
    setTargetWord(randWord());
    if (inputRef.current) inputRef.current.focus();
  }, []);

  // Gravity
  useEffect(() => {
    if (deadRef.current) return;
    const t = setInterval(() => {
      setAltitude(prev => {
        const next = Math.max(0, prev - fallingSpeed);
        altRef.current = next;
        return next;
      });
    }, 100);
    return () => clearInterval(t);
  }, [fallingSpeed]);

  // Win condition
  useEffect(() => {
    if (altitude >= maxAltitude && !isDead) {
      setTimeout(() => onGameOver(score + 5000), 1500);
    }
  }, [altitude, isDead, score, onGameOver]);

  const handleInput = useCallback((e) => {
    if (isDead || jumping || altitude >= maxAltitude) return;
    const val = e.target.value.toLowerCase();

    // Wrong char
    if (val.length > 0 && targetWord[val.length - 1] !== val[val.length - 1]) {
      deadRef.current = true;
      setShake(true);
      setIsDead(true);
      setTimeout(() => onGameOver(score), 2200);
      return;
    }

    setUserInput(val);
    setClimbing(true);
    setTimeout(() => setClimbing(false), 200);

    // Per-letter: small climb
    setAltitude(prev => Math.min(maxAltitude, prev + 2.5));

    // Word complete
    if (val === targetWord) {
      const newSide = side === 'left' ? 'right' : 'left';
      const pts = targetWord.length * 10 * Math.max(1, combo + 1);
      setScore(p => p + pts);
      setCombo(p => p + 1);

      // Web strand animation from current side to next
      setWebStrand({
        id: Date.now(),
        from: { x: side === 'left' ? 220 : 460, y: 220 },
        to: { x: newSide === 'left' ? 220 : 460, y: 200 },
      });
      setTimeout(() => setWebStrand(null), 700);

      // Spawn impact particles
      const px = newSide === 'left' ? 220 : 460;
      const newPs = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i, x: px, y: 220,
        angle: (i / 8) * 360,
      }));
      setParticles(prev => [...prev, ...newPs]);
      setTimeout(() => setParticles(prev => prev.filter(p => !newPs.find(n => n.id === p.id))), 700);

      // Bigger climb on word
      setAltitude(prev => Math.min(maxAltitude, prev + targetWord.length * 18));
      setJumping(true);
      setSide(newSide);

      setTimeout(() => {
        setTargetWord(randWord());
        setUserInput('');
        setJumping(false);
        setFallingSpeed(prev => Math.min(5, prev + 0.12));
        if (inputRef.current) inputRef.current.focus();
      }, 520);
    }
  }, [isDead, jumping, altitude, targetWord, side, combo, score, onGameOver]);

  const pct = (altitude / maxAltitude) * 100;

  return (
    <div
      className="w-full h-full min-h-[600px] rounded-3xl overflow-hidden relative flex select-none"
      style={{ background: 'linear-gradient(to bottom, #020617 0%, #0a0f2e 40%, #0f172a 100%)' }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* ── Stars ── */}
      {stars.current.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, opacity: s.opacity, animation: `pulse ${2 + s.id % 3}s ease-in-out infinite` }}
        />
      ))}

      {/* ── Moon ── */}
      <div className="absolute top-8 right-24 w-16 h-16 rounded-full"
        style={{ background: 'radial-gradient(circle at 35% 35%, #fef9c3, #fde68a)', boxShadow: '0 0 40px 10px rgba(253,230,138,0.3)' }}
      />

      {/* ── City skyline (parallax) ── */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] pointer-events-none opacity-25"
        style={{ transform: `translateX(-50%) translateY(${pct * 0.3}%)` }}
      >
        {[
          { x: 0, w: 55, h: 150 }, { x: 60, w: 70, h: 220 }, { x: 135, w: 45, h: 170 },
          { x: 185, w: 60, h: 260 }, { x: 250, w: 80, h: 200 }, { x: 335, w: 55, h: 180 },
          { x: 395, w: 65, h: 240 }, { x: 465, w: 50, h: 160 }, { x: 520, w: 70, h: 210 },
        ].map((b, i) => (
          <div key={i} className="absolute bottom-0 bg-slate-900 border-t border-slate-700/30"
            style={{ left: b.x, width: b.w, height: b.h }}
          >
            {/* Antenna */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-slate-600"/>
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-500"
              style={{ animation: 'pulse 1.5s ease-in-out infinite' }}/>
          </div>
        ))}
      </div>

      {/* ── Searchlights / atmospheric sweeps ── */}
      {[
        { origin: '20%', duration: 7, color: 'rgba(255,255,255,0.06)', delay: 0 },
        { origin: '75%', duration: 10, color: 'rgba(34,211,238,0.05)', delay: 2 },
        { origin: '45%', duration: 8, color: 'rgba(147,51,234,0.06)', delay: 4 },
      ].map((sl, i) => (
        <motion.div
          key={i}
          animate={{ rotate: [-18, 18, -18], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: sl.duration, repeat: Infinity, ease: 'easeInOut', delay: sl.delay }}
          className="absolute bottom-[-5%] pointer-events-none rounded-full blur-2xl"
          style={{ left: sl.origin, width: 60, height: '110%', background: `linear-gradient(to top, ${sl.color}, transparent)`, transformOrigin: 'bottom center' }}
        />
      ))}

      {/* ── Rain streaks ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ left: `${Math.random() * 100}%`, width: 1.5, height: 40, background: 'linear-gradient(to bottom, transparent, rgba(147,197,253,0.6))' }}
            animate={{ y: ['-5%', '110%'] }}
            transition={{ duration: 0.5 + Math.random() * 0.4, repeat: Infinity, ease: 'linear', delay: Math.random() * 2 }}
          />
        ))}
      </div>

      {/* ── LEFT BUILDING ── */}
      <div
        className="absolute left-0 bottom-0 w-52 overflow-hidden"
        style={{ height: '300%', background: 'linear-gradient(to right, #111827, #1e293b)', borderRight: '8px solid #0f172a', transform: `translateY(${pct}%)`, boxShadow: '4px 0 30px rgba(0,0,0,0.8)' }}
      >
        {/* Building highlight */}
        <div className="absolute right-0 inset-y-0 w-1 bg-gradient-to-b from-slate-600/30 to-transparent"/>
        {/* Windows grid */}
        <div className="absolute inset-4 grid gap-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(18, 1fr)' }}>
          {Array.from({ length: 54 }).map((_, i) => {
            const lit = (i * 37 + 11) % 17 < 10;
            const warm = (i * 13) % 5 < 2;
            return (
              <div key={i} className="rounded-sm relative overflow-hidden"
                style={{
                  background: lit ? (warm ? 'rgba(253,224,71,0.25)' : 'rgba(186,230,253,0.2)') : 'rgba(15,23,42,0.8)',
                  boxShadow: lit ? `0 0 8px ${warm ? 'rgba(253,224,71,0.3)' : 'rgba(186,230,253,0.25)'}` : 'none',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                {lit && <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />}
              </div>
            );
          })}
        </div>
        {/* Edge ledges */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="absolute right-0 h-1 bg-slate-600/40" style={{ top: `${(i + 1) * 12}%`, width: '100%' }}/>
        ))}
      </div>

      {/* ── RIGHT BUILDING ── */}
      <div
        className="absolute right-0 bottom-0 w-52 overflow-hidden"
        style={{ height: '300%', background: 'linear-gradient(to left, #111827, #1e293b)', borderLeft: '8px solid #0f172a', transform: `translateY(${pct}%)`, boxShadow: '-4px 0 30px rgba(0,0,0,0.8)' }}
      >
        <div className="absolute left-0 inset-y-0 w-1 bg-gradient-to-b from-slate-600/30 to-transparent"/>
        <div className="absolute inset-4 grid gap-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(18, 1fr)' }}>
          {Array.from({ length: 54 }).map((_, i) => {
            const lit = (i * 41 + 7) % 13 < 8;
            const warm = (i * 17) % 7 < 3;
            return (
              <div key={i} className="rounded-sm relative overflow-hidden"
                style={{
                  background: lit ? (warm ? 'rgba(253,224,71,0.25)' : 'rgba(186,230,253,0.2)') : 'rgba(15,23,42,0.8)',
                  boxShadow: lit ? `0 0 8px ${warm ? 'rgba(253,224,71,0.3)' : 'rgba(186,230,253,0.25)'}` : 'none',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                {lit && <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />}
              </div>
            );
          })}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="absolute left-0 h-1 bg-slate-600/40" style={{ top: `${(i + 1) * 12}%`, width: '100%' }}/>
        ))}
      </div>

      {/* ── Alleyway ground glow ── */}
      <div className="absolute bottom-0 left-52 right-52 h-24 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(220,38,38,0.15), transparent 80%)' }}
      />

      {/* ── Web strands ── */}
      {webStrand && <WebStrand key={webStrand.id} from={webStrand.from} to={webStrand.to} visible={true} />}

      {/* ── Impact particles ── */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute w-2 h-2 rounded-full bg-white pointer-events-none"
          style={{ left: p.x, top: p.y }}
          initial={{ opacity: 1, x: 0, y: 0 }}
          animate={{ opacity: 0, x: Math.cos(p.angle * Math.PI / 180) * 40, y: Math.sin(p.angle * Math.PI / 180) * 40 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}

      {/* ── SPIDER-MAN CHARACTER ── */}
      <motion.div
        className="absolute z-30 pointer-events-none"
        style={{ bottom: 80 }}
        animate={{
          left: side === 'left' ? 170 : 'calc(100% - 240px)',
          y: isDead ? 500 : jumping ? -160 : climbing ? -20 : [0, 6, 0],
          rotate: isDead ? (side === 'left' ? -360 : 360) : jumping ? (side === 'left' ? -20 : 20) : 0,
        }}
        transition={{
          left: { type: 'spring', stiffness: 130, damping: 16 },
          y: isDead
            ? { duration: 1.8, ease: 'easeIn' }
            : jumping
            ? { type: 'spring', stiffness: 150, damping: 14, duration: 0.5 }
            : climbing
            ? { duration: 0.18 }
            : { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
          rotate: isDead ? { duration: 1.8, ease: 'linear' } : { type: 'spring' },
        }}
      >
        <motion.div animate={shake ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}>
          <Spiderman climbing={climbing} jumping={jumping} dead={isDead} side={side} />
        </motion.div>

        {/* Building sticky glow */}
        <motion.div
          animate={{ opacity: jumping ? 0 : 0.5, scale: climbing ? 1.4 : 1 }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full blur-md bg-red-500/50 pointer-events-none"
        />
      </motion.div>

      {/* ── Typing panel (center) ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3 pointer-events-none">
        {/* Word display */}
        <div className="bg-slate-950/85 border border-red-500/50 rounded-2xl px-8 py-4 backdrop-blur-xl shadow-[0_0_40px_rgba(220,38,38,0.3)]">
          <div className="text-xs font-bold text-red-400 uppercase tracking-widest text-center mb-3">Web Target</div>
          <div className="flex gap-1 justify-center">
            {targetWord.split('').map((char, i) => {
              const isTyped = i < userInput.length;
              const isCurrent = i === userInput.length;
              return (
                <span
                  key={i}
                  className={`text-5xl font-mono font-black transition-all duration-75 ${
                    isTyped
                      ? 'text-red-400 drop-shadow-[0_0_12px_rgba(220,38,38,0.9)]'
                      : isCurrent
                      ? 'text-white border-b-4 border-red-400 animate-pulse'
                      : 'text-slate-600'
                  }`}
                >{char}</span>
              );
            })}
          </div>

          {/* Mini progress bar */}
          <div className="mt-3 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${(userInput.length / Math.max(1, targetWord.length)) * 100}%` }}
              className="h-full bg-red-500 rounded-full shadow-[0_0_8px_red]"
            />
          </div>
        </div>

        {/* Combo badge */}
        <AnimatePresence>
          {combo > 1 && (
            <motion.div
              key={combo}
              initial={{ scale: 1.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-orange-500/80 text-white font-black text-sm px-4 py-1 rounded-full border border-orange-400 pointer-events-none"
            >
              🔥 x{combo} COMBO
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── HUD: left sidebar ── */}
      <div className="absolute left-52 top-0 z-50 flex flex-col">
        {/* Altitude bar */}
        <div className="m-3 w-5 rounded-full overflow-hidden" style={{ height: 200, background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(220,38,38,0.3)' }}>
          <motion.div
            animate={{ height: `${pct}%` }}
            className="w-full rounded-full bg-gradient-to-t from-red-700 to-red-400"
            style={{ position: 'absolute', bottom: 0 }}
          />
        </div>
      </div>

      {/* Speed + score HUD */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
        <div className="bg-slate-950/80 border border-slate-700/60 px-4 py-1.5 rounded-full flex items-center gap-2 backdrop-blur">
          <span className="text-red-500 font-black">🕷</span>
          <span className="text-white font-black text-lg tabular-nums">{Math.floor(altitude)}m</span>
          <span className="text-slate-500 text-xs">/ {maxAltitude}m</span>
        </div>
        <div className="bg-slate-950/80 border border-orange-500/40 px-4 py-1.5 rounded-full backdrop-blur">
          <span className="text-orange-400 font-black text-lg tabular-nums">{score.toLocaleString()}</span>
          <span className="text-slate-500 text-xs ml-1">PTS</span>
        </div>
      </div>

      {/* Fall speed indicator */}
      <div className="absolute top-3 right-3 z-50 flex flex-col items-end gap-1">
        <div className="text-slate-500 text-xs font-mono">GRAVITY</div>
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-2 h-4 mx-0.5 rounded-sm"
              style={{ background: i < Math.ceil(fallingSpeed / 1.5) ? '#ef4444' : '#1e293b' }}
            />
          ))}
        </div>
      </div>

      {/* ── INVISIBLE INPUT ── */}
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInput}
        disabled={isDead || altitude >= maxAltitude}
        className="absolute opacity-0 pointer-events-none w-0 h-0"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
      />

      {/* ── DEATH OVERLAY ── */}
      <AnimatePresence>
        {isDead && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute inset-0 z-[200] flex flex-col items-center justify-center"
            style={{ background: 'radial-gradient(circle at 50% 60%, rgba(127,0,0,0.9), rgba(2,6,23,0.96))', backdropFilter: 'blur(12px)' }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -15 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.9, type: 'spring', bounce: 0.5 }}
            >
              <div className="text-9xl mb-4 text-center">🕷️</div>
            </motion.div>
            <motion.h2
              initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-8xl font-black text-red-500 tracking-widest uppercase italic"
              style={{ textShadow: '0 0 40px rgba(220,38,38,0.8)' }}
            >YOU DIED</motion.h2>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
              className="text-white/60 mt-3 font-mono text-xl"
            >
              One mistake. Fatal fall. Score: <span className="text-orange-400 font-black">{score}</span>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── WIN OVERLAY ── */}
      <AnimatePresence>
        {altitude >= maxAltitude && !isDead && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-sky-900/80 backdrop-blur-xl"
          >
            <div className="text-8xl mb-4">🏆</div>
            <h2 className="text-7xl font-black text-white tracking-tight drop-shadow-[0_0_30px_white]">SUMMIT!</h2>
            <p className="text-sky-300 font-mono mt-2 text-xl">Final Score: <span className="text-yellow-400 font-black">{score.toLocaleString()}</span></p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
