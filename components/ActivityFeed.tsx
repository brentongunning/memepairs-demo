'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight, ArrowLeftRight, User } from 'lucide-react'
import { useDemoStore } from '@/lib/store'

export default function ActivityFeed() {
  const { trades } = useDemoStore()
  
  const recentTrades = trades.slice(-10).reverse()
  
  const getTradeIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return <ArrowUpRight className="w-4 h-4 text-green-400" />
      case 'sell':
        return <ArrowDownRight className="w-4 h-4 text-red-400" />
      case 'swap':
        return <ArrowLeftRight className="w-4 h-4 text-purple-400" />
      default:
        return null
    }
  }
  
  const getTradeColor = (type: string, token: string) => {
    if (type === 'swap') return 'text-purple-400'
    if (token === 'chiefs') return 'text-chiefs-red'
    return 'text-eagles-green'
  }
  
  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-purple-500" />
        Activity Feed
      </h3>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {recentTrades.map((trade) => (
            <motion.div
              key={trade.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-gray-800/30 rounded-lg p-3 text-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {getTradeIcon(trade.type)}
                  <span className="text-gray-400">{trade.trader}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(trade.timestamp).toLocaleTimeString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={getTradeColor(trade.type, trade.token)}>
                  {trade.type === 'swap' ? 'Swapped' : trade.type === 'buy' ? 'Bought' : 'Sold'}{' '}
                  {(trade.amount / 1000000).toFixed(2)}M {trade.token.toUpperCase()}
                </span>
                {trade.pool && (
                  <span className="text-xs text-purple-400">
                    via {trade.pool === 'quantum' ? 'Quantum' : 'AMM'}
                  </span>
                )}
              </div>
              
              {trade.price && (
                <div className="text-xs text-gray-500 mt-1">
                  @ ${trade.price.toFixed(6)}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {recentTrades.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No trades yet. Bots will start trading soon...
          </div>
        )}
      </div>
    </div>
  )
}