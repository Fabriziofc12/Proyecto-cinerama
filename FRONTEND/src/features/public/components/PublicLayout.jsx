import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import '../styles/public.css';

export default function PublicLayout() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const container = useRef(null);
  const menuButton = useRef(null);
  useEffect(() => {
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'start' });
    } else {
      container.current?.scrollTo({ top: 0 });
    }
  }, [location.pathname, location.hash]);
  return (
    <div className="pub-site" ref={container}>
      <a className="pub-skip" href="#contenido">
        Saltar al contenido
      </a>
      <div className="pub-announcement">
        Las historias se ven. El cine se siente. <span>Encuentra tu próxima película</span>
      </div>
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
          <Link to="/WebHome">Inicio</Link>
          <Link to="/WebHome#cartelera">Películas</Link>
          <Link to="/WebHome#experiencia">La experiencia</Link>
        </nav>
      </header>
      <main id="contenido" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="pub-footer">
        <div className="pub-footer-main">
          <div>
            <Link to="/WebHome" className="pub-footer-brand">
              CINERAMA
            </Link>
            <p>
              Las historias se ven.
              <br />
              <strong>El cine se siente.</strong>
            </p>
          </div>
          <div>
            <h2>Tu próximo plan</h2>
            <Link to="/WebHome#cartelera">Explorar películas</Link>
            <Link to="/WebHome#experiencia">La experiencia</Link>
          </div>
          <div>
            <h2>Historias para compartir</h2>
            <p>
              Una pantalla.
              <br />
              <strong>Mil emociones.</strong>
            </p>
          </div>
        </div>
        <div className="pub-footer-bottom">
          <span>© {new Date().getFullYear()} Cinerama · Proyecto académico</span>
          <span>Catálogo de demostración</span>
        </div>
      </footer>
    </div>
  );
}
