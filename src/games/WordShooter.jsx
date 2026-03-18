/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { generateRandomWords } from '../utils/generateText';
import { Crosshair, Target, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const WordShooter = ({ onGameOver }) => {
  const [targets, setTargets] = useState([]);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [activeInput, setActiveInput] = useState('');
  const [activeTargetId, setActiveTargetId] = useState(null);
  
  const timerRef = useRef(null);
  const maxMisses = 10;

  useEffect(() => {
    // Spawn targets
    timerRef.current = setInterval(() => {
      const word = generateRandomWords(1).split(' ')[0];
      const x = Math.random() * 80 + 10; // 10% to 90%
      const y = Math.random() * 60 + 10; // 10% to 70%
      
      setTargets(prev => [...prev, { id: Date.now(), word, x, y, life: 100 }]);
    }, 2000);

    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    // Decrease target life
    const lifeTimer = setInterval(() => {
       setTargets(prev => {
         const next = prev.map(t => ({ ...t, life: t.life - 2 }));
         const dead = next.filter(t => t.life <= 0);
         
         if (dead.length > 0) {
            setMisses(m => {
               const newM = m + dead.length;
               if (newM >= maxMisses) setTimeout(() => onGameOver(score), 0);
               return newM;
            });
            // if we miss our active target, clear it
            if (activeTargetId && dead.some(d => d.id === activeTargetId)) {
               setActiveTargetId(null);
               setActiveInput('');
            }
         }
         
         return next.filter(t => t.life > 0);
       });
    }, 100);

    return () => clearInterval(lifeTimer);
  }, [score, onGameOver, activeTargetId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.length !== 1 && e.key !== 'Backspace') return;
      
      const char = e.key.toLowerCase();
      
      if (char === 'backspace') {
        setActiveInput(prev => prev.slice(0, -1));
        return;
      }
      
      if (activeTargetId) {
        const tgt = targets.find(t => t.id === activeTargetId);
        if (tgt) {
          const expected = tgt.word[activeInput.length];
          if (char === expected?.toLowerCase()) {
             const newInput = activeInput + char;
             setActiveInput(newInput);
             if (newInput === tgt.word) {
               // Destroyed!
               setTargets(prev => prev.filter(t => t.id !== activeTargetId));
               setActiveTargetId(null);
               setActiveInput('');
               setScore(s => s + tgt.word.length * 20);
             }
          } else {
             // Miss penalty
             setScore(s => Math.max(0, s - 5));
          }
        } else {
          setActiveTargetId(null);
          setActiveInput('');
        }
      } else {
        const potential = targets.find(t => t.word.toLowerCase().startsWith(char));
        if (potential) {
          setActiveTargetId(potential.id);
          setActiveInput(char);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [targets, activeInput, activeTargetId]);

  return (
    <div className="w-full h-full min-h-[500px] bg-slate-900 rounded-3xl overflow-hidden relative border border-slate-700 flex flex-col cursor-crosshair select-none">
       {/* UI HUD */}
       <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10 pointer-events-none">
          <div className="glass-panel px-4 py-2 rounded-xl border border-slate-700">
             <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2"><Target size={16}/> Score</div>
             <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">{score}</div>
          </div>
          <div className="glass-panel px-4 py-2 rounded-xl border border-slate-700 text-right">
             <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Misses Allowed</div>
             <div className="text-3xl font-black text-red-500">{maxMisses - misses}</div>
          </div>
       </div>

       {/* Viewport */}
       <div className="flex-1 relative overflow-hidden bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDIwTDQwIDIwTTEyIDBMMTIgNDAiIHN0cm9rZT0iIzMzNDE1NSIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjE1Ij48L3BhdGg+Cjwvc3ZnPg==')]">
          
          <AnimatePresence>
             {targets.map(tgt => {
                const isTargeted = activeTargetId === tgt.id;
                const typedPart = isTargeted ? activeInput : '';
                const remainingPart = tgt.word.substring(typedPart.length);

                return (
                  <motion.div
                    key={tgt.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0, filter: "brightness(2)" }}
                    className={`absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2`}
                    style={{ left: `${tgt.x}%`, top: `${tgt.y}%` }}
                  >
                     <div className={`relative flex items-center justify-center w-24 h-24 rounded-full border-2 transition-colors ${
                        isTargeted ? 'border-red-500 bg-red-500/10' : 'border-blue-500/50 bg-blue-500/5'
                     }`}>
                        <Crosshair className={`absolute opacity-20 w-full h-full ${isTargeted ? 'text-red-500 animate-spin-slow' : 'text-blue-500'}`} />
                        
                        {/* Word string */}
                        <div className="z-10 bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-700 font-mono font-bold text-lg whitespace-nowrap shadow-xl">
                           <span className="text-red-400">{typedPart}</span>
                           <span className="text-white">{remainingPart}</span>
                        </div>
                     </div>
                     {/* Circular health bar around target */}
                     <svg className="absolute w-[110px] h-[110px] transform -rotate-90 pointer-events-none">
                        <circle cx="55" cy="55" r="50" stroke="currentColor" strokeWidth="4" fill="transparent" 
                           className="text-slate-800" />
                        <circle cx="55" cy="55" r="50" stroke="currentColor" strokeWidth="4" fill="transparent" 
                           strokeDasharray={314} strokeDashoffset={314 - (314 * tgt.life) / 100}
                           className={`${tgt.life > 50 ? 'text-green-500' : tgt.life > 25 ? 'text-yellow-500' : 'text-red-500'} transition-all duration-100`} />
                     </svg>
                  </motion.div>
                )
             })}
          </AnimatePresence>

       </div>
    </div>
  );
};
