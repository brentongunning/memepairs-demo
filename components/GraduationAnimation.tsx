'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { TOTAL_SUPPLY_PER_TOKEN } from '@/lib/tokenPair';

interface GraduationAnimationProps {
  show: boolean;
  chiefsCirculating: number;
  eaglesCirculating: number;
  onComplete: () => void;
}

export default function GraduationAnimation({
  show,
  chiefsCirculating,
  eaglesCirculating,
  onComplete
}: GraduationAnimationProps) {
  const [phase, setPhase] = useState<'explosion' | 'distribution' | 'complete'>('explosion');

  useEffect(() => {
    if (show) {
      setPhase('explosion');
      const timer1 = setTimeout(() => setPhase('distribution'), 1500);
      const timer2 = setTimeout(() => {
        setPhase('complete');
        onComplete();
      }, 4000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [show, onComplete]);

  const chiefsInPool = TOTAL_SUPPLY_PER_TOKEN - chiefsCirculating;
  const eaglesInPool = TOTAL_SUPPLY_PER_TOKEN - eaglesCirculating;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative w-full max-w-4xl">
            {/* Explosion Phase */}
            {phase === 'explosion' && (
              <motion.div
                className="text-center"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 1] }}
                transition={{ duration: 1 }}
              >
                <h1 className="text-6xl font-bold text-white mb-4 neon-text">
                  GRADUATION!
                </h1>
                <div className="text-2xl text-neon-teal">
                  $69,000 Market Cap Reached!
                </div>
                
                {/* Explosion particles */}
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-neon-teal rounded-full"
                    initial={{
                      x: 0,
                      y: 0,
                      opacity: 1,
                    }}
                    animate={{
                      x: Math.cos((i / 20) * Math.PI * 2) * 200,
                      y: Math.sin((i / 20) * Math.PI * 2) * 200,
                      opacity: 0,
                    }}
                    transition={{ duration: 1, delay: 0.5 }}
                    style={{
                      left: '50%',
                      top: '50%',
                    }}
                  />
                ))}
              </motion.div>
            )}

            {/* Distribution Phase */}
            {phase === 'distribution' && (
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-4xl font-bold text-center text-white mb-8">
                  Token Distribution
                </h2>
                
                <div className="grid grid-cols-2 gap-8">
                  {/* Circulating Supply */}
                  <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-4 text-neon-teal">
                      Circulating Supply (1B Total)
                    </h3>
                    
                    <motion.div
                      className="space-y-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-chiefs-red">Chiefs</span>
                          <span>{(chiefsCirculating / 1_000_000).toFixed(0)}M</span>
                        </div>
                        <div className="h-8 bg-dark-bg rounded overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-chiefs-red to-chiefs-red/50"
                            initial={{ width: 0 }}
                            animate={{ width: `${(chiefsCirculating / TOTAL_SUPPLY_PER_TOKEN) * 100}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-eagles-green">Eagles</span>
                          <span>{(eaglesCirculating / 1_000_000).toFixed(0)}M</span>
                        </div>
                        <div className="h-8 bg-dark-bg rounded overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-eagles-green to-eagles-green/50"
                            initial={{ width: 0 }}
                            animate={{ width: `${(eaglesCirculating / TOTAL_SUPPLY_PER_TOKEN) * 100}%` }}
                            transition={{ duration: 1, delay: 0.7 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Pair Pool */}
                  <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-4 text-purple-400">
                      Pair Pool (1B Total)
                    </h3>
                    
                    <motion.div
                      className="space-y-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-chiefs-red">Chiefs</span>
                          <span>{(chiefsInPool / 1_000_000).toFixed(0)}M</span>
                        </div>
                        <div className="h-8 bg-dark-bg rounded overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-chiefs-red to-chiefs-red/50"
                            initial={{ width: 0 }}
                            animate={{ width: `${(chiefsInPool / TOTAL_SUPPLY_PER_TOKEN) * 100}%` }}
                            transition={{ duration: 1, delay: 0.9 }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-eagles-green">Eagles</span>
                          <span>{(eaglesInPool / 1_000_000).toFixed(0)}M</span>
                        </div>
                        <div className="h-8 bg-dark-bg rounded overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-eagles-green to-eagles-green/50"
                            initial={{ width: 0 }}
                            animate={{ width: `${(eaglesInPool / TOTAL_SUPPLY_PER_TOKEN) * 100}%` }}
                            transition={{ duration: 1, delay: 1.1 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                <motion.div
                  className="text-center text-xl text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  Trading Phase Begins...
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}