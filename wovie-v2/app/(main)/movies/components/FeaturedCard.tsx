'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import HoverOverlay from './HoverOverlay'
import ProgressBar from './ProgressBar'

interface Movie {
  id: number; title: string; posterUrl: string | null;
  backdropUrl: string | null; releaseDate: Date | null;
  rating: number; runtime: number | null;
  genres: { genre: { name: string } }[]
}

interface Props {
  movie: Movie
  progress?: { watchedSeconds: number; totalSeconds: number }
}

export default function FeaturedCard({ movie, progress }: Props) {
  const [isHovered, setIsHovered] = useState(false)
  const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : ''
  const genre = movie.genres[0]?.genre.name || 'Movie'
  const hours = movie.runtime ? Math.floor(movie.runtime / 60) : 0
  const mins = movie.runtime ? movie.runtime % 60 : 0
  const runtime = movie.runtime ? `${hours}h ${mins}min` : ''

  return (
    <Link href={`/movies/${movie.id}`} className="block col-span-3 row-span-2">
      <motion.div
        className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden bg-card border border-white/5 cursor-pointer"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Background image */}
        {movie.backdropUrl && (
          <Image 
            src={movie.backdropUrl} 
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover" 
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

        {/* Genre badge */}
        <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-md bg-white/10 backdrop-blur-sm
                        border border-white/10 text-xs font-medium text-white/90">{genre}</div>

        {/* HOT badge */}
        <div className="absolute top-4 right-12 z-10 px-2.5 py-1 rounded-md bg-red-500/90
                        text-[10px] font-bold text-white uppercase tracking-wider">HOT</div>

        {/* Info bottom-left */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
          <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{movie.title}</h3>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Star className="w-4 h-4 text-accent-yellow fill-accent-yellow" />
            <span className="text-white font-semibold">{movie.rating.toFixed(1)}</span>
            <span>·</span>
            <span>{year}</span>
            {runtime && <><span>·</span><span>{runtime}</span></>}
            <span className="px-1.5 py-0.5 text-[10px] rounded border border-white/20 text-white/60">4K</span>
          </div>

          {/* Progress bar */}
          {progress && (
            <div className="mt-3">
              <ProgressBar watchedSeconds={progress.watchedSeconds} totalSeconds={progress.totalSeconds} />
            </div>
          )}
        </div>

        <HoverOverlay isHovered={isHovered} />
      </motion.div>
    </Link>
  )
}
