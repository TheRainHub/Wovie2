'use client'
import { useScroll, useTransform, motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface Props {
  backdropUrl: string;
  title: string;
  year?: string;
  trailerKey?: string;
}

export default function CinematicHero({ backdropUrl, title, year, trailerKey }: Props) {
  const { scrollYProgress } = useScroll()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // дымка усиливается при скролле, уводя фон в темноту
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.2, 0.95])

  return (
    <div className="fixed inset-0 w-full h-screen -z-10 bg-[#0D0F14] overflow-hidden">

      {/* Базовый слой: картинка-постер (работает как placeholder, пока грузится видео) */}
      <motion.img
        src={backdropUrl}
        initial={{ scale: 1 }}
        animate={{ scale: 1.1 }}
        transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Слой с видео (обрезанный, чтобы скрыть рамки YouTube) */}
      {isMounted && trailerKey && (
        <motion.div 
          className="absolute inset-0 overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 6, duration: 2 }} // Ждем пока Ютуб скроет свой UI (play/перемотка), потом плавно показываем
        >
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${trailerKey}&playsinline=1&modestbranding=1&iv_load_policy=3&disablekb=1`}
            className="absolute top-1/2 left-1/2 w-[300vw] h-[300vh] md:w-[150vw] md:h-[150vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            allow="autoplay; encrypted-media"
          />
        </motion.div>
      )}

      {/* Градиенты для читаемости текста */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-[#0D0F14]/40 to-[#0D0F14] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0D0F14]/90 via-[#0D0F14]/20 to-transparent pointer-events-none" />
      
      {/* Затемнение при скролле вниз */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 bg-[#0D0F14] pointer-events-none"
      />

    </div>
  )
}
