import { categories } from '../data/catalog';
import Poster from './Poster';

export default function MovieCard({ movie }) {
  return (
    <article className="pub-movie-card">
      <div className="pub-poster-link">
        <Poster src={movie.poster} title={movie.title} />
        <span className={`pub-badge ${movie.status === 'presale' ? 'pub-badge-gold' : ''}`}>
          {movie.status === 'active' ? movie.rating : categories[movie.status]}
        </span>
      </div>
      <div className="pub-card-meta">
        {movie.genre} <span>·</span> {movie.duration} min <span>·</span> {movie.format.join(' / ')}
      </div>
      <h3>{movie.title}</h3>
    </article>
  );
}
