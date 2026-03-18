import React, { useEffect, useState } from 'react';

const row1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'];
const row2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"];
const row3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'];

const Keyboard = () => {
  const [pressedKey, setPressedKey] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      setPressedKey(e.key.toLowerCase());
    };
    
    const handleKeyUp = () => {
      setPressedKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const renderKey = (key) => {
    const isPressed = pressedKey === key;
    return (
      <div 
        key={key} 
        className={`
          flex items-center justify-center rounded-lg font-mono text-lg transition-all duration-75
          ${key === ' ' ? 'w-64 h-12' : 'w-10 h-12 sm:w-12 sm:h-12'}
          ${isPressed 
            ? 'bg-primary text-white scale-95 shadow-inner' 
            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm border-b-4 border-slate-200 dark:border-slate-900'}
        `}
      >
        {key === ' ' ? 'SPACE' : key.toUpperCase()}
      </div>
    );
  };

  return (
    <div className="glass-panel p-4 sm:p-6 mt-8 w-full max-w-3xl mx-auto flex flex-col items-center gap-2">
      <div className="flex gap-1 sm:gap-2">
        {row1.map(renderKey)}
      </div>
      <div className="flex gap-1 sm:gap-2 ml-4 sm:ml-6">
        {row2.map(renderKey)}
      </div>
      <div className="flex gap-1 sm:gap-2 ml-8 sm:ml-12">
        {row3.map(renderKey)}
      </div>
      <div className="flex gap-1 sm:gap-2 mt-2">
        {renderKey(' ')}
      </div>
    </div>
  );
};

export default Keyboard;
