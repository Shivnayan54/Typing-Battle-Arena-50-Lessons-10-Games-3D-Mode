import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateRank, calculateLevelFromXP, calculateStreak } from '../utils/gamification';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem('typing_xp')) || 0);
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      const saved = localStorage.getItem('typing_completed_lessons');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  });
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('typing_streak')) || 0);
  const [lastLoginDate, setLastLoginDate] = useState(() => localStorage.getItem('typing_last_login') || null);
  
  const [level, setLevel] = useState(1);
  const [rank, setRank] = useState('Beginner');
  
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('typing_history');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  });

  // Init auth / daily streak logic
  useEffect(() => {
    const currentStreak = calculateStreak(lastLoginDate, streak);
    setStreak(currentStreak);
    setLastLoginDate(new Date().toISOString());
    localStorage.setItem('typing_streak', currentStreak);
    localStorage.setItem('typing_last_login', new Date().toISOString());
  }, []);

  // Update level and rank whenever XP changes
  useEffect(() => {
    setLevel(calculateLevelFromXP(xp));
    setRank(calculateRank(xp));
    localStorage.setItem('typing_xp', xp);
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('typing_completed_lessons', JSON.stringify(completedLessons));
  }, [completedLessons]);
  
  useEffect(() => {
    // Keep max 100 history entries
    if (history.length > 100) {
      setHistory(prev => prev.slice(0, 100));
    }
    localStorage.setItem('typing_history', JSON.stringify(history));
  }, [history]);

  const addXp = (amount) => {
    setXp(prev => prev + amount);
  };

  const markLessonComplete = (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons(prev => [...prev, lessonId]);
    }
  };

  const addHistoryEntry = (entry) => {
    setHistory(prev => [{ ...entry, date: new Date().toISOString() }, ...prev]);
  };

  const isLessonUnlocked = (lessonId) => {
    if (lessonId === 1) return true;
    return completedLessons.includes(lessonId - 1);
  };

  return (
    <UserContext.Provider value={{
      xp, addXp, 
      level, rank, 
      streak, 
      completedLessons, markLessonComplete, isLessonUnlocked,
      history, addHistoryEntry
    }}>
      {children}
    </UserContext.Provider>
  );
};
