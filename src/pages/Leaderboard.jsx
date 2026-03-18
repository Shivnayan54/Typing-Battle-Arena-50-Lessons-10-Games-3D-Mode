import React from 'react';
import { useTypingContext } from '../context/TypingContext';
import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const Leaderboard = () => {
  const { highScores } = useTypingContext();

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="text-yellow-500" size={36} />
        <h1 className="text-3xl font-bold">Leaderboard</h1>
      </div>

      <div className="glass-panel overflow-hidden">
        {highScores && highScores.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 border-b dark:border-slate-700">
                <th className="p-4 font-semibold">Rank</th>
                <th className="p-4 font-semibold">WPM</th>
                <th className="p-4 font-semibold">Accuracy</th>
                <th className="p-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {highScores.map((score, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={idx} 
                  className="border-b dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="p-4">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                  </td>
                  <td className="p-4 font-bold text-primary">{score.wpm}</td>
                  <td className="p-4">{score.accuracy}%</td>
                  <td className="p-4 text-sm text-slate-500">{new Date(score.date).toLocaleDateString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-slate-500">
            <p>No high scores yet! Start practicing to get on the board.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
