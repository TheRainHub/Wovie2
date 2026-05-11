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
  const genre = movie.genres[0]?.genre.name || ''

  return (
    <Link href={`/movies/${movie.id}`} className="block">
      <motion.div
        className="relative aspect-[2/3] rounded-xl overflow-hidden bg-card border border-white/5 cursor-pointer"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {movie.posterUrl && (
          <img src={movie.posterUrl} alt={movie.title}
               className="absolute inset-0 w-full h-full object-cover" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Top badges: genre + rating */}
        <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between">
          {genre && (
            <span className="px-2 py-1 rounded-md bg-white/10 backdrop-blur-sm border border-white/10
                             text-[10px] font-medium text-white/80">{genre}</span>
          )}
          <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/40 backdrop-blur-sm
                           text-[10px] font-bold text-white/90">
            <Star className="w-3 h-3 text-accent-yellow fill-accent-yellow" />
            {movie.rating.toFixed(1)}
          </span>
        </div>

        {/* Rank number */}
        <span className="absolute bottom-10 left-2 z-10 text-[72px] font-black leading-none
                         text-white/8 select-none" style={{ fontFamily: 'Georgia, serif' }}>
          {rank}
        </span>

        {/* Progress */}
        {progress && (
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <ProgressBar watchedSeconds={progress.watchedSeconds} totalSeconds={progress.totalSeconds} />
          </div>
        )}

        <HoverOverlay isHovered={isHovered} />
      </motion.div>

      {/* Title + year below */}
      <div className="mt-2 px-0.5">
        <h4 className="text-sm font-semibold text-white line-clamp-1">{movie.title}</h4>
        <div className="flex items-center gap-1.5 text-xs text-white/50 mt-0.5">
          <span>{year}</span>
          {isNew && <span className="text-red-400 font-medium">· New</span>}
        </div>
      </div>
    </Link>
  )
}
