'use client'

import { useEffect, useRef } from 'react'
import { useDemoStore } from '@/lib/store'

const BOT_NAMES = [
  'MomentumTrader', 'ValueHunter', 'WhaleBot', 'PaperHands', 
  'DiamondHands', 'Arbitrager', 'GameWatcher', 'SwingTrader',
  'Contrarian', 'TrendFollower', 'MarketMaker', 'Scalper',
  'HODLer', 'FOMOBuyer', 'PanicSeller', 'SmartMoney'
]

export default function BotEngine() {
  const intervalRef = useRef<NodeJS.Timeout>()
  const launchIntervalRef = useRef<NodeJS.Timeout>()
  
  const {
    phase,
    botActivity,
    gameState,
    chiefsPrice,
    eaglesPrice,
    quantumPoolChiefs,
    quantumPoolEagles,
    addTrade,
    swapInQuantumPool,
    addPurchase,
    currentRaised,
    targetRaised,
  } = useDemoStore()
  
  useEffect(() => {
    // Launch phase bot activity
    if (phase === 'launch' && currentRaised < targetRaised) {
      launchIntervalRef.current = setInterval(() => {
        const amount = 500 + Math.random() * 2000
        const chiefsAllocation = 30 + Math.random() * 40 // Tends towards 50-50
        
        addPurchase({
          amount,
          chiefsAllocation,
          eaglesAllocation: 100 - chiefsAllocation,
          buyer: BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)],
        })
      }, 2000 + Math.random() * 3000) // Every 2-5 seconds
    }
    
    return () => {
      if (launchIntervalRef.current) {
        clearInterval(launchIntervalRef.current)
      }
    }
  }, [phase, currentRaised, targetRaised, addPurchase])
  
  useEffect(() => {
    if (phase !== 'trading' || !botActivity) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      return
    }
    
    intervalRef.current = setInterval(() => {
      const botType = Math.random()
      const botName = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)]
      
      // Game-based trading (40% of bots)
      if (botType < 0.4) {
        const leadingTeam = gameState.chiefsScore > gameState.eaglesScore ? 'chiefs' : 'eagles'
        const losingTeam = leadingTeam === 'chiefs' ? 'eagles' : 'chiefs'
        
        // Momentum traders - buy the winning team
        if (Math.random() < 0.6) {
          const amount = 1000000 + Math.random() * 5000000
          addTrade({
            type: 'buy',
            token: leadingTeam,
            amount,
            price: leadingTeam === 'chiefs' ? chiefsPrice : eaglesPrice,
            trader: botName,
            pool: 'amm',
          })
        } 
        // Contrarians - buy the losing team when oversold
        else {
          const amount = 500000 + Math.random() * 2000000
          addTrade({
            type: 'buy',
            token: losingTeam,
            amount,
            price: losingTeam === 'chiefs' ? chiefsPrice : eaglesPrice,
            trader: botName,
            pool: 'amm',
          })
        }
      }
      // Quantum Pool swappers (30% of bots)
      else if (botType < 0.7) {
        const fromToken = Math.random() < 0.5 ? 'chiefs' : 'eagles'
        const amount = 500000 + Math.random() * 3000000
        
        // Check if swap makes sense based on game state
        const leadingTeam = gameState.chiefsScore > gameState.eaglesScore ? 'chiefs' : 'eagles'
        if (fromToken !== leadingTeam && Math.random() < 0.7) {
          const outputAmount = swapInQuantumPool(fromToken, amount)
          addTrade({
            type: 'swap',
            token: fromToken,
            amount,
            price: amount / outputAmount,
            trader: botName,
            pool: 'quantum',
          })
        }
      }
      // Regular traders (30% of bots)
      else {
        const token = Math.random() < 0.5 ? 'chiefs' : 'eagles'
        const tradeType = Math.random() < 0.6 ? 'buy' : 'sell'
        const amount = 100000 + Math.random() * 2000000
        
        addTrade({
          type: tradeType,
          token,
          amount,
          price: token === 'chiefs' ? chiefsPrice : eaglesPrice,
          trader: botName,
          pool: 'amm',
        })
      }
    }, 1000 + Math.random() * 3000) // Every 1-4 seconds
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [
    phase,
    botActivity,
    gameState,
    chiefsPrice,
    eaglesPrice,
    quantumPoolChiefs,
    quantumPoolEagles,
    addTrade,
    swapInQuantumPool,
  ])
  
  return null // This component doesn't render anything
}