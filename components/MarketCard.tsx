'use client';

import { motion } from 'framer-motion';
import { TOTAL_SUPPLY_PER_TOKEN } from '@/lib/tokenPair';

interface MarketCardProps {
  token: 'chiefs' | 'eagles';
  circulating: number;
  price: number;
  marketCap: number;
}

export default function MarketCard({ token, circulating, price, marketCap }: MarketCardProps) {
  const isChiefs = token === 'chiefs';
  const colorClass = isChiefs ? 'text-chiefs-red' : 'text-eagles-green';
  const bgGradient = isChiefs 
    ? 'from-chiefs-red/20 to-chiefs-red/5' 
    : 'from-eagles-green/20 to-eagles-green/5';
  
  const circulatingPercentage = (circulating / TOTAL_SUPPLY_PER_TOKEN) * 100;
  
  // Calculate 24h change (mock data for demo)
  const change24h = isChiefs ? 12.5 : -8.3;

  return (
    <motion.div
      className={`glass-card p-6 rounded-2xl bg-gradient-to-b ${bgGradient} border ${
        isChiefs ? 'border-chiefs-red/30' : 'border-eagles-green/30'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-2xl font-bold ${colorClass}`}>
          {isChiefs ? '🏈 Chiefs' : '🦅 Eagles'}
        </h3>
        <div className={`text-sm px-2 py-1 rounded ${
          change24h > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {change24h > 0 ? '↑' : '↓'} {Math.abs(change24h)}%
        </div>
      </div>

      {/* Price Display */}
      <div className="mb-6">
        <div className="text-sm text-gray-400 mb-1">Price per Token</div>
        <div className="text-3xl font-bold text-white">
          ${price.toFixed(7)}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div className="text-xs text-gray-400">Market Cap</div>
          <div className="text-lg font-semibold">
            ${marketCap.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Holders</div>
          <div className="text-lg font-semibold">
            {Math.floor(Math.random() * 5000 + 1000)}
          </div>
        </div>
      </div>

      {/* Circulating Supply Bar */}
      <div>
        <div className="flex justify-between mb-2 text-sm">
          <span className="text-gray-400">Circulating</span>
          <span>{(circulating / 1_000_000).toFixed(0)}M / 1B</span>
        </div>
        <div className="h-8 bg-dark-bg rounded-lg overflow-hidden relative">
          <motion.div
            className={`h-full bg-gradient-to-r ${
              isChiefs 
                ? 'from-chiefs-red to-chiefs-red/50' 
                : 'from-eagles-green to-eagles-green/50'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${circulatingPercentage}%` }}
            transition={{ type: "spring", stiffness: 100 }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-xs text-white/80">
            {circulatingPercentage.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Mini Chart Placeholder */}
      <div className="mt-6 h-20 bg-dark-bg rounded-lg p-2">
        <svg className="w-full h-full">
          <defs>
            <linearGradient id={`${token}ChartGradient`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isChiefs ? '#E31837' : '#004C54'} stopOpacity="0.3" />
              <stop offset="100%" stopColor={isChiefs ? '#E31837' : '#004C54'} stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Mock chart line */}
          <motion.path
            d="M 0,40 Q 20,35 40,38 T 80,32 T 120,28 T 160,25 T 200,20"
            fill="none"
            stroke={isChiefs ? '#E31837' : '#004C54'}
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2 }}
          />
          <path
            d="M 0,40 Q 20,35 40,38 T 80,32 T 120,28 T 160,25 T 200,20 L 200,60 L 0,60 Z"
            fill={`url(#${token}ChartGradient)`}
            opacity="0.3"
          />
        </svg>
      </div>
    </motion.div>
  );
}