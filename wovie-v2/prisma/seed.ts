import 'dotenv/config';
import { PrismaClient } from '../app/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { getPopularMovies, getMovieDetails, getGenres, getPosterUrl, getProfileUrl, getTrailerUrl } from '../app/lib/tmdb';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

  console.log('📂 Loading genres...');
  const { genres } = await getGenres();
  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { id: genre.id },
      update: { name: genre.name },
      create: { id: genre.id, name: genre.name },
    });
  }
  console.log(`✅ ${genres.length} genres saved`);

  const PAGES_TO_LOAD = 5;
  let movieCount = 0;

  for (let page = 1; page <= PAGES_TO_LOAD; page++) {
    console.log(`🎬 Loading page ${page}/${PAGES_TO_LOAD}...`);
    const { results } = await getPopularMovies(page);

    for (const movie of results) {
      const details = await getMovieDetails(movie.id);

      await prisma.movie.upsert({
        where: { id: movie.id },
        update: {
          title: movie.title,
          description: movie.overview,
          posterUrl: getPosterUrl(movie.poster_path),
          backdropUrl: getPosterUrl(movie.backdrop_path, 'original'),
          trailerUrl: getTrailerUrl(details.videos),
          releaseDate: movie.release_date ? new Date(movie.release_date) : null,
          rating: movie.vote_average,
          runtime: details.runtime,
        },
        create: {
          id: movie.id,
          title: movie.title,
          description: movie.overview,
          posterUrl: getPosterUrl(movie.poster_path),
          backdropUrl: getPosterUrl(movie.backdrop_path, 'original'),
          trailerUrl: getTrailerUrl(details.videos),
          releaseDate: movie.release_date ? new Date(movie.release_date) : null,
          rating: movie.vote_average,
          runtime: details.runtime,
        },
      });

      for (const genre of details.genres) {
        await prisma.movieGenre.upsert({
          where: { movieId_genreId: { movieId: movie.id, genreId: genre.id }},
          update: {},
          create: { movieId: movie.id, genreId: genre.id },
        });
      }

      const topCast = details.credits.cast.slice(0, 10);
      for (const member of topCast) {
        await prisma.actor.upsert({
          where: { id: member.id },
          update: { name: member.name, profilePhoto: getProfileUrl(member.profile_path) },
          create: { id: member.id, name: member.name, profilePhoto: getProfileUrl(member.profile_path) },
        });
        await prisma.movieActor.upsert({
          where: { movieId_actorId: { movieId: movie.id, actorId: member.id }},
          update: { role: member.character },
          create: { movieId: movie.id, actorId: member.id, role: member.character },
        });
      }

      movieCount++;
    }

    // Задержка между страницами (TMDB rate limit: 40 req/10sec)
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log(`🎉 Seed complete! ${movieCount} movies loaded.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
