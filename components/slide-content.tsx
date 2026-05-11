"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface SlideContentProps {
  children: ReactNode
  isActive: boolean
  brightness: number
  slideIndex: number
}

export function SlideContent({ children, isActive, brightness, slideIndex }: SlideContentProps) {
  // Keep dark theme for slides 8+ (index 7+), otherwise use brightness-based theming
  const useDarkTheme = slideIndex >= 7 || brightness <= 0.6
  
  // Text color shifts from light (on dark bg) to dark (on bright bg)
  const textColor = useDarkTheme
    ? `hsl(220, 20%, ${90 + brightness * 5}%)`
    : `hsl(220, 30%, ${20 - brightness * 10}%)`
  
  const subtextColor = useDarkTheme
    ? `hsla(220, 20%, ${80 + brightness * 10}%, 0.7)`
    : `hsla(220, 25%, ${30 - brightness * 10}%, 0.8)`

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
      animate={{ 
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 0.9,
        rotateY: isActive ? 0 : 15,
        z: isActive ? 0 : -100,
      }}
      exit={{ opacity: 0, scale: 1.1, rotateY: 15 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ 
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        pointerEvents: isActive ? 'auto' : 'none',
        color: textColor,
      }}
    >
      <motion.div 
        className={`relative w-full mx-auto ${slideIndex === 10 ? 'max-w-7xl' : 'max-w-6xl'}`}
        initial={{ y: 50 }}
        animate={{ y: isActive ? 0 : 50 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Glass card container */}
        <div 
          className="relative rounded-3xl p-8 md:p-12 overflow-hidden"
          style={{
            background: useDarkTheme
              ? `rgba(0, 0, 0, ${0.3 - Math.min(brightness, 0.6) * 0.15})`
              : `rgba(255, 255, 255, ${0.7 + brightness * 0.2})`,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${useDarkTheme
              ? `rgba(255, 255, 255, ${0.1 + Math.min(brightness, 0.6) * 0.1})`
              : `rgba(255, 255, 255, 0.3)`}`,
            boxShadow: useDarkTheme
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              : '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          }}
        >
          {/* Decorative corner elements */}
          <div 
            className="absolute top-0 left-0 w-24 h-24 pointer-events-none"
            style={{
              background: `radial-gradient(circle at top left, ${
                useDarkTheme
                  ? 'rgba(192, 132, 252, 0.15)' 
                  : 'rgba(251, 191, 36, 0.1)'
              } 0%, transparent 70%)`,
            }}
          />
          <div 
            className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none"
            style={{
              background: `radial-gradient(circle at bottom right, ${
                useDarkTheme
                  ? 'rgba(240, 171, 252, 0.1)' 
                  : 'rgba(59, 130, 246, 0.08)'
              } 0%, transparent 70%)`,
            }}
          />
          
          {/* Page number indicator */}
          <motion.div 
            className="absolute top-4 right-6 font-serif text-sm tracking-widest"
            style={{ color: subtextColor }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ delay: 0.4 }}
          >
            {String(slideIndex + 1).padStart(2, '0')}
          </motion.div>
          
          {/* Content */}
          <div style={{ color: textColor }}>
            {children}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Reusable slide layouts
export function TitleSlide({ 
  title, 
  subtitle,
  brightness 
}: { 
  title: string
  subtitle?: string
  brightness: number 
}) {
  const accentColor = brightness > 0.6 
    ? 'hsl(35, 90%, 50%)' 
    : 'hsl(270, 70%, 70%)'
    
  return (
    <div className="text-center space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="inline-block mb-4"
      >
        <svg width="60" height="60" viewBox="0 0 60 60" className="mx-auto">
          <motion.circle
            cx="30"
            cy="30"
            r="25"
            fill="none"
            stroke={accentColor}
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
          <motion.circle
            cx="30"
            cy="30"
            r="4"
            fill={accentColor}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 }}
          />
        </svg>
      </motion.div>
      
      <motion.h1 
        className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight text-balance"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {title}
      </motion.h1>
      
      {subtitle && (
        <motion.p 
          className="text-lg md:text-xl opacity-70 max-w-2xl mx-auto text-pretty"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 0.7 }}
          transition={{ delay: 0.6 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}

export function ContentSlide({ 
  title, 
  romanNumeral,
  children,
  brightness,
  slideIndex = 0
}: { 
  title: string
  romanNumeral: string
  children: ReactNode
  brightness: number
  slideIndex?: number
}) {
  // Use dark theme accent for slides 8+ (index 7+)
  const useDarkAccent = slideIndex >= 7 || brightness <= 0.6
  const accentColor = useDarkAccent
    ? 'hsl(270, 70%, 70%)' 
    : 'hsl(35, 90%, 50%)'
    
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <motion.span 
          className="text-sm font-medium tracking-widest opacity-50"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 0.5 }}
          transition={{ delay: 0.3 }}
        >
          {romanNumeral}
        </motion.span>
        <motion.div 
          className="h-px flex-1 max-w-16"
          style={{ background: accentColor }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        />
      </div>
      
      <motion.h2 
        className="text-2xl md:text-4xl font-serif font-bold text-balance"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {title}
      </motion.h2>
      
      <motion.div 
        className="prose prose-lg max-w-none"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ 
          color: 'inherit',
          '--tw-prose-body': 'currentColor',
          '--tw-prose-headings': 'currentColor',
        } as React.CSSProperties}
      >
        {children}
      </motion.div>
    </div>
  )
}
