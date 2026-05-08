interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export default function CastGrid({ cast }: { cast: CastMember[] }) {
  if (!cast || cast.length === 0) return null;

  return (
    <div className="mt-12 px-8">
      <h2 className="text-xl font-medium text-white mb-6">Cast</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {cast.map(actor => (
          <div key={actor.id} className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-3 bg-white/5 border border-white/10">
              {actor.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                  alt={actor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20">
                  No Photo
                </div>
              )}
            </div>
            <p className="text-sm text-white font-medium line-clamp-1">{actor.name}</p>
            <p className="text-xs text-white/50 line-clamp-1">{actor.character}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
