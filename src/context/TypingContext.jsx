/* eslint-disable */
import React, { createContext, useContext, useState, useEffect, useLayoutEffect } from 'react';

const TypingContext = createContext();
export const useTypingContext = () => useContext(TypingContext);

// Apply theme to DOM immediately (called before render to prevent flash)
const applyTheme = (theme) => {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
    root.style.colorScheme = 'light';
  }
};

// Read from storage before first render to avoid flash
const getInitialTheme = () => {
  try {
    const stored = localStorage.getItem('typenova_theme');
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {}
  return 'dark'; // default dark
};

export const TypingProvider = ({ children }) => {
  const [theme, setThemeState] = useState(getInitialTheme);
  const [level, setLevel] = useState('beginner');
  const [highScores, setHighScores] = useState(() => {
    try {
      const saved = localStorage.getItem('typing_high_scores');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  });

  // Apply theme BEFORE paint to avoid flash
  useLayoutEffect(() => {
    applyTheme(theme);
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('typenova_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      return next;
    });
  };

  const setTheme = (t) => setThemeState(t);

  const saveScore = (score) => {
    const newScores = [...highScores, { ...score, date: new Date().toISOString() }];
    newScores.sort((a, b) => b.wpm - a.wpm);
    const topScores = newScores.slice(0, 50);
    setHighScores(topScores);
    localStorage.setItem('typing_high_scores', JSON.stringify(topScores));
  };

  return (
    <TypingContext.Provider value={{ theme, toggleTheme, setTheme, level, setLevel, highScores, saveScore }}>
      <div className={`theme-wrapper transition-colors duration-300 ${theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-background-dark text-slate-100'}`}
        style={{ minHeight: '100vh' }}>
        {children}
      </div>
    </TypingContext.Provider>
  );
};
