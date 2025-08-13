'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTokenPair } from '@/hooks/useTokenPair';
import { useGameSimulation } from '@/hooks/useGameSimulation';
import { useBotTrading } from '@/hooks/useBotTrading';
import BondingCurve from '@/components/BondingCurve';
import AllocationBar from '@/components/AllocationBar';
import ActivityFeed from '@/components/ActivityFeed';
import GraduationAnimation from '@/components/GraduationAnimation';
import TradingInterface from '@/components/TradingInterface';
import GameSimulator from '@/components/GameSimulator';
import PairPool from '@/components/PairPool';

export default function Home() {
  const {
    state,
    purchases,
    swaps,
    makePurchase,
    makeSwap,
    forceGraduate,
    updateMarketCap,
    startSimulation,
    stopSimulation,
    reset,
    isSimulating,
  } = useTokenPair();

  const {
    gameState,
    events,
    isRunning: isGameRunning,
    startGame,
    pauseGame,
    resetGame,
  } = useGameSimulation((chiefsScore, eaglesScore) => {
    // Trigger bot trading on score changes
    if (state.isGraduated) {
      // Market reacts to score changes
      const scoreDiff = chiefsScore - eaglesScore;
      const marketReaction = 69000 + (scoreDiff * 500); // Market cap changes with score
      updateMarketCap(Math.max(50000, marketReaction)); // Keep minimum at 50k
    }
  });

  const { activeBots } = useBotTrading({
    isEnabled: state.isGraduated && isGameRunning,
    chiefsScore: gameState.chiefsScore,
    eaglesScore: gameState.eaglesScore,
    chiefsCirculating: state.chiefsCirculating,
    eaglesCirculating: state.eaglesCirculating,
    onSwap: makeSwap,
  });

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

  // Auto-start game after graduation
  useEffect(() => {
    if (state.isGraduated && !showGraduation && !isGameRunning) {
      const timer = setTimeout(() => {
        startGame();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.isGraduated, showGraduation, isGameRunning, startGame]);

  const handleReset = () => {
    reset();
    resetGame();
    setHasShownGraduation(false);
    setShowGraduation(false);
  };

  // Get recent swaps for pool animation
  const recentSwaps = swaps.slice(-10).map(s => ({
    from: s.from,
    amount: s.amount,
    timestamp: s.timestamp,
  }));

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
            Memecoin Pairs Demo
          </h1>
          <p className="text-gray-400">
            {state.isGraduated 
              ? 'Trading Phase - Game determines market sentiment' 
              : 'Launch Phase - Buy into the pair with your preferred allocation'}
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
              onPurchase={makePurchase}
              disabled={state.isGraduated}
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
          // Trading Phase
          <div className="space-y-6">
            {/* Game Simulator */}
            <GameSimulator
              gameState={gameState}
              events={events}
              isRunning={isGameRunning}
              onStart={startGame}
              onPause={pauseGame}
              onReset={resetGame}
            />

            {/* Trading Interface */}
            <TradingInterface
              state={state}
              onSwap={makeSwap}
              combinedMarketCap={state.combinedMarketCap}
            />

            {/* Bot Activity Indicator */}
            {activeBots > 0 && (
              <motion.div
                className="fixed bottom-4 right-4 px-4 py-2 bg-dark-card rounded-lg border border-neon-teal/30"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-neon-teal rounded-full animate-pulse" />
                  <span className="text-sm text-gray-400">
                    {activeBots} bots trading
                  </span>
                </div>
              </motion.div>
            )}

            {/* Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-3">
                <ActivityFeed
                  purchases={purchases}
                  swaps={swaps}
                  isGraduated={state.isGraduated}
                />
              </div>
            </div>
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