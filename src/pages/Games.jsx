import React, { useState, useCallback } from 'react';
import { Type3D } from '../games/Game3D/Type3D';
import { ZombieSurvival } from '../games/ZombieSurvival';
import { FallingWords2 } from '../games/FallingWords2';
import { SpeedRush } from '../games/SpeedRush';
import { TypingRace } from '../games/TypingRace';
import { WordShooter } from '../games/WordShooter';
import { SpaceDefender } from '../games/SpaceDefender';
import { MemoryFlash } from '../games/MemoryFlash';
import { BossBattle } from '../games/BossBattle';
import { MultiplayerArena } from '../games/MultiplayerArena';
import { HeroClimb } from '../games/HeroClimb';
import { TreeJumper } from '../games/TreeJumper';
import { StarshipDefender } from '../games/StarshipDefender';
import { NinjaRun } from '../games/NinjaRun';
import { GalaxyDrift } from '../games/GalaxyDrift';
import { useUserContext } from '../context/UserContext';
import { Gamepad2 } from 'lucide-react';
import ResultModal from '../components/ResultModal';

// ─── Inline SVG Thumbnails ─────────────────────────────────────────────────────
const Thumb3D = () => (
  <svg viewBox="0 0 200 110" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="110" fill="#030712"/>
    <circle cx="100" cy="55" r="45" fill="none" stroke="#3b82f6" strokeWidth="0.5" opacity="0.3"/>
    {[0,60,120,180,240,300].map((a,i)=>(
      <ellipse key={i} cx={100+38*Math.cos(a*Math.PI/180)} cy={55+22*Math.sin(a*Math.PI/180)}
        rx="14" ry="10" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="1.5"
        style={{filter:'drop-shadow(0 0 6px #3b82f6)'}}/>
    ))}
    <text x="100" y="62" textAnchor="middle" fill="#93c5fd" fontSize="13" fontFamily="monospace" fontWeight="bold">TYPE</text>
  </svg>
);

const ThumbZombie = () => (
  <svg viewBox="0 0 200 110" fill="none">
    <rect width="200" height="110" fill="#0a0a0a"/>
    <rect x="0" y="85" width="200" height="25" fill="#14532d"/>
    {[30,80,130,170].map((x,i)=>(
      <g key={i}>
        <circle cx={x} cy="75" r="12" fill="#15803d"/>
        <rect x={x-5} y="40" width="10" height="38" rx="3" fill="#4ade80"/>
        <circle cx={x} cy="35" r="9" fill="#86efac"/>
        <rect x={x-3} y="30" width="2" height="4" fill="#1a1a1a"/>
        <rect x={x+1} y="30" width="2" height="4" fill="#1a1a1a"/>
      </g>
    ))}
    <text x="100" y="22" textAnchor="middle" fill="#4ade80" fontSize="11" fontFamily="monospace" fontWeight="bold" opacity="0.8">ZOMBIE SURVIVAL</text>
  </svg>
);

const ThumbFalling = () => (
  <svg viewBox="0 0 200 110" fill="none">
    <rect width="200" height="110" fill="#020617"/>
    {[['the',20,15,'#f472b6'],['run',70,30,'#818cf8'],['fast',120,10,'#34d399'],['jump',160,25,'#fb923c'],['code',45,55,'#60a5fa'],['type',100,50,'#a78bfa'],['win',150,60,'#f9a8d4']].map(([w,x,y,c],i)=>(
      <g key={i}>
        <text x={x} y={y+14} fill={c} fontSize="12" fontFamily="monospace" fontWeight="bold" style={{filter:`drop-shadow(0 0 4px ${c})`}}>{w}</text>
        <line x1={x+w.length*3.5} y1={y} x2={x+w.length*3.5} y2={y+2} stroke={c} strokeWidth="1.5"/>
      </g>
    ))}
    <rect x="0" y="95" width="200" height="15" fill="#dc2626" opacity="0.5"/>
    <text x="100" y="106" textAnchor="middle" fill="#fca5a5" fontSize="9" fontFamily="monospace">DANGER ZONE</text>
  </svg>
);

const ThumbSpeed = () => (
  <svg viewBox="0 0 200 110" fill="none">
    <rect width="200" height="110" fill="#0f0a00"/>
    <circle cx="100" cy="65" r="50" fill="none" stroke="#f97316" strokeWidth="1" opacity="0.3"/>
    <circle cx="100" cy="65" r="38" fill="none" stroke="#fb923c" strokeWidth="3" strokeDasharray="100 140" strokeLinecap="round"/>
    <text x="100" y="72" textAnchor="middle" fill="#fb923c" fontSize="22" fontFamily="monospace" fontWeight="900">60s</text>
    <text x="100" y="18" textAnchor="middle" fill="#f97316" fontSize="10" fontFamily="monospace">SPEED RUSH</text>
    {[0,1,2,3,4,5,6,7].map(i=>(
      <line key={i} x1={100+45*Math.cos((i/8)*Math.PI*2-Math.PI/2)} y1={65+45*Math.sin((i/8)*Math.PI*2-Math.PI/2)}
        x2={100+50*Math.cos((i/8)*Math.PI*2-Math.PI/2)} y2={65+50*Math.sin((i/8)*Math.PI*2-Math.PI/2)}
        stroke="#f97316" strokeWidth="1.5" opacity="0.5"
      />
    ))}
  </svg>
);

const ThumbRace = () => (
  <svg viewBox="0 0 200 110" fill="none">
    <rect width="200" height="110" fill="#0c0a00"/>
    <rect x="0" y="60" width="200" height="50" fill="#1c1400"/>
    {[0,40,80,120,160,200].map((x,i)=>(
      <line key={i} x1={x} y1="60" x2={x} y2="110" stroke="#fbbf24" strokeWidth="0.5" opacity="0.3"/>
    ))}
    {/* YOU car */}
    <rect x="30" y="45" width="35" height="20" rx="4" fill="#3b82f6"/>
    <rect x="36" y="39" width="23" height="10" rx="3" fill="#60a5fa"/>
    <circle cx="38" cy="65" r="5" fill="#1e293b" stroke="#64748b" strokeWidth="1.5"/>
    <circle cx="59" cy="65" r="5" fill="#1e293b" stroke="#64748b" strokeWidth="1.5"/>
    {/* AI car */}
    <rect x="90" y="45" width="35" height="20" rx="4" fill="#ef4444"/>
    <rect x="96" y="39" width="23" height="10" rx="3" fill="#fca5a5"/>
    <circle cx="98" cy="65" r="5" fill="#1e293b" stroke="#64748b" strokeWidth="1.5"/>
    <circle cx="119" cy="65" r="5" fill="#1e293b" stroke="#64748b" strokeWidth="1.5"/>
    <text x="47" y="58" textAnchor="middle" fill="white" fontSize="7" fontFamily="monospace">YOU</text>
    <text x="107" y="58" textAnchor="middle" fill="white" fontSize="7" fontFamily="monospace">AI</text>
  </svg>
);

const ThumbShooter = () => (
  <svg viewBox="0 0 200 110" fill="none">
    <rect width="200" height="110" fill="#030712"/>
    {/* crosshair */}
    <circle cx="100" cy="55" r="28" stroke="#22d3ee" strokeWidth="1.5" opacity="0.8"/>
    <circle cx="100" cy="55" r="18" stroke="#22d3ee" strokeWidth="1" opacity="0.5"/>
    <circle cx="100" cy="55" r="4" fill="#22d3ee"/>
    <line x1="60" y1="55" x2="82" y2="55" stroke="#22d3ee" strokeWidth="1.5"/>
    <line x1="118" y1="55" x2="140" y2="55" stroke="#22d3ee" strokeWidth="1.5"/>
    <line x1="100" y1="15" x2="100" y2="37" stroke="#22d3ee" strokeWidth="1.5"/>
    <line x1="100" y1="73" x2="100" y2="95" stroke="#22d3ee" strokeWidth="1.5"/>
    <text x="100" y="26" textAnchor="middle" fill="#67e8f9" fontSize="9" fontFamily="monospace">WORD SHOOTER</text>
  </svg>
);

