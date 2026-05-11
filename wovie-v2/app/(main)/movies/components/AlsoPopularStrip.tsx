'use client'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import MiniCard from './MiniCard'

interface Movie {
  id: number; title: string; posterUrl: string | null; rating: number
}

export default function AlsoPopularStrip({ movies }: { movies: Movie[] }) {
  if (!movies.length) return null

  return (
    <div className="mt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">Also popular this week</h3>
        <Link href="/movies?page=2"
              className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-1">
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Scrollable row */}
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
        {movies.map(movie => (
          <MiniCard key={movie.id} movie={movie} />
        ))}

        {/* See all card */}
        <Link href="/movies?page=2"
              className="flex-shrink-0 w-[130px] aspect-[2/3] rounded-lg bg-white/5 border border-white/10
                         flex flex-col items-center justify-center gap-2 hover:bg-white/10
                         transition-colors cursor-pointer">
          <ArrowRight className="w-6 h-6 text-white/40" />
          <span className="text-sm text-white/50">See all</span>
        </Link>
      </div>
    </div>
  )
}
