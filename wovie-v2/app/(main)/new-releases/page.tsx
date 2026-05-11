import { prisma } from '@/app/lib/db'
import RankedCard from '../movies/components/RankedCard'
import { CalendarDays } from 'lucide-react'

export const revalidate = 3600 // Cache for 1 hour

export default async function NewReleasesPage() {
  const movies = await prisma.movie.findMany({
    take: 100, // Top 100 newest movies
    orderBy: { releaseDate: 'desc' },
    include: {
      genres: { include: { genre: true } }
    }
  })

  return (
    <div className="min-h-screen bg-background text-white pb-20 pt-24 px-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col items-center justify-center mb-16 mt-12">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6">
            <CalendarDays className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">New Releases</h1>
          <p className="text-white/50 text-lg max-w-2xl text-center">
            The freshest arrivals. Catch the latest cinematic experiences right here.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie, index) => (
            <RankedCard
              key={movie.id}
              movie={movie}
              rank={index + 1}
              isNew={true} // Always show "NEW" badge on the newest movies
            />
          ))}
        </div>
      </div>
    </div>
  )
}
