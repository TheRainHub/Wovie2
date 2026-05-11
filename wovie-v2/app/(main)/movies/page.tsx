'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import HeroBanner from './components/HeroBanner'
import TrendingBanner from './components/TrendingBanner'
import GenreFilters from './components/GenreFilters'
import RankedCard from './components/RankedCard'

export default function MoviesPage() {
  const [movies, setMovies] = useState<any[]>([])
  const [trendingMovies, setTrendingMovies] = useState<any[]>([])
  const [heroMovie, setHeroMovie] = useState<any>(null)
  const [genres, setGenres] = useState<any[]>([])
  const [activeGenre, setActiveGenre] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const observerRef = useRef<HTMLDivElement>(null)

  // Load genres and initial trending
  useEffect(() => {
    fetch('/api/movies/genres').then(r => r.json()).then(d => setGenres(d.genres))
    fetch('/api/movies?limit=5&sort=rating').then(r => r.json()).then(d => setTrendingMovies(d.movies || []))
  }, [])

  // Trigger TMDB sync on first visit (fire-and-forget)
  useEffect(() => {
    fetch('/api/movies/sync', { method: 'POST' }).catch(() => {})
  }, [])

  // Fetch last visited movie for hero
  useEffect(() => {
    try {
      const lastId = localStorage.getItem('wovie_last_visited')
      if (lastId) {
        fetch(`/api/movies/${lastId}`)
          .then(r => r.ok ? r.json() : null)
          .then(data => { if (data) setHeroMovie(data) })
      }
    } catch {}
  }, [])

  // Fetch movies (reset on genre change)
  useEffect(() => {
    setLoading(true)
    setMovies([])
    setPage(1)
    setHasMore(true)

    const url = activeGenre
      ? `/api/movies?limit=20&page=1&genre=${activeGenre}`
      : '/api/movies?limit=20&page=1'

    fetch(url)
      .then(r => r.json())
      .then(d => {
        setMovies(d.movies || [])
        setHasMore(d.hasMore ?? false)
        setLoading(false)
      })
  }, [activeGenre])

  // Load more movies (lazy loading)
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    const nextPage = page + 1

    const url = activeGenre
      ? `/api/movies?limit=20&page=${nextPage}&genre=${activeGenre}`
      : `/api/movies?limit=20&page=${nextPage}`

    fetch(url)
      .then(r => r.json())
      .then(d => {
        setMovies(prev => {
          const existingIds = new Set(prev.map(m => m.id))
          const newMovies = (d.movies || []).filter((m: any) => !existingIds.has(m.id))
          return [...prev, ...newMovies]
        })
        setHasMore(d.hasMore ?? false)
        setPage(nextPage)
        setLoadingMore(false)
      })
  }, [page, activeGenre, loadingMore, hasMore])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const el = observerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) loadMore() },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [loadMore, loading])

  // Split movies into sections without repetitions
  const hero = heroMovie || (trendingMovies.length > 0 ? trendingMovies[0] : movies[0])
  
  const reservedIds = new Set(trendingMovies.map(m => m.id))
  if (hero) reservedIds.add(hero.id)
  
  const catalogMovies = movies.filter(m => !reservedIds.has(m.id))

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Hero Banner — last visited movie */}
      {hero && <HeroBanner movie={hero} isLastVisited={!!heroMovie} />}

      {/* Content */}
      <div className="max-w-[1400px] mx-auto">

        {/* Trending rotating banner */}
        {trendingMovies.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
              🔥 Trending now
            </h2>
            <TrendingBanner movies={trendingMovies} />
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">All movies</h2>
          <GenreFilters genres={genres} activeGenre={activeGenre} onGenreChange={setActiveGenre} />
        </div>

        {/* Movie grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-xl bg-card/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {catalogMovies.map((m, i) => (
                <RankedCard
                  key={m.id}
                  movie={m}
                  rank={i + 1}
                  isNew={m.releaseDate && new Date(m.releaseDate).getFullYear() >= 2026}
                />
              ))}
            </div>

            {/* Infinite scroll trigger */}
            {hasMore && (
              <div ref={observerRef} className="flex justify-center py-10">
                {loadingMore && (
                  <div className="flex items-center gap-3 text-white/40">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                    <span className="text-sm">Loading more movies...</span>
                  </div>
                )}
              </div>
            )}

            {!hasMore && movies.length > 0 && (
              <p className="text-center text-white/20 text-sm py-10">
                You&apos;ve seen all {movies.length} movies
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
