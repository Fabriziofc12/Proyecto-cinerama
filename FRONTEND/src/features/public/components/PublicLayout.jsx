import { Link, Outlet } from 'react-router-dom';
import '../styles/public.css';

export default function PublicLayout() {
  return (
    <div className="pub-site">
      <a className="pub-skip" href="#contenido">
        Saltar al contenido
      </a>
      <header className="pub-header">
        <Link to="/WebHome" className="pub-brand" aria-label="Cinerama, inicio">
          <span className="pub-brand-symbol" aria-hidden="true">
            c<span />
          </span>
          <span>
            CINERAMA<small>EL CINE SE SIENTE.</small>
          </span>
        </Link>
        <nav className="pub-nav" aria-label="Navegación principal">
          <Link to="/WebHome">Inicio</Link>
        </nav>
      </header>
      <main id="contenido" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="pub-footer">
        <div className="pub-footer-bottom">
          <span>Cinerama · El cine se siente.</span>
          <span>Proyecto académico · React</span>
        </div>
      </footer>
    </div>
  );
}
