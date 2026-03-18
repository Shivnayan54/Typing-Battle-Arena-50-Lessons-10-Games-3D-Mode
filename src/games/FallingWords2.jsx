/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { generateRandomWords } from '../utils/generateText';
import { Shield, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 500;

export const FallingWords2 = ({ onGameOver }) => {
  const [isPlaying, setIsPlaying] = useState(true); // Auto-start for integration
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5); // Increased for V2
  const [combo, setCombo] = useState(0); // V2 Feature
  const [multiplier, setMultiplier] = useState(1); // V2 Feature
  
  const [words, setWords] = useState([]);
  const [userInput, setUserInput] = useState('');
  
  const gameAreaRef = useRef(null);
  const animationRef = useRef(null);
  const spawnTimerRef = useRef(null);
  
  // Difficulty Scaling parameters
  const [fallSpeed, setFallSpeed] = useState(1.0);
  const [spawnRate, setSpawnRate] = useState(2500);

  useEffect(() => {
    if (!isPlaying) return;

    spawnTimerRef.current = setInterval(() => {
      const newWord = generateRandomWords(1).split(' ')[0];
      const randomX = Math.random() * (GAME_WIDTH - 150) + 20; 
      setWords((prev) => [
        ...prev, 
        { id: Date.now(), text: newWord, x: randomX, y: -30 }
      ]);
    }, spawnRate);

    return () => clearInterval(spawnTimerRef.current);
  }, [isPlaying, spawnRate]);

  useEffect(() => {
    if (!isPlaying) return;

    const updateGame = () => {
      setWords((prevWords) => {
        const updatedWords = prevWords.map(w => ({ ...w, y: w.y + fallSpeed }));
        
        const activeWords = updatedWords.filter(w => {
          if (w.y > GAME_HEIGHT - 40) {
            setLives((l) => {
              const newL = l - 1;
              if (newL <= 0) setTimeout(() => onGameOver(score), 0);
              return newL;
            });
            setCombo(0); // Break combo
            setMultiplier(1);
            return false;
          }
          return true;
        });

        return activeWords;
      });

      animationRef.current = requestAnimationFrame(updateGame);
    };

    animationRef.current = requestAnimationFrame(updateGame);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, fallSpeed, score, onGameOver]);

  // Scale difficulty over time
  useEffect(() => {
     if (score > 1000) { setFallSpeed(1.5); setSpawnRate(1800); }
     if (score > 3000) { setFallSpeed(2.0); setSpawnRate(1200); }
     if (score > 6000) { setFallSpeed(2.8); setSpawnRate(800); }
  }, [score]);

  const handleInput = (e) => {
    if (!isPlaying) return;
    const value = e.target.value.trim().toLowerCase();
    setUserInput(e.target.value);

    const matchedWordIndex = words.findIndex(w => w.text.toLowerCase() === value);
    if (matchedWordIndex !== -1) {
      const basePoints = value.length * 10;
      const pointsEarned = basePoints * multiplier;
      
      setScore(s => s + pointsEarned);
      setUserInput('');
      setWords(prev => prev.filter((_, idx) => idx !== matchedWordIndex));
      
      // Update Combo System
      setCombo(c => {
        const nextCombo = c + 1;
        if (nextCombo > 5) setMultiplier(2);
        if (nextCombo > 15) setMultiplier(3);
        if (nextCombo > 30) setMultiplier(5);
        return nextCombo;
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center bg-slate-900 border border-slate-700/50 rounded-2xl p-4 shadow-xl">
       <div className="w-full max-w-[800px] flex justify-between items-center mb-4 px-4 glass-panel py-3 shadow-md">
         <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2 font-bold text-xl text-primary">
              <span className="text-white">Score:</span> {score}
            </div>
            {combo > 3 && (
               <div className="flex items-center gap-1 font-bold text-orange-500 animate-pulse bg-orange-500/10 px-2 py-1 rounded">
                 <Zap size={16} /> Combo x{multiplier}
               </div>
             )}
         </div>
         <div className="flex items-center gap-2 text-red-500 font-bold">
           {[...Array(5)].map((_, i) => (
             <Shield key={i} fill={i < lives ? "currentColor" : "none"} size={20} opacity={i < lives ? 1 : 0.3} />
           ))}
         </div>
       </div>

       <div className="w-full max-w-[800px] flex-1 flex flex-col rounded-2xl overflow-hidden shadow-2xl relative bg-slate-950">
         <div className="relative flex-1 w-full overflow-hidden">
           {/* Fall background fx */}
           <div className="absolute inset-0 opacity-10 space-y-4 pt-10 pointer-events-none">
              <div className="w-full h-px bg-slate-500"></div>
              <div className="w-full h-px bg-slate-500"></div>
           </div>

           <AnimatePresence>
             {words.map((word) => (
               <motion.div
                 key={word.id}
                 initial={{ scale: 0.5, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ scale: 1.5, opacity: 0, color: "#10b981", filter: "blur(2px)" }}
                 style={{ left: word.x, top: word.y }}
                 className="absolute px-3 py-1 bg-gradient-to-r from-slate-800 to-slate-700 rounded shadow-md font-mono text-lg font-bold border border-slate-600/50 text-white pointer-events-none"
               >
                 {word.text}
               </motion.div>
             ))}
           </AnimatePresence>
           
           <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-red-600/30 to-transparent border-t-2 border-red-500 z-10"></div>
         </div>
         
         <div className="bg-slate-900 border-t border-slate-800 p-4 flex justify-center z-20">
           <input
             ref={gameAreaRef}
             type="text"
             value={userInput}
             onChange={handleInput}
             placeholder="Stop them here..."
             className="w-[80%] px-4 py-3 rounded-xl border-2 border-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none bg-slate-800 text-white font-mono text-xl text-center shadow-inner transition-all"
             autoFocus
             autoComplete="off"
           />
         </div>
       </div>
    </div>
  );
};
