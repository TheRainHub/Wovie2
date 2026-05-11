'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import Link from 'next/link'
import HoverOverlay from './HoverOverlay'

interface Movie {
  id: number; title: string; posterUrl: string | null;
  releaseDate: Date | null; rating: number;
  genres: { genre: { name: string } }[]
}

export default function TallCards({ movies }: { movies: Movie[] }) {
  return (
    <>
      {movies.map((movie, i) => (
        <TallCard key={movie.id} movie={movie} rank={i + 2} />
      ))}
    </>
  )
}

function TallCard({ movie, rank }: { movie: Movie; rank: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : ''
  const genre = movie.genres[0]?.genre.name || ''

  return (
    <Link href={`/movies/${movie.id}`} className="block">
      <motion.div
        className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-card border border-white/5 cursor-pointer"
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

        {/* Genre + Heart badges */}
        {genre && (
          <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-sm
                          border border-white/10 text-[11px] text-white/80">{genre}</div>
        )}

        {/* Rank number */}
        <span className="absolute bottom-14 left-3 z-10 text-[80px] font-black leading-none
                         text-white/10 select-none" style={{ fontFamily: 'Georgia, serif' }}>
          {rank}
        </span>

        <HoverOverlay isHovered={isHovered} />
      </motion.div>

      {/* Info below card */}
      <div className="mt-2 px-1">
        <h4 className="text-sm font-semibold text-white line-clamp-1">{movie.title}</h4>
        <div className="flex items-center gap-1.5 text-xs text-white/50 mt-0.5">
          <Star className="w-3 h-3 text-accent-yellow fill-accent-yellow" />
          <span className="text-white/80">{movie.rating.toFixed(1)}</span>
          {year && <span>{year}</span>}
        </div>
      </div>
    </Link>
  )
}
