import Link from 'next/link';
import Image from 'next/image';

interface SimilarFilm {
  id: number;
  title: string;
  poster_path: string | null;
}

export default function SimilarFilms({ films }: { films: SimilarFilm[] }) {
  if (!films || films.length === 0) return null;

  return (
    <div className="mt-12 mb-12 px-8">
      <h2 className="text-xl font-medium text-white mb-6">Similar Movies</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {films.map(film => (
          <Link href={`/movies/${film.id}`} key={film.id} className="group">
            <div className="aspect-[2/3] rounded-xl overflow-hidden bg-white/5 border border-white/10 mb-2 relative">
              {film.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w342${film.poster_path}`}
                  alt={film.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20 text-xs text-center p-2">
                  {film.title}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              
              {/* Info inside the card — bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                <p className="text-sm font-semibold text-white/90 group-hover:text-white line-clamp-1 drop-shadow-md transition-colors">
                  {film.title}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
