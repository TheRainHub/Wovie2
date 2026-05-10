'use client';

import { useState, useEffect } from "react";
import MovieGrid from "@/app/components/MovieGrid";
import MovieCard from "@/app/components/MovieCard";

interface Movie {
  id: number;
  title: string;
  posterUrl: string | null;
  releaseDate: Date | null;
  rating: number;
  genres: { genre: { name: string } }[];
}

interface MoviePageData {
  movies: Movie[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, [currentPage]);

  async function fetchMovies() {
    setLoading(true);
    try {
      const res = await fetch(`/api/movies?page=${currentPage}&limit=20`);
      const data: MoviePageData = await res.json();
      
      if (res.ok) {
        setMovies(data.movies);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-white">

      {/* Movie Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-10">
          {/* Loading skeletons */}
          {[...Array(20)].map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-xl bg-card/50 animate-pulse" />
          ))}
        </div>
      ) : (
        <MovieGrid>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </MovieGrid>
      )}

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-6 py-3 rounded-lg bg-card hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="text-gray-400">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-6 py-3 rounded-lg bg-card hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
