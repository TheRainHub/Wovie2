import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'
import { getPopularMovies, getMovieDetails, getGenres, getPosterUrl, getProfileUrl, getTrailerUrl } from '@/app/lib/tmdb'

const MAX_MOVIES = 300

export async function POST() {
  try {
    // Check current count
    const currentCount = await prisma.movie.count()
    if (currentCount >= MAX_MOVIES) {
      return NextResponse.json({
        message: `Database already has ${currentCount} movies (limit: ${MAX_MOVIES})`,
        synced: 0,
        total: currentCount
      })
    }

    // Sync genres first
    const { genres } = await getGenres()
    for (const genre of genres) {
      await prisma.genre.upsert({
        where: { id: genre.id },
        update: { name: genre.name },
        create: { id: genre.id, name: genre.name },
      })
    }

    let synced = 0
    const remaining = MAX_MOVIES - currentCount
    const pagesToFetch = Math.min(Math.ceil(remaining / 20), 15) // TMDB returns 20 per page

    for (let page = 1; page <= pagesToFetch; page++) {
      const { results } = await getPopularMovies(page)

      for (const movie of results) {
        // Check if we've hit the limit
        const count = await prisma.movie.count()
        if (count >= MAX_MOVIES) break

        // Check if movie already exists
        const exists = await prisma.movie.findUnique({ where: { id: movie.id }, select: { id: true } })
        if (exists) continue

        try {
          const details = await getMovieDetails(movie.id)

          await prisma.movie.create({
            data: {
              id: movie.id,
              title: movie.title,
              description: movie.overview,
              posterUrl: getPosterUrl(movie.poster_path),
              backdropUrl: getPosterUrl(movie.backdrop_path, 'original'),
              trailerUrl: getTrailerUrl(details.videos),
              releaseDate: movie.release_date ? new Date(movie.release_date) : null,
              rating: movie.vote_average,
              runtime: details.runtime,
            }
          })

          // Link genres
          for (const genre of details.genres) {
            await prisma.movieGenre.upsert({
              where: { movieId_genreId: { movieId: movie.id, genreId: genre.id } },
              update: {},
              create: { movieId: movie.id, genreId: genre.id },
            })
          }

          // Link top cast
          const topCast = details.credits.cast.slice(0, 5)
          for (const member of topCast) {
            await prisma.actor.upsert({
              where: { id: member.id },
              update: { name: member.name, profilePhoto: getProfileUrl(member.profile_path) },
              create: { id: member.id, name: member.name, profilePhoto: getProfileUrl(member.profile_path) },
            })
            await prisma.movieActor.upsert({
              where: { movieId_actorId: { movieId: movie.id, actorId: member.id } },
              update: { role: member.character },
              create: { movieId: movie.id, actorId: member.id, role: member.character },
            })
          }

          synced++
        } catch (e) {
          console.error(`Failed to sync movie ${movie.id}:`, e)
        }
      }

      // Respect TMDB rate limits (40 req/10sec)
      await new Promise(r => setTimeout(r, 1500))

      const totalNow = await prisma.movie.count()
      if (totalNow >= MAX_MOVIES) break
    }

    const total = await prisma.movie.count()
    return NextResponse.json({ message: 'Sync complete', synced, total })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}
