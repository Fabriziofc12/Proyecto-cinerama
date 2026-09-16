import { Armchair, ExternalLink, MapPin, Navigation, Projector } from 'lucide-react';
import { cinemaMapLinks } from '../utils/cinema';

export default function CinemaInfo({ cinema }) {
  const links = cinemaMapLinks(cinema);
  return (
    <section className="pub-cinema-info" aria-label="Información para tu visita">
      <div className="pub-location-card">
        <span className="pub-eyebrow">Tu próxima parada</span>
        <h2>
          <MapPin size={22} /> {cinema.city}
        </h2>
        <address>{cinema.address}</address>
        <div className="pub-actions">
          <a className="pub-button" href={links.directions} target="_blank" rel="noreferrer">
            <Navigation size={17} /> Cómo llegar
          </a>
          <a className="pub-text-link" href={links.location} target="_blank" rel="noreferrer">
            Ver en Maps <ExternalLink size={15} />
          </a>
        </div>
        <small>El recorrido se abre en Google Maps.</small>
      </div>
      <div className="pub-cinema-facts">
        <h2>Conoce tu sede</h2>
        <div className="pub-cinema-fact">
          <Armchair size={23} />
          <div>
            <strong>
              {cinema.halls} {cinema.halls === 1 ? 'sala' : 'salas'}
            </strong>
            <span>Elige tu ubicación al reservar</span>
          </div>
        </div>
        <div className="pub-cinema-fact">
          <Projector size={23} />
          <div>
            <strong>Formatos de proyección</strong>
            <span>{cinema.formats}</span>
          </div>
        </div>
        <p>
          ¿Necesitas información sobre accesibilidad o servicios? Consulta con la sede antes de tu
          visita.
        </p>
        <a
          className="pub-text-link"
          href="https://www.cinerama.com.pe/contacto"
          target="_blank"
          rel="noreferrer"
        >
          Consultar servicios <ExternalLink size={15} />
        </a>
      </div>
    </section>
  );
}
