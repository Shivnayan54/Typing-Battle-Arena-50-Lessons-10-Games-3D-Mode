import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Practice from './pages/Practice';
import Games from './pages/Games';
import Leaderboard from './pages/Leaderboard';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import { TypingProvider } from './context/TypingContext';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <TypingProvider>
        <Router>
          <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 relative text-slate-800 dark:text-slate-100 dark:bg-[#0f172a]">
            {/* Soft background glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
              <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]"></div>
              <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px]"></div>
            </div>

            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8 relative">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/practice" element={<Practice />} />
                <Route path="/games" element={<Games />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
              </Routes>
            </main>
          </div>
        </Router>
      </TypingProvider>
    </UserProvider>
  );
}

export default App;
