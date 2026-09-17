import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Monitor,
  Pause,
  Play,
  Sofa,
  Ticket,
} from 'lucide-react';
import { categories, movies, cinemas } from '../data/catalog';
import HeroBackdrop from '../components/HeroBackdrop';
import MovieCard from '../components/MovieCard';
import Poster from '../components/Poster';
import ShowFilters from '../components/ShowFilters';
import useReveal from '../hooks/useReveal';
import useCarousel from '../hooks/useCarousel';

const featured = [movies[4], movies[3], movies[2]];
const headlines = [
  'La música se vive.\nEl cine se siente.',
  'La próxima batalla\nse vive en pantalla.',
  'Una nueva temporada.\nEl mismo gran estilo.',
];

const AUTOPLAY_MS = 6000;

const experiences = [
  {
    icon: MapPin,
    title: 'Encuentra tu cine',
    desc: 'Explora las sedes, consulta su ubicación y elige una función.',
  },
  {
    icon: Monitor,
    title: 'Explora la cartelera',
    desc: 'Filtra películas por sede, fecha y formato para organizar tu salida.',
  },
  {
    icon: Sofa,
    title: 'Tu lugar en la sala',
    desc: 'Elige tus butacas y revisa el importe antes de continuar.',
  },
  {
    icon: Ticket,
    title: 'Tus reservas a mano',
    desc: 'Consulta y descarga el comprobante de tu reserva de demostración.',
  },
];

export default function HomePage() {
  const { slide, fading, changeSlide, autoplay, toggleAutoplay, setHovered, setFocused } =
    useCarousel(featured.length, AUTOPLAY_MS);
  const [category, setCategory] = useState('active');
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();
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
  const experienceRef = useReveal({ threshold: 0.08 });

  function search(event) {
    event.preventDefault();
    const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value));
    navigate(
      filters.movieId
        ? `/web/pelicula/${filters.movieId}?${params}#funciones`
        : `/web/peliculas?${params}`,
    );
  }

  return (
    <>
      <section
        className="pub-hero"
        aria-roledescription="carrusel"
        aria-label="Películas destacadas"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Backdrop — full-bleed movie image */}
        <HeroBackdrop key={movie.id} movie={movie} fading={fading} />

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
          <Link className="pub-button" to={`/web/pelicula/${movie.id}#funciones`}>
            Elegir mi función <ArrowUpRight size={20} />
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
        <Link
          to={`/web/pelicula/${movie.id}`}
          className={`pub-hero-art ${fading ? 'is-fading' : ''}`}
          aria-label={`Descubrir ${movie.title}`}
        >
          <Poster key={movie.id} src={movie.poster} title={movie.title} priority />
          <span className="pub-art-caption">EN PANTALLA, TODO SE SIENTE MÁS.</span>
        </Link>
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
        <ShowFilters filters={filters} onChange={setFilters} withMovie />
        <button className="pub-button" type="submit">
          Buscar <ArrowRight size={18} />
        </button>
      </form>

      <section className="pub-section">
        <div className="pub-section-heading">
          <div>
            <span className="pub-eyebrow">La pantalla te espera</span>
            <h2>Encuentra tu película.</h2>
          </div>
          <Link className="pub-text-link" to="/web/peliculas">
            Toda la cartelera <ArrowUpRight size={17} />
          </Link>
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
          {movies
            .filter((item) => item.status === category)
            .map((item, index) => (
              <MovieCard key={item.id} movie={item} index={index} />
            ))}
        </div>
      </section>

      {/* Experience / Features Section */}
      <section className="pub-experience-section reveal" ref={experienceRef}>
        <div className="pub-section-heading">
          <div>
            <span className="pub-eyebrow">La experiencia completa</span>
            <h2>Tu cine, a otro nivel.</h2>
          </div>
        </div>
        <div className="pub-experience-grid">
          {experiences.map((exp) => (
            <div className="pub-feature-card" key={exp.title}>
              <div className="pub-feature-icon">
                <exp.icon size={24} />
              </div>
              <h3>{exp.title}</h3>
              <p>{exp.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pub-visit-banner reveal" ref={bannerRef}>
        <div>
          <span className="pub-eyebrow">De Miraflores a Tarapoto</span>
          <h2>
            El mejor plan empieza
            <br />
            en tu cine favorito.
          </h2>
          <p>
            Un plan después de clases, una salida en pareja o una película en familia. Encuentra tu
            Cinerama y haz espacio para ese momento.
          </p>
          <Link className="pub-button pub-secondary" to="/web/cines">
            <MapPin size={18} /> Explorar cines
          </Link>
        </div>
        <Link
          className="pub-location-preview"
          to={`/web/cine/${cinemas[0].id}`}
          aria-label={`Conoce ${cinemas[0].name}`}
        >
          <Poster src={cinemas[0].img} title={cinemas[0].name} />
          <span>
            <MapPin size={18} /> {cinemas[0].name}
            <small>{cinemas[0].city} · Ver sede y horarios</small>
          </span>
        </Link>
      </section>
    </>
  );
}
