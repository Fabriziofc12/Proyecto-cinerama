import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { categories } from '../data/catalog';
import Poster from './Poster';

export default function MovieCard({ movie, search = '' }) {
  return (
    <article className="pub-movie-card">
      <Link
        to={`/web/pelicula/${movie.id}${search}`}
        className="pub-poster-link"
        aria-label={`Ver ${movie.title}`}
      >
        <Poster src={movie.poster} title={movie.title} />
        <div className="pub-card-badges">
          <span className={`pub-badge ${movie.status === 'presale' ? 'pub-badge-gold' : ''}`}>
            {movie.status === 'active' ? movie.rating : categories[movie.status]}
          </span>
        </div>
        <span className="pub-poster-action">
          Descubrir película <ArrowUpRight size={19} />
        </span>
      </Link>
      <div className="pub-card-meta">
        {movie.genre} <span>·</span> {movie.duration} min <span>·</span> {movie.format.join(' / ')}
      </div>
      <h3>
        <Link to={`/web/pelicula/${movie.id}${search}`}>{movie.title}</Link>
      </h3>
      <Link className="pub-text-link" to={`/web/pelicula/${movie.id}${search}#funciones`}>
        {movie.status === 'upcoming' ? 'Ver detalles' : 'Ver horarios'} <ArrowUpRight size={16} />
      </Link>
    </article>
  );
}
