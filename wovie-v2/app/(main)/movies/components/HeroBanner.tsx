'use client'

import { motion } from 'framer-motion'
import { Play, Plus, Info, Star } from 'lucide-react'
import Link from 'next/link'

interface Movie {
  id: number
  title: string
  description: string | null
  posterUrl: string | null
  backdropUrl: string | null
  releaseDate: Date | null
  rating: number
  runtime: number | null
  genres: { genre: { name: string } }[]
}

interface Props {
  movie: Movie
  isLastVisited?: boolean
}

export default function HeroBanner({ movie, isLastVisited }: Props) {
  const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : ''
  const hours = movie.runtime ? Math.floor(movie.runtime / 60) : 0
  const mins = movie.runtime ? movie.runtime % 60 : 0
  const runtime = movie.runtime ? `${hours}h ${mins}min` : ''

  return (
    <div className="relative w-[calc(100%+2rem)] -mx-4 -mt-16 mb-10">
      {/* Backdrop image */}
      <div className="relative w-full h-[70vh] min-h-[500px] max-h-[700px] overflow-hidden">
        {movie.backdropUrl ? (
          <motion.img
            src={movie.backdropUrl}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        ) : movie.posterUrl ? (
          <motion.img
            src={movie.posterUrl}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1 }}
          />
        ) : null}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#121212]/80 via-[#121212]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#121212] to-transparent" />

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-10 max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Badge */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-4 ${
              isLastVisited
                ? 'bg-blue-500/20 border border-blue-500/30'
                : 'bg-red-500/20 border border-red-500/30'
            }`}>
              <span className={`text-xs ${isLastVisited ? 'text-blue-400' : 'text-red-400'}`}>
                {isLastVisited ? '🕐' : '🔥'}
              </span>
              <span className={`text-xs font-semibold tracking-wide ${isLastVisited ? 'text-blue-400' : 'text-red-400'}`}>
                {isLastVisited ? 'Continue where you left off' : '#1 in trending today'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg max-w-3xl leading-tight">
              {movie.title}
            </h1>

            {/* Meta info */}
            <div className="flex items-center gap-2 text-sm text-white/70 mb-4 flex-wrap">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-amber-400 font-bold">{movie.rating.toFixed(1)}</span>
              </div>
              {year && <><span className="text-white/30">·</span><span>{year}</span></>}
              {runtime && <><span className="text-white/30">·</span><span>{runtime}</span></>}
              <span className="text-white/30">·</span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded border border-white/25 text-white/60">18+</span>
            </div>

            {/* Genre chips */}
            <div className="flex flex-wrap gap-2 mb-5">
              {movie.genres?.slice(0, 4).map(g => (
                <span
                  key={g.genre.name}
                  className="px-3 py-1 rounded-full text-xs font-medium
                             bg-white/8 border border-white/10 text-white/80"
                >
                  {g.genre.name}
                </span>
              ))}
            </div>

            {/* Description */}
            {movie.description && (
              <p className="text-white/60 text-sm leading-relaxed max-w-xl mb-6 line-clamp-3">
                {movie.description}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <Link
                href={`/movies/${movie.id}`}
                className="flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm
                           bg-white text-black hover:bg-white/90 transition-all duration-200
                           shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
              >
                <Play className="w-4 h-4" fill="black" />
                Watch
              </Link>

              <button className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm
                                 bg-white/10 text-white border border-white/15
                                 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm">
                <Plus className="w-4 h-4" />
                Add to list
              </button>

              <Link
                href={`/movies/${movie.id}`}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm
                           bg-white/10 text-white border border-white/15
                           hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
              >
                <Info className="w-4 h-4" />
                More info
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
