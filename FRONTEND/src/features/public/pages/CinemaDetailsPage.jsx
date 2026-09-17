import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowDown } from 'lucide-react';
import CinemaInfo from '../components/CinemaInfo';
import { cinemas, filterShows, movies } from '../data/catalog';
import { localDate } from '../utils/format';
import Poster from '../components/Poster';
import ShowFilters from '../components/ShowFilters';
import Showtimes from '../components/Showtimes';
import MovieCard from '../components/MovieCard';
import EmptyState from '../components/EmptyState';

export default function CinemaDetailsPage() {
  const { id } = useParams();
  const [tab, setTab] = useState('shows');
  const [filters, setFilters] = useState({ date: localDate() });
  const cinema = cinemas.find((item) => item.id === Number(id));
  if (!cinema)
    return (
      <EmptyState
        title="No encontramos este cine"
        action={
          <Link className="pub-button" to="/web/cines">
            Explorar cines
          </Link>
        }
      >
        Elige una sede de la lista.
      </EmptyState>
    );
  const matchingShows = filterShows({ ...filters, cinemaId: cinema.id });
  const matchingMovies = movies.filter((movie) =>
    matchingShows.some((show) => show.movieId === movie.id),
  );
  return (
    <section className="pub-section pub-page">
      <Link className="pub-text-link pub-back" to="/web/cines">
        <ArrowLeft size={17} /> Todos los cines
      </Link>
      <div className="pub-cinema-detail">
        <div>
          <span className="pub-eyebrow">
            {cinema.city} · {cinema.formats}
          </span>
          <h1>{cinema.name}</h1>
          <p className="pub-lead">{cinema.address}</p>
          <a className="pub-button pub-secondary" href="#programacion">
            <ArrowDown size={17} /> Ver funciones
          </a>
        </div>
        <Poster src={cinema.img} title={cinema.name} priority />
      </div>
      <CinemaInfo cinema={cinema} />
      <div className="pub-section-heading pub-program-heading" id="programacion">
        <div>
          <span className="pub-eyebrow">Arma tu plan</span>
          <h2>En pantalla en {cinema.city}</h2>
        </div>
      </div>
      <div className="pub-tabs" aria-label="Vista de programación">
        <button
          aria-pressed={tab === 'shows'}
          className={tab === 'shows' ? 'is-active' : ''}
          onClick={() => setTab('shows')}
        >
          Horarios
        </button>
        <button
          aria-pressed={tab === 'movies'}
          className={tab === 'movies' ? 'is-active' : ''}
          onClick={() => setTab('movies')}
        >
          Películas
        </button>
      </div>
      <ShowFilters fixedCinema filters={filters} onChange={setFilters} />
      {matchingMovies.length ? (
        tab === 'movies' ? (
          <div className="pub-movie-grid pub-space-top">
            {matchingMovies.map((movie, index) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                search={`?cinemaId=${cinema.id}&date=${filters.date || ''}`}
                index={index}
              />
            ))}
          </div>
        ) : (
          matchingMovies.map((movie) => (
            <section className="pub-cinema-program" key={movie.id}>
              <Link to={`/web/pelicula/${movie.id}?cinemaId=${cinema.id}`}>
                <Poster src={movie.poster} title={movie.title} />
              </Link>
              <div>
                <h2>{movie.title}</h2>
                <p className="pub-muted">
                  {movie.genre} · {movie.duration} min · {movie.rating}
                </p>
                <Showtimes shows={matchingShows.filter((show) => show.movieId === movie.id)} />
              </div>
            </section>
          ))
        )
      ) : (
        <EmptyState title="Sin funciones para esta fecha">
          Elige otro día para ver la programación.
        </EmptyState>
      )}
    </section>
  );
}
