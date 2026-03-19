/* eslint-disable */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// ─── Storage Key ───────────────────────────────────────────────────────────────
const PROFILES_KEY = 'typenova_profiles';
const ACTIVE_USER_KEY = 'typenova_active_user';

// ─── Helper: load all profiles ─────────────────────────────────────────────────
const loadProfiles = () => {
  try {
    const data = localStorage.getItem(PROFILES_KEY);
    return data ? JSON.parse(data) : {};
  } catch { return {}; }
};

// ─── Helper: save all profiles ─────────────────────────────────────────────────
const saveProfiles = (profiles) => {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
};

// ─── Create empty profile ───────────────────────────────────────────────────────
const createProfile = (name, email) => ({
  name: name.trim(),
  email: email.trim().toLowerCase(),
  createdAt: new Date().toISOString(),
  xp: 0,
  level: 1,
  rank: 'Novice',
  streak: 0,
  lastLoginDate: null,
  lastStreakDay: null,
  bestWpm: 0,
  avgWpm: 0,
  avgAccuracy: 100,
  completedLessons: [],
  history: [],
  dailyAttempts: {},
  soundEnabled: true,
  theme: 'dark',
  totalTests: 0,
});

// ─── Provider ──────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = not logged in
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const activeEmail = localStorage.getItem(ACTIVE_USER_KEY);
    if (activeEmail) {
      const profiles = loadProfiles();
      const profile = profiles[activeEmail];
      if (profile) {
        setUser(profile);
      }
    }
    setIsLoading(false);
  }, []);

  // Login or create account
  const login = useCallback((name, email) => {
    const normalizedEmail = email.trim().toLowerCase();
    const profiles = loadProfiles();

    let profile = profiles[normalizedEmail];
    if (!profile) {
      // New user - create profile
      profile = createProfile(name, email);
    } else {
      // Existing user - update last login
      profile.lastLoginDate = new Date().toISOString();
    }

    profiles[normalizedEmail] = profile;
    saveProfiles(profiles);
    localStorage.setItem(ACTIVE_USER_KEY, normalizedEmail);
    setUser(profile);
    return profile;
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem(ACTIVE_USER_KEY);
    setUser(null);
  }, []);

  // Update user profile in storage
  const updateUser = useCallback((updates) => {
    if (!user) return;
    const profiles = loadProfiles();
    const updated = { ...user, ...updates };
    profiles[user.email] = updated;
    saveProfiles(profiles);
    setUser(updated);
  }, [user]);

  // Persist specific field
  const persistField = useCallback((key, value) => {
    if (!user) return;
    const profiles = loadProfiles();
    if (profiles[user.email]) {
      profiles[user.email][key] = value;
      saveProfiles(profiles);
      setUser(prev => ({ ...prev, [key]: value }));
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser, persistField }}>
      {children}
    </AuthContext.Provider>
  );
};
