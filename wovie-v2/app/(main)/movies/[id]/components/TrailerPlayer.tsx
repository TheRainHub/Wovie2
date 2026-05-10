'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'

export default function TrailerPlayer({ youtubeId }: { youtubeId: string | undefined }) {
  const [isPlaying, setIsPlaying] = useState(false)

  if (!youtubeId) return null

  return (
    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 mt-8">
      {isPlaying ? (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      ) : (
        // Thumbnail до клика
        <div
          className="absolute inset-0 cursor-pointer group"
          onClick={() => setIsPlaying(true)}
        >
          <img
            src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
            className="w-full h-full object-cover"
            alt="Trailer"
          />
          {/* тёмный оверлей */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

          {/* кнопка play */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-16 h-16 rounded-full bg-[#E8454A]/90
                            flex items-center justify-center
                            border-2 border-white/20">
              <Play className="w-6 h-6 text-white ml-1" />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
