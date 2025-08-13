'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftRight, Zap, TrendingUp, Info } from 'lucide-react'
import { useDemoStore } from '@/lib/store'

export default function QuantumPool() {
  const [selectedToken, setSelectedToken] = useState<'chiefs' | 'eagles'>('chiefs')
  const [swapAmount, setSwapAmount] = useState(1000000)
  const [outputAmount, setOutputAmount] = useState(0)
  const [showTooltip, setShowTooltip] = useState(false)
  
  const {
    quantumPoolChiefs,
    quantumPoolEagles,
    swapInQuantumPool,
    addTrade,
  } = useDemoStore()
  
  const totalPool = quantumPoolChiefs + quantumPoolEagles
  const chiefsPercentage = totalPool > 0 ? (quantumPoolChiefs / totalPool) * 100 : 50
  const eaglesPercentage = totalPool > 0 ? (quantumPoolEagles / totalPool) * 100 : 50
  
  // Calculate output preview
  useEffect(() => {
    const fromPool = selectedToken === 'chiefs' ? quantumPoolChiefs : quantumPoolEagles
    const toPool = selectedToken === 'chiefs' ? quantumPoolEagles : quantumPoolChiefs
    
    if (fromPool && toPool && swapAmount > 0 && swapAmount <= fromPool) {
      const k = fromPool * toPool
      const newFromPool = fromPool - swapAmount // Subtract from the "from" pool
      const newToPool = k / newFromPool
      const output = newToPool - toPool // Calculate output amount properly
      setOutputAmount(output)
    } else {
      setOutputAmount(0)
    }
  }, [selectedToken, swapAmount, quantumPoolChiefs, quantumPoolEagles])
  
  const handleSwap = () => {
    const output = swapInQuantumPool(selectedToken, swapAmount)
    
    addTrade({
      type: 'swap',
      token: selectedToken,
      amount: swapAmount,
      price: swapAmount / output,
      trader: 'QuantumSwapper',
      pool: 'quantum',
    })
    
    // Reset amount
    setSwapAmount(1000000)
  }
  
  const exchangeRate = swapAmount > 0 && outputAmount > 0 ? outputAmount / swapAmount : 1
  
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Zap className="w-6 h-6 text-purple-500" />
          Quantum Pool
        </h2>
        <div className="relative">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="text-gray-400 hover:text-gray-300"
          >
            <Info className="w-5 h-5" />
          </button>
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-8 w-64 bg-gray-800 rounded-lg p-3 text-sm z-10"
              >
                <p className="text-gray-300">
                  The Quantum Pool allows instant swaps between entangled tokens. 
                  Early swappers get better rates as the pool rebalances!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Pool Visualization */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Pool Balance</span>
          <span className="text-xs text-purple-400">Constant Product: k = {(quantumPoolChiefs * quantumPoolEagles / 1e18).toFixed(2)}B²</span>
        </div>
        <div className="relative h-12 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-chiefs-red to-chiefs-red/50"
            animate={{ width: `${chiefsPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            className="absolute right-0 top-0 h-full bg-gradient-to-l from-eagles-green to-eagles-green/50"
            animate={{ width: `${eaglesPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <span className="text-white font-bold text-sm">{chiefsPercentage.toFixed(1)}%</span>
            <ArrowLeftRight className="w-5 h-5 text-white/50" />
            <span className="text-white font-bold text-sm">{eaglesPercentage.toFixed(1)}%</span>
          </div>
        </div>
      </div>
      
      {/* Swap Interface */}
      <div className="space-y-4">
        {/* From Token */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">From</span>
            <span className="text-xs text-gray-500">
              Balance: {(selectedToken === 'chiefs' ? quantumPoolChiefs : quantumPoolEagles).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-3 overflow-hidden">
            <button
              onClick={() => setSelectedToken(selectedToken === 'chiefs' ? 'eagles' : 'chiefs')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors flex-shrink-0 ${
                selectedToken === 'chiefs' 
                  ? 'bg-chiefs-red text-white' 
                  : 'bg-eagles-green text-white'
              }`}
            >
              <div className="w-6 h-6 bg-white/20 rounded-full" />
              {selectedToken === 'chiefs' ? 'CHIEFS' : 'EAGLES'}
            </button>
            <input
              type="number"
              value={swapAmount}
              onChange={(e) => setSwapAmount(Number(e.target.value))}
              className="flex-1 bg-transparent text-right text-xl font-bold outline-none min-w-0 pr-2"
              placeholder="0"
            />
          </div>
        </div>
        
        {/* Swap Arrow */}
        <div className="flex justify-center">
          <motion.button
            onClick={() => setSelectedToken(selectedToken === 'chiefs' ? 'eagles' : 'chiefs')}
            whileHover={{ rotate: 180 }}
            className="p-2 bg-purple-600 rounded-full"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </motion.button>
        </div>
        
        {/* To Token */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">To</span>
            <span className="text-xs text-gray-500">
              Balance: {(selectedToken === 'eagles' ? quantumPoolChiefs : quantumPoolEagles).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              selectedToken === 'eagles' 
                ? 'bg-chiefs-red text-white' 
                : 'bg-eagles-green text-white'
            }`}>
              <div className="w-6 h-6 bg-white/20 rounded-full" />
              {selectedToken === 'eagles' ? 'CHIEFS' : 'EAGLES'}
            </div>
            <div className="flex-1 text-right text-xl font-bold">
              {outputAmount.toLocaleString()}
            </div>
          </div>
        </div>
        
        {/* Exchange Rate */}
        <div className="bg-gray-800/30 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Exchange Rate</span>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="font-medium">
                1 {selectedToken === 'chiefs' ? 'CHIEFS' : 'EAGLES'} = {exchangeRate.toFixed(4)} {selectedToken === 'chiefs' ? 'EAGLES' : 'CHIEFS'}
              </span>
            </div>
          </div>
          {exchangeRate > 1 && (
            <div className="mt-2 text-xs text-green-400">
              🎯 Good rate! Pool is imbalanced in your favor
            </div>
          )}
        </div>
        
        {/* Swap Button */}
        <motion.button
          onClick={handleSwap}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={swapAmount <= 0 || outputAmount <= 0}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          QUANTUM SWAP
        </motion.button>
      </div>
    </div>
  )
}