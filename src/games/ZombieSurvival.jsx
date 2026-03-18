/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { generateRandomWords } from '../utils/generateText';
import { Shield, Target, Clock, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ZombieSurvival = ({ onGameOver }) => {
  const [zombies, setZombies] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const gameLoopRef = useRef(null);
  
  const distanceMax = 100;

  useEffect(() => {
    // Spawn zombie logic
    const spawner = setInterval(() => {
       const word = generateRandomWords(1).split(' ')[0];
       setZombies(prev => [...prev, { id: Date.now(), word, distance: distanceMax }]);
    }, 2500); // spawn every 2.5s

    // Distance update loop
    gameLoopRef.current = setInterval(() => {
       setZombies(prev => {
         const nextZombies = prev.map(z => ({ ...z, distance: z.distance - 2 })); // reduce distance
         
         const encroached = nextZombies.filter(z => z.distance <= 0);
         if (encroached.length > 0) {
           setLives(l => {
             const newL = l - encroached.length;
             if (newL <= 0) setTimeout(() => onGameOver(score), 0);
             return newL;
           });
         }
         return nextZombies.filter(z => z.distance > 0); // Keep only those not at base
       });
    }, 100); // 10 ticks per sec

    return () => { clearInterval(spawner); clearInterval(gameLoopRef.current); };
  }, [score, onGameOver]); // Need refs or omit score for stability

  // Typing logic
  useEffect(() => {
     const handler = (e) => {
        if (e.key.length !== 1 && e.key !== 'Backspace') return;
        
        let newStr = currentInput;
        if (e.key === 'Backspace') newStr = newStr.slice(0, -1);
        else newStr += e.key;

        setCurrentInput(newStr);

        // Check for kill
        const killedIdx = zombies.findIndex(z => z.word === newStr.trim().toLowerCase());
        if (killedIdx > -1) {
           setZombies(prev => prev.filter((_, idx) => idx !== killedIdx));
           setScore(prev => prev + newStr.length * 10);
           setCurrentInput('');
        }
     };

     document.addEventListener('keydown', handler);
     return () => document.removeEventListener('keydown', handler);
  }, [currentInput, zombies]);

  return (
    <div className="w-full h-full min-h-[500px] bg-slate-900 rounded-3xl overflow-hidden relative border border-slate-700 p-8 flex flex-col">
       <div className="flex justify-between items-center mb-8 bg-slate-800/80 p-4 rounded-xl backdrop-blur-md">
         <div className="text-red-500 font-bold flex gap-2">
            {[...Array(3)].map((_, i) => (
              <Shield key={i} size={24} fill={i < lives ? "currentColor" : "none"} opacity={i < lives ? 1 : 0.3} />
            ))}
         </div>
         <div className="text-2xl font-black text-green-400">Score: {score}</div>
       </div>

       {/* Zombie field */}
       <div className="flex-1 relative border-l-4 border-l-green-500/50 pl-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMGYxNzJhIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMzM0MTU1IiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMSI+PC9wYXRoPgo8L3N2Zz4=')]">
          {/* Base representation */}
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)] z-10"></div>
          
          <AnimatePresence>
            {zombies.map(zomb => (
               <motion.div
                 key={zomb.id}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0, left: `${Math.max(5, zomb.distance)}%` }}
                 exit={{ opacity: 0, scale: 1.2, filter: "brightness(2)" }}
                 className="absolute top-1/2 -translate-y-1/2 transform rounded-lg bg-red-900/50 border border-red-500 p-2 text-white font-mono font-bold whitespace-nowrap"
                 style={{ 
                   marginTop: `${(zomb.id % 40) - 20}vh` // Randomize Y spread
                 }}
               >
                 <span className="mr-2 text-2xl">🧟</span>
                 {zomb.word.split('').map((char, idx) => (
                   <span key={idx} className={idx < currentInput.length && zomb.word.startsWith(currentInput) ? "text-green-400" : ""}>
                     {char}
                   </span>
                 ))}
               </motion.div>
            ))}
          </AnimatePresence>
       </div>

       <div className="mt-8 mx-auto w-1/2">
         <div className="bg-slate-800 p-4 rounded-2xl flex items-center justify-center font-mono text-2xl h-16 border-2 border-slate-600 outline-none text-white text-center shadow-inner tracking-widest">
           {currentInput}
           <span className="w-4 h-6 bg-primary ml-1 animate-pulse inline-block"></span>
         </div>
       </div>
    </div>
  );
};
