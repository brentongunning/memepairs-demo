'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RotateCcw, Info, Zap } from 'lucide-react'
import { useDemoStore } from '@/lib/store'
import EntangledLaunch from '@/components/EntangledLaunch'
import QuantumSplit from '@/components/QuantumSplit'
import TradingDashboard from '@/components/TradingDashboard'
import BotEngine from '@/components/BotEngine'

export default function Home() {
  const { phase, setPhase, reset, currentRaised, targetRaised, setGraduation, collectiveChiefsAllocation, collectiveEaglesAllocation, setBotActivity } = useDemoStore()
  const [showIntro, setShowIntro] = useState(true)
  
  // Auto-graduate when target is reached
  useEffect(() => {
    if (phase === 'launch' && currentRaised >= targetRaised) {
      setTimeout(() => {
        setGraduation(collectiveChiefsAllocation, collectiveEaglesAllocation)
        setPhase('graduation')
      }, 2000)
    }
  }, [currentRaised, targetRaised, phase, setPhase, setGraduation, collectiveChiefsAllocation, collectiveEaglesAllocation])
  
  // Enable bot activity when trading starts
  useEffect(() => {
    if (phase === 'trading') {
      setBotActivity(true)
    }
  }, [phase, setBotActivity])
  
  const handleStart = () => {
    setShowIntro(false)
    setPhase('launch')
  }
  
  const handleReset = () => {
    reset()
    setShowIntro(true)
    setPhase('intro')
  }
  
  return (
    <main className="min-h-screen bg-gray-950 relative">
      {/* Background animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-purple-900/10" />
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-500/20 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
            }}
            animate={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear',
            }}
          />
        ))}
      </div>
      
      {/* Bot Engine */}
      <BotEngine />
      
      {/* Reset Button */}
      {!showIntro && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleReset}
          className="fixed top-4 right-4 z-50 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-2 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Demo
        </motion.button>
      )}
      
      <AnimatePresence mode="wait">
        {/* Intro Screen */}
        {showIntro && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-8 relative z-10"
          >
            <div className="max-w-4xl w-full">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-8 lg:p-12"
              >
                <div className="text-center mb-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="inline-block mb-6"
                  >
                    <Zap className="w-16 h-16 text-purple-500" />
                  </motion.div>
                  <h1 className="text-5xl lg:text-6xl font-bold mb-4 pb-2 bg-gradient-to-r from-chiefs-red via-purple-500 to-eagles-green bg-clip-text text-transparent leading-tight">
                    Entangled Memes
                  </h1>
                  <p className="text-xl text-gray-400 mb-2">Two tokens, one destiny</p>
                  <p className="text-lg text-gray-500">Super Bowl LXII Edition</p>
                </div>
                
                <div className="space-y-6 mb-8">
                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Info className="w-6 h-6 text-purple-500" />
                      How It Works
                    </h2>
                    <ol className="space-y-3 text-gray-300">
                      <li className="flex gap-3">
                        <span className="text-purple-500 font-bold">1.</span>
                        <span>Two tokens (Chiefs & Eagles) launch as ONE entangled entity</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-purple-500 font-bold">2.</span>
                        <span>Buyers choose their allocation split during the launch phase</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-purple-500 font-bold">3.</span>
                        <span>At graduation ($69k), tokens split based on collective allocation</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-purple-500 font-bold">4.</span>
                        <span>Quantum Pool enables swaps with dynamic exchange rates</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-purple-500 font-bold">5.</span>
                        <span>Game events drive bot trading behavior and price action</span>
                      </li>
                    </ol>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-chiefs-red/10 border border-chiefs-red/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-chiefs-red rounded-full" />
                        <span className="font-bold">Kansas City Chiefs</span>
                      </div>
                      <p className="text-sm text-gray-400">The reigning champions</p>
                    </div>
                    <div className="bg-eagles-green/10 border border-eagles-green/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-eagles-green rounded-full" />
                        <span className="font-bold">Philadelphia Eagles</span>
                      </div>
                      <p className="text-sm text-gray-400">The hungry challengers</p>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  onClick={handleStart}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl font-bold text-xl flex items-center justify-center gap-3"
                >
                  <Play className="w-6 h-6" />
                  START DEMO
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
        
        {/* Launch Phase */}
        {phase === 'launch' && (
          <motion.div
            key="launch"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EntangledLaunch />
          </motion.div>
        )}
        
        {/* Graduation Animation */}
        {phase === 'graduation' && (
          <motion.div
            key="graduation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <QuantumSplit />
          </motion.div>
        )}
        
        {/* Trading Phase */}
        {phase === 'trading' && (
          <motion.div
            key="trading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TradingDashboard />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}