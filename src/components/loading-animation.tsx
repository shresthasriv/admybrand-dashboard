"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import Image from "next/image"

interface LoadingAnimationProps {
  onComplete: () => void
}

export function LoadingAnimation({ onComplete }: LoadingAnimationProps) {
  const [stage, setStage] = React.useState<'initial' | 'shrinking' | 'complete'>('initial')

  React.useEffect(() => {
    // Start the animation sequence
    const timer1 = setTimeout(() => {
      setStage('shrinking')
    }, 1500) // Show large logo for 1.5 seconds

    const timer2 = setTimeout(() => {
      setStage('complete')
      onComplete()
    }, 2800) // Complete animation after 2.8 seconds total

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [onComplete])

  if (stage === 'complete') {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
      >
        {/* Large centered logo that shrinks and moves to header position */}
        <motion.div
          initial={{ 
            scale: 1,
            x: 0,
            y: 0
          }}
          animate={stage === 'shrinking' ? {
            scale: 0.3,
            x: typeof window !== 'undefined' ? -window.innerWidth * 0.35 : -300,
            y: typeof window !== 'undefined' ? -window.innerHeight * 0.4 : -200
          } : {
            scale: 1,
            x: 0,
            y: 0
          }}
          transition={{
            duration: 1.2,
            ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth animation
            delay: stage === 'shrinking' ? 0 : 0
          }}
          className="relative"
        >
          {/* Glowing background effect */}
          <motion.div
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ 
              opacity: stage === 'shrinking' ? 0 : [0.3, 0.8, 0.3],
              scale: stage === 'shrinking' ? 0.5 : [1, 1.1, 1]
            }}
            transition={{
              duration: stage === 'shrinking' ? 0.8 : 2,
              repeat: stage === 'shrinking' ? 0 : Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"
          />
          
          {/* Main logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ 
              scale: 1
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.2
            }}
            className="relative z-10"
          >
            <Image
              src="/web-logo.svg"
              alt="ADmyBRAND"
              width={200}
              height={200}
              className="w-48 h-48 sm:w-64 sm:h-64"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Loading text */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="absolute bottom-32 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
              className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="text-lg font-medium text-muted-foreground"
            >
              Loading Analytics Dashboard...
            </motion.p>
          </div>
        </motion.div>

        {/* Animated particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0,
              scale: 0,
              x: 0,
              y: 0
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: [0, (Math.random() - 0.5) * 400],
              y: [0, (Math.random() - 0.5) * 400],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeOut"
            }}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            style={{
              left: '50%',
              top: '50%',
            }}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  )
} 