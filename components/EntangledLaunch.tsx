'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as d3 from 'd3'
import { useDemoStore } from '@/lib/store'
import { TrendingUp, Zap, Users, DollarSign } from 'lucide-react'

export default function EntangledLaunch() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [allocation, setAllocation] = useState(50)
  const [selectedAmount, setSelectedAmount] = useState(100)
  const [customAmount, setCustomAmount] = useState('')
  const [isHovering, setIsHovering] = useState(false)
  
  const {
    currentRaised,
    targetRaised,
    bondingCurvePrice,
    collectiveChiefsAllocation,
    collectiveEaglesAllocation,
    purchases,
    addPurchase,
  } = useDemoStore()
  
  const amounts = [1, 100, 1000, 10000]
  const finalAmount = customAmount ? Number(customAmount) : selectedAmount
  const tokensPerDollar = 1 / bondingCurvePrice
  const totalTokens = finalAmount * tokensPerDollar
  const chiefsTokens = (totalTokens * allocation) / 100
  const eaglesTokens = (totalTokens * (100 - allocation)) / 100
  
  const progress = (currentRaised / targetRaised) * 100
  const isKingOfHill = currentRaised >= 45000
  
  useEffect(() => {
    if (!svgRef.current) return
    
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    
    const width = 600
    const height = 300
    const margin = { top: 20, right: 30, bottom: 40, left: 60 }
    
    const xScale = d3.scaleLinear()
      .domain([0, targetRaised])
      .range([margin.left, width - margin.right])
    
    const yScale = d3.scaleLog()
      .domain([0.00001, 1])
      .range([height - margin.bottom, margin.top])
    
    // Bonding curve line
    const line = d3.line<number>()
      .x(d => xScale(d))
      .y(d => {
        const progress = d / targetRaised
        const price = 0.00001 * Math.pow(10, progress * 2)
        return yScale(price)
      })
      .curve(d3.curveMonotoneX)
    
    const data = d3.range(0, targetRaised + 1, targetRaised / 100)
    
    // Gradient definition
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'curve-gradient')
      .attr('x1', '0%')
      .attr('x2', '100%')
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#E31837')
      .attr('stop-opacity', 0.8)
    
    gradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#9333ea')
      .attr('stop-opacity', 0.8)
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#004C54')
      .attr('stop-opacity', 0.8)
    
    // Draw the curve
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'url(#curve-gradient)')
      .attr('stroke-width', 3)
      .attr('d', line)
      .style('filter', 'drop-shadow(0 0 10px rgba(147, 51, 234, 0.5))')
    
    // Progress indicator
    if (currentRaised > 0) {
      svg.append('circle')
        .attr('cx', xScale(currentRaised))
        .attr('cy', yScale(bondingCurvePrice))
        .attr('r', 6)
        .attr('fill', '#9333ea')
        .style('filter', 'drop-shadow(0 0 20px rgba(147, 51, 234, 0.8))')
        .append('animate')
        .attr('attributeName', 'r')
        .attr('values', '6;10;6')
        .attr('dur', '2s')
        .attr('repeatCount', 'indefinite')
    }
    
    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickFormat(d => `$${d3.format('.0s')(d)}`))
      .style('color', '#6b7280')
    
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).tickFormat(d => `$${d3.format('.2s')(d)}`))
      .style('color', '#6b7280')
    
    // Labels
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', margin.left - 40)
      .attr('x', -(height / 2))
      .style('text-anchor', 'middle')
      .style('fill', '#9ca3af')
      .style('font-size', '12px')
      .text('Price (SOL)')
    
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 5)
      .style('text-anchor', 'middle')
      .style('fill', '#9ca3af')
      .style('font-size', '12px')
      .text('Market Cap')
    
  }, [currentRaised, targetRaised, bondingCurvePrice])
  
  const handleBuy = () => {
    addPurchase({
      amount: finalAmount,
      chiefsAllocation: allocation,
      eaglesAllocation: 100 - allocation,
      buyer: `User`,
    })
    // Reset to default after purchase
    setCustomAmount('')
    setSelectedAmount(100)
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-chiefs-red via-purple-500 to-eagles-green bg-clip-text text-transparent">
            Entangled Memes Launch
          </h1>
          <p className="text-gray-400 text-lg">Two tokens, one destiny. Choose your allocation.</p>
        </div>
        
        {/* Progress Bar */}
        <div className="glass-card p-6 mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">Progress to Graduation</span>
            <span className="text-sm font-bold">${currentRaised.toLocaleString()} / ${targetRaised.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          {isKingOfHill && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-2 text-center text-yellow-400 font-bold flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              KING OF THE HILL ACHIEVED!
              <Zap className="w-5 h-5" />
            </motion.div>
          )}
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bonding Curve */}
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-500" />
              Bonding Curve
            </h2>
            <svg ref={svgRef} width="600" height="300" className="w-full" />
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400">Current Price</div>
                <div className="text-xl font-bold text-purple-400">
                  ${bondingCurvePrice.toFixed(6)} SOL
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-400">Market Cap</div>
                <div className="text-xl font-bold text-green-400">
                  ${currentRaised.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
          
          {/* Allocation Selector */}
          <div className="glass-card p-6">
            {/* Amount Selector */}
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-purple-500" />
              Choose Your Amount
            </h2>
            
            <div className="grid grid-cols-4 gap-2 mb-4">
              {amounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount)
                    setCustomAmount('')
                  }}
                  className={`py-2 px-3 rounded-lg font-medium transition-all ${
                    selectedAmount === amount && !customAmount
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800/50 hover:bg-gray-700/50'
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>
            
            <input
              type="number"
              placeholder="Custom amount..."
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full mb-6 px-4 py-2 bg-gray-800/50 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
            />
            
            {/* Token Preview */}
            <div className="bg-gray-800/30 rounded-lg p-3 mb-6">
              <div className="text-xs text-gray-400 mb-2">You will receive:</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-chiefs-red rounded-full" />
                  <span className="font-bold text-chiefs-red">
                    {chiefsTokens.toLocaleString(undefined, { maximumFractionDigits: 0 })} CHIEFS
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-eagles-green rounded-full" />
                  <span className="font-bold text-eagles-green">
                    {eaglesTokens.toLocaleString(undefined, { maximumFractionDigits: 0 })} EAGLES
                  </span>
                </div>
              </div>
            </div>
            
            {/* Allocation Selector */}
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-500" />
              Choose Your Allocation
            </h2>
            
            {/* Team Labels */}
            <div className="flex justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-chiefs-red rounded-full" />
                <span className="font-bold">Chiefs</span>
                <span className="text-2xl font-bold text-chiefs-red">{allocation}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-eagles-green">{100 - allocation}%</span>
                <span className="font-bold">Eagles</span>
                <div className="w-8 h-8 bg-eagles-green rounded-full" />
              </div>
            </div>
            
            {/* Slider */}
            <div className="relative mb-8">
              <input
                type="range"
                min="0"
                max="100"
                value={allocation}
                onChange={(e) => setAllocation(Number(e.target.value))}
                className="w-full h-12 appearance-none bg-gradient-to-r from-chiefs-red to-eagles-green rounded-full cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #E31837 ${allocation}%, #004C54 ${allocation}%)`,
                }}
              />
              <style jsx>{`
                input[type="range"]::-webkit-slider-thumb {
                  appearance: none;
                  width: 24px;
                  height: 24px;
                  background: white;
                  border: 3px solid #9333ea;
                  border-radius: 50%;
                  cursor: pointer;
                  box-shadow: 0 0 20px rgba(147, 51, 234, 0.6);
                }
              `}</style>
            </div>
            
            {/* Collective Allocation Display */}
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-400 mb-2">Collective Allocation (All Buyers)</div>
              <div className="flex gap-4 items-center">
                <div className="flex-1 max-w-[45%]">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Chiefs</span>
                    <span>{collectiveChiefsAllocation.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-chiefs-red rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, collectiveChiefsAllocation)}%` }}
                    />
                  </div>
                </div>
                <div className="text-gray-500">vs</div>
                <div className="flex-1 max-w-[45%]">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Eagles</span>
                    <span>{collectiveEaglesAllocation.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-eagles-green rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, collectiveEaglesAllocation)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Buy Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBuy}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl font-bold text-lg relative overflow-hidden"
            >
              <span className="relative z-10">ENTANGLE TOKENS</span>
              {isHovering && (
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
              )}
            </motion.button>
            
            {/* Recent Purchases */}
            <div className="mt-6">
              <h3 className="text-sm font-bold text-gray-400 mb-3">Recent Entanglements</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                <AnimatePresence mode="popLayout">
                  {purchases.slice(-3).reverse().map((purchase) => (
                    <motion.div
                      key={purchase.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex justify-between items-center text-sm bg-gray-800/30 rounded-lg px-3 py-2"
                    >
                      <span className="text-gray-400">{purchase.buyer}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-chiefs-red">{purchase.chiefsAllocation}%</span>
                        <span className="text-gray-500">/</span>
                        <span className="text-eagles-green">{purchase.eaglesAllocation}%</span>
                        <span className="text-purple-400 font-bold">${purchase.amount.toFixed(0)}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}