const ThumbDefender = () => (
  <svg viewBox="0 0 200 110" fill="none">
    <rect width="200" height="110" fill="#020617"/>
    {[[40,20],[130,30],[80,50],[160,15],[20,45]].map(([x,y],i)=>(
      <g key={i}>
        <polygon points={`${x},${y} ${x+16},${y+8} ${x+18},${y+22} ${x+10},${y+30} ${x-4},${y+28} ${x-6},${y+14}`}
          fill="#7c3aed" stroke="#a78bfa" strokeWidth="1.2"/>
        <text x={x+6} y={y+20} fill="white" fontSize="7" fontFamily="monospace" fontWeight="bold">{['the','run','far','big','win'][i]}</text>
      </g>
    ))}
    {/* ship */}
    <path d="M100 95 L108 78 L100 82 L92 78 Z" fill="#0ea5e9"/>
    <rect x="97" y="70" width="6" height="12" fill="#38bdf8" opacity="0.6"/>
  </svg>
);

const ThumbMemory = () => (
  <svg viewBox="0 0 200 110" fill="none">
    <rect width="200" height="110" fill="#030712"/>
    <rect x="20" y="35" width="160" height="40" rx="6" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1"/>
    <text x="100" y="62" textAnchor="middle" fill="#a5b4fc" fontSize="13" fontFamily="monospace" fontWeight="bold">the quick fox...</text>
    <rect x="20" y="35" width="160" height="40" rx="6" fill="#030712" opacity="0.9"/>
    <text x="100" y="22" textAnchor="middle" fill="#6366f1" fontSize="10" fontFamily="monospace">MEMORIZE THEN TYPE</text>
    <rect x="60" y="50" width="80" height="16" rx="3" fill="#6366f1" opacity="0.2"/>
    <text x="100" y="62" textAnchor="middle" fill="#818cf8" fontSize="11" fontFamily="monospace">_ _ _ _ _ _</text>
  </svg>
);

const ThumbBoss = () => (
  <svg viewBox="0 0 200 110" fill="none">
    <rect width="200" height="110" fill="#0a0000"/>
    <rect x="20" y="20" width="160" height="16" rx="4" fill="#1a0000" stroke="#ef4444" strokeWidth="1"/>
    <rect x="20" y="20" width="120" height="16" rx="4" fill="#ef4444" opacity="0.8"/>
    <text x="100" y="32" textAnchor="middle" fill="white" fontSize="9" fontFamily="monospace">BOSS HP ████████░░░</text>
    <text x="100" y="70" textAnchor="middle" fill="#fca5a5" fontSize="26" fontFamily="monospace" fontWeight="900">BOSS</text>
    <text x="100" y="90" textAnchor="middle" fill="#dc2626" fontSize="11" fontFamily="monospace">TYPE TO DEAL DAMAGE</text>
  </svg>
);

const ThumbMP = () => (
  <svg viewBox="0 0 200 110" fill="none">
    <rect width="200" height="110" fill="#020617"/>
    {/* P1 */}
    <rect x="10" y="20" width="80" height="70" rx="8" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5"/>
    <circle cx="50" cy="50" r="16" fill="#3b82f6"/>
    <text x="50" y="55" textAnchor="middle" fill="white" fontSize="12" fontFamily="monospace" fontWeight="bold">P1</text>
    {/* VS */}
    <text x="100" y="62" textAnchor="middle" fill="#f1f5f9" fontSize="16" fontFamily="monospace" fontWeight="900">VS</text>
    {/* P2 */}
    <rect x="110" y="20" width="80" height="70" rx="8" fill="#4f1f1f" stroke="#ef4444" strokeWidth="1.5"/>
    <circle cx="150" cy="50" r="16" fill="#ef4444"/>
    <text x="150" y="55" textAnchor="middle" fill="white" fontSize="12" fontFamily="monospace" fontWeight="bold">P2</text>
  </svg>
);

