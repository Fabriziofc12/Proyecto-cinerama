import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Play, Ticket } from 'lucide-react';
import { categories, dates, filterShows, movies } from '../data/catalog';
import { languageLabel } from '../utils/format';
import Poster from '../components/Poster';
import ShowFilters from '../components/ShowFilters';
import Showtimes from '../components/Showtimes';
import TrailerDialog from '../components/TrailerDialog';
import EmptyState from '../components/EmptyState';

export default function MovieDetailsPage() {
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const [trailerOpen, setTrailerOpen] = useState(false);
  const movie = movies.find((item) => item.id === Number(id));
  const filters = {
    date: movie?.status === 'presale' ? dates[2] : dates[0],
    ...Object.fromEntries(params),
  };
  if (!movie)
    return (
      <EmptyState
        title="Esta película no está disponible"
        action={
          <Link className="pub-button" to="/web/peliculas">
            Volver a la cartelera
          </Link>
        }
      >
        Revisa las películas de nuestro catálogo.
      </EmptyState>
    );
  return (
    <section className="pub-section pub-page">
      <Link className="pub-text-link pub-back" to="/web/peliculas">
        <ArrowLeft size={17} /> Cartelera
      </Link>
      <div className="pub-movie-detail">
        <Poster
          key={movie.id}
          src={movie.poster}
          title={movie.title}
          className="pub-detail-poster"
        />
        <div>
          <span className="pub-eyebrow">{categories[movie.status]}</span>
          <h1>{movie.title}</h1>
          <div className="pub-meta-pills">
            <span>{movie.rating}</span>
            <span>{movie.duration} min</span>
            <span>{movie.genre}</span>
            <span>{movie.format.join(' / ')}</span>
          </div>
          <h2>La historia</h2>
          <p className="pub-synopsis">
            {movie.synopsis || 'La sinopsis estará disponible próximamente.'}
          </p>
          <dl className="pub-film-facts">
            <div>
              <dt>Dirección</dt>
              <dd>{movie.director}</dd>
            </div>
            <div>
              <dt>Idioma</dt>
              <dd>{languageLabel(movie.language)}</dd>
            </div>
          </dl>
          <div className="pub-actions">
            {movie.status !== 'upcoming' && (
              <a className="pub-button" href="#funciones">
                <Ticket size={18} /> Elegir función
              </a>
            )}
            <button className="pub-button pub-secondary" onClick={() => setTrailerOpen(true)}>
              <Play size={17} /> Ver tráiler
            </button>
          </div>
        </div>
      </div>
      <section id="funciones" className="pub-functions">
        <span className="pub-eyebrow">A tu hora, en tu cine</span>
        <h2>Tu próxima función.</h2>
        {movie.status === 'upcoming' ? (
          <EmptyState title="Pronto en nuestras pantallas">
            Los horarios de esta película aún no están disponibles.
          </EmptyState>
        ) : (
          <>
            <ShowFilters
              filters={filters}
              onChange={(values) =>
                setParams(
                  Object.fromEntries(
                    Object.entries(values).filter(([key, value]) => key === 'date' || value),
                  ),
                  {
                    preventScrollReset: true,
                  },
                )
              }
            />
            <Showtimes shows={filterShows({ ...filters, movieId: movie.id })} />
          </>
        )}
      </section>
      {trailerOpen && <TrailerDialog movie={movie} onClose={() => setTrailerOpen(false)} />}
    </section>
  );
}
