"use client"

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion"
import { useEffect, useState, useRef } from "react"

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  layer: number // 1 = far (slow), 2 = mid, 3 = near (fast)
  twinkleDelay: number
  variant: 'small' | 'medium' | 'large' // different sparkle sizes
}

interface ParallaxStarsProps {
  currentIndex: number
  totalSlides: number
  mouseX: number
  mouseY: number
}

function generateStars(count: number, layer: number): Star[] {
  const variants: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large']
  return Array.from({ length: count }, (_, i) => ({
    id: i + layer * 1000,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: layer === 1 ? Math.random() * 8 + 6 : layer === 2 ? Math.random() * 12 + 10 : Math.random() * 18 + 14,
    opacity: 1,
    layer,
    twinkleDelay: Math.random() * 5,
    variant: variants[Math.floor(Math.random() * 3)],
  }))
}

export function ParallaxStars({ currentIndex, totalSlides, mouseX, mouseY }: ParallaxStarsProps) {
  const [stars, setStars] = useState<Star[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Calculate brightness based on slide position (0 = dark, 1 = bright)
  const brightness = currentIndex / (totalSlides - 1)
  
  // Spring values for smooth mouse following
  const springConfig = { damping: 50, stiffness: 100 }
  const smoothMouseX = useSpring(useMotionValue(mouseX), springConfig)
  const smoothMouseY = useSpring(useMotionValue(mouseY), springConfig)
  
  useEffect(() => {
    smoothMouseX.set(mouseX)
    smoothMouseY.set(mouseY)
  }, [mouseX, mouseY, smoothMouseX, smoothMouseY])
  
  // Parallax transforms for each layer (far stars move less)
  const layer1X = useTransform(smoothMouseX, [0, 1], [-5, 5])
  const layer1Y = useTransform(smoothMouseY, [0, 1], [-5, 5])
  const layer2X = useTransform(smoothMouseX, [0, 1], [-15, 15])
  const layer2Y = useTransform(smoothMouseY, [0, 1], [-15, 15])
  const layer3X = useTransform(smoothMouseX, [0, 1], [-30, 30])
  const layer3Y = useTransform(smoothMouseY, [0, 1], [-30, 30])
  
  useEffect(() => {
    const farStars = generateStars(150, 1)
    const midStars = generateStars(100, 2)
    const nearStars = generateStars(60, 3)
    setStars([...farStars, ...midStars, ...nearStars])
  }, [])
  
  const getLayerTransform = (layer: number) => {
    switch (layer) {
      case 1: return { x: layer1X, y: layer1Y }
      case 2: return { x: layer2X, y: layer2Y }
      case 3: return { x: layer3X, y: layer3Y }
      default: return { x: layer1X, y: layer1Y }
    }
  }
  
  // Stars stay visible throughout all pages with high opacity
  const starOpacity = Math.max(0.7, 1 - brightness * 0.3)
  
  // Background gradient matching the reference - deep indigo purple
  const bgGradient = `
    radial-gradient(ellipse at 50% 100%, 
      hsl(${265 + brightness * 15}, ${70 - brightness * 20}%, ${18 + brightness * 40}%) 0%,
      hsl(${270 - brightness * 10}, ${65 - brightness * 25}%, ${12 + brightness * 35}%) 40%,
      hsl(${275 - brightness * 15}, ${60 - brightness * 30}%, ${8 + brightness * 25}%) 100%
    )
  `
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden"
      style={{ background: bgGradient }}
    >
      {/* Nebula layers - pink/lavender flowing aurora effect */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
          opacity: starOpacity * 0.8,
          x: layer1X,
          y: layer1Y,
        }}
      >
        {/* Main pink aurora flow */}
        <div 
          className="absolute w-[600px] h-[1000px] blur-[80px]"
          style={{
            background: `linear-gradient(180deg, 
              rgba(240, 171, 252, 0.3) 0%, 
              rgba(232, 121, 249, 0.25) 30%,
              rgba(192, 132, 252, 0.2) 60%,
              transparent 100%)`,
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%) rotate(-5deg)',
            borderRadius: '50% 50% 50% 50%',
          }}
        />
        {/* Secondary lavender glow */}
        <div 
          className="absolute w-[500px] h-[800px] blur-[100px]"
          style={{
            background: `linear-gradient(180deg, 
              rgba(196, 181, 253, 0.25) 0%, 
              rgba(167, 139, 250, 0.2) 40%,
              transparent 100%)`,
            top: '5%',
            left: '35%',
            transform: 'rotate(10deg)',
            borderRadius: '40% 60% 50% 50%',
          }}
        />
        {/* Soft purple ambient glow */}
        <div 
          className="absolute w-[800px] h-[800px] rounded-full blur-[120px]"
          style={{
            background: `radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)`,
            top: '60%',
            left: '70%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </motion.div>
      
      {/* Star layers */}
      {[1, 2, 3].map((layer) => {
        const transform = getLayerTransform(layer)
        const layerStars = stars.filter(s => s.layer === layer)
        
        return (
          <motion.div
            key={`layer-${layer}`}
            className="absolute inset-0"
            style={{
              x: transform.x,
              y: transform.y,
              opacity: starOpacity,
            }}
          >
            {layerStars.map((star) => (
              <motion.div
                key={star.id}
                className="absolute"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: star.size,
                  height: star.size,
                }}
                animate={{
                  opacity: [0.7, 1, 0.7],
                  scale: [0.9, 1.2, 0.9],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: star.twinkleDelay,
                  ease: "easeInOut",
                }}
              >
                {/* 4-pointed diamond sparkle star */}
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{
                    filter: `drop-shadow(0 0 ${star.size * 0.5}px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 ${star.size}px rgba(240, 171, 252, 0.6))`,
                  }}
                >
                  <path
                    d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z"
                    fill="url(#starGradient)"
                  />
                  <defs>
                    <radialGradient id="starGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="40%" stopColor="#f5f3ff" />
                      <stop offset="70%" stopColor="#e9d5ff" />
                      <stop offset="100%" stopColor="#d8b4fe" />
                    </radialGradient>
                  </defs>
                </svg>
              </motion.div>
            ))}
          </motion.div>
        )
      })}
      
      {/* Magical pink/lavender light source that appears as we progress */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          right: '-5%',
          top: '15%',
          width: '35vw',
          height: '35vw',
          maxWidth: '500px',
          maxHeight: '500px',
        }}
        animate={{
          opacity: brightness > 0.4 ? (brightness - 0.4) * 1.2 : 0,
          scale: 0.8 + brightness * 0.3,
        }}
        transition={{ duration: 1 }}
      >
        <div 
          className="w-full h-full rounded-full blur-[80px]"
          style={{
            background: `radial-gradient(circle, 
              rgba(240, 171, 252, ${0.3 + brightness * 0.3}) 0%, 
              rgba(196, 181, 253, ${0.2 + brightness * 0.2}) 40%,
              transparent 70%
            )`,
          }}
        />
      </motion.div>
      
      {/* Distant planet with purple/pink tones */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: '12%',
          top: '20%',
        }}
        animate={{
          opacity: starOpacity * 0.6,
          y: [0, -8, 0],
        }}
        transition={{
          y: { duration: 10, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 1 }
        }}
      >
        <div 
          className="w-12 h-12 md:w-16 md:h-16 rounded-full"
          style={{
            background: `linear-gradient(135deg, 
              hsl(${280 - brightness * 20}, 50%, 45%) 0%,
              hsl(${275 - brightness * 15}, 45%, 30%) 50%,
              hsl(${270 - brightness * 10}, 40%, 20%) 100%
            )`,
            boxShadow: `
              inset -6px -6px 15px rgba(0,0,0,0.4),
              0 0 30px rgba(192, 132, 252, 0.25)
            `,
          }}
        />
      </motion.div>
      
      {/* Shooting stars (occasional) */}
      <ShootingStars opacity={starOpacity} />
    </div>
  )
}

