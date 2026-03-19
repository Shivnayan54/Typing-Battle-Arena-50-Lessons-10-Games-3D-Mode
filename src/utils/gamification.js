// src/utils/gamification.js — TypeNova Gamification System

export const RANKS = [
  { maxXP: 500,    title: "Novice",      color: "#64748b", emoji: "🌱" },
  { maxXP: 1500,   title: "Apprentice",  color: "#10b981", emoji: "⚡" },
  { maxXP: 3000,   title: "Typist",      color: "#3b82f6", emoji: "🔵" },
  { maxXP: 6000,   title: "Speedster",   color: "#8b5cf6", emoji: "🟣" },
  { maxXP: 10000,  title: "Expert",      color: "#f59e0b", emoji: "🌟" },
  { maxXP: 15000,  title: "Virtuoso",    color: "#f43f5e", emoji: "🔥" },
  { maxXP: 25000,  title: "Master",      color: "#ec4899", emoji: "💎" },
  { maxXP: 40000,  title: "Grandmaster", color: "#7c3aed", emoji: "👑" },
  { maxXP: Infinity, title: "Legend",    color: "#06b6d4", emoji: "⚡" },
];

export const calculateRank = (xp) => {
  for (let rank of RANKS) {
    if (xp < rank.maxXP) return rank.title;
  }
  return "Legend";
};

export const getRankData = (xp) => {
  for (let rank of RANKS) {
    if (xp < rank.maxXP) return rank;
  }
  return RANKS[RANKS.length - 1];
};

export const calculateLevelFromXP = (xp) => {
  return Math.floor(Math.sqrt(Math.max(0, xp) / 50)) + 1;
};

export const getXPForNextLevel = (currentLevel) => {
  return Math.pow(currentLevel, 2) * 50;
};

export const calculateXPReward = (wpm, accuracy, difficultyMultiplier = 1) => {
  if (accuracy < 50) return 0;

  const baseXP = wpm * 2;
  const accuracyBonus = accuracy >= 98 ? 80 : accuracy >= 95 ? 50 : accuracy >= 90 ? 25 : accuracy >= 85 ? 10 : 0;
  const speedBonus = wpm >= 120 ? 60 : wpm >= 100 ? 40 : wpm >= 80 ? 20 : wpm >= 60 ? 10 : 0;

  return Math.floor((baseXP + accuracyBonus + speedBonus) * difficultyMultiplier);
};

export const calculateStreak = (lastLoginDateStr, currentStreak) => {
  if (!lastLoginDateStr) return 1;

  const lastDate = new Date(lastLoginDateStr);
  lastDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = today - lastDate;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return currentStreak; // same day
  if (diffDays === 1) return currentStreak + 1; // yesterday
  return 1; // streak broken
};

// Daily attempt tracking (per-user keyed by email)
export const DAILY_LIMIT = 5;

export const getDailyAttemptsKey = (email = 'guest') => {
  const today = new Date().toISOString().split('T')[0];
  return `typenova_daily_${email}_${today}`;
};

export const getDailyAttempts = (email = 'guest') => {
  const key = getDailyAttemptsKey(email);
  return parseInt(localStorage.getItem(key) || '0');
};

export const incrementDailyAttempts = (email = 'guest') => {
  const key = getDailyAttemptsKey(email);
  const current = getDailyAttempts(email);
  const next = current + 1;
  localStorage.setItem(key, String(next));
  return next;
};

export const isDailyLimitReached = (email = 'guest') => {
  return getDailyAttempts(email) >= DAILY_LIMIT;
};
