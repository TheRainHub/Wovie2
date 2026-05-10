// app/api/movies/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const genreId = searchParams.get("genre");
    
    const skip = (page - 1) * limit;

    const whereClause: any = {};
    if (genreId) {
      whereClause.genres = {
        some: {
          genreId: parseInt(genreId)
        }
      };
    }

    const [movies, total] = await Promise.all([
      prisma.movie.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { rating: "desc" }, 
        include: {
          genres: {
            include: { genre: true }
          }
        }
      }),
      prisma.movie.count({ where: whereClause })
    ]);

    return NextResponse.json({
      movies,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error("Error fetching movies:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
