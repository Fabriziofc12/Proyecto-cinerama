import Poster from './Poster';
import { dateLabel, money, languageLabel } from '../utils/format';

export default function BookingSummary({ movie, cinema, show, selected }) {
  return (
    <aside className="pub-booking-summary">
      <span className="pub-eyebrow">Tu próxima función</span>
      <div className="pub-summary-movie">
        <Poster src={movie.poster} title={movie.title} />
        <div>
          <h2>{movie.title}</h2>
          <p>
            {movie.duration} min · {movie.rating}
          </p>
          <p>
            {show.format} · {languageLabel(show.language)}
          </p>
        </div>
      </div>
      <dl>
        <div>
          <dt>Cine</dt>
          <dd>{cinema.name}</dd>
        </div>
        <div>
          <dt>Función</dt>
          <dd>
            {dateLabel(show.date)} · {show.time}
          </dd>
        </div>
        <div>
          <dt>Sala</dt>
          <dd>{show.hall}</dd>
        </div>
        <div>
          <dt>Butacas</dt>
          <dd>{selected.length ? selected.join(', ') : 'Por seleccionar'}</dd>
        </div>
        <div>
          <dt>Entrada general</dt>
          <dd>
            {selected.length} × {money(show.price)}
          </dd>
        </div>
      </dl>
      <div className="pub-total">
        <span>Total</span>
        <strong>{money(show.price * selected.length)}</strong>
      </div>
      <small>Precio final por las entradas seleccionadas.</small>
    </aside>
  );
}
