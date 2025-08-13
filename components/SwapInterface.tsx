'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface SwapInterfaceProps {
  chiefsCirculating: number;
  eaglesCirculating: number;
  onSwap: (from: 'chiefs' | 'eagles', amount: number) => void;
}

export default function SwapInterface({ chiefsCirculating, eaglesCirculating, onSwap }: SwapInterfaceProps) {
  const [from, setFrom] = useState<'chiefs' | 'eagles'>('chiefs');
  const [amount, setAmount] = useState<string>('1000000');
  const [isSwapping, setIsSwapping] = useState(false);

  const to = from === 'chiefs' ? 'eagles' : 'chiefs';
  const maxAmount = from === 'chiefs' ? chiefsCirculating : eaglesCirculating;

  const handleSwap = async () => {
    const swapAmount = parseFloat(amount);
    if (swapAmount > 0 && swapAmount <= maxAmount) {
      setIsSwapping(true);
      onSwap(from, swapAmount);
      
      // Animation delay
      setTimeout(() => {
        setIsSwapping(false);
        setAmount('1000000');
      }, 1000);
    }
  };

  const handleFlip = () => {
    setFrom(to);
  };

  return (
    <motion.div
      className="glass-card p-8 rounded-2xl max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-2xl font-bold mb-6 text-center">Swap Tokens</h3>

      <div className="space-y-4">
        {/* From Token */}
        <div className="p-4 bg-dark-bg rounded-xl">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">From</span>
            <span className="text-xs text-gray-500">
              Balance: {(maxAmount / 1_000_000).toFixed(2)}M
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              className={`px-4 py-2 rounded-lg font-bold ${
                from === 'chiefs' 
                  ? 'bg-chiefs-red text-white' 
                  : 'bg-eagles-green text-white'
              }`}
            >
              {from === 'chiefs' ? '🏈 Chiefs' : '🦅 Eagles'}
            </button>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-transparent text-right text-xl font-bold text-white outline-none"
              placeholder="0"
            />
          </div>
          <button
            onClick={() => setAmount(maxAmount.toString())}
            className="text-xs text-neon-teal hover:text-neon-teal/80 mt-2"
          >
            Max
          </button>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <motion.button
            onClick={handleFlip}
            className="p-3 bg-dark-card rounded-full border border-white/10 hover:border-neon-teal/50"
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6 text-neon-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </motion.button>
        </div>

        {/* To Token */}
        <div className="p-4 bg-dark-bg rounded-xl">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">To</span>
            <span className="text-xs text-gray-500">
              Balance: {((to === 'chiefs' ? chiefsCirculating : eaglesCirculating) / 1_000_000).toFixed(2)}M
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              className={`px-4 py-2 rounded-lg font-bold ${
                to === 'chiefs' 
                  ? 'bg-chiefs-red text-white' 
                  : 'bg-eagles-green text-white'
              }`}
            >
              {to === 'chiefs' ? '🏈 Chiefs' : '🦅 Eagles'}
            </button>
            <div className="flex-1 text-right text-xl font-bold text-white">
              {amount || '0'}
            </div>
          </div>
        </div>

        {/* Swap Info */}
        <div className="p-3 bg-dark-bg/50 rounded-lg text-sm">
          <div className="flex justify-between text-gray-400">
            <span>Swap Rate</span>
            <span className="text-white">1:1</span>
          </div>
          <div className="flex justify-between text-gray-400 mt-1">
            <span>Fee</span>
            <span className="text-white">0%</span>
          </div>
        </div>

        {/* Swap Button */}
        <motion.button
          onClick={handleSwap}
          disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > maxAmount || isSwapping}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            isSwapping
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-neon-teal text-white hover:shadow-lg hover:shadow-neon-teal/30'
          }`}
          whileHover={!isSwapping ? { scale: 1.02 } : {}}
          whileTap={!isSwapping ? { scale: 0.98 } : {}}
        >
          {isSwapping ? (
            <span className="flex items-center justify-center gap-2">
              <motion.div
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              Swapping...
            </span>
          ) : (
            'Swap'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}