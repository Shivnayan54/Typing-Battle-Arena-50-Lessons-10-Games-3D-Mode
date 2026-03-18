/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { generateRandomWords } from '../utils/generateText';
import { Eye, EyeOff, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MemoryFlash = ({ onGameOver }) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [targetText, setTargetText] = useState('');
  const [userInput, setUserInput] = useState('');
  
  const [phase, setPhase] = useState('prepare'); // prepare -> flash -> typing -> result
  
  const inputRef = useRef(null);
  
  // Game sequence logic
  useEffect(() => {
     let timer;
     
     if (phase === 'prepare') {
        // Generate text based on level (level 1 = 3 words, level 10 = 12 words)
        const wordCount = Math.min(3 + Math.floor(level / 2), 15);
        setTargetText(generateRandomWords(wordCount));
        setUserInput('');
        
        // Wait 2 seconds then flash
        timer = setTimeout(() => setPhase('flash'), 2000);
     }
     else if (phase === 'flash') {
        // Show for 1.5s + 0.2s per word
        const flashDuration = 1500 + (targetText.split(' ').length * 200);
        timer = setTimeout(() => {
           setPhase('typing');
        }, flashDuration);
     }
     else if (phase === 'typing') {
        if (inputRef.current) inputRef.current.focus();
     }
     
     return () => clearTimeout(timer);
  }, [phase, level, targetText]);

  const handleInput = (e) => {
     if (phase !== 'typing') return;
     const val = e.target.value;
     setUserInput(val);
     
     if (val.length === targetText.length) {
        checkResult(val);
     }
  };

  const checkResult = (finalInput) => {
     setPhase('result');
     
     // Calculate similarity
     let correctChars = 0;
     for (let i = 0; i < targetText.length; i++) {
        if (targetText[i] === finalInput[i]) correctChars++;
     }
     
     const accuracy = correctChars / targetText.length;
     
     setTimeout(() => {
        if (accuracy > 0.85) {
           // Success! Next level
           setScore(s => s + Math.floor(targetText.length * 10 * accuracy) + (level * 50));
           setLevel(l => l + 1);
           setPhase('prepare');
        } else {
           // Failed. Game over.
           onGameOver(score);
        }
     }, 3000);
  };

  const getAccuracyColor = () => {
     if (phase !== 'result') return "text-white";
     let correct = 0;
     for (let i = 0; i < targetText.length; i++) {
        if (targetText[i] === userInput[i]) correct++;
     }
     const acc = correct / targetText.length;
     if (acc > 0.85) return "text-green-500";
     return "text-red-500";
  };

  return (
    <div className="w-full h-full min-h-[500px] bg-slate-900 rounded-3xl overflow-hidden relative border border-slate-700 p-8 flex flex-col items-center justify-center">
       
       <div className="absolute top-6 left-6 flex items-center gap-4">
          <div className="glass-panel px-4 py-2 border-teal-500/50 flex items-center gap-2 font-bold text-teal-400">
             <Brain size={20} /> Level {level}
          </div>
          <div className="glass-panel px-4 py-2 text-white font-bold">
             Score: {score}
          </div>
       </div>

       <div className="glass-panel w-full max-w-3xl min-h-[250px] p-8 flex flex-col items-center justify-center shadow-2xl relative">
          
          <AnimatePresence mode="wait">
             {phase === 'prepare' && (
                <motion.div 
                   key="prep"
                   initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                   className="flex flex-col items-center text-slate-400"
                >
                   <Brain size={64} className="mb-4 text-teal-500 animate-pulse" />
                   <h2 className="text-2xl font-bold">Prepare to memorize...</h2>
                </motion.div>
             )}

             {phase === 'flash' && (
                <motion.div 
                   key="flash"
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   className="text-center"
                >
                   <Eye size={48} className="mx-auto mb-6 text-yellow-500" />
                   <h2 className="text-4xl font-mono leading-relaxed track-wide font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                      {targetText}
                   </h2>
                </motion.div>
             )}

             {phase === 'typing' && (
                <motion.div 
                   key="type"
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   className="text-center w-full"
                >
                   <EyeOff size={48} className="mx-auto mb-6 text-slate-600" />
                   <h2 className="text-2xl font-bold text-slate-400 mb-6">Type what you remember:</h2>
                   
                   <div className="relative">
                      {/* Masked display of input */}
                      <div className="text-4xl font-mono leading-relaxed font-black text-white min-h-[60px] border-b-2 border-slate-600 pb-2">
                         {userInput.split('').map(() => '*').join('')}
                         <span className="w-4 h-8 inline-block bg-teal-500 animate-pulse ml-1 align-middle"></span>
                      </div>
                      <div className="text-sm text-slate-500 mt-2 font-mono">
                         {userInput.length} / {targetText.length} characters
                      </div>
                   </div>
                </motion.div>
             )}

             {phase === 'result' && (
                <motion.div 
                   key="result"
                   initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                   className="text-center w-full"
                >
                   <h2 className={`text-4xl font-black mb-6 ${getAccuracyColor()}`}>
                      {getAccuracyColor() === 'text-green-500' ? 'Memory Passed!' : 'Memory Failed'}
                   </h2>
                   
                   <div className="flex flex-col gap-4 text-left font-mono text-xl bg-slate-950 p-6 rounded-xl border border-slate-800">
                      <div>
                         <span className="text-slate-500 text-sm block mb-1">Target:</span>
                         <span className="text-white break-all">{targetText}</span>
                      </div>
                      <div>
                         <span className="text-slate-500 text-sm block mb-1">You Typed:</span>
                         <span className="break-all">
                            {userInput.split('').map((char, i) => (
                               <span key={i} className={char === targetText[i] ? "text-green-400" : "text-red-500 bg-red-900/30"}>
                                  {char}
                               </span>
                            ))}
                         </span>
                      </div>
                   </div>
                </motion.div>
             )}
          </AnimatePresence>

       </div>

       {/* Hidden input field for typing phase */}
       <input 
         ref={inputRef}
         type="text" 
         value={userInput}
         onChange={handleInput}
         disabled={phase !== 'typing'}
         className="absolute opacity-0 -z-10 focus:outline-none"
         autoComplete="off"
       />
    </div>
  );
};
