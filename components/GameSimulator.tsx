'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { GameState, GameEvent } from '@/lib/gameEngine';

interface GameSimulatorProps {
  gameState: GameState;
  events: GameEvent[];
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export default function GameSimulator({
  gameState,
  events,
  isRunning,
  onStart,
  onPause,
  onReset
}: GameSimulatorProps) {
  const getQuarterDisplay = () => {
    if (gameState.quarter === 'OT') return 'OT';
    if (gameState.quarter === 'FINAL') return 'FINAL';
    return `Q${gameState.quarter}`;
  };

  return (
    <div className="glass-card p-6 rounded-2xl">
      {/* Scoreboard */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Super Bowl LIX</h2>
          <div className="flex gap-2">
            {!isRunning && !gameState.isGameOver && (
              <motion.button
                onClick={onStart}
                className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Game
              </motion.button>
            )}
            {isRunning && !gameState.isGameOver && (
              <motion.button
                onClick={onPause}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Pause
              </motion.button>
            )}
            <motion.button
              onClick={onReset}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reset
            </motion.button>
          </div>
        </div>

        {/* Score Display */}
        <div className="bg-dark-bg rounded-xl p-6 border border-white/10">
          <div className="grid grid-cols-3 gap-4">
            {/* Chiefs Score */}
            <div className="text-center">
              <div className="text-3xl mb-2">🏈</div>
              <div className="text-xl font-bold text-chiefs-red mb-1">Chiefs</div>
              <motion.div
                className="text-5xl font-bold text-white"
                key={gameState.chiefsScore}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                {gameState.chiefsScore}
              </motion.div>
            </div>

            {/* Game Info */}
            <div className="text-center flex flex-col justify-center">
              <div className="text-2xl font-bold text-neon-teal mb-2">
                {getQuarterDisplay()}
              </div>
              {gameState.quarter !== 'FINAL' && (
                <div className="text-xl font-mono text-white">
                  {gameState.timeRemaining}
                </div>
              )}
              {gameState.possession && gameState.quarter !== 'FINAL' && (
                <div className="text-sm text-gray-400 mt-2">
                  {gameState.possession === 'chiefs' ? '🏈 Chiefs ball' : '🦅 Eagles ball'}
                </div>
              )}
            </div>

            {/* Eagles Score */}
            <div className="text-center">
              <div className="text-3xl mb-2">🦅</div>
              <div className="text-xl font-bold text-eagles-green mb-1">Eagles</div>
              <motion.div
                className="text-5xl font-bold text-white"
                key={gameState.eaglesScore}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                {gameState.eaglesScore}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Last Play */}
      <div className="mb-4">
        <div className="text-sm text-gray-400 mb-2">Last Play</div>
        <AnimatePresence mode="wait">
          <motion.div
            key={gameState.lastPlay}
            className="p-3 bg-dark-bg rounded-lg text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {gameState.lastPlay}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Recent Events */}
      <div>
        <div className="text-sm text-gray-400 mb-2">Play-by-Play</div>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          <AnimatePresence>
            {events.slice(-5).reverse().map((event, index) => (
              <motion.div
                key={`${event.description}-${index}`}
                className={`p-2 rounded-lg text-sm ${
                  event.team === 'chiefs' 
                    ? 'bg-chiefs-red/10 border border-chiefs-red/30' 
                    : 'bg-eagles-green/10 border border-eagles-green/30'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className={event.team === 'chiefs' ? 'text-chiefs-red' : 'text-eagles-green'}>
                  {event.team === 'chiefs' ? 'Chiefs' : 'Eagles'}
                </span>
                <span className="text-white ml-2">{event.description}</span>
                {event.points > 0 && (
                  <span className="text-neon-teal ml-2">+{event.points}</span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Game Over Message */}
      {gameState.isGameOver && (
        <motion.div
          className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-neon-teal/20 rounded-lg text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-2xl font-bold text-white mb-2">Game Over!</div>
          <div className="text-xl">
            {gameState.chiefsScore > gameState.eaglesScore ? (
              <span className="text-chiefs-red">Chiefs Win!</span>
            ) : gameState.eaglesScore > gameState.chiefsScore ? (
              <span className="text-eagles-green">Eagles Win!</span>
            ) : (
              <span className="text-yellow-400">It's a Tie!</span>
            )}
          </div>
          <div className="text-lg mt-2 text-gray-300">
            Final Score: Chiefs {gameState.chiefsScore} - Eagles {gameState.eaglesScore}
          </div>
        </motion.div>
      )}
    </div>
  );
}