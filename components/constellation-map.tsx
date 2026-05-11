"use client"

import { motion } from "framer-motion"

interface ConstellationMapProps {
  currentIndex: number
  totalSlides: number
  onNavigate: (index: number) => void
  slideNames: string[]
}

// Leo constellation pattern - accurate star positions
// The "Sickle" (lion's head) curves from Regulus through Eta, Algieba, Zosma, Epsilon
// Then the body extends to Chertan, and tail to Denebola
const constellationPoints = [
  { x: 15, y: 65 },   // I. Title - Regulus (alpha, brightest, heart of lion)
  { x: 22, y: 50 },   // II. TOC - Eta Leonis (chin of sickle)
  { x: 18, y: 35 },   // III. Essay - Algieba (gamma, neck/mane)
  { x: 25, y: 22 },   // IV. SMART Goal - Adhafera (zeta, top of head)
  { x: 38, y: 18 },   // V. Eastern/Western - Epsilon Leonis (forehead)
  { x: 50, y: 28 },   // VI. Philosophical - Rasalas (mu, crown)
  { x: 55, y: 45 },   // VII. Anthropological - Zosma (delta, back)
  { x: 68, y: 55 },   // VIII. Physical - Chertan (theta, hip/rear leg)
  { x: 78, y: 48 },   // IX. Material - between Chertan and Denebola
  { x: 88, y: 38 },   // X. Spiritual - approaching tail
  { x: 92, y: 28 },   // XI. Parting Words - Denebola (beta, tail tip)
]

export function ConstellationMap({ 
  currentIndex, 
  totalSlides, 
  onNavigate,
  slideNames 
}: ConstellationMapProps) {
  return (
    <motion.div 
      className="fixed bottom-32 left-6 z-50 w-48 h-40 md:w-64 md:h-52"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      {/* Glass background */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10" />
      
      {/* SVG Constellation */}
      <svg 
        viewBox="0 0 100 100" 
        className="absolute inset-0 w-full h-full p-3"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Connection lines */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(147, 197, 253, 0.3)" />
            <stop offset="100%" stopColor="rgba(251, 191, 36, 0.3)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Draw connecting lines */}
        {constellationPoints.slice(0, totalSlides - 1).map((point, i) => {
          const nextPoint = constellationPoints[i + 1]
          const isTraversed = i < currentIndex
          return (
            <motion.line
              key={`line-${i}`}
              x1={point.x}
              y1={point.y}
              x2={nextPoint.x}
              y2={nextPoint.y}
              stroke={isTraversed ? "url(#lineGradient)" : "rgba(255,255,255,0.15)"}
              strokeWidth={isTraversed ? 1.5 : 0.5}
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: 1,
                opacity: isTraversed ? 1 : 0.4
              }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            />
          )
        })}
        
        {/* Draw stars */}
        {constellationPoints.slice(0, totalSlides).map((point, i) => {
          const isCurrent = i === currentIndex
          const isVisited = i <= currentIndex
          const brightness = i / (totalSlides - 1)
          
          // Color transitions from cool blue to warm gold
          const starColor = isVisited 
            ? `hsl(${200 + brightness * 40}, ${70 + brightness * 20}%, ${60 + brightness * 30}%)`
            : "rgba(255,255,255,0.3)"
          
          return (
            <g key={`star-${i}`}>
              {/* Outer glow for current */}
              {isCurrent && (
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r={6}
                  fill="none"
                  stroke={starColor}
                  strokeWidth={1}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0.2, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              
              {/* Star point */}
              <motion.circle
                cx={point.x}
                cy={point.y}
                r={isCurrent ? 4 : isVisited ? 3 : 2}
                fill={starColor}
                filter={isCurrent ? "url(#glow)" : undefined}
                className="cursor-pointer"
                onClick={() => onNavigate(i)}
                whileHover={{ scale: 1.5 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05, type: "spring" }}
              />
            </g>
          )
        })}
      </svg>
      
      {/* Current slide label */}
      <motion.div 
        className="absolute -bottom-8 left-0 right-0 text-center"
        key={currentIndex}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="text-xs text-white/60 font-medium tracking-wide">
          {slideNames[currentIndex]}
        </span>
      </motion.div>
    </motion.div>
  )
}
