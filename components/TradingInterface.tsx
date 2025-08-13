'use client';

import { motion } from 'framer-motion';
import { TokenPairState } from '@/lib/tokenPair';
import PairPool from './PairPool';
import MarketCard from './MarketCard';
import SwapInterface from './SwapInterface';

interface TradingInterfaceProps {
  state: TokenPairState;
  onSwap: (from: 'chiefs' | 'eagles', amount: number) => void;
  combinedMarketCap: number;
}

export default function TradingInterface({ state, onSwap, combinedMarketCap }: TradingInterfaceProps) {
  return (
    <div className="space-y-6">
      {/* Combined Market Cap Display */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-sm text-gray-400 mb-2">Combined Market Cap</div>
        <div className="text-5xl font-bold text-white neon-text">
          ${combinedMarketCap.toLocaleString()}
        </div>
        <div className={`text-sm mt-2 ${combinedMarketCap > 69000 ? 'text-green-400' : 'text-red-400'}`}>
          {combinedMarketCap > 69000 ? '↑' : '↓'} {((combinedMarketCap - 69000) / 69000 * 100).toFixed(2)}% from graduation
        </div>
      </motion.div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chiefs Market */}
        <MarketCard
          token="chiefs"
          circulating={state.chiefsCirculating}
          price={state.chiefsPrice}
          marketCap={state.chiefsPrice * state.chiefsCirculating}
        />

        {/* Pair Pool */}
        <div className="lg:col-span-1">
          <PairPool
            chiefsInPool={state.chiefsInPool}
            eaglesInPool={state.eaglesInPool}
            recentSwaps={[]}
          />
        </div>

        {/* Eagles Market */}
        <MarketCard
          token="eagles"
          circulating={state.eaglesCirculating}
          price={state.eaglesPrice}
          marketCap={state.eaglesPrice * state.eaglesCirculating}
        />
      </div>

      {/* Swap Interface */}
      <SwapInterface
        chiefsCirculating={state.chiefsCirculating}
        eaglesCirculating={state.eaglesCirculating}
        onSwap={onSwap}
      />
    </div>
  );
}