import { useSearchParams } from 'react-router-dom';
import { categories, filterShows, movies } from '../data/catalog';
import MovieCard from '../components/MovieCard';
import ShowFilters from '../components/ShowFilters';
import EmptyState from '../components/EmptyState';
import useReveal from '../hooks/useReveal';
import ActiveFilters from '../components/ActiveFilters';
import { normalizeSearch } from '../utils/search';

export default function MoviesPage() {
  const [params, setParams] = useSearchParams();
  const filters = Object.fromEntries(params);
  const update = (values, options) =>
    setParams(Object.fromEntries(Object.entries(values).filter(([, value]) => value)), options);
  const category = Object.hasOwn(categories, filters.category) ? filters.category : 'active';
  const gridRef = useReveal({ threshold: 0.05 });
  const filtered = movies.filter((movie) => {
    if (
      movie.status !== category ||
      (filters.q && !normalizeSearch(movie.title).includes(normalizeSearch(filters.q)))
    )
      return false;
    if (filters.genre && movie.genre !== filters.genre) return false;
    if (filters.format && !movie.format.includes(filters.format)) return false;
    if (filters.language && movie.language !== filters.language) return false;
    if (filters.city || filters.cinemaId || filters.date)
      return filterShows({ ...filters, movieId: movie.id }).length > 0;
    return true;
  });
  return (
    <section className="pub-section pub-page">
      <span className="pub-eyebrow">Historias para todos</span>
      <h1>Elige qué quieres sentir.</h1>
      <p className="pub-lead">
        Acción, emoción o una buena dosis de suspenso. Tu próxima película está aquí.
      </p>
      <div className="pub-tabs" aria-label="Categoría">
        {Object.entries(categories).map(([key, label]) => (
          <button
            key={key}
            className={category === key ? 'is-active' : ''}
            aria-pressed={category === key}
            onClick={() => update({ ...filters, category: key })}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="pub-catalog-filters">
        <ShowFilters filters={filters} onChange={update} />
        <div className="pub-filters">
          <label>
            Buscar por título
            <input
              type="search"
              placeholder="¿Qué quieres ver?"
              value={filters.q || ''}
              onChange={(event) => update({ ...filters, q: event.target.value }, { replace: true })}
            />
          </label>
          <label>
            Género
            <select
              value={filters.genre || ''}
              onChange={(event) => update({ ...filters, genre: event.target.value })}
            >
              <option value="">Todos los géneros</option>
              {[...new Set(movies.map((movie) => movie.genre))].map((genre) => (
                <option key={genre}>{genre}</option>
              ))}
            </select>
          </label>
          <label>
            Formato
            <select
              value={filters.format || ''}
              onChange={(event) => update({ ...filters, format: event.target.value })}
            >
              <option value="">Todos</option>
              <option>2D</option>
              <option>3D</option>
            </select>
          </label>
          <label>
            Idioma
            <select
              value={filters.language || ''}
              onChange={(event) => update({ ...filters, language: event.target.value })}
            >
              <option value="">Todos</option>
              <option value="ES">Doblada</option>
              <option value="EN">Subtitulada</option>
            </select>
          </label>
        </div>
      </div>
      <ActiveFilters filters={filters} onChange={update} />
      <div className="pub-section-heading pub-results">
        <p role="status">
          {filtered.length}{' '}
          {filtered.length === 1 ? 'película encontrada' : 'películas encontradas'}
        </p>
        <button className="pub-text-link" onClick={() => setParams({ category })}>
          Limpiar filtros
        </button>
      </div>
      {filtered.length ? (
        <div className="pub-movie-grid reveal" ref={gridRef}>
          {filtered.map((movie, index) => (
            <MovieCard key={movie.id} movie={movie} search={`?${params}`} index={index} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No encontramos una función con esos filtros"
          action={
            <button className="pub-button pub-secondary" onClick={() => setParams({ category })}>
              Mostrar todas las películas
            </button>
          }
        >
          Prueba otro título, fecha o cine. También puedes limpiar los filtros.
        </EmptyState>
      )}
    </section>
  );
}
