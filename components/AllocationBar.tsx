'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface AllocationBarProps {
  currentChiefsPercentage: number;
  currentEaglesPercentage: number;
  onPurchase: (amount: number, chiefsPercentage: number) => void;
  disabled: boolean;
  totalRaised?: number;
  userChiefsTokens?: number;
  userEaglesTokens?: number;
}

export default function AllocationBar({
  currentChiefsPercentage,
  currentEaglesPercentage,
  onPurchase,
  disabled,
  totalRaised = 0,
  userChiefsTokens = 0,
  userEaglesTokens = 0
}: AllocationBarProps) {
  const [amount, setAmount] = useState<string>('100');
  const [allocation, setAllocation] = useState<number>(50);
  const [isHovering, setIsHovering] = useState(false);

  const handlePurchase = () => {
    const purchaseAmount = parseFloat(amount);
    if (purchaseAmount > 0) {
      onPurchase(purchaseAmount, allocation);
      // Reset form
      setAmount('100');
      setAllocation(50);
    }
  };

  return (
    <div className="glass-card p-8 rounded-2xl">
      <h2 className="text-2xl font-bold mb-6">Buy Into The Entangled Pair</h2>
      
      {/* User Holdings Display */}
      {(userChiefsTokens > 0 || userEaglesTokens > 0) && (
        <div className="mb-6 p-4 bg-dark-bg/30 rounded-lg border border-white/10">
          <div className="text-sm text-gray-400 mb-2">Your Current Holdings</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-chiefs-red rounded-full"></div>
              <div>
                <span className="text-lg font-bold text-white">
                  {(userChiefsTokens / 1000000).toFixed(2)}M
                </span>
                <span className="text-xs text-gray-400 ml-1">Chiefs</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-eagles-green rounded-full"></div>
              <div>
                <span className="text-lg font-bold text-white">
                  {(userEaglesTokens / 1000000).toFixed(2)}M
                </span>
                <span className="text-xs text-gray-400 ml-1">Eagles</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Current allocation display */}
      <div className="mb-8">
        <div className="text-sm text-gray-400 mb-2">Current Market Allocation</div>
        <div className="relative h-12 bg-dark-bg rounded-full overflow-hidden border border-white/10">
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-600 to-red-600/50"
            initial={{ width: '50%' }}
            animate={{ width: `${currentChiefsPercentage}%` }}
            transition={{ type: "spring", stiffness: 100 }}
          />
          <motion.div
            className="absolute right-0 top-0 h-full bg-gradient-to-l from-eagles-green to-eagles-green/50"
            initial={{ width: '50%' }}
            animate={{ width: `${currentEaglesPercentage}%` }}
            transition={{ type: "spring", stiffness: 100 }}
          />
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <span className="text-white font-bold drop-shadow-lg">
              Chiefs {currentChiefsPercentage.toFixed(1)}%
            </span>
            <span className="text-white font-bold drop-shadow-lg">
              Eagles {currentEaglesPercentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Purchase form */}
      <div className="space-y-6">
        {/* Amount input */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Purchase Amount ($)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 bg-dark-bg border border-white/10 rounded-lg text-white focus:border-neon-teal focus:outline-none"
            placeholder="Enter amount"
            min="1"
            disabled={disabled}
          />
        </div>

        {/* Allocation slider */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Your Allocation</label>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={allocation}
              onChange={(e) => setAllocation(Number(e.target.value))}
              className="w-full h-2 bg-dark-bg rounded-lg appearance-none cursor-pointer slider"
              disabled={disabled}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            />
            <div className="absolute inset-0 pointer-events-none">
              <div className="relative h-2 bg-dark-bg rounded-lg overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-chiefs-red to-chiefs-red/50"
                  style={{ width: `${allocation}%` }}
                />
                <div
                  className="absolute right-0 top-0 h-full bg-gradient-to-l from-eagles-green to-eagles-green/50"
                  style={{ width: `${100 - allocation}%` }}
                />
              </div>
            </div>
            
            {/* Slider thumb indicator */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg pointer-events-none"
              style={{ left: `calc(${allocation}% - 12px)` }}
              animate={{
                scale: isHovering ? 1.2 : 1,
              }}
            />
          </div>
          
          {/* Allocation display */}
          <div className="flex justify-between mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-chiefs-red">{allocation}%</div>
              <div className="text-sm text-gray-400">Chiefs</div>
              <div className="text-xs text-gray-500 mt-1">
                ${((parseFloat(amount) || 0) * allocation / 100).toFixed(2)}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                ~{((parseFloat(amount) || 0) * allocation / 100 / 69000 * 1000000000).toLocaleString(undefined, { maximumFractionDigits: 0 })} tokens
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-eagles-green">{100 - allocation}%</div>
              <div className="text-sm text-gray-400">Eagles</div>
              <div className="text-xs text-gray-500 mt-1">
                ${((parseFloat(amount) || 0) * (100 - allocation) / 100).toFixed(2)}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                ~{((parseFloat(amount) || 0) * (100 - allocation) / 100 / 69000 * 1000000000).toLocaleString(undefined, { maximumFractionDigits: 0 })} tokens
              </div>
            </div>
          </div>
        </div>

        {/* Purchase button */}
        <motion.button
          onClick={handlePurchase}
          disabled={disabled || !amount || parseFloat(amount) <= 0}
          className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
            disabled
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-neon-teal text-white hover:shadow-lg hover:shadow-neon-teal/30'
          }`}
          whileHover={!disabled ? { scale: 1.02 } : {}}
          whileTap={!disabled ? { scale: 0.98 } : {}}
        >
          {disabled ? 'Market Graduated' : 'Entangle Tokens'}
        </motion.button>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: white;
          cursor: pointer;
          border-radius: 50%;
          position: relative;
          z-index: 10;
        }
        
        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: white;
          cursor: pointer;
          border-radius: 50%;
          border: none;
          position: relative;
          z-index: 10;
        }
      `}</style>
    </div>
  );
}