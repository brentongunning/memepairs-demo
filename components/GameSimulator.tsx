'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Clock, AlertCircle } from 'lucide-react'
import { useDemoStore } from '@/lib/store'

const GAME_EVENTS = [
  { type: 'touchdown', points: 7, message: 'TOUCHDOWN!' },
  { type: 'field_goal', points: 3, message: 'Field Goal!' },
  { type: 'safety', points: 2, message: 'Safety!' },
  { type: 'turnover', points: 0, message: 'Turnover!' },
  { type: 'big_play', points: 0, message: 'Big Play!' },
]

export default function GameSimulator() {
  const { gameState, updateGameState } = useDemoStore()
  const [lastEvent, setLastEvent] = useState<string>('')
  const [showEvent, setShowEvent] = useState(false)
  
  useEffect(() => {
    const gameInterval = setInterval(() => {
      // Update game time
      const [minutes, seconds] = gameState.timeRemaining.split(':').map(Number)
      let newSeconds = seconds - 1
      let newMinutes = minutes
      
      if (newSeconds < 0) {
        newSeconds = 59
        newMinutes -= 1
      }
      
      if (newMinutes < 0) {
        // Move to next quarter
        if (gameState.quarter < 4) {
          updateGameState({
            quarter: gameState.quarter + 1,
            timeRemaining: '15:00',
          })
        } else {
          // Game over
          clearInterval(gameInterval)
          return
        }
      } else {
        updateGameState({
          timeRemaining: `${newMinutes}:${newSeconds.toString().padStart(2, '0')}`,
        })
      }
      
      // Random game events
      if (Math.random() < 0.1) {
        const event = GAME_EVENTS[Math.floor(Math.random() * GAME_EVENTS.length)]
        const scoringTeam = Math.random() < 0.5 ? 'chiefs' : 'eagles'
        
        if (event.points > 0) {
          updateGameState({
            chiefsScore: scoringTeam === 'chiefs' 
              ? gameState.chiefsScore + event.points 
              : gameState.chiefsScore,
            eaglesScore: scoringTeam === 'eagles' 
              ? gameState.eaglesScore + event.points 
              : gameState.eaglesScore,
            possession: scoringTeam === 'chiefs' ? 'eagles' : 'chiefs',
          })
          
          setLastEvent(`${scoringTeam === 'chiefs' ? 'Chiefs' : 'Eagles'} ${event.message}`)
          setShowEvent(true)
          setTimeout(() => setShowEvent(false), 3000)
        } else if (event.type === 'turnover') {
          updateGameState({
            possession: gameState.possession === 'chiefs' ? 'eagles' : 'chiefs',
          })
          setLastEvent(event.message)
          setShowEvent(true)
          setTimeout(() => setShowEvent(false), 2000)
        }
      }
    }, 1000)
    
    return () => clearInterval(gameInterval)
  }, [gameState, updateGameState])
  
  const leadingTeam = gameState.chiefsScore > gameState.eaglesScore ? 'chiefs' : 
                     gameState.eaglesScore > gameState.chiefsScore ? 'eagles' : null
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 mb-6"
    >
      {/* Game Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold">Super Bowl LXII</h2>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="font-mono">Q{gameState.quarter} - {gameState.timeRemaining}</span>
        </div>
      </div>
      
      {/* Score Display */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Chiefs */}
        <motion.div
          className={`text-center p-4 rounded-lg ${
            leadingTeam === 'chiefs' ? 'bg-chiefs-red/20 border border-chiefs-red/50' : 'bg-gray-800/50'
          }`}
          animate={leadingTeam === 'chiefs' ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-chiefs-red rounded-full" />
            <span className="font-bold">CHIEFS</span>
          </div>
          <div className="text-4xl font-bold text-chiefs-red">
            {gameState.chiefsScore}
          </div>
          {gameState.possession === 'chiefs' && (
            <div className="mt-2 text-xs text-yellow-400 flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              POSSESSION
            </div>
          )}
        </motion.div>
        
        {/* VS */}
        <div className="flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-500">VS</span>
        </div>
        
        {/* Eagles */}
        <motion.div
          className={`text-center p-4 rounded-lg ${
            leadingTeam === 'eagles' ? 'bg-eagles-green/20 border border-eagles-green/50' : 'bg-gray-800/50'
          }`}
          animate={leadingTeam === 'eagles' ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-eagles-green rounded-full" />
            <span className="font-bold">EAGLES</span>
          </div>
          <div className="text-4xl font-bold text-eagles-green">
            {gameState.eaglesScore}
          </div>
          {gameState.possession === 'eagles' && (
            <div className="mt-2 text-xs text-yellow-400 flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              POSSESSION
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Event Notification */}
      <AnimatePresence>
        {showEvent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-purple-600/20 border border-purple-600/50 rounded-lg p-3 flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5 text-purple-400" />
            <span className="font-bold text-purple-400">{lastEvent}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Game Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Game Progress</span>
          <span>{Math.round(((gameState.quarter - 1) * 15 + (15 - parseInt(gameState.timeRemaining))) / 60 * 100)}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-600 to-purple-500 rounded-full"
            animate={{
              width: `${((gameState.quarter - 1) * 15 + (15 - parseInt(gameState.timeRemaining))) / 60 * 100}%`
            }}
          />
        </div>
      </div>
    </motion.div>
  )
}