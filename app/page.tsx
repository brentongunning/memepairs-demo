'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTokenPair } from '@/hooks/useTokenPair';
import BondingCurve from '@/components/BondingCurve';
import AllocationBar from '@/components/AllocationBar';
import ActivityFeed from '@/components/ActivityFeed';
import GraduationAnimation from '@/components/GraduationAnimation';

export default function Home() {
  const {
    state,
    purchases,
    swaps,
    userTokens,
    makePurchase,
    makeSwap,
    forceGraduate,
    updateMarketCap,
    startSimulation,
    stopSimulation,
    reset,
    isSimulating,
  } = useTokenPair();


  const [showGraduation, setShowGraduation] = useState(false);
  const [hasShownGraduation, setHasShownGraduation] = useState(false);

  // Auto-start simulation for demo
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isSimulating && !state.isGraduated) {
        startSimulation();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Handle graduation
  useEffect(() => {
    if (state.isGraduated && !hasShownGraduation) {
      setShowGraduation(true);
      setHasShownGraduation(true);
      stopSimulation();
    }
  }, [state.isGraduated, hasShownGraduation, stopSimulation]);

  const handleReset = () => {
    reset();
    setHasShownGraduation(false);
    setShowGraduation(false);
  };


  return (
    <main className="min-h-screen dark-bg p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold text-white mb-2 neon-text">
            Entangled Memes Demo
          </h1>
          <p className="text-gray-400">
            {state.isGraduated 
              ? 'Trading Phase - Game determines market sentiment' 
              : 'Launch Phase - Buy into the entangled pair with your preferred allocation'}
          </p>
        </motion.div>

        {/* Reset Button */}
        <div className="flex justify-end mb-4">
          <motion.button
            onClick={handleReset}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-bold border border-red-500/30 hover:bg-red-500/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset Demo
          </motion.button>
        </div>

        {!state.isGraduated ? (
          // Launch Phase
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <BondingCurve
                  totalRaised={state.totalRaised}
                  recentPurchases={purchases.map(p => ({
                    amount: p.amount,
                    timestamp: p.timestamp,
                  }))}
                />
              </div>
              <div>
                <ActivityFeed
                  purchases={purchases}
                  swaps={swaps}
                  isGraduated={state.isGraduated}
                />
              </div>
            </div>
            
            <AllocationBar
              currentChiefsPercentage={state.allocationPercentageChiefs}
              currentEaglesPercentage={state.allocationPercentageEagles}
              onPurchase={(amount, chiefsPercentage) => makePurchase(amount, chiefsPercentage, true)}
              disabled={state.isGraduated}
              userChiefsTokens={userTokens.chiefs}
              userEaglesTokens={userTokens.eagles}
            />

            {/* Demo Controls */}
            <div className="flex justify-center gap-4">
              {!isSimulating && !state.isGraduated && (
                <motion.button
                  onClick={startSimulation}
                  className="px-6 py-3 bg-purple-500 text-white rounded-lg font-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Auto-Buy Simulation
                </motion.button>
              )}
              {state.totalRaised > 50000 && !state.isGraduated && (
                <motion.button
                  onClick={forceGraduate}
                  className="px-6 py-3 bg-neon-teal text-dark-bg rounded-lg font-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Force Graduation
                </motion.button>
              )}
            </div>
          </div>
        ) : (
          // Post-Graduation Phase (Empty)
          <div className="space-y-6">
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                Tokens Graduated! 🎉
              </h2>
              <p className="text-gray-400">
                Market cap reached $69k - Tokens are now graduated
              </p>
            </motion.div>
          </div>
        )}

        {/* Graduation Animation */}
        <GraduationAnimation
          show={showGraduation}
          chiefsCirculating={state.chiefsCirculating}
          eaglesCirculating={state.eaglesCirculating}
          onComplete={() => setShowGraduation(false)}
        />
      </div>
    </main>
  );
}