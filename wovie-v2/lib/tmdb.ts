// lib/tmdb.ts
const BASE = 'https://api.themoviedb.org/3'
const IMG  = 'https://image.tmdb.org/t/p'

export async function getFilm(id: string) {
  const apiKey = process.env.TMDB_API_KEY;
  const res = await fetch(
    `${BASE}/movie/${id}?api_key=${apiKey}&language=en-US&append_to_response=credits,videos,similar,images&include_image_language=en,null`,
    {
      next: { revalidate: 3600 }
    }
  )
  
  if (!res.ok) {
    console.error(`Failed to fetch TMDB data for movie ${id}:`, res.status, res.statusText);
    return null;
  }
  
  return res.json()
}
