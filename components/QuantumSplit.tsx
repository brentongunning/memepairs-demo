'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Trophy, ArrowRight } from 'lucide-react'
import { useDemoStore } from '@/lib/store'

export default function QuantumSplit() {
  const [stage, setStage] = useState<'collapsing' | 'splitting' | 'complete'>('collapsing')
  const { 
    finalChiefsAllocation, 
    finalEaglesAllocation,
    quantumPoolChiefs,
    quantumPoolEagles,
    setPhase 
  } = useDemoStore()
  
  useEffect(() => {
    const timer1 = setTimeout(() => setStage('splitting'), 2000)
    const timer2 = setTimeout(() => setStage('complete'), 4000)
    const timer3 = setTimeout(() => setPhase('trading'), 6000)
    
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [setPhase])
  
  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-purple-900/20" />
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
            }}
            animate={{
              x: window.innerWidth / 2,
              y: window.innerHeight / 2,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: Math.random() * 0.5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      
      <AnimatePresence mode="wait">
        {stage === 'collapsing' && (
          <motion.div
            key="collapsing"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-center z-10"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="w-32 h-32 mx-auto mb-8 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-chiefs-red to-eagles-green rounded-full blur-xl opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-br from-chiefs-red to-eagles-green rounded-full animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="w-16 h-16 text-white" />
              </div>
            </motion.div>
            <h2 className="text-4xl font-bold mb-4">QUANTUM MEASUREMENT</h2>
            <p className="text-xl text-gray-400">Collapsing the wave function...</p>
          </motion.div>
        )}
        
        {stage === 'splitting' && (
          <motion.div
            key="splitting"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="z-10"
          >
            <div className="flex items-center justify-center gap-8">
              {/* Chiefs Token */}
              <motion.div
                initial={{ x: 0, opacity: 0 }}
                animate={{ x: -100, opacity: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="text-center"
              >
                <div className="w-24 h-24 bg-chiefs-red rounded-full flex items-center justify-center mb-4 neon-glow-red">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-chiefs-red">CHIEFS</h3>
                <p className="text-lg">{finalChiefsAllocation}% Circulating</p>
                <p className="text-sm text-gray-400">{(100 - finalChiefsAllocation)}% to Quantum Pool</p>
              </motion.div>
              
              {/* Split Animation */}
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.5, 0] }}
                transition={{ duration: 1 }}
                className="text-4xl"
              >
                ⚡
              </motion.div>
              
              {/* Eagles Token */}
              <motion.div
                initial={{ x: 0, opacity: 0 }}
                animate={{ x: 100, opacity: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="text-center"
              >
                <div className="w-24 h-24 bg-eagles-green rounded-full flex items-center justify-center mb-4 neon-glow-green">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-eagles-green">EAGLES</h3>
                <p className="text-lg">{finalEaglesAllocation}% Circulating</p>
                <p className="text-sm text-gray-400">{(100 - finalEaglesAllocation)}% to Quantum Pool</p>
              </motion.div>
            </div>
          </motion.div>
        )}
        
        {stage === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center z-10"
          >
            <motion.h1
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-6xl font-bold mb-8 bg-gradient-to-r from-chiefs-red via-purple-500 to-eagles-green bg-clip-text text-transparent"
            >
              GRADUATION COMPLETE!
            </motion.h1>
            
            <div className="glass-card p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Quantum Pool Initialized</h2>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="text-sm text-gray-400 mb-2">Chiefs in Pool</h3>
                  <p className="text-2xl font-bold text-chiefs-red">
                    {(quantumPoolChiefs / 1000000000 * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="text-sm text-gray-400 mb-2">Eagles in Pool</h3>
                  <p className="text-2xl font-bold text-eagles-green">
                    {(quantumPoolEagles / 1000000000 * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-purple-400">
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
                <span className="text-lg font-medium">Entering Trading Phase</span>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Zap className="w-6 h-6" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}