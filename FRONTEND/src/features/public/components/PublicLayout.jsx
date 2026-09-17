import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ArrowUp, ArrowUpRight, Menu, Ticket, UserRound, X } from 'lucide-react';
import { usePublic } from '../context/PublicContext';
import '../styles/public.css';
import '../styles/experience.css';

export default function PublicLayout() {
  const { user } = usePublic();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const container = useRef(null);
  const menuButton = useRef(null);

  useEffect(() => {
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'start' });
    } else {
      container.current?.scrollTo({ top: 0 });
    }
  }, [location.pathname, location.hash]);

  // Sticky header + back-to-top scroll listener
  useEffect(() => {
    const el = container.current;
    if (!el) return;
    function onScroll() {
      setScrolled(el.scrollTop > 40);
      setShowTop(el.scrollTop > 400);
    }
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  function scrollToTop() {
    document.getElementById('contenido')?.focus({ preventScroll: true });
    container.current?.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }

  return (
    <div className="pub-site" ref={container}>
      <a className="pub-skip" href="#contenido">
        Saltar al contenido
      </a>
      <div className="pub-announcement">
        Elige tu película · Encuentra tu cine · Reserva tu butaca
      </div>
      <div className={`pub-header-wrap ${scrolled ? 'is-scrolled' : ''}`}>
        <header className="pub-header">
          <Link to="/WebHome" className="pub-brand" aria-label="Cinerama, inicio">
            <span className="pub-brand-symbol" aria-hidden="true">
              c<span />
            </span>
            <span>
              CINERAMA<small>EL CINE SE SIENTE.</small>
            </span>
          </Link>
          <button
            ref={menuButton}
            className="pub-icon-button pub-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            aria-controls="public-navigation"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
          <nav
            id="public-navigation"
            className={`pub-nav ${menuOpen ? 'is-open' : ''}`}
            aria-label="Navegación principal"
            onClick={() => setMenuOpen(false)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setMenuOpen(false);
                menuButton.current?.focus();
              }
            }}
          >
            <NavLink to="/WebHome">Inicio</NavLink>
            <NavLink to="/web/peliculas">Películas</NavLink>
            <NavLink to="/web/cines">Nuestros cines</NavLink>
            <NavLink to="/web/cuenta">
              <Ticket size={16} /> Mis entradas
            </NavLink>
            <NavLink className="pub-nav-account" to={user ? '/web/cuenta' : '/web/login'}>
              <UserRound size={17} />
              {user ? user.name.split(' ')[0] : 'Iniciar sesión'}
            </NavLink>
          </nav>
        </header>
      </div>
      <main id="contenido" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="pub-footer">
        <div className="pub-footer-main">
          <div>
            <Link to="/WebHome" className="pub-footer-brand">
              CINERAMA<span>®</span>
            </Link>
            <p>
              Las historias se ven.
              <br />
              <strong>El cine se siente.</strong>
            </p>
          </div>
          <div>
            <h2>Tu próximo plan</h2>
            <Link to="/web/peliculas">
              Cartelera <ArrowUpRight size={15} />
            </Link>
            <Link to="/web/peliculas?category=presale">
              Preventa <ArrowUpRight size={15} />
            </Link>
            <Link to="/web/cines">
              Encuentra tu cine <ArrowUpRight size={15} />
            </Link>
          </div>
          <div>
            <h2>Tu experiencia</h2>
            <Link to="/web/cuenta">
              Mis entradas <ArrowUpRight size={15} />
            </Link>
            <Link to={user ? '/web/cuenta' : '/web/login'}>
              Mi cuenta <ArrowUpRight size={15} />
            </Link>
            <span className="pub-muted">Selecciona · Reserva · Disfruta</span>
          </div>
          <div>
            <h2>Atención al cliente</h2>
            <p>Consulta los servicios y horarios de atención directamente con tu sede.</p>
            <a href="https://www.cinerama.com.pe/contacto" target="_blank" rel="noreferrer">
              Contacto oficial <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
        <div className="pub-footer-bottom">
          <span>© {new Date().getFullYear()} Cinerama. Todos los derechos reservados.</span>
          <span>Prototipo académico · Reservas simuladas</span>
        </div>
      </footer>
      {showTop && (
        <button
          className={`pub-back-top ${showTop ? 'is-visible' : ''}`}
          onClick={scrollToTop}
          aria-label="Volver arriba"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
