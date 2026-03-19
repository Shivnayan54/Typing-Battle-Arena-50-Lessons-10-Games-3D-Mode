/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { generateRandomWords } from '../utils/generateText';
import { Activity, CarFront } from 'lucide-react';
import { motion } from 'framer-motion';

export const TypingRace = ({ onGameOver }) => {
  const [textToType] = useState(() => generateRandomWords(30)); // Race text
  const [userInput, setUserInput] = useState('');
  
  const [playerProgress, setPlayerProgress] = useState(0); // 0 to 100
  const [aiProgress, setAiProgress] = useState(0); // 0 to 100
  
  const [isActive, setIsActive] = useState(false);
  const [raceFinished, setRaceFinished] = useState(false);
  const [totalStrokes, setTotalStrokes] = useState(0);
  const [errors, setErrors] = useState(0);
  const inputRef = useRef(null);
  const aiTimerRef = useRef(null);

  // Focus
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const finishRace = useCallback((playerWon) => {
    setRaceFinished(true);
    setIsActive(false);
    
    // Wait a sec before passing score
    setTimeout(() => {
       const wpm = Math.floor((userInput.length / 5) / (aiProgress / 100 * 45 / 60) || 40); 
       // score calculation based on win/loss and progress
       const score = playerWon ? 5000 + wpm * 10 : Math.floor(playerProgress * 20);
       
       const accuracy = totalStrokes > 0 ? Math.round(((totalStrokes - errors) / totalStrokes) * 100) : 100;
       
       onGameOver({
         score,
         wpm,
         accuracy,
         errors,
         totalStrokes
       });
    }, 2000);
  }, [userInput.length, aiProgress, playerProgress, onGameOver, totalStrokes, errors]);

  // AI Logic (moves constantly towards 100% over ~45 seconds)
  useEffect(() => {
    if (isActive && !raceFinished) {
      aiTimerRef.current = setInterval(() => {
        setAiProgress(prev => {
          const next = prev + (100 / (45 * 10)); // 10 ticks a sec for 45 seconds total
          if (next >= 100) {
            clearInterval(aiTimerRef.current);
            finishRace(false); // Player lost
            return 100;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(aiTimerRef.current);
  }, [isActive, raceFinished, finishRace]);

  const handleInput = (e) => {
    if (raceFinished) return;
    
    const val = e.target.value;
    
    // Start race
    if (!isActive && val.length > 0) setIsActive(true);

    if (val.length > userInput.length) {
      setTotalStrokes(s => s + 1);
    }
    
    // Check if correct
    for (let i = 0; i < val.length; i++) {
       if (val[i] !== textToType[i]) {
         if (val.length > userInput.length) setErrors(e => e + 1);
         return; // Stop accepting if typo
       }
    }
    
    setUserInput(val);
    
    const progress = (val.length / textToType.length) * 100;
    setPlayerProgress(progress);
    
    if (progress >= 100) {
       finishRace(true); // Player won!
    }
  };

  const renderText = () => {
    return textToType.split('').map((char, index) => {
      let colorClass = "text-slate-500 opacity-50"; 
      if (index < userInput.length) {
         colorClass = userInput[index] === char 
           ? "text-white font-bold opacity-100" 
           : "text-red-500 bg-red-500/20"; 
      } else if (index === userInput.length) {
         colorClass = "text-primary border-b-2 border-primary animate-pulse opacity-100"; 
      }
      return (
        <span key={index} className={colorClass}>{char}</span>
      );
    });
  };

  return (
    <div className="w-full h-full min-h-[500px] bg-slate-900 rounded-3xl overflow-hidden relative border border-slate-700 p-8 flex flex-col items-center">
       
       <div className="w-full max-w-4xl mb-8 space-y-6">
          {/* AI Track */}
          <div className="w-full h-16 bg-slate-800 rounded-full border-2 border-slate-700 relative overflow-hidden flex items-center px-4">
             <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMWUyOTNiIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDJMOCAxME0tMiAwTDYgOE0yIC0yTDEwIDYiIHN0cm9rZT0iIzMzNDE1NSIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjUiPjwvcGF0aD4KPC9zdmc+')] opacity-20 pointer-events-none"></div>
             
             <div className="absolute right-4 top-0 bottom-0 w-2 bg-white/20 z-0 flex flex-col justify-around">
                {[...Array(5)].map((_, i) => <div key={i} className="w-full h-2 bg-white"></div>)}
             </div>

             <motion.div 
               animate={{ left: `calc(${aiProgress}% - 32px)` }}
               transition={{ ease: "linear", duration: 0.1 }}
               className="absolute z-10 text-orange-500"
             >
                <div className="bg-slate-950 p-2 rounded-lg border border-orange-500 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.5)]">
                  <span className="font-bold mr-2 text-xs">AI</span>
                  <CarFront size={24} />
                </div>
             </motion.div>
          </div>

          {/* Player Track */}
          <div className="w-full h-16 bg-slate-800 rounded-full border-2 border-primary relative overflow-hidden flex items-center px-4 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
             <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMWUyOTNiIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDJMOCAxME0tMiAwTDYgOE0yIC0yTDEwIDYiIHN0cm9rZT0iIzMzNDE1NSIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjUiPjwvcGF0aD4KPC9zdmc+')] opacity-20 pointer-events-none"></div>
             
             <div className="absolute right-4 top-0 bottom-0 w-2 bg-white/20 z-0 flex flex-col justify-around">
                {[...Array(5)].map((_, i) => <div key={i} className="w-full h-2 bg-white"></div>)}
             </div>

             <motion.div 
               animate={{ left: `calc(${playerProgress}% - 32px)` }}
               transition={{ ease: "linear", duration: 0.1 }}
               className="absolute z-10 text-primary"
             >
                <div className="bg-slate-950 p-2 rounded-lg border border-primary flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.8)]">
                  <span className="font-bold mr-2 text-xs">YOU</span>
                  <CarFront size={24} />
                </div>
             </motion.div>
          </div>
       </div>

       {raceFinished && (
         <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md">
            <h2 className={`text-6xl font-black ${playerProgress >= 100 ? 'text-green-500' : 'text-red-500'} animate-bounce`}>
              {playerProgress >= 100 ? 'YOU WIN!' : 'AI WINS!'}
            </h2>
         </div>
       )}

       <div 
        className="w-full max-w-4xl flex-1 glass-panel p-8 text-2xl leading-loose tracking-wide font-mono relative overflow-hidden cursor-text shadow-xl"
        onClick={() => inputRef.current && inputRef.current.focus()}
       >
         {!isActive && userInput.length === 0 && !raceFinished && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10 backdrop-blur-sm rounded-xl">
             <div className="text-2xl font-bold text-white animate-pulse">Start typing to launch!</div>
          </div>
         )}
         {renderText()}
         <input 
          ref={inputRef}
          type="text" 
          value={userInput} 
          onChange={handleInput}
          disabled={raceFinished}
          className="absolute opacity-0 -z-10 focus:outline-none"
          autoFocus
         />
       </div>

    </div>
  );
};
