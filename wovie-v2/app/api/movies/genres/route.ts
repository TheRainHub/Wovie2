import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'

export async function GET() {
  const genres = await prisma.genre.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json({ genres })
}
