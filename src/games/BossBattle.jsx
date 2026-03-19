/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { generateRandomWords } from '../utils/generateText';
import { Target, Skull, Swords } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BossBattle = ({ onGameOver }) => {
  const [bossHealth, setBossHealth] = useState(100);
  const [playerHealth, setPlayerHealth] = useState(100);
  
  // Stages: 1=Easy, 2=Med, 3=Hard (Boss changes attack speeds and words length)
  const [stage, setStage] = useState(1); 
  const [score, setScore] = useState(0);
  const [totalStrokes, setTotalStrokes] = useState(0);
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState(null);
  
  const [currentAttackId, setCurrentAttackId] = useState(null);
  const [attackWord, setAttackWord] = useState('');
  const [userInput, setUserInput] = useState('');
  
  const [bossShake, setBossShake] = useState(false);
  const [playerShake, setPlayerShake] = useState(false);

  const inputRef = useRef(null);
  const attackTimerRef = useRef(null);

  // Focus
  useEffect(() => { if (inputRef.current) inputRef.current.focus(); }, [currentAttackId]);

  const playerTakeDamage = useCallback(() => {
     setPlayerHealth(h => Math.max(0, h - 15));
     setPlayerShake(true);
     setTimeout(() => setPlayerShake(false), 500);
  }, []);

  // Boss attack loop
  useEffect(() => {
    if (bossHealth <= 0 || playerHealth <= 0) return;

    if (!currentAttackId) {
      // Setup next attack
      const waitTime = Math.random() * 2000 + (3000 / stage); // Boss attacks faster on higher stages
      
      const prepare = setTimeout(() => {
         // Generate an attack word
         const wordLen = stage === 1 ? 2 : stage === 2 ? 4 : 7;
         setAttackWord(generateRandomWords(wordLen));
         setCurrentAttackId(Date.now());
         setUserInput('');
      }, waitTime);
      
      return () => clearTimeout(prepare);
    } else {
      // Countdown for player to type the word
      const timeToDefend = stage === 1 ? 5000 : stage === 2 ? 3500 : 2500;
      
      attackTimerRef.current = setTimeout(() => {
         // If timer runs out before player types word: player takes damage!
         playerTakeDamage();
         setCurrentAttackId(null);
      }, timeToDefend);
      
      return () => clearTimeout(attackTimerRef.current);
    }
  }, [currentAttackId, bossHealth, playerHealth, stage, playerTakeDamage]);

  // Stage progression
  useEffect(() => {
     if (bossHealth <= 66 && stage === 1) setStage(2);
     if (bossHealth <= 33 && stage === 2) setStage(3);
  }, [bossHealth, stage]);

  // End game logic
  useEffect(() => {
    if (playerHealth <= 0 || bossHealth <= 0) {
      const isWin = bossHealth <= 0;
      const finalScore = isWin ? score + 10000 : score;
      
      const duration = startTime ? (Date.now() - startTime) / 60000 : 0.1;
      const wpm = Math.round((totalStrokes / 5) / duration);
      const accuracy = totalStrokes > 0 ? Math.round(((totalStrokes - errors) / totalStrokes) * 100) : 100;

      setTimeout(() => onGameOver({
        score: finalScore,
        wpm,
        accuracy,
        errors,
        totalStrokes
      }), 2000);
    }
  }, [playerHealth, bossHealth, score, onGameOver, startTime, totalStrokes, errors]);

  const bossTakeDamage = () => {
     setBossHealth(h => Math.max(0, h - 8)); // Takes about 13 hits to kill
     setBossShake(true);
     setScore(s => s + 500 * stage);
     setTimeout(() => setBossShake(false), 500);
  };

  const handleInput = (e) => {
     if (!currentAttackId || playerHealth <= 0 || bossHealth <= 0) return;
     
     const val = e.target.value;
     
     // strict matching
     if (val.length > userInput.length) {
       if (!startTime) setStartTime(Date.now());
       setTotalStrokes(s => s + 1);
       if (val[val.length - 1] !== attackWord[val.length - 1]) {
         setErrors(e => e + 1);
         return;
       }
     }
     
     setUserInput(val);
     
     if (val === attackWord) {
        // Player successfully parried and hit the boss
        clearTimeout(attackTimerRef.current);
        bossTakeDamage();
        setCurrentAttackId(null);
     }
  };

  return (
    <div className="w-full h-full min-h-[600px] bg-slate-950 rounded-3xl overflow-hidden relative border-4 border-slate-800 flex flex-col justify-between p-8 font-serif">
       
       {/* Background overlays based on stage */}
       <div className={`absolute inset-0 transition-colors duration-1000 ${
          stage === 1 ? 'bg-slate-950' : 
          stage === 2 ? 'bg-orange-950/20' : 
          'bg-red-950/30'
       }`}></div>

       {/* Top: Boss Area */}
       <div className="relative z-10 w-full max-w-2xl mx-auto text-center mt-4">
          <div className="flex justify-between items-end mb-2 px-2">
             <span className="text-red-500 font-black uppercase tracking-widest text-xl flex items-center gap-2">
                <Skull size={24}/> The Architect (Stage {stage})
             </span>
             <span className="text-slate-400 font-mono text-sm">{bossHealth.toFixed(0)} / 100 HP</span>
          </div>
          {/* Boss Healthbar */}
          <div className="w-full h-6 bg-slate-900 rounded-full border-2 border-red-900 overflow-hidden relative shadow-[0_0_30px_rgba(220,38,38,0.3)]">
             <motion.div 
                className="h-full bg-gradient-to-r from-red-600 to-red-400"
                animate={{ width: `${bossHealth}%` }}
                transition={{ duration: 0.3 }}
             />
          </div>
          
          {/* Boss Sprite Mock */}
          <motion.div 
             animate={bossShake ? { x: [-10, 10, -10, 10, 0], filter: 'brightness(2)' } : { y: [0, -10, 0] }}
             transition={bossShake ? { duration: 0.4 } : { repeat: Infinity, duration: 4, ease: "easeInOut" }}
             className={`mx-auto mt-12 w-48 h-48 rounded-full border-4 flex items-center justify-center shadow-2xl transition-colors duration-1000 ${
                 stage === 1 ? 'border-slate-600 bg-slate-800 shadow-slate-500/20' : 
                 stage === 2 ? 'border-orange-500 bg-orange-900/50 shadow-orange-500/40 scale-110' : 
                 'border-red-500 bg-red-900/80 shadow-red-500/60 scale-125'
             }`}
          >
             <Skull size={stage === 3 ? 100 : 80} className={`${stage === 3 ? 'text-red-400 animate-pulse' : 'text-slate-400'}`} />
          </motion.div>
       </div>

       {/* Middle: Attack Field */}
       <div className="flex-1 relative flex items-center justify-center z-10 w-full min-h-[150px]">
          <AnimatePresence mode="wait">
             {currentAttackId && !bossShake && (
                <motion.div 
                   key={currentAttackId}
                   initial={{ scale: 0, opacity: 0, y: -50 }}
                   animate={{ scale: 1, opacity: 1, y: 0 }}
                   exit={{ scale: 1.5, opacity: 0, filter: "blur(4px)" }}
                   className="bg-black/80 p-6 rounded-2xl border-2 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)] text-center max-w-3xl"
                >
                   <div className="text-red-400 text-sm font-bold uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                     <Swords size={16} /> Incoming Attack! Type to Parry!
                   </div>
                   
                   <div className="text-5xl font-mono leading-relaxed font-black text-white">
                     {attackWord.split('').map((char, index) => (
                        <span key={index} className={index < userInput.length ? "text-slate-600" : "text-white"}>
                           {char}
                        </span>
                     ))}
                   </div>
                </motion.div>
             )}
          </AnimatePresence>
       </div>

       {/* Bottom: Player Area */}
       <motion.div 
          animate={playerShake ? { x: [-15, 15, -15, 15, 0], rotate: [-2, 2, -2, 2, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="relative z-10 w-full max-w-2xl mx-auto"
       >
          <div className="flex justify-between items-end mb-2 px-2">
             <span className="text-blue-500 font-bold uppercase tracking-widest text-sm">Player Status</span>
             <span className="text-slate-400 font-mono text-xs">{playerHealth.toFixed(0)} / 100 HP</span>
          </div>
          <div className="w-full h-4 bg-slate-900 rounded-full border border-slate-700 overflow-hidden relative">
             <motion.div 
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                animate={{ width: `${playerHealth}%` }}
                transition={{ duration: 0.3 }}
             />
          </div>
       </motion.div>

       {/* Hidden input field for typing phase */}
       <input 
         ref={inputRef}
         type="text" 
         value={userInput}
         onChange={handleInput}
         disabled={!currentAttackId || bossHealth <= 0 || playerHealth <= 0}
         className="absolute opacity-0 -z-10 focus:outline-none"
         autoFocus
         autoComplete="off"
       />

       {/* Game Over Screen Overlays */}
       {bossHealth <= 0 && (
          <div className="absolute inset-0 bg-white z-50 flex items-center justify-center mix-blend-screen animate-pulse">
             <h2 className="text-9xl font-black text-yellow-500 drop-shadow-2xl">VICTORY</h2>
          </div>
       )}
       {playerHealth <= 0 && (
          <div className="absolute inset-0 bg-red-950/90 z-50 flex items-center justify-center backdrop-blur-md">
             <div className="text-center">
                <h2 className="text-7xl font-black text-red-600 mb-4 tracking-widest">DEFEATED</h2>
                <p className="text-red-400 font-mono text-xl">The Architect proved too fast.</p>
             </div>
          </div>
       )}

    </div>
  );
};
