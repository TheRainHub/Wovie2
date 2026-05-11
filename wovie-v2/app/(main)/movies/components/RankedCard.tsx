'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import Link from 'next/link'
import HoverOverlay from './HoverOverlay'
import ProgressBar from './ProgressBar'

interface Movie {
  id: number; title: string; posterUrl: string | null;
  releaseDate: Date | null; rating: number;
  genres: { genre: { name: string } }[]
}

interface Props {
  movie: Movie
  rank: number
  progress?: { watchedSeconds: number; totalSeconds: number }
  isNew?: boolean
}

export default function RankedCard({ movie, rank, progress, isNew }: Props) {
  const [isHovered, setIsHovered] = useState(false)
  const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : ''
  const genre = movie.genres?.[0]?.genre.name || ''

  return (
    <Link href={`/movies/${movie.id}`} className="block group">
      <motion.div
        className="relative aspect-[2/3] rounded-xl overflow-hidden bg-card cursor-pointer"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Poster */}
        {movie.posterUrl && (
          <img src={movie.posterUrl} alt={movie.title}
               className="absolute inset-0 w-full h-full object-cover" />
        )}

        {/* Bottom gradient — all info lives here */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Rating badge — top right, always visible */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-1
                        rounded-md bg-black/50 backdrop-blur-sm text-[10px] font-bold text-white/90">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          {movie.rating.toFixed(1)}
        </div>

        {/* NEW badge — top left */}
        {isNew && (
          <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded text-[9px] font-bold
                          bg-[#D4537E] text-white uppercase tracking-wider">
            New
          </div>
        )}

        {/* Info block — bottom, inside the card */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-3">
          {/* Title */}
          <h4 className="text-sm font-semibold text-white line-clamp-1 mb-1 drop-shadow-md">
            {movie.title}
          </h4>

          {/* Year + Genre */}
          <div className="flex items-center gap-1.5 text-[11px] text-white/50">
            {year && <span>{year}</span>}
            {year && genre && <span className="text-white/20">·</span>}
            {genre && <span>{genre}</span>}
          </div>

          {/* Progress */}
          {progress && (
            <div className="mt-2">
              <ProgressBar watchedSeconds={progress.watchedSeconds} totalSeconds={progress.totalSeconds} />
            </div>
          )}
        </div>

        <HoverOverlay isHovered={isHovered} />
      </motion.div>
    </Link>
  )
}
