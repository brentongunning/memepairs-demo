'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react'
import { useDemoStore } from '@/lib/store'
import QuantumPool from './QuantumPool'
import GameSimulator from './GameSimulator'
import ActivityFeed from './ActivityFeed'

interface PriceData {
  time: string
  chiefs: number
  eagles: number
}

export default function TradingDashboard() {
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([])
  const { 
    chiefsPrice, 
    eaglesPrice,
    quantumPoolChiefs,
    quantumPoolEagles,
    trades,
  } = useDemoStore()
  
  // Update price history
  useEffect(() => {
    const interval = setInterval(() => {
      setPriceHistory(prev => {
        const newData = [...prev, {
          time: new Date().toLocaleTimeString(),
          chiefs: chiefsPrice,
          eagles: eaglesPrice,
        }].slice(-30) // Keep last 30 data points
        return newData
      })
    }, 2000)
    
    return () => clearInterval(interval)
  }, [chiefsPrice, eaglesPrice])
  
  const chiefsChange = priceHistory.length > 1 
    ? ((chiefsPrice - priceHistory[0].chiefs) / priceHistory[0].chiefs) * 100
    : 0
  
  const eaglesChange = priceHistory.length > 1
    ? ((eaglesPrice - priceHistory[0].eagles) / priceHistory[0].eagles) * 100
    : 0
  
  const totalVolume = trades.reduce((sum, trade) => sum + (trade.amount * trade.price), 0)
  
  const chiefsCirculating = ((1000000000 - quantumPoolChiefs) / 1000000000) * 100
  const eaglesCirculating = ((1000000000 - quantumPoolEagles) / 1000000000) * 100
  
  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-chiefs-red via-purple-500 to-eagles-green bg-clip-text text-transparent">
            Trading Arena
          </h1>
          <p className="text-gray-400">Watch the quantum dynamics unfold</p>
        </motion.div>
        
        {/* Game Score */}
        <GameSimulator />
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Price Charts - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Cards */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass-card p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-chiefs-red rounded-full" />
                    <span className="font-bold">CHIEFS</span>
                  </div>
                  {chiefsChange >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div className="text-2xl font-bold">${chiefsPrice.toFixed(4)}</div>
                <div className={`text-sm ${chiefsChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {chiefsChange >= 0 ? '+' : ''}{chiefsChange.toFixed(2)}%
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Circulating: {chiefsCirculating.toFixed(1)}%
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass-card p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-eagles-green rounded-full" />
                    <span className="font-bold">EAGLES</span>
                  </div>
                  {eaglesChange >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div className="text-2xl font-bold">${eaglesPrice.toFixed(4)}</div>
                <div className={`text-sm ${eaglesChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {eaglesChange >= 0 ? '+' : ''}{eaglesChange.toFixed(2)}%
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Circulating: {eaglesCirculating.toFixed(1)}%
                </div>
              </motion.div>
            </div>
            
            {/* Chart */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-500" />
                Price Action
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={priceHistory}>
                  <defs>
                    <linearGradient id="chiefsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E31837" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#E31837" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="eaglesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#004C54" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#004C54" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                    labelStyle={{ color: '#9CA3AF' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="chiefs"
                    stroke="#E31837"
                    fill="url(#chiefsGradient)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="eagles"
                    stroke="#004C54"
                    fill="url(#eaglesGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-card p-4 text-center">
                <DollarSign className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <div className="text-xs text-gray-400">Total Volume</div>
                <div className="text-lg font-bold">${totalVolume.toFixed(2)}</div>
              </div>
              <div className="glass-card p-4 text-center">
                <Activity className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <div className="text-xs text-gray-400">Total Trades</div>
                <div className="text-lg font-bold">{trades.length}</div>
              </div>
              <div className="glass-card p-4 text-center">
                <TrendingUp className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <div className="text-xs text-gray-400">Spread</div>
                <div className="text-lg font-bold">
                  {Math.abs(chiefsPrice - eaglesPrice).toFixed(4)}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Quantum Pool */}
            <QuantumPool />
            
            {/* Activity Feed */}
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  )
}