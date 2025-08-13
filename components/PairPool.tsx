'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { TOTAL_SUPPLY_PER_TOKEN } from '@/lib/tokenPair';

interface PairPoolProps {
  chiefsInPool: number;
  eaglesInPool: number;
  recentSwaps: Array<{ from: 'chiefs' | 'eagles'; amount: number; timestamp: number }>;
}

export default function PairPool({ chiefsInPool, eaglesInPool, recentSwaps }: PairPoolProps) {
  const [particles, setParticles] = useState<Array<{ id: number; from: 'chiefs' | 'eagles' }>>([]);
  
  // Generate swap animation particles
  useEffect(() => {
    if (recentSwaps.length > 0) {
      const latestSwap = recentSwaps[0];
      const newParticles = Array.from({ length: Math.min(5, Math.floor(latestSwap.amount / 10_000_000)) }, (_, i) => ({
        id: Date.now() + i,
        from: latestSwap.from,
      }));
      setParticles(prev => [...prev, ...newParticles].slice(-20));
    }
  }, [recentSwaps]);

  const chiefsPercentage = (chiefsInPool / TOTAL_SUPPLY_PER_TOKEN) * 100;
  const eaglesPercentage = (eaglesInPool / TOTAL_SUPPLY_PER_TOKEN) * 100;

  return (
    <div className="glass-card p-6 rounded-2xl h-full relative overflow-hidden">
      <h3 className="text-xl font-bold mb-4 text-center">Pair Pool</h3>
      
      {/* Portal Visualization */}
      <div className="relative h-64 mb-6">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
          {/* Portal Background */}
          <defs>
            <radialGradient id="portalGradient">
              <stop offset="0%" stopColor="#6B46C1" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#00D4AA" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Rotating portal rings */}
          <motion.circle
            cx="100"
            cy="100"
            r="60"
            fill="none"
            stroke="url(#portalGradient)"
            strokeWidth="2"
            opacity="0.5"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          
          <motion.circle
            cx="100"
            cy="100"
            r="45"
            fill="none"
            stroke="#00D4AA"
            strokeWidth="1"
            opacity="0.3"
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          
          <motion.circle
            cx="100"
            cy="100"
            r="30"
            fill="none"
            stroke="#6B46C1"
            strokeWidth="1"
            opacity="0.3"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Center portal */}
          <circle cx="100" cy="100" r="20" fill="url(#portalGradient)" filter="url(#glow)" />
          
          {/* Swap particles */}
          {particles.map(particle => (
            <motion.circle
              key={particle.id}
              cx={particle.from === 'chiefs' ? 30 : 170}
              cy="100"
              r="3"
              fill={particle.from === 'chiefs' ? '#E31837' : '#004C54'}
              initial={{ opacity: 1 }}
              animate={{
                cx: particle.from === 'chiefs' ? 170 : 30,
                opacity: [1, 0.5, 0],
              }}
              transition={{ duration: 2 }}
              onAnimationComplete={() => {
                setParticles(prev => prev.filter(p => p.id !== particle.id));
              }}
            />
          ))}
        </svg>
        
        {/* Token labels */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 text-chiefs-red font-bold">
          Chiefs
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-eagles-green font-bold">
          Eagles
        </div>
      </div>

      {/* Pool Balance */}
      <div className="space-y-4">
        <div className="text-center text-sm text-gray-400 mb-2">
          Pool Balance (1B Total)
        </div>
        
        {/* Chiefs in pool */}
        <div>
          <div className="flex justify-between mb-1 text-sm">
            <span className="text-chiefs-red">Chiefs</span>
            <span>{(chiefsInPool / 1_000_000).toFixed(0)}M ({chiefsPercentage.toFixed(1)}%)</span>
          </div>
          <div className="h-6 bg-dark-bg rounded overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-chiefs-red to-chiefs-red/50"
              initial={{ width: 0 }}
              animate={{ width: `${chiefsPercentage}%` }}
              transition={{ type: "spring", stiffness: 100 }}
            />
          </div>
        </div>
        
        {/* Eagles in pool */}
        <div>
          <div className="flex justify-between mb-1 text-sm">
            <span className="text-eagles-green">Eagles</span>
            <span>{(eaglesInPool / 1_000_000).toFixed(0)}M ({eaglesPercentage.toFixed(1)}%)</span>
          </div>
          <div className="h-6 bg-dark-bg rounded overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-eagles-green to-eagles-green/50"
              initial={{ width: 0 }}
              animate={{ width: `${eaglesPercentage}%` }}
              transition={{ type: "spring", stiffness: 100 }}
            />
          </div>
        </div>
        
        {/* Swap rate */}
        <div className="text-center mt-4 p-3 bg-dark-bg rounded-lg">
          <div className="text-xs text-gray-400">Swap Rate</div>
          <div className="text-lg font-bold text-neon-teal">1:1</div>
          <div className="text-xs text-gray-500">Always Equal</div>
        </div>
      </div>
    </div>
  );
}