const ThumbHero = () => (
  <svg viewBox="0 0 200 110" fill="none">
    <rect width="200" height="110" fill="#050b1a"/>
    {/* Buildings */}
    <rect x="0" y="10" width="55" height="100" fill="#1a1f2e" stroke="#334155" strokeWidth="1"/>
    <rect x="145" y="15" width="55" height="95" fill="#1a1f2e" stroke="#334155" strokeWidth="1"/>
    {/* Windows */}
    {Array.from({length:8}).map((_, i)=>(
      <rect key={'l'+i} x={6+i%2*25} y={20+Math.floor(i/2)*20} width="14" height="12" rx="2"
        fill={i%3===0?'#fde68a':'#1e293b'} opacity={i%3===0?0.6:0.3}/>
    ))}
    {Array.from({length:8}).map((_, i)=>(
      <rect key={'r'+i} x={151+i%2*25} y={22+Math.floor(i/2)*20} width="14" height="12" rx="2"
        fill={i%2===0?'#bae6fd':'#1e293b'} opacity={i%2===0?0.5:0.3}/>
    ))}
    {/* Spider-Man */}
    <circle cx="100" cy="55" r="12" fill="#dc2626"/>
    <rect x="88" y="62" width="24" height="22" rx="5" fill="#dc2626"/>
    <rect x="80" y="66" width="22" height="8" rx="4" fill="#dc2626"/>
    <rect x="98" y="66" width="22" height="8" rx="4" fill="#dc2626"/>
    {/* Web */}
    <line x1="88" y1="55" x2="55" y2="30" stroke="white" strokeWidth="1.5" opacity="0.7" strokeDasharray="3 2"/>
    <text x="100" y="102" textAnchor="middle" fill="#ef4444" fontSize="9" fontFamily="monospace">SPIDER CLIMB</text>
  </svg>
);

const ThumbTreeJumper = () => (
  <svg viewBox="0 0 200 110" fill="none">
    <rect width="200" height="110" fill="url(#skyg)"/>
    <defs><linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#87ceeb"/><stop offset="100%" stopColor="#a8e6cf"/></linearGradient></defs>
    {/* Trees */}
    {[10,40,70,130,160,190].map((x,i)=>(
      <g key={i}>
        <rect x={x-3} y="70" width="6" height="40" fill="#8b4513"/>
        <ellipse cx={x} cy="65" rx="14" ry="20" fill="#2d7a4f" opacity="0.8"/>
      </g>
    ))}
    {/* Platforms */}
    {[[55,65],[95,45],[135,55]].map(([x,y],i)=>(
      <g key={i}>
        <rect x={x-25} y={y} width="50" height="10" rx="4" fill="#8b6914"/>
        {i===1 && <rect x={x-10} y={y-14} width="20" height="10" rx="4" fill="#22c55e" opacity="0.8"/>}
      </g>
    ))}
    {/* Red panda */}
    <circle cx="55" cy="55" r="8" fill="#d4521a"/>
    <rect x="49" y="60" width="12" height="12" rx="3" fill="#d4521a"/>
  </svg>
);

