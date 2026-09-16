import { cinemas, dates, movies } from '../data/catalog';
import { dateLabel, localDate } from '../utils/format';

export default function ShowFilters({ filters, onChange, withMovie = false, fixedCinema = false }) {
  const update = (key, value) =>
    onChange({ ...filters, [key]: value, ...(key === 'city' ? { cinemaId: '' } : {}) });
  const availableCinemas = cinemas.filter(
    (cinema) => !filters.city || cinema.city === filters.city,
  );
  return (
    <div className="pub-filters">
      {withMovie && (
        <label>
          Película
          <select
            value={filters.movieId || ''}
            onChange={(event) => update('movieId', event.target.value)}
          >
            <option value="">Todas las películas</option>
            {movies
              .filter((movie) => movie.status !== 'upcoming')
              .map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.title}
                </option>
              ))}
          </select>
        </label>
      )}
      {!fixedCinema && (
        <>
          <label>
            Ciudad
            <select
              value={filters.city || ''}
              onChange={(event) => update('city', event.target.value)}
            >
              <option value="">Todas las ciudades</option>
              {[...new Set(cinemas.map((cinema) => cinema.city))].map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
          </label>
          <label>
            Cine
            <select
              value={filters.cinemaId || ''}
              onChange={(event) => update('cinemaId', event.target.value)}
            >
              <option value="">Todos los cines</option>
              {availableCinemas.map((cinema) => (
                <option key={cinema.id} value={cinema.id}>
                  {cinema.name}
                </option>
              ))}
            </select>
          </label>
        </>
      )}
      <label>
        Fecha
        <select value={filters.date || ''} onChange={(event) => update('date', event.target.value)}>
          <option value="">Todas las fechas</option>
          {dates.map((date) => (
            <option key={date} value={date}>
              {date === localDate() ? 'Hoy · ' : ''}
              {dateLabel(date)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
