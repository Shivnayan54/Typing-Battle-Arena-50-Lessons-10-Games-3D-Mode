/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { generateRandomWords } from '../utils/generateText';
import { Shield, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SpaceDefender = ({ onGameOver }) => {
  const [asteroids, setAsteroids] = useState([]);
  const [coreHealth, setCoreHealth] = useState(100);
  const [score, setScore] = useState(0);
  
  const [activeInput, setActiveInput] = useState('');
  const [activeTargetId, setActiveTargetId] = useState(null);
  
  const timerRef = useRef(null);
  const loopRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      const word = generateRandomWords(1).split(' ')[0];
      // Asteroids spawn on edges
      const side = Math.floor(Math.random() * 4);
      let x, y;
      if (side === 0) { x = Math.random() * 100; y = -10; } // Top
      else if (side === 1) { x = 110; y = Math.random() * 100; } // Right
      else if (side === 2) { x = Math.random() * 100; y = 110; } // Bottom
      else { x = -10; y = Math.random() * 100; } // Left

      setAsteroids(prev => [...prev, { id: Date.now(), word, x, y, speed: Math.random() * 0.2 + 0.1 }]);
    }, 1500);

    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (coreHealth <= 0) {
       onGameOver(score);
       return;
    }

    loopRef.current = setInterval(() => {
       setAsteroids(prev => {
         const next = prev.map(a => {
            // Move towards center 50,50
            const dx = 50 - a.x;
            const dy = 50 - a.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const moveX = (dx / dist) * a.speed;
            const moveY = (dy / dist) * a.speed;
            return { ...a, x: a.x + moveX, y: a.y + moveY, dist };
         });
         
         const crashed = next.filter(a => a.dist < 5); // hit core radius
         if (crashed.length > 0) {
            setCoreHealth(h => Math.max(0, h - (crashed.length * 15)));
            // Drop target if crashed
            if (activeTargetId && crashed.some(c => c.id === activeTargetId)) {
               setActiveTargetId(null);
               setActiveInput('');
            }
         }
         
         return next.filter(a => a.dist >= 5);
       });
    }, 50);

    return () => clearInterval(loopRef.current);
  }, [coreHealth, score, onGameOver, activeTargetId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.length !== 1 && e.key !== 'Backspace') return;
      
      const char = e.key.toLowerCase();
      
      if (char === 'backspace') {
        setActiveInput(prev => prev.slice(0, -1));
        return;
      }
      
      if (activeTargetId) {
        const tgt = asteroids.find(a => a.id === activeTargetId);
        if (tgt) {
          const expected = tgt.word[activeInput.length];
          if (char === expected?.toLowerCase()) {
             const newInput = activeInput + char;
             setActiveInput(newInput);
             if (newInput === tgt.word) {
               setAsteroids(prev => prev.filter(a => a.id !== activeTargetId));
               setActiveTargetId(null);
               setActiveInput('');
               setScore(s => s + tgt.word.length * 15);
             }
          }
        } else {
          setActiveTargetId(null);
          setActiveInput('');
        }
      } else {
        const potential = asteroids.find(a => a.word.toLowerCase().startsWith(char));
        if (potential) {
          setActiveTargetId(potential.id);
          setActiveInput(char);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [asteroids, activeInput, activeTargetId]);

  return (
    <div className="w-full h-full min-h-[500px] bg-slate-950 rounded-3xl overflow-hidden relative border border-slate-700 select-none">
       {/* UI HUD */}
       <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-20 pointer-events-none">
          <div className="glass-panel px-4 py-2 rounded-xl text-white font-bold text-2xl border-indigo-500/50">Score: {score}</div>
          <div className="flex gap-1 items-center bg-slate-900/80 p-3 rounded-full border border-slate-700">
             <Shield className={coreHealth > 50 ? 'text-blue-400' : 'text-red-500 animate-pulse'} size={24} />
             <div className="w-48 h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700 ml-2">
                <div className={`h-full transition-all ${coreHealth > 50 ? 'bg-blue-500' : 'bg-red-500'}`} style={{width: `${coreHealth}%`}}></div>
             </div>
          </div>
       </div>

       {/* Radial space background */}
       <div className="absolute inset-0 opacity-20" style={{background: 'radial-gradient(circle at center, transparent 0%, #020617 100%), repeating-radial-gradient(circle at center, #334155 0px, transparent 2px, transparent 40px)'}}></div>

       {/* Viewport */}
       <div className="absolute inset-0 overflow-hidden">
          {/* Core */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 border-blue-500 bg-blue-500/10 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.5)] z-10">
             <div className="w-16 h-16 rounded-full bg-blue-400 animate-pulse mix-blend-screen blur-md"></div>
             <Target className="absolute text-blue-300 opacity-50" size={64}/>
          </div>
          
          <AnimatePresence>
             {asteroids.map(ast => {
                const isTargeted = activeTargetId === ast.id;
                const typedPart = isTargeted ? activeInput : '';
                const remainingPart = ast.word.substring(typedPart.length);

                return (
                  <motion.div
                    key={ast.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${ast.x}%`, top: `${ast.y}%` }}
                  >
                    {/* Visual asteroid */}
                    <div className={`w-12 h-12 rounded-lg rotate-45 border-2 flex items-center justify-center shadow-lg ${
                       isTargeted ? 'border-amber-400 bg-amber-400/20' : 'border-slate-500 bg-slate-800'
                    }`}>
                    </div>
                    
                    {/* Label */}
                    <div className="absolute top-14 whitespace-nowrap bg-slate-900/90 px-2 py-1 rounded text-lg font-mono font-bold border border-slate-700">
                       <span className="text-amber-400">{typedPart}</span>
                       <span className="text-white">{remainingPart}</span>
                    </div>

                    {isTargeted && (
                       <svg className="absolute w-64 h-64 pointer-events-none -z-10 opacity-30">
                          {/* Targeting laser to core */}
                          <line x1="50%" y1="50%" x2="50vw" y2="50vh" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                       </svg>
                    )}
                  </motion.div>
                )
             })}
          </AnimatePresence>

       </div>
    </div>
  );
};
