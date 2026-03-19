/* eslint-disable */
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TypingProvider } from './context/TypingContext';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';
import LoginScreen from './components/LoginScreen';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const Practice = lazy(() => import('./pages/Practice'));
const Games = lazy(() => import('./pages/Games'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Roadmap = lazy(() => import('./pages/Roadmap'));

const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="w-8 h-8 border-2 border-nova-500/30 border-t-nova-500 rounded-full animate-spin" />
  </div>
);

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25 } },
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full"
      >
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/games" element={<Games />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

// Auth-gated inner app
const AppInner = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background-dark">
        <div className="w-10 h-10 border-2 border-nova-500/30 border-t-nova-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <TypingProvider>
      <UserProvider>
        <Router>
          <div className="min-h-screen flex flex-col relative">
            {/* Particle background */}
            <ParticleBackground />

            {/* Global ambient glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
              <div className="absolute -top-[20%] left-[20%] w-[600px] h-[600px] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />
              <div className="absolute top-[60%] right-[10%] w-[500px] h-[500px] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 70%)', filter: 'blur(60px)' }} />
            </div>

            {/* Main layout */}
            <div className="relative z-10 flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1 container mx-auto px-4 py-8">
                <AnimatedRoutes />
              </main>
              <footer className="text-center py-5 text-slate-700 text-xs font-semibold border-t border-white/[0.04]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-nova-500 to-cyan-500 font-bold">TypeNova</span>
                {' '}© {new Date().getFullYear()} — Master Speed. Master Precision.
              </footer>
            </div>
          </div>
        </Router>
      </UserProvider>
    </TypingProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;
