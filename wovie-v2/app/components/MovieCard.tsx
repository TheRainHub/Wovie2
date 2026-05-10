// app/components/MovieCard.tsx
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    posterUrl: string | null;
    releaseDate: Date | null;
    rating: number;
    genres: { genre: { name: string } }[];
  };
}

export default function MovieCard({ movie }: MovieCardProps) {
  const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : "N/A";
  const mainGenre = movie.genres[0]?.genre.name || "Movie";

  return (
    <Link href={`/movies/${movie.id}`} className="group relative block overflow-hidden rounded-xl bg-card border border-white/5 transition-transform duration-300 hover:scale-[1.03] hover:shadow-2xl">
      <div className="relative aspect-[2/3] w-full bg-neutral-800">
        {movie.posterUrl ? (
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
            quality={95}
            unoptimized={true}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={false}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/30">No Image</div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
        
        <div className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold text-white bg-accent/80 backdrop-blur-md rounded-md">
          {mainGenre}
        </div>
        
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 text-xs font-bold text-white bg-black/60 backdrop-blur-md rounded-md">
          <Star className="w-3.5 h-3.5 text-accent-yellow fill-accent-yellow" />
          {movie.rating.toFixed(1)}
        </div>
      </div>

      <div className="absolute bottom-0 w-full p-4">
        <h3 className="text-lg font-bold text-white line-clamp-1">{movie.title}</h3>
        <p className="text-sm text-gray-300">{year}</p>
      </div>
    </Link>
  );
}
