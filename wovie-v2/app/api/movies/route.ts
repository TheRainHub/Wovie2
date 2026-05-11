import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

export const revalidate = 900; // ISR: Cache catalog data for 15 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const genreId = searchParams.get("genre");
    const sort = searchParams.get("sort") || "rating";

    const skip = (page - 1) * limit;

    const whereClause: any = {};
    if (genreId) {
      whereClause.genres = {
        some: { genreId: parseInt(genreId) }
      };
    }

    const orderBy: any =
      sort === "date" ? { releaseDate: "desc" } :
      sort === "title" ? { title: "asc" } :
      { rating: "desc" };

    const [movies, total] = await Promise.all([
      prisma.movie.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy,
        include: {
          genres: { include: { genre: true } }
        }
      }),
      prisma.movie.count({ where: whereClause })
    ]);

    return NextResponse.json({
      movies,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      hasMore: skip + movies.length < total
    });
  } catch (error) {
    console.error("Error fetching movies:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
