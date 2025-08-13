'use client';

import { motion } from 'framer-motion';
import { GRADUATION_MARKET_CAP } from '@/lib/tokenPair';

interface BondingCurveProps {
  totalRaised: number;
  recentPurchases: Array<{ amount: number; timestamp: number }>;
}

export default function BondingCurve({ totalRaised, recentPurchases }: BondingCurveProps) {
  const progress = (totalRaised / GRADUATION_MARKET_CAP) * 100;
  const curveHeight = 300;
  const curveWidth = 600;
  
  // Generate curve path
  const generateCurvePath = () => {
    const points = [];
    for (let i = 0; i <= 100; i++) {
      const x = (i / 100) * curveWidth;
      // Exponential curve: y = a * e^(b * x)
      const y = curveHeight - (curveHeight * 0.9 * Math.pow(i / 100, 1.5));
      points.push(`${x},${y}`);
    }
    return `M ${points.join(' L ')}`;
  };

  const currentX = (progress / 100) * curveWidth;
  const currentY = curveHeight - (curveHeight * 0.9 * Math.pow(progress / 100, 1.5));

  return (
    <div className="glass-card p-8 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Bonding Curve</h2>
        <div className="text-right">
          <div className="text-sm text-gray-400">Total Raised</div>
          <div className="text-2xl font-bold text-neon-teal">
            ${totalRaised.toLocaleString()} / ${GRADUATION_MARKET_CAP.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="relative">
        <svg width={curveWidth} height={curveHeight} className="overflow-visible">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="60" height="30" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width={curveWidth} height={curveHeight} fill="url(#grid)" />
          
          {/* Gradient for curve fill */}
          <defs>
            <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6B46C1" stopOpacity="0.3" />
              <stop offset={`${progress}%`} stopColor="#00D4AA" stopOpacity="0.3" />
              <stop offset={`${progress}%`} stopColor="#00D4AA" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#00D4AA" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {/* Curve fill */}
          <path
            d={`${generateCurvePath()} L ${curveWidth},${curveHeight} L 0,${curveHeight} Z`}
            fill="url(#curveGradient)"
          />
          
          {/* Main curve line */}
          <path
            d={generateCurvePath()}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
          />
          
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6B46C1" />
              <stop offset={`${progress}%`} stopColor="#00D4AA" />
              <stop offset="100%" stopColor="#888888" />
            </linearGradient>
          </defs>
          
          {/* Current position indicator */}
          <motion.circle
            cx={currentX}
            cy={currentY}
            r="8"
            fill="#00D4AA"
            className="drop-shadow-[0_0_10px_rgba(0,212,170,0.8)]"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
          
          {/* Purchase animations */}
          {recentPurchases.slice(-5).map((purchase, i) => (
            <motion.circle
              key={purchase.timestamp}
              cx={currentX}
              cy={currentY}
              r="4"
              fill="#00D4AA"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ 
                scale: [0, 3, 0],
                opacity: [1, 0.5, 0],
                y: -50
              }}
              transition={{ duration: 2 }}
            />
          ))}
        </svg>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="h-2 bg-dark-card rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-neon-teal"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 50 }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span>$0</span>
            <span className="text-neon-teal font-bold">{progress.toFixed(1)}%</span>
            <span>${GRADUATION_MARKET_CAP.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}