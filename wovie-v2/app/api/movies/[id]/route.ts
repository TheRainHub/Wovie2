import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const movieId = parseInt(id)

    if (isNaN(movieId)) {
      return NextResponse.json({ error: 'Invalid movie ID' }, { status: 400 })
    }

    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
      include: {
        genres: {
          include: { genre: true }
        }
      }
    })

    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 })
    }

    return NextResponse.json(movie)
  } catch (error) {
    console.error('Error fetching movie:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
