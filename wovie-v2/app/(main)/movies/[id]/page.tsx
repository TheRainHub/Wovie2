import { getFilm } from '@/lib/tmdb'
import CinematicHero from './components/CinematicHero'
import PosterInfo from './components/PosterInfo'
import TrailerPlayer from './components/TrailerPlayer'
import CastGrid from './components/CastGrid'
import SimilarFilms from './components/SimilarFilms'
import SaveLastVisited from './components/SaveLastVisited'

const IMG = 'https://image.tmdb.org/t/p'

export const revalidate = 3600; // ISR: Revalidate movie pages every 1 hour

export default async function FilmPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const film = await getFilm(resolvedParams.id)

  if (!film || !film.id) {
    return <div className="text-white p-8">Movie not found</div>
  }

  const trailer = film.videos?.results?.find((v: any) => v.type === 'Trailer')

  return (
    <div className="pb-20">
      <SaveLastVisited movieId={film.id} />
      <CinematicHero
        backdropUrl={`${IMG}/original${film.backdrop_path}`}
        title={film.title}
        year={film.release_date?.split('-')[0]}
        trailerKey={trailer?.key}
      />
      
      {/* Контент страницы, который скроллится поверх фиксированного фона */}
      <div className="relative z-10 mt-[45vh]">
        
        {/* Градиентный переход от прозрачного к фону сайта */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0D0F14]/80 to-[#0D0F14] -z-10 pointer-events-none" />
        
        <div className="max-w-[1200px] mx-auto pt-10">
          <PosterInfo film={film} />
          
          <div className="px-8 mt-12 bg-[#0D0F14]">
            <TrailerPlayer
              youtubeId={trailer?.key}
            />
          </div>
          
          <div className="bg-[#0D0F14] pt-8 pb-12">
            <CastGrid cast={film.credits?.cast?.slice(0, 10) || []} />
            <SimilarFilms films={film.similar?.results?.slice(0, 6) || []} />
          </div>
        </div>
      </div>
    </div>
  )
}
