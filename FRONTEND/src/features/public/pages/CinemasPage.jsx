import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { cinemas } from '../data/catalog';
import Poster from '../components/Poster';
import EmptyState from '../components/EmptyState';

export default function CinemasPage() {
  const [city, setCity] = useState('');
  const [format, setFormat] = useState('');
  const filtered = cinemas.filter(
    (cinema) => (!city || cinema.city === city) && (!format || cinema.formats.includes(format)),
  );
  return (
    <section className="pub-section pub-page">
      <span className="pub-eyebrow">Encuentra tu lugar</span>
      <h1>Nos vemos en el cine.</h1>
      <p className="pub-lead">Elige tu sede y descubre las funciones disponibles.</p>
      <div className="pub-filters pub-cinema-filters">
        <label>
          Ciudad
          <select value={city} onChange={(event) => setCity(event.target.value)}>
            <option value="">Todas las ciudades</option>
            {[...new Set(cinemas.map((cinema) => cinema.city))].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Formato
          <select value={format} onChange={(event) => setFormat(event.target.value)}>
            <option value="">Todos los formatos</option>
            <option>2D</option>
            <option>3D</option>
          </select>
        </label>
        <button
          className="pub-text-link"
          onClick={() => {
            setCity('');
            setFormat('');
          }}
        >
          Limpiar filtros
        </button>
      </div>
      <p className="pub-results" role="status">
        {filtered.length} cines disponibles
      </p>
      <div className="pub-cinema-grid">
        {filtered.map((cinema) => (
          <article className="pub-cinema-card" key={cinema.id}>
            <Link to={`/web/cine/${cinema.id}`}>
              <Poster src={cinema.img} title={cinema.name} />
            </Link>
            <div>
              <span className="pub-eyebrow">
                {cinema.city} · {cinema.halls} salas
              </span>
              <h2>
                <Link to={`/web/cine/${cinema.id}`}>{cinema.name}</Link>
              </h2>
              <p>
                <MapPin size={15} /> {cinema.address}
              </p>
              <div className="pub-section-heading">
                <span className="pub-muted">{cinema.formats}</span>
                <Link className="pub-text-link" to={`/web/cine/${cinema.id}`}>
                  Ver horarios <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && <EmptyState>Prueba otra ciudad o formato.</EmptyState>}
    </section>
  );
}
