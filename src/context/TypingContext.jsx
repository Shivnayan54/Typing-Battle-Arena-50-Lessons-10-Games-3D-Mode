import React, { createContext, useContext, useState, useEffect } from 'react';

const TypingContext = createContext();

export const useTypingContext = () => useContext(TypingContext);

export const TypingProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [level, setLevel] = useState('beginner'); // beginner, intermediate, advanced, programming
  const [highScores, setHighScores] = useState(() => {
    try {
      const saved = localStorage.getItem('typing_high_scores');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const saveScore = (score) => {
    const newScores = [...highScores, { ...score, date: new Date().toISOString() }];
    newScores.sort((a, b) => b.wpm - a.wpm);
    const topScores = newScores.slice(0, 50); // Keep top 50
    setHighScores(topScores);
    localStorage.setItem('typing_high_scores', JSON.stringify(topScores));
  };

  const value = {
    theme,
    toggleTheme,
    level,
    setLevel,
    highScores,
    saveScore
  };

  return (
    <TypingContext.Provider value={value}>
      {children}
    </TypingContext.Provider>
  );
};
