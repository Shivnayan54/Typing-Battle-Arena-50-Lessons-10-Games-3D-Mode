/* eslint-disable */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { calculateRank, calculateLevelFromXP, calculateStreak, getDailyAttempts, incrementDailyAttempts, DAILY_LIMIT, getRankData } from '../utils/gamification';
import { sounds } from '../utils/sounds';

const UserContext = createContext();
export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const { user, persistField, updateUser } = useAuth();

  // ─── Derive all state from auth user profile ───────────────────────────────
  const xp = user?.xp ?? 0;
  const level = calculateLevelFromXP(xp);
  const rank = calculateRank(xp);
  const streak = user?.streak ?? 0;
  const completedLessons = user?.completedLessons ?? [];
  const history = user?.history ?? [];
  const soundEnabled = user?.soundEnabled ?? true;
  const dailyAttempts = getDailyAttempts(user?.email);

  // Computed stats
  const bestWpm = history.length > 0 ? Math.max(...history.map(h => h.wpm || 0)) : 0;
  const avgWpm = history.length > 0 ? Math.round(history.reduce((a, b) => a + (b.wpm || 0), 0) / history.length) : 0;
  const avgAccuracy = history.length > 0 ? Math.round(history.reduce((a, b) => a + (b.accuracy || 0), 0) / history.length) : 0;

  // ─── Actions ──────────────────────────────────────────────────────────────
  const addXp = useCallback((amount) => {
    if (!user) return;
    const newXp = xp + amount;
    const prevLevel = calculateLevelFromXP(xp);
    const newLevel = calculateLevelFromXP(newXp);
    if (newLevel > prevLevel && soundEnabled) sounds.levelUp();
    persistField('xp', newXp);
  }, [user, xp, soundEnabled, persistField]);

  const markLessonComplete = useCallback((lessonId) => {
    if (!user) return;
    if (!completedLessons.includes(lessonId)) {
      const updated = [...completedLessons, lessonId];
      persistField('completedLessons', updated);
    }
  }, [user, completedLessons, persistField]);

  const addHistoryEntry = useCallback((entry) => {
    if (!user) return;
    const newEntry = { ...entry, date: new Date().toISOString() };
    const updated = [newEntry, ...history].slice(0, 100);
    persistField('history', updated);
  }, [user, history, persistField]);

  const isLessonUnlocked = useCallback((lessonId) => {
    if (lessonId === 1) return true;
    return completedLessons.includes(lessonId - 1);
  }, [completedLessons]);

  const recordDailyAttempt = useCallback(() => {
    if (!user) return 0;
    const newCount = incrementDailyAttempts(user.email);
    if (newCount >= DAILY_LIMIT) {
      const today = new Date().toISOString().split('T')[0];
      const lastStreakDay = user.lastStreakDay;
      if (lastStreakDay !== today) {
        const lastLogin = user.lastLoginDate;
        const newStreak = calculateStreak(lastLogin, user.streak) + (lastStreakDay ? 0 : 0);
        const finalStreak = streak + 1;
        updateUser({ streak: finalStreak, lastStreakDay: today, lastLoginDate: new Date().toISOString() });
        if (soundEnabled) sounds.streakMilestone();
      }
    }
    return newCount;
  }, [user, streak, soundEnabled, updateUser]);

  const toggleSound = useCallback(() => {
    sounds.setEnabled(!soundEnabled);
    persistField('soundEnabled', !soundEnabled);
  }, [soundEnabled, persistField]);

  // Sync sound engine
  useEffect(() => {
    sounds.setEnabled(soundEnabled);
  }, [soundEnabled]);

  return (
    <UserContext.Provider value={{
      xp, addXp,
      level, rank,
      streak,
      completedLessons, markLessonComplete, isLessonUnlocked,
      history, addHistoryEntry,
      soundEnabled, toggleSound,
      dailyAttempts,
      recordDailyAttempt,
      bestWpm, avgWpm, avgAccuracy,
    }}>
      {children}
    </UserContext.Provider>
  );
};
