'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import * as d3 from 'd3'
import { useDemoStore } from '@/lib/store'

export default function AllocationVisualizer() {
  const svgRef = useRef<SVGSVGElement>(null)
  const { collectiveChiefsAllocation, collectiveEaglesAllocation } = useDemoStore()
  
  useEffect(() => {
    if (!svgRef.current) return
    
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    
    const width = 300
    const height = 300
    const radius = Math.min(width, height) / 2 - 20
    
    const data = [
      { team: 'Chiefs', value: collectiveChiefsAllocation, color: '#E31837' },
      { team: 'Eagles', value: collectiveEaglesAllocation, color: '#004C54' },
    ]
    
    const pie = d3.pie<typeof data[0]>()
      .value(d => d.value)
      .sort(null)
    
    const arc = d3.arc<d3.PieArcDatum<typeof data[0]>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius)
    
    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)
    
    // Create pie slices
    const slices = g.selectAll('.slice')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'slice')
    
    slices.append('path')
      .attr('d', arc)
      .attr('fill', d => d.data.color)
      .style('opacity', 0.9)
      .style('filter', 'drop-shadow(0 0 10px rgba(147, 51, 234, 0.3))')
      .transition()
      .duration(1000)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d)
        return function(t) {
          return arc(interpolate(t)) || ''
        }
      })
    
    // Add percentage labels
    slices.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-size', '20px')
      .style('font-weight', 'bold')
      .style('opacity', 0)
      .text(d => `${d.data.value.toFixed(1)}%`)
      .transition()
      .delay(1000)
      .duration(500)
      .style('opacity', 1)
    
    // Center text
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.5em')
      .style('fill', '#9333ea')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('ENTANGLED')
    
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em')
      .style('fill', '#9333ea')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('ALLOCATION')
    
  }, [collectiveChiefsAllocation, collectiveEaglesAllocation])
  
  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold mb-4 text-center">Quantum State Distribution</h3>
      <svg ref={svgRef} width="300" height="300" className="w-full max-w-xs mx-auto" />
      <div className="mt-4 space-y-2">
        <motion.div
          className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-chiefs-red rounded-full" />
            <span className="font-medium">Kansas City Chiefs</span>
          </div>
          <span className="font-bold text-chiefs-red">{collectiveChiefsAllocation.toFixed(1)}%</span>
        </motion.div>
        <motion.div
          className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-eagles-green rounded-full" />
            <span className="font-medium">Philadelphia Eagles</span>
          </div>
          <span className="font-bold text-eagles-green">{collectiveEaglesAllocation.toFixed(1)}%</span>
        </motion.div>
      </div>
    </div>
  )
}