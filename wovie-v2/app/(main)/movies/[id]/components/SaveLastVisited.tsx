'use client'

import { useEffect } from 'react'

export default function SaveLastVisited({ movieId }: { movieId: number }) {
  useEffect(() => {
    try {
      localStorage.setItem('wovie_last_visited', String(movieId))
    } catch {}
  }, [movieId])

  return null
}
