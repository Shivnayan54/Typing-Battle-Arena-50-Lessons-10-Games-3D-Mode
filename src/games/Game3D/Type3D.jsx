/* eslint-disable */
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Stars, Float } from '@react-three/drei';
import { generateRandomWords } from '../../utils/generateText';
import * as THREE from 'three';

// Explosion effect component
const ParticleExplosion = ({ position, color = '#3b82f6', onComplete }) => {
  const particlesCount = 20;
  const meshRef = useRef();
  const dummy = new THREE.Object3D();
  
  // Create randomized particle data
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < particlesCount; i++) {
      const t = Math.random() * Math.PI * 2;
      const p = Math.random();
      const speed = Math.random() * 0.1 + 0.05;
      temp.push({
        x: Math.cos(t) * p * 2,
        y: Math.sin(t) * p * 2,
        z: (Math.random() - 0.5) * 2,
        speed,
        life: 1.0
      });
    }
    return temp;
  }, []);

  useFrame((state, delta) => {
    let alive = false;
    particles.forEach((p, i) => {
      if (p.life > 0) {
        alive = true;
        p.life -= delta * 1.5;
        p.x += p.x * p.speed;
        p.y += p.y * p.speed;
        p.z += p.z * p.speed;
        
        dummy.position.set(position[0] + p.x, position[1] + p.y, position[2] + p.z);
        const scale = p.life * 0.2;
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      } else {
        dummy.scale.set(0,0,0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    
    if (!alive && onComplete) {
      onComplete();
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, particlesCount]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </instancedMesh>
  );
};

// Word entity falling towards camera
const FloatingWord = ({ id, word, startPos, activeInput, activeTarget, onMiss, onType, isTarget }) => {
  const groupRef = useRef();
  
  // Calculate display string (highlight matching part)
  const typedPart = isTarget ? activeInput : '';
  const remainingPart = word.substring(typedPart.length);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Move towards camera (z increases from -15 to +5)
    groupRef.current.position.z += delta * 2;
    
    // Rotation for floatiness
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime + id) * 0.2;
    
    // Add miss logic
    if (groupRef.current.position.z > 5) {
      onMiss(id);
    }
  });

  return (
    <group ref={groupRef} position={startPos}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* Glow behind targeted word */}
        {isTarget && (
          <mesh position={[0, 0, -0.1]}>
             <planeGeometry args={[word.length * 0.5 + 1, 1.5]} />
             <meshBasicMaterial color="#3b82f6" transparent opacity={0.2} />
          </mesh>
        )}
        
        <Text
          fontSize={1}
          color="#10b981"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          {typedPart}
          <Text
            fontSize={1}
            color={isTarget ? "#ffffff" : "#cbd5e1"}
            anchorX="left"
            anchorY="middle"
            position={[typedPart.length * 0.25, 0, 0]} // Approximate offset
            outlineWidth={0.05}
            outlineColor="#000000"
          >
            {remainingPart}
          </Text>
        </Text>
      </Float>
    </group>
  );
};

export const Type3D = ({ onGameOver }) => {
  const [words, setWords] = useState([]);
  const [activeInput, setActiveInput] = useState('');
  const [activeTargetId, setActiveTargetId] = useState(null);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [explosions, setExplosions] = useState([]);
  const [totalStrokes, setTotalStrokes] = useState(0);
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const spawnTimerRef = useRef(null);

  // Spawn logic
  useEffect(() => {
    spawnTimerRef.current = setInterval(() => {
      const word = generateRandomWords(1).split(' ')[0];
      const x = (Math.random() - 0.5) * 12;
      const y = (Math.random() - 0.5) * 6;
      setWords(prev => [...prev, { id: Date.now(), text: word, pos: [x, y, -15] }]);
    }, 1500);
    return () => clearInterval(spawnTimerRef.current);
  }, []);

  // Keyboard hook in the 3D scene's parent wrapper
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore non character keys briefly
      if (e.key.length > 1 && e.key !== 'Backspace') return;
      
      if (!startTime) setStartTime(Date.now());
      const char = e.key.toLowerCase();
      if (char !== 'backspace') setTotalStrokes(s => s + 1);
      
      if (char === 'backspace') {
        setActiveInput(prev => prev.slice(0, -1));
        return;
      }
      
      // If we have an active target, we must type it
      if (activeTargetId) {
        const targetWord = words.find(w => w.id === activeTargetId);
        if (targetWord) {
          const expectedChar = targetWord.text[activeInput.length];
          if (char === expectedChar?.toLowerCase()) {
             const newInput = activeInput + char;
             setActiveInput(newInput);
             
             // Check if completed
             if (newInput === targetWord.text) {
               // Explode!
               setExplosions(prev => [...prev, { id: Date.now(), pos: targetWord.pos }]);
               // Remove word
               setWords(prev => prev.filter(w => w.id !== activeTargetId));
               setActiveTargetId(null);
               setActiveInput('');
               setScore(prev => prev + 100);
             }
          } else {
             // Miss penalty (shake screen? play sound?)
             setErrors(err => err + 1);
             setScore(prev => Math.max(0, prev - 10));
          }
        } else {
          setActiveTargetId(null);
          setActiveInput('');
        }
      } else {
        // No active target, let's find one that starts with this char
        const potentialTarget = words.find(w => w.text.toLowerCase().startsWith(char));
        if (potentialTarget) {
          setActiveTargetId(potentialTarget.id);
          setActiveInput(char);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [words, activeInput, activeTargetId]);

  const handleMiss = (id) => {
    setWords(prev => prev.filter(w => w.id !== id));
    setHealth(prev => {
      const nextH = prev - 10;
      if (nextH <= 0) {
        const duration = startTime ? (Date.now() - startTime) / 60000 : 0.1;
        const wpm = Math.round((totalStrokes / 5) / duration);
        const accuracy = totalStrokes > 0 ? Math.round(((totalStrokes - errors) / totalStrokes) * 100) : 100;
        onGameOver({ score, wpm, accuracy, errors, totalStrokes });
      }
      return nextH;
    });
    if (activeTargetId === id) {
      setActiveTargetId(null);
      setActiveInput('');
    }
  };

  const removeExplosion = (id) => {
    setExplosions(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className="w-full h-full relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl">
      {/* 2D HUD */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 pointer-events-none text-white">
         <div className="font-bold text-2xl drop-shadow-lg">Score: <span className="text-blue-400">{score}</span></div>
         <div className="flex gap-2 items-center">
            <span className="font-bold drop-shadow-lg">Hull Integrity:</span>
            <div className="w-48 h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
               <div className="h-full bg-gradient-to-r from-red-500 to-green-500 transition-all duration-300" style={{width: `${health}%`}}></div>
            </div>
         </div>
      </div>
      
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <color attach="background" args={['#0f172a']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {words.map(w => (
          <FloatingWord 
            key={w.id} 
            id={w.id} 
            word={w.text} 
            startPos={w.pos}
            activeInput={activeInput}
            isTarget={activeTargetId === w.id}
            onMiss={handleMiss}
          />
        ))}

        {explosions.map(e => (
          <ParticleExplosion key={e.id} position={e.pos} onComplete={() => removeExplosion(e.id)} />
        ))}
      </Canvas>
    </div>
  );
};

export default Type3D;
