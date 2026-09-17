import { movies as sourceMovies, branches as sourceBranches } from '../../../data/store.js';
import { nextDays } from '../utils/format.js';
import { movieDetails } from './movieDetails.js';

// Fixtures del sitio público. Sus fechas son relativas para poder presentar la demo cualquier día.
// Los identificadores de película y sede coinciden con los del panel administrativo.
export const categories = { active: 'En cartelera', presale: 'Preventa', upcoming: 'Próximamente' };
export const movies = sourceMovies.map((movie) => ({
  ...movie,
  ...movieDetails[movie.id],
  trailerUrl: `https://www.youtube-nocookie.com/embed/${movieDetails[movie.id].trailerId}`,
  status: movie.id === 4 ? 'presale' : [7, 8].includes(movie.id) ? 'upcoming' : 'active',
}));
export const cinemas = sourceBranches.filter((cinema) => cinema.status === 'active');
export const dates = nextDays();
export const shows = dates.flatMap((date, day) =>
  movies.flatMap((movie) => {
    if (movie.status === 'upcoming' || (movie.status === 'presale' && day < 2)) return [];
    return cinemas.flatMap((cinema) => {
      // Una selección distinta por sede; no todas las películas se ofrecen en todos los cines.
      if ((movie.id + cinema.id) % 4 === 0) return [];
      return ['15:30', '18:30', '21:30'].map((time, index) => ({
        id: `${date}_${movie.id}_${cinema.id}_${index}`,
        movieId: movie.id,
        cinemaId: cinema.id,
        date,
        time,
        hall: `Sala ${1 + (movie.id % cinema.halls)}`,
        format: movie.format[index % movie.format.length],
        language: movie.language,
        price: 15 + ((cinema.id + index) % 3) * 3,
        rows: 8,
        columns: 10,
        occupied:
          index === 0 && movie.id === 2
            ? Array.from(
                { length: 80 },
                (_, seat) => `${String.fromCharCode(65 + Math.floor(seat / 10))}${(seat % 10) + 1}`,
              )
            : ['B4', 'B5', 'D6', 'F7', 'F8'],
      }));
    });
  }),
);

export function filterShows(filters = {}, source = shows) {
  return source.filter((show) => {
    const cinema = cinemas.find((item) => item.id === show.cinemaId);
    return (
      (!filters.movieId || show.movieId === Number(filters.movieId)) &&
      (!filters.cinemaId || show.cinemaId === Number(filters.cinemaId)) &&
      (!filters.city || cinema.city === filters.city) &&
      (!filters.date || show.date === filters.date) &&
      (!filters.format || show.format === filters.format) &&
      (!filters.language || show.language === filters.language)
    );
  });
}
