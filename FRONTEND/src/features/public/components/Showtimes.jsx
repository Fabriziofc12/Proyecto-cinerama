import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { cinemas } from '../data/catalog';
import { dateLabel, hasStarted, languageLabel, money } from '../utils/format';
import { occupiedSeats } from '../services/demoBooking';
import { usePublic } from '../context/PublicContext';
import EmptyState from './EmptyState';

export default function Showtimes({ shows }) {
  const { orders } = usePublic();
  if (!shows.length)
    return (
      <EmptyState title="Sin funciones para esta selección">
        Prueba otra fecha o un cine cercano.
      </EmptyState>
    );
  const groups = Object.groupBy(shows, (show) => `${show.cinemaId}-${show.date}`);
  return (
    <div className="pub-showtimes">
      {Object.entries(groups).map(([key, group]) => {
        const cinema = cinemas.find((item) => item.id === group[0].cinemaId);
        return (
          <section className="pub-show-group" key={key}>
            <div>
              <h3>{cinema.name}</h3>
              <p>
                <MapPin size={14} /> {cinema.city} <span>·</span> {dateLabel(group[0].date)}
              </p>
            </div>
            <div className="pub-times">
              {group.map((show) => {
                const full = occupiedSeats(show, orders).size >= show.rows * show.columns;
                const past = hasStarted(show);
                const content = (
                  <>
                    <strong>{show.time}</strong>
                    <span>
                      {show.format} · {languageLabel(show.language)}
                    </span>
                    <small>
                      {past ? 'Finalizada / en curso' : full ? 'Agotada' : money(show.price)}
                    </small>
                  </>
                );
                return past || full ? (
                  <button key={show.id} className="pub-time" disabled>
                    {content}
                  </button>
                ) : (
                  <Link
                    className="pub-time"
                    key={show.id}
                    to={`/web/compra?funcion=${show.id}`}
                    aria-label={`${show.time}, ${cinema.name}, ${dateLabel(show.date)}, ${show.format}, ${languageLabel(show.language)}, ${money(show.price)}`}
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
