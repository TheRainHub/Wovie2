'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface Movie {
  id: number
  title: string
  description: string | null
  backdropUrl: string | null
  posterUrl: string | null
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

  useEffect(() => {
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next])

  if (!movies.length) return null
  const movie = movies[current]
  const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : ''
  const hours = movie.runtime ? Math.floor(movie.runtime / 60) : 0
  const mins = movie.runtime ? movie.runtime % 60 : 0
  const runtime = movie.runtime ? `${hours}h ${mins}m` : ''

  return (
    <div className="relative w-full rounded-2xl overflow-hidden group"
         style={{ height: 'clamp(280px, 32vw, 420px)' }}>

      {/* Slides */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={movie.id}
          custom={direction}
          initial={(dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 })}
          animate={{ opacity: 1, x: 0 }}
          exit={(dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 })}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          {/* Backdrop fills entire banner */}
          {movie.backdropUrl && (
            <img
              src={movie.backdropUrl}
              alt={movie.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Cinematic gradients — heavier coverage */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />

          {/* Content: left-aligned, vertically centered */}
          <div className="absolute inset-0 flex items-end p-6 md:p-8 pb-8">
            <div className="max-w-3xl">
                {/* Badges */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4537E] text-white uppercase tracking-wider">
                    #{current + 1} Trending
                  </span>
                  {movie.genres?.slice(0, 2).map(g => (
                    <span key={g.genre.name}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/10
                                     border border-white/10 text-white/70 hidden md:inline">
                      {g.genre.name}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1.5 line-clamp-1 drop-shadow-lg">
                  {movie.title}
                </h3>

                {/* Meta */}
                <div className="flex items-center gap-2 text-xs text-white/50 mb-2.5">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-amber-400 font-semibold">{movie.rating.toFixed(1)}</span>
                  {year && <><span className="text-white/20">·</span><span>{year}</span></>}
                  {runtime && <><span className="text-white/20">·</span><span>{runtime}</span></>}
                </div>

                {/* Description */}
                {movie.description && (
                  <p className="text-white/40 text-xs leading-relaxed line-clamp-2 mb-3 hidden md:block max-w-md">
                    {movie.description}
                  </p>
                )}

                {/* CTA */}
                <Link
                  href={`/movies/${movie.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs
                             bg-white text-black hover:bg-white/90 transition-all"
                >
                  <Play className="w-3.5 h-3.5" fill="black" />
                  Watch now
                </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrows — only visible on hover, premium glassmorphism */}
      <button
        onClick={prev}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full
                   bg-black/50 backdrop-blur-md flex items-center justify-center
                   border border-white/15 opacity-0 group-hover:opacity-100
                   hover:bg-white/20 transition-all duration-200"
      >
        <ChevronLeft className="w-4 h-4 text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full
                   bg-black/50 backdrop-blur-md flex items-center justify-center
                   border border-white/15 opacity-0 group-hover:opacity-100
                   hover:bg-white/20 transition-all duration-200"
      >
        <ChevronRight className="w-4 h-4 text-white" />
      </button>

      {/* Progress dots — bigger, bottom-right */}
      <div className="absolute bottom-4 right-5 z-20 flex gap-2">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-5 h-2 bg-[#D4537E]'
                : 'w-2 h-2 bg-white/25 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
