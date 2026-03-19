/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { generateRandomWords } from '../utils/generateText';
import { Users, Globe, Wifi, Sword } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Multiplayer Environment
export const MultiplayerArena = ({ onGameOver }) => {
  const [phase, setPhase] = useState('matchmaking'); // matchmaking -> count -> battle -> end
  const [matchFound, setMatchFound] = useState(false);
  const [countdown, setCountdown] = useState(3);
  
  const [textToType] = useState(() => generateRandomWords(40)); 
  const [userInput, setUserInput] = useState('');
  
  const [playerProgress, setPlayerProgress] = useState(0); 
  const [opponentProgress, setOpponentProgress] = useState(0); 
  const [opponentName, setOpponentName] = useState('Player281');

  const inputRef = useRef(null);

  // Matchmaking fake delay
  useEffect(() => {
     if (phase === 'matchmaking') {
        setTimeout(() => {
           setMatchFound(true);
           setOpponentName(`Guest-${Math.floor(Math.random() * 9000) + 1000}`);
           setTimeout(() => setPhase('count'), 2000);
        }, 3000);
     }
  }, [phase]);

  // Countdown timer
  useEffect(() => {
     if (phase === 'count') {
        if (countdown > 0) {
           setTimeout(() => setCountdown(c => c - 1), 1000);
        } else {
           setPhase('battle');
        }
     }
  }, [phase, countdown]);

  // Focus
  useEffect(() => {
    if (phase === 'battle' && inputRef.current) inputRef.current.focus();
  }, [phase]);

  const finishBattle = useCallback((playerWon) => {
    setPhase('end');
    setTimeout(() => {
       const score = playerWon ? 15000 : playerProgress * 50;
       onGameOver(score);
    }, 3000);
  }, [playerProgress, onGameOver]);

  // Opponent AI Mocking a real player's erratic typing (bursts of speed)
  useEffect(() => {
    if (phase === 'battle') {
      const oppTimer = setInterval(() => {
        setOpponentProgress(prev => {
          // Burst logic
          const burst = Math.random() > 0.8 ? 5 : Math.random() * 2;
          const next = prev + (burst / textToType.length * 100);
          
          if (next >= 100) {
            clearInterval(oppTimer);
            finishBattle(false);
            return 100;
          }
          return next;
        });
      }, 500); // Check every half sec

      return () => clearInterval(oppTimer);
    }
  }, [phase, textToType.length, finishBattle]);

  const handleInput = (e) => {
    if (phase !== 'battle') return;
    
    const val = e.target.value;
    for (let i = 0; i < val.length; i++) {
       if (val[i] !== textToType[i]) return; 
    }
    
    setUserInput(val);
    const progress = (val.length / textToType.length) * 100;
    setPlayerProgress(progress);
    
    if (progress >= 100) {
       finishBattle(true); 
    }
  };

  const renderText = () => {
    return textToType.split('').map((char, index) => {
      let colorClass = "text-slate-500 opacity-50"; 
      if (index < userInput.length) {
         colorClass = "text-white font-bold opacity-100"; 
      } else if (index === userInput.length) {
         colorClass = "text-sky-400 border-b-2 border-sky-400 animate-pulse opacity-100 bg-sky-500/10"; 
      }
      return <span key={index} className={colorClass}>{char}</span>;
    });
  };

  return (
    <div className="w-full h-full min-h-[500px] bg-slate-900 rounded-3xl overflow-hidden relative border border-slate-700 p-8 flex flex-col items-center">
       
       {phase === 'matchmaking' && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-pulse text-sky-400">
             <Globe size={100} className="mx-auto" />
             <h2 className="text-3xl font-bold tracking-widest uppercase">
                {matchFound ? "Match Found" : "Searching for Opponent..."}
             </h2>
             {matchFound && (
                <div className="text-white text-xl bg-slate-800 p-4 rounded-xl border border-sky-500 flex items-center gap-4 shadow-[0_0_20px_rgba(14,165,233,0.3)]">
                   <Users size={24} className="text-sky-500" />
                   Vs {opponentName}
                </div>
             )}
          </div>
       )}

       {phase === 'count' && (
          <div className="flex-1 flex items-center justify-center">
             <motion.div 
                key={countdown}
                initial={{ scale: 2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-sky-400 to-indigo-600 drop-shadow-2xl"
             >
                {countdown}
             </motion.div>
          </div>
       )}

       {(phase === 'battle' || phase === 'end') && (
          <div className="w-full h-full flex flex-col max-w-5xl">
             
             {/* Scoreboards / Progress */}
             <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Player side */}
                <div className="glass-panel p-4 border border-sky-500/50 shadow-[0_0_20px_rgba(14,165,233,0.1)] rounded-xl relative overflow-hidden">
                   <div className="absolute inset-0 bg-sky-500/20 opacity-20 w-1/2 -skew-x-12 -ml-10"></div>
                   <div className="flex justify-between items-center z-10 relative mb-4">
                      <div className="font-bold text-lg text-white">You</div>
                      <div className="text-sky-400 font-mono text-2xl font-black">{Math.floor(playerProgress)}%</div>
                   </div>
                   <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700 shadow-inner">
                      <div className="h-full bg-gradient-to-r from-sky-600 to-sky-400 transition-all duration-75" style={{width: `${playerProgress}%`}}></div>
                   </div>
                </div>

                {/* Opponent side */}
                <div className="glass-panel p-4 border border-red-500/30 rounded-xl relative overflow-hidden bg-slate-900/50">
                   <div className="flex justify-between items-center z-10 relative mb-4">
                      <div className="font-bold text-lg text-red-100 flex items-center gap-2">
                         <Wifi size={16} className="text-red-500"/> {opponentName}
                      </div>
                      <div className="text-red-400 font-mono text-2xl font-black">{Math.floor(opponentProgress)}%</div>
                   </div>
                   <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700 shadow-inner">
                      <div className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300 ease-out" style={{width: `${opponentProgress}%`}}></div>
                   </div>
                </div>
             </div>

             {/* Battle Text Field */}
             <div className="flex-1 relative">
                
                {phase === 'end' && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md rounded-2xl">
                     <h2 className={`text-6xl font-black tracking-widest uppercase flex items-center gap-4 ${playerProgress >= 100 ? 'text-sky-400 drop-shadow-[0_0_20px_rgba(14,165,233,0.8)]' : 'text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]'}`}>
                       <Sword size={64}/> {playerProgress >= 100 ? 'VICTORY' : 'DEFEAT'} <Sword size={64}/>
                     </h2>
                  </div>
                )}

                <div 
                   className="w-full h-full glass-panel p-10 text-3xl leading-relaxed tracking-wide font-mono relative overflow-hidden cursor-text shadow-xl border-l-4 border-l-sky-500"
                   onClick={() => phase === 'battle' && inputRef.current && inputRef.current.focus()}
                >
                   {renderText()}
                   <input 
                      ref={inputRef}
                      type="text" 
                      value={userInput} 
                      onChange={handleInput}
                      disabled={phase !== 'battle'}
                      className="absolute opacity-0 -z-10 focus:outline-none"
                      autoComplete="off"
                   />
                </div>
             </div>

          </div>
       )}

    </div>
  );
};
