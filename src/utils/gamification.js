// src/utils/gamification.js

export const RANKS = [
  { maxXP: 500, title: "Beginner" },
  { maxXP: 1500, title: "Novice" },
  { maxXP: 3000, title: "Apprentice" },
  { maxXP: 6000, title: "Typist" },
  { maxXP: 10000, title: "Speedster" },
  { maxXP: 15000, title: "Expert" },
  { maxXP: 25000, title: "Master" },
  { maxXP: 40000, title: "Grandmaster" },
  { maxXP: Infinity, title: "Legend" }
];

export const calculateRank = (xp) => {
  for (let rank of RANKS) {
    if (xp < rank.maxXP) return rank.title;
  }
  return "Legend";
};

export const calculateLevelFromXP = (xp) => {
  // Base formula: level = Math.floor(0.1 * Math.sqrt(xp))
  // A simple linear/exponential curve for levels
  return Math.floor(Math.sqrt(Math.max(0, xp) / 50)) + 1;
};

export const getXPForNextLevel = (currentLevel) => {
  // Reverse the formula to find XP needed for next level
  return Math.pow(currentLevel, 2) * 50;
};

export const calculateXPReward = (wpm, accuracy, difficultyMultiplier = 1) => {
  if (accuracy < 50) return 0;
  
  const baseXP = wpm * 2;
  const accuracyBonus = accuracy >= 95 ? 50 : accuracy >= 85 ? 20 : 0;
  
  return Math.floor((baseXP + accuracyBonus) * difficultyMultiplier);
};

export const calculateStreak = (lastLoginDateStr, currentStreak) => {
  if (!lastLoginDateStr) return 1;
  
  const lastDate = new Date(lastLoginDateStr);
  lastDate.setHours(0,0,0,0);
  
  const today = new Date();
  today.setHours(0,0,0,0);
  
  const diffTime = Math.abs(today - lastDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  if (diffDays === 1) { // logged in yesterday
    return currentStreak + 1;
  } else if (diffDays === 0) { // already logged in today
    return currentStreak;
  } else {
    return 1; // streak broken
  }
};
