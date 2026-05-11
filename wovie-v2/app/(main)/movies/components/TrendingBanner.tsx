'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Info, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface Movie {
  id: number
  title: string
  description: string | null
  backdropUrl: string | null
  rating: number
  releaseDate: Date | null
  runtime: number | null
  genres: { genre: { name: string } }[]
}

interface Props {
  movies: Movie[]
}

export default function TrendingBanner({ movies }: Props) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  const next = useCallback(() => {
    setDirection(1)
    setCurrent(prev => (prev + 1) % movies.length)
  }, [movies.length])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent(prev => (prev - 1 + movies.length) % movies.length)
  }, [movies.length])

  // Auto-rotate every 6 seconds
  useEffect(() => {
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next])

  if (!movies.length) return null
  const movie = movies[current]
  const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : ''
  const genre = movie.genres?.[0]?.genre.name || ''

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -80 : 80 }),
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden mb-8"
         style={{ aspectRatio: '21/9', minHeight: 280 }}>
      {/* Background images with crossfade */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={movie.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {movie.backdropUrl && (
            <img
              src={movie.backdropUrl}
              alt={movie.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/90 text-white uppercase tracking-wider">
                Trending
              </span>
              {genre && (
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/10 border border-white/10 text-white/80">
                  {genre}
                </span>
              )}
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg line-clamp-1">
              {movie.title}
            </h3>

            <div className="flex items-center gap-2 text-sm text-white/60 mb-3">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-amber-400 font-semibold">{movie.rating.toFixed(1)}</span>
              {year && <><span className="text-white/25">·</span><span>{year}</span></>}
            </div>

            {movie.description && (
              <p className="text-white/50 text-sm leading-relaxed max-w-lg line-clamp-2 mb-4 hidden md:block">
                {movie.description}
              </p>
            )}

            <div className="flex items-center gap-2">
              <Link
                href={`/movies/${movie.id}`}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg font-semibold text-sm
                           bg-white text-black hover:bg-white/90 transition-all"
              >
                <Play className="w-4 h-4" fill="black" />
                Watch
              </Link>
              <Link
                href={`/movies/${movie.id}`}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-medium text-sm
                           bg-white/10 text-white border border-white/15
                           hover:bg-white/20 transition-all backdrop-blur-sm"
              >
                <Info className="w-4 h-4" />
                Details
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40
                   backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors
                   border border-white/10"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40
                   backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors
                   border border-white/10"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-3 right-6 z-20 flex gap-1.5">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
