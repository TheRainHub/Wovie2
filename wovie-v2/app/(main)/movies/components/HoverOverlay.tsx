'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { Play, Heart } from 'lucide-react'

interface Props {
  isHovered: boolean
}

export default function HoverOverlay({ isHovered }: Props) {
  return (
    <AnimatePresence>
      {isHovered && (
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Play button */}
          <motion.button
            className="relative z-10 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm
                       border border-white/30 flex items-center justify-center
                       hover:bg-white/30 transition-colors"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
          </motion.button>

          {/* Heart top-right */}
          <button className="absolute top-3 right-3 z-10 p-2 rounded-full
                             bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors">
            <Heart className="w-4 h-4 text-white" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
