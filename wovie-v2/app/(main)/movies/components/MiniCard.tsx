'use client'
import Link from 'next/link'
import Image from 'next/image'
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
          <Image 
            src={movie.posterUrl} 
            alt={movie.title}
            fill
            sizes="130px"
            className="object-cover transition-transform duration-300 group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">
            {movie.title}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        
        {/* Info inside the card — bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-2 z-20">
          <h5 className="text-xs font-medium text-white/90 line-clamp-1 drop-shadow-md group-hover:text-white transition-colors">
            {movie.title}
          </h5>
          <div className="flex items-center gap-1 text-[10px] text-white/70 mt-0.5">
            <Star className="w-2.5 h-2.5 text-accent-yellow fill-accent-yellow" />
            <span className="font-medium text-white/90">{movie.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
