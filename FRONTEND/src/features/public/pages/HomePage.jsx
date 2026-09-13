import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Ticket,
  Armchair,
  Pause,
  Play,
} from 'lucide-react';
import { categories, movies } from '../data/catalog';
import MovieCard from '../components/MovieCard';
import Poster from '../components/Poster';
import EmptyState from '../components/EmptyState';
import useReveal from '../hooks/useReveal';
import useCarousel from '../hooks/useCarousel';

const featured = [movies[4], movies[3], movies[2]];
const headlines = [
  'La música se vive.\nEl cine se siente.',
  'La próxima batalla\nse vive en pantalla.',
  'Una nueva temporada.\nEl mismo gran estilo.',
];

const AUTOPLAY_MS = 6000;

export default function HomePage() {
  const { slide, fading, changeSlide, autoplay, toggleAutoplay, setInteracting } = useCarousel(
    featured.length,
    AUTOPLAY_MS,
  );
  const [category, setCategory] = useState('active');
  const [query, setQuery] = useState('');
  const movie = featured[slide];

  // --- Swipe touch -------------------------------------------------------
  const touchX = useRef(0);
  function onTouchStart(e) {
    touchX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e) {
    const diff = touchX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      changeSlide(
        diff > 0 ? (slide + 1) % featured.length : (slide + featured.length - 1) % featured.length,
      );
    }
  }

  // --- Reveal refs -------------------------------------------------------
  const searchRef = useReveal();
  const gridRef = useReveal({ threshold: 0.08 });
  const bannerRef = useReveal();

  const normalize = (value) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  const visibleMovies = movies.filter(
    (item) => item.status === category && normalize(item.title).includes(normalize(query.trim())),
  );
  function search(event) {
    event.preventDefault();
    document.getElementById('cartelera')?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }

  return (
    <>
      <section
        className="pub-hero"
        aria-roledescription="carrusel"
        aria-label="Películas destacadas"
        onMouseEnter={() => setInteracting(true)}
        onMouseLeave={() => setInteracting(false)}
        onFocusCapture={() => setInteracting(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false);
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Backdrop — full-bleed movie image */}
        <div className={`pub-hero-backdrop ${fading ? 'is-fading' : ''}`}>
          <img key={movie.id} src={movie.poster} alt="" aria-hidden="true" draggable="false" />
        </div>

        {/* Cinematic gradient overlays */}
        <div className="pub-hero-glow" />

        {/* Copy text */}
        <div
          className={`pub-hero-copy ${fading ? '' : 'is-transitioning'}`}
          aria-live={autoplay ? 'off' : 'polite'}
        >
          <span className="pub-eyebrow">
            <span className="pub-live-dot" /> {categories[movie.status]} · Cinerama presenta
          </span>
          <h1>{headlines[slide]}</h1>
          <p className="pub-hero-title">{movie.title}</p>
          <p>
            Una buena película. Tu butaca favorita.
            <br />
            Haz espacio para una historia que valga la pena.
          </p>
          <Link className="pub-button" to="/WebHome#cartelera">
            Explorar películas <ArrowUpRight size={20} />
          </Link>
          <div className="pub-carousel-controls">
            <button
              className="pub-icon-button"
              aria-label={autoplay ? 'Pausar carrusel' : 'Reanudar carrusel'}
              onClick={toggleAutoplay}
            >
              {autoplay ? <Pause size={15} /> : <Play size={15} />}
            </button>
            <button
              className="pub-icon-button"
              aria-label="Película anterior"
              onClick={() => changeSlide((slide + featured.length - 1) % featured.length)}
            >
              <ChevronLeft size={19} />
            </button>
            <span>
              {String(slide + 1).padStart(2, '0')}{' '}
              <span className="pub-muted">/ {String(featured.length).padStart(2, '0')}</span>
            </span>
            {featured.map((item, index) => (
              <button
                className={`pub-dot ${index === slide ? 'is-active' : ''}`}
                key={item.id}
                aria-label={`Mostrar ${item.title}`}
                aria-pressed={index === slide}
                onClick={() => changeSlide(index)}
              />
            ))}
            <button
              className="pub-icon-button"
              aria-label="Película siguiente"
              onClick={() => changeSlide((slide + 1) % featured.length)}
            >
              <ChevronRight size={19} />
            </button>
          </div>
        </div>

        {/* Floating poster accent */}
        <div className={`pub-hero-art ${fading ? 'is-fading' : ''}`}>
          <div className="pub-orbit" />
          <Poster key={movie.id} src={movie.poster} title={movie.title} />
          <span className="pub-art-caption">EN PANTALLA, TODO SE SIENTE MÁS.</span>
        </div>
      </section>

      <form className="pub-quick-search reveal" ref={searchRef} onSubmit={search}>
        <div className="pub-search-title">
          <Ticket size={21} />
          <span>
            Tu próxima
            <br />
            <strong>gran historia</strong>
          </span>
        </div>
        <label className="pub-home-search">
          Busca una película
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Título de la película"
          />
        </label>
        <button className="pub-button" type="submit">
          Buscar <ArrowRight size={18} />
        </button>
      </form>

      <section className="pub-section" id="cartelera">
        <div className="pub-section-heading">
          <div>
            <span className="pub-eyebrow">La pantalla te espera</span>
            <h2>Encuentra tu película.</h2>
          </div>
          <span className="pub-muted">Catálogo de demostración</span>
        </div>
        <div className="pub-tabs" aria-label="Categoría de películas">
          {Object.entries(categories).map(([key, label]) => (
            <button
              key={key}
              className={category === key ? 'is-active' : ''}
              aria-pressed={category === key}
              onClick={() => setCategory(key)}
            >
              {label}
              <span>{movies.filter((item) => item.status === key).length}</span>
            </button>
          ))}
        </div>
        <div className="pub-movie-grid reveal" ref={gridRef}>
          {visibleMovies.map((item) => (
            <MovieCard key={item.id} movie={item} />
          ))}
        </div>
        {!visibleMovies.length && (
          <EmptyState title="No encontramos películas">
            Prueba otro título o cambia de categoría.
          </EmptyState>
        )}
      </section>

      <section className="pub-visit-banner reveal" id="experiencia" ref={bannerRef}>
        <div>
          <span className="pub-eyebrow">Vive el cine</span>
          <h2>
            El mejor plan empieza
            <br />
            en tu cine favorito.
          </h2>
          <p>
            Explora las historias que llegan a la pantalla y encuentra tu próxima película favorita.
          </p>
          <Link className="pub-button pub-secondary" to="/WebHome#cartelera">
            <Ticket size={18} /> Explorar películas
          </Link>
        </div>
        <div className="pub-visit-detail">
          <Armchair size={72} strokeWidth={1} />
          <span>
            Tu lugar.
            <br />
            <strong>Tu momento.</strong>
          </span>
        </div>
      </section>
    </>
  );
}
