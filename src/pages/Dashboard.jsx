import React, { useMemo } from 'react';
import { useUserContext } from '../context/UserContext';
import { getXPForNextLevel } from '../utils/gamification';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Trophy, Flame, Target, Star, Keyboard, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { xp, level, rank, streak, history, completedLessons } = useUserContext();
  const navigate = useNavigate();

  const xpNeeded = getXPForNextLevel(level);
  const xpCurrentLevel = getXPForNextLevel(level - 1);
  const progressPercent = Math.min(100, Math.max(0, ((xp - xpCurrentLevel) / (xpNeeded - xpCurrentLevel)) * 100));

  // Analytics
  const bestWpm = useMemo(() => {
    if (!history.length) return 0;
    return Math.max(...history.map(h => h.wpm));
  }, [history]);

  const avgAccuracy = useMemo(() => {
    if (!history.length) return 0;
    const sum = history.reduce((acc, curr) => acc + curr.accuracy, 0);
    return Math.round(sum / history.length);
  }, [history]);

  const recentHistory = useMemo(() => {
    return [...history].reverse().slice(-10); // Display last 10 for the chart functionally
  }, [history]);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 w-full animate-fade-in pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
            Welcome Back!
          </h1>
          <p className="text-slate-500">Your personal typing mastery dashboard.</p>
        </div>
        
        <button 
          onClick={() => navigate('/roadmap')}
          className="btn-primary flex items-center gap-2 px-6 py-3"
        >
          Continue Lessons <ArrowRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User ID & Progress */}
        <div className="glass-panel p-6 flex flex-col gap-6 col-span-1 lg:col-span-1 border-l-4 border-l-primary">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-primary to-purple-600 p-1">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-white border-2 border-transparent">
                <Trophy size={32} />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{rank}</h2>
              <div className="text-sm font-semibold text-primary">Level {level}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-slate-500">
              <span>{xp} XP</span>
              <span>{xpNeeded} XP</span>
            </div>
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="text-xs text-center text-slate-500">
              {xpNeeded - xp} XP to reach Level {level + 1}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-auto">
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800 text-center">
              <Flame size={24} className="text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{streak}</div>
              <div className="text-xs uppercase font-semibold text-orange-500">Day Streak</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 text-center">
              <Keyboard size={24} className="text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{completedLessons.length}/50</div>
              <div className="text-xs uppercase font-semibold text-blue-500">Lessons</div>
            </div>
          </div>
        </div>

        {/* Right Column - Stats & Graphs */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="glass-panel p-6 flex flex-col justify-center border-t-2 border-t-purple-500">
              <div className="flex items-center gap-2 text-purple-500 mb-2">
                <Star size={20} /> <span className="font-semibold uppercase tracking-wider text-sm">Best Speed</span>
              </div>
              <div className="text-5xl font-black">{bestWpm} <span className="text-lg text-slate-400 font-normal">WPM</span></div>
            </div>
            <div className="glass-panel p-6 flex flex-col justify-center border-t-2 border-t-green-500">
              <div className="flex items-center gap-2 text-green-500 mb-2">
                <Target size={20} /> <span className="font-semibold uppercase tracking-wider text-sm">Avg Accuracy</span>
              </div>
              <div className="text-5xl font-black">{avgAccuracy}<span className="text-lg text-slate-400 font-normal">%</span></div>
            </div>
          </div>

          <div className="glass-panel p-6 flex-1 min-h-[300px]">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Trophy size={18} className="text-primary"/> Performance History</h3>
            {history.length >= 2 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={recentHistory} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false}/>
                  <XAxis dataKey="date" tickFormatter={() => ''} stroke="#64748b" />
                  <YAxis yAxisId="left" stroke="#3b82f6" tick={{fill: '#64748b'}} />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" tick={{fill: '#64748b'}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                    labelFormatter={() => ''}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="wpm" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} name="WPM" />
                  <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} name="Accuracy %" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 pb-10">
                <Keyboard size={48} className="mb-4 opacity-20" />
                <p>Complete more lessons to see your progress chart!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
