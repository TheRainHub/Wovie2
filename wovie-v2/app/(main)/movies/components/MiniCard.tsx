'use client'
import Link from 'next/link'
import { Star } from 'lucide-react'

interface Movie {
  id: number; title: string; posterUrl: string | null;
  rating: number
}

export default function MiniCard({ movie }: { movie: Movie }) {
  return (
    <Link href={`/movies/${movie.id}`} className="group flex-shrink-0 w-[130px]">
      <div className="aspect-[2/3] rounded-lg overflow-hidden bg-card border border-white/5
                      mb-2 relative">
        {movie.posterUrl ? (
          <img src={movie.posterUrl} alt={movie.title}
               className="w-full h-full object-cover transition-transform duration-300
                          group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">
            {movie.title}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      <h5 className="text-xs font-medium text-white/80 line-clamp-1 group-hover:text-white
                     transition-colors">{movie.title}</h5>
      <div className="flex items-center gap-1 text-[10px] text-white/40 mt-0.5">
        <Star className="w-2.5 h-2.5 text-accent-yellow fill-accent-yellow" />
        {movie.rating.toFixed(1)}
      </div>
    </Link>
  )
}