function ShootingStars({ opacity }: { opacity: number }) {
  const [shootingStars, setShootingStars] = useState<Array<{ id: number; startX: number; startY: number }>>([])
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newStar = {
          id: Date.now(),
          startX: Math.random() * 60 + 20,
          startY: Math.random() * 30,
        }
        setShootingStars(prev => [...prev, newStar])
        setTimeout(() => {
          setShootingStars(prev => prev.filter(s => s.id !== newStar.id))
        }, 1000)
      }
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <>
      {shootingStars.map(star => (
        <motion.div
          key={star.id}
          className="absolute w-2 h-2 bg-white rounded-full"
          style={{
            left: `${star.startX}%`,
            top: `${star.startY}%`,
            opacity: opacity,
            boxShadow: '0 0 6px #fff, 0 0 12px rgba(240, 171, 252, 0.8), 0 0 20px rgba(196, 181, 253, 0.5)',
          }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{ 
            x: [0, 180], 
            y: [0, 120], 
            opacity: [0, 1, 0] 
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Trail with pink/lavender tint */}
          <div 
            className="absolute w-24 h-0.5 -left-24 top-0.5"
            style={{ 
              background: 'linear-gradient(to right, transparent, rgba(240, 171, 252, 0.6), rgba(255, 255, 255, 0.9))',
              transform: 'rotate(-34deg)', 
              transformOrigin: 'right center' 
            }}
          />
        </motion.div>
      ))}
    </>
  )
}