const STARSHIP_STARS = Array.from({length:30}, (_, i) => ({ cx: ((i*37+11)%199)+1, cy: ((i*53+7)%109)+1, r: (i%5)*0.3+0.4, op: (i%7)*0.08+0.2 }));
const ThumbStarship = () => (
  <svg viewBox="0 0 200 110" fill="none">
    <rect width="200" height="110" fill="#020617"/>
    {STARSHIP_STARS.map((s, i)=>(
      <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="white" opacity={s.op}/>
    ))}
    {[[35,20,'the'],[140,35,'run'],[80,55,'fast'],[160,18,'code']].map(([x,y,w],i)=>(
      <g key={i}>
        <polygon points={`${x},${y} ${x+16},${y+8} ${x+18},${y+22} ${x+8},${y+28} ${x-4},${y+22} ${x-2},${y+8}`} fill="#7c3aed" stroke="#a78bfa" strokeWidth="1"/>
        <text x={x+7} y={y+18} fill="white" fontSize="7" fontFamily="monospace" fontWeight="bold">{w}</text>
      </g>
    ))}
    {/* Ship */}
    <path d="M100 100 L108 82 L100 87 L92 82 Z" fill="#0ea5e9" style={{filter:'drop-shadow(0 0 6px #0ea5e9)'}}/>
    <line x1="95" y1="90" x2="95" y2="105" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round"/>
    <line x1="105" y1="90" x2="105" y2="105" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const ThumbNinja = () => (
  <svg viewBox="0 0 200 110" fill="none">
    <rect width="200" height="110" fill="#0a0500"/>
    {/* Moon */}
    <circle cx="170" cy="20" r="14" fill="#e2e8f0" opacity="0.8"/>
    {/* Mountains */}
    <polygon points="0,110 30,55 60,110" fill="#1c1917" opacity="0.8"/>
    <polygon points="50,110 90,40 130,110" fill="#292524" opacity="0.7"/>
    <polygon points="120,110 155,55 190,110" fill="#1c1917" opacity="0.8"/>
    {/* Ground */}
    <rect x="0" y="85" width="200" height="25" fill="#141010"/>
    <text x="30" y="98" fill="#dc2626" fontSize="10" fontFamily="monospace">⛩</text>
    <text x="150" y="98" fill="#dc2626" fontSize="10" fontFamily="monospace">🎋</text>
    {/* Ninja */}
    <circle cx="55" cy="68" r="10" fill="#111"/>
    <rect x="46" y="51" width="18" height="20" rx="4" fill="#111"/>
    <rect x="45" y="46" width="20" height="5" rx="2" fill="#ef4444"/>
    {/* Rock obstacle */}
    <polygon points="130,85 145,65 160,85" fill="#57534e" stroke="#78716c" strokeWidth="1.5"/>
    <rect x="125" y="56" width="40" height="12" rx="4" fill="#0f172a"/>
    <text x="145" y="67" textAnchor="middle" fill="white" fontSize="8" fontFamily="monospace">jump</text>
  </svg>
);

const GALAXY_STARS = Array.from({length:25}, (_, i) => ({ cx: ((i*41+17)%198)+1, cy: ((i*67+13)%108)+1, r: (i%6)*0.25+0.4, op: (i%8)*0.07+0.25 }));
const ThumbGalaxy = () => (
  <svg viewBox="0 0 200 110" fill="none">
    <rect width="200" height="110" fill="#0f0c29"/>
    {/* Nebula */}
    <ellipse cx="80" cy="50" rx="60" ry="45" fill="#7c3aed" opacity="0.08"/>
    <ellipse cx="150" cy="60" rx="50" ry="35" fill="#0ea5e9" opacity="0.08"/>
    {/* Stars */}
    {GALAXY_STARS.map((s,i)=>(
      <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="white" opacity={s.op}/>
    ))}
    {/* Crystal words */}
    {[[40,30,'#f0abfc','the'],[120,20,'#67e8f9','run'],[75,65,'#86efac','code'],[155,55,'#fde68a','fast']].map(([x,y,c,w],i)=>(
      <g key={i}>
        <polygon points={`${x},${y} ${x+16},${y+7} ${x+18},${y+20} ${x+9},${y+26} ${x-4},${y+20} ${x-2},${y+7}`}
          fill={`${c}20`} stroke={c} strokeWidth="1.5" style={{filter:`drop-shadow(0 0 6px ${c})`}}/>
        <text x={x+7} y={y+17} fill={c} fontSize="7" fontFamily="monospace" fontWeight="bold">{w}</text>
      </g>
    ))}
  </svg>
);

// ─── Game definitions ─────────────────────────────────────────────────────────
const GAMES = [
  { id: 'HERO',      name: 'Spider Climb',      desc: 'Scale a skyscraper. One typo = fatal fall.',     thumb: ThumbHero,      tag: 'EXTREME',  tagColor: '#ef4444' },
  { id: 'JUMPER',    name: 'Tree Jumper',        desc: 'Jump log-to-log as a Red Panda.',               thumb: ThumbTreeJumper,tag: 'ENDLESS',  tagColor: '#22c55e' },
  { id: 'STARSHIP',  name: 'Starship Defender',  desc: 'Blast asteroid words before they hit your ship.',thumb: ThumbStarship,  tag: 'ACTION',   tagColor: '#0ea5e9' },
  { id: 'NINJA',     name: 'Ninja Run',          desc: 'Type words to leap over incoming obstacles.',    thumb: ThumbNinja,     tag: 'NEW 🔥',   tagColor: '#f97316' },
  { id: 'GALAXY',    name: 'Galaxy Drift',       desc: 'Destroy neon crystal enemies in deep space.',   thumb: ThumbGalaxy,    tag: 'NEW 🔥',   tagColor: '#a855f7' },
  { id: '3D',        name: 'Type3D: Space Fleet',desc: 'React 3D Fiber – type flying geometric words.',  thumb: Thumb3D,        tag: '3D',       tagColor: '#3b82f6' },
  { id: 'ZOMBIE',    name: 'Zombie Survival',    desc: 'Entities approach. Type to eliminate them.',     thumb: ThumbZombie,    tag: 'SURVIVAL', tagColor: '#4ade80' },
  { id: 'FALLING',   name: 'Falling Words 2.0',  desc: 'Intense gravity typer with combo multipliers.', thumb: ThumbFalling,   tag: 'COMBO',    tagColor: '#e879f9' },
  { id: 'SPEED',     name: 'Speed Rush',         desc: '60 Seconds. Maximum output pressure.',          thumb: ThumbSpeed,     tag: 'TIMED',    tagColor: '#fb923c' },
  { id: 'RACE',      name: 'Typing Race',        desc: 'Race against brutal AI pacing logic.',          thumb: ThumbRace,      tag: 'RACE',     tagColor: '#facc15' },
  { id: 'SHOOTER',   name: 'Word Shooter',       desc: 'Arcade crosshairs. Classic TOTD style.',        thumb: ThumbShooter,   tag: 'ARCADE',   tagColor: '#22d3ee' },
  { id: 'DEFENDER',  name: 'Space Defender',     desc: 'Defend the core from floating asteroid words.',  thumb: ThumbDefender,  tag: 'DEFEND',   tagColor: '#818cf8' },
  { id: 'MEMORY',    name: 'Memory Flash',       desc: 'See it briefly, then type totally blind.',      thumb: ThumbMemory,    tag: 'MEMORY',   tagColor: '#6366f1' },
  { id: 'BOSS',      name: 'Boss Battle',        desc: 'Massive health bars, enormous text bodies.',    thumb: ThumbBoss,      tag: 'EPIC',     tagColor: '#f87171' },
  { id: 'MP',        name: 'Multiplayer Arena',  desc: 'Live 1v1 typing duels via WebSockets.',         thumb: ThumbMP,        tag: '1v1',      tagColor: '#38bdf8' },
];

const Games = () => {
  const { addXp, addHistoryEntry } = useUserContext();
  const [activeGame, setActiveGame] = useState(null);
  const [showGameModal, setShowGameModal] = useState(false);
  const [finalGameStats, setFinalGameStats] = useState(null);

  const handleGameOver = useCallback((finalScore) => {
    setActiveGame(null);
    const xpReward = Math.max(10, Math.floor(finalScore / 10));
    addXp(xpReward);
    addHistoryEntry({ type: 'game', lessonId: `game-${activeGame}`, wpm: 0, accuracy: 100, errors: 0 });
    setFinalGameStats({ wpm: 'N/A', accuracy: 100, totalStrokes: finalScore, errors: 0, xpEarned: xpReward });
    setShowGameModal(true);
  }, [activeGame, addXp, addHistoryEntry]);

  const renderActiveGame = () => {
    const g = activeGame;
    if (g === '3D')       return <Type3D onGameOver={handleGameOver}/>;
    if (g === 'ZOMBIE')   return <ZombieSurvival onGameOver={handleGameOver}/>;
    if (g === 'FALLING')  return <FallingWords2 onGameOver={handleGameOver}/>;
    if (g === 'SPEED')    return <SpeedRush onGameOver={handleGameOver}/>;
    if (g === 'RACE')     return <TypingRace onGameOver={handleGameOver}/>;
    if (g === 'SHOOTER')  return <WordShooter onGameOver={handleGameOver}/>;
    if (g === 'DEFENDER') return <SpaceDefender onGameOver={handleGameOver}/>;
    if (g === 'MEMORY')   return <MemoryFlash onGameOver={handleGameOver}/>;
    if (g === 'BOSS')     return <BossBattle onGameOver={handleGameOver}/>;
    if (g === 'MP')       return <MultiplayerArena onGameOver={handleGameOver}/>;
    if (g === 'HERO')     return <HeroClimb onGameOver={handleGameOver}/>;
    if (g === 'JUMPER')   return <TreeJumper onGameOver={handleGameOver}/>;
    if (g === 'STARSHIP') return <StarshipDefender onGameOver={handleGameOver}/>;
    if (g === 'NINJA')    return <NinjaRun onGameOver={handleGameOver}/>;
    if (g === 'GALAXY')   return <GalaxyDrift onGameOver={handleGameOver}/>;
    return null;
  };

  if (activeGame) {
    const meta = GAMES.find(g => g.id === activeGame);
    return (
      <div className="w-full h-[80vh] flex flex-col gap-4">
        <div className="flex justify-between items-center glass-panel px-6 py-3 rounded-full">
          <div className="font-bold text-xl flex items-center gap-2">
            <Gamepad2 className="text-primary"/>
            <span>{meta?.name}</span>
            {meta && (
              <span className="text-xs font-black px-2 py-0.5 rounded-full ml-1"
                style={{ background: `${meta.tagColor}22`, color: meta.tagColor, border: `1px solid ${meta.tagColor}55` }}>
                {meta.tag}
              </span>
            )}
          </div>
          <button
            onClick={() => setActiveGame(null)}
            className="btn-primary !bg-red-500 hover:!bg-red-600 !py-1 !px-4 !rounded-lg text-sm"
          >
            ✕ Exit Game
          </button>
        </div>
        <div className="flex-1 w-full relative">
          {renderActiveGame()}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col items-center pb-16">
      {/* ── Header ── */}
      <div className="text-center mb-12 relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(600px circle at 50% -20%, rgba(99,102,241,0.1), transparent)' }}
        />
        <h1 className="text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-400 tracking-tight">
          🕹 Arcade Zone
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Apply your skills in cinematic, high-pressure environments. Earn massive XP from combos and perfect runs.
        </p>
        <div className="flex gap-3 justify-center mt-4 flex-wrap">
          {[['15', 'Games Available'], ['🔥', '2 New Games'], ['⚡', 'Real-time XP']].map(([v, l], i) => (
            <div key={i} className="px-4 py-1.5 rounded-full text-sm font-bold border glass-panel">
              <span className="text-primary">{v}</span>
              <span className="text-slate-400 ml-2">{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 w-full">
        {GAMES.map((game) => {
          const Thumb = game.thumb;
          return (
            <div
              key={game.id}
              className="group cursor-pointer flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              style={{
                background: 'rgba(15,23,42,0.7)',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
              }}
              onClick={() => setActiveGame(game.id)}
              onMouseEnter={e => {
                e.currentTarget.style.border = `1px solid ${game.tagColor}55`;
                e.currentTarget.style.boxShadow = `0 8px 40px ${game.tagColor}30`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)';
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)';
              }}
            >
              {/* Thumbnail */}
              <div className="relative overflow-hidden" style={{ height: 120 }}>
                <Thumb />
                {/* Tag badge */}
                <div
                  className="absolute top-2 left-2 text-xs font-black px-2 py-0.5 rounded-full"
                  style={{ background: `${game.tagColor}22`, color: game.tagColor, border: `1px solid ${game.tagColor}60`, backdropFilter: 'blur(4px)' }}
                >
                  {game.tag}
                </div>
                {/* Hover overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.55)' }}
                >
                  <div className="text-white font-black text-lg px-5 py-2 rounded-full"
                    style={{ background: game.tagColor, boxShadow: `0 0 20px ${game.tagColor}70` }}>
                    ▶ Play Now
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col gap-1.5 flex-1">
                <h3 className="font-bold text-base text-white group-hover:text-primary transition-colors leading-tight">
                  {game.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed flex-1">{game.desc}</p>
                <div
                  className="mt-2 text-xs font-bold text-center py-1.5 rounded-lg transition-all group-hover:opacity-100 opacity-70"
                  style={{ background: `${game.tagColor}18`, color: game.tagColor }}
                >
                  Play Now →
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ResultModal
        isOpen={showGameModal}
        onClose={() => setShowGameModal(false)}
        onRestart={() => setShowGameModal(false)}
        stats={finalGameStats || { wpm: 0, accuracy: 0, totalStrokes: 0, errors: 0 }}
        customContent={finalGameStats && (
          <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4 text-center">
            <div className="text-sm uppercase font-bold text-slate-400 mb-2">XP Earned</div>
            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse">
              +{finalGameStats.xpEarned} XP
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default Games;
