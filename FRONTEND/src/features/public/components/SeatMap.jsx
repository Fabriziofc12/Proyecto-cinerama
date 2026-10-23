import { Fragment, useId, useState } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

export default function SeatMap({ show, selected, occupied, onSelect }) {
  const [expanded, setExpanded] = useState(false);
  const mapId = useId();
  const aisleAfter = Math.ceil(show.columns / 2);
  const tracks = [
    'var(--row-label-width)',
    ...Array.from(
      { length: show.columns },
      (_, index) => `${index === aisleAfter ? '8px ' : ''}minmax(0, 1fr)`,
    ),
    'var(--row-label-width)',
  ].join(' ');
  return (
    <section
      className={`pub-seat-map ${expanded ? 'is-expanded' : 'is-overview'}`}
      aria-label="Selección de butacas"
    >
      <div className="pub-map-toolbar">
        <span>
          {show.hall} · {show.rows} filas
        </span>
        <button
          type="button"
          className="pub-map-zoom"
          aria-pressed={expanded}
          aria-controls={mapId}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
          {expanded ? 'Ver sala completa' : 'Ampliar butacas'}
        </button>
      </div>
      <div className="pub-screen">Pantalla</div>
      <p className="pub-seat-help">
        {expanded
          ? 'Desliza el mapa para recorrer la sala.'
          : 'Vista completa. Amplía las butacas si necesitas más espacio.'}
      </p>
      <p className="pub-muted pub-center">Elige hasta 8 butacas. Todas tienen el mismo precio.</p>
      <div
        className="pub-seat-scroll"
        id={mapId}
        role="region"
        aria-label={
          expanded
            ? 'Mapa de sala ampliado, desplazable horizontalmente'
            : 'Mapa completo de la sala'
        }
        tabIndex={0}
      >
        <div className="pub-seats">
          {Array.from({ length: show.rows }, (_, row) => (
            <div className="pub-seat-row" key={row} style={{ '--seat-tracks': tracks }}>
              <span className="pub-row-label" aria-hidden="true">
                {String.fromCharCode(65 + row)}
              </span>
              {Array.from({ length: show.columns }, (_, column) => {
                const name = `${String.fromCharCode(65 + row)}${column + 1}`;
                const taken = occupied.has(name);
                const active = selected.includes(name);
                return (
                  <Fragment key={name}>
                    {column === aisleAfter && <span className="pub-seat-gap" aria-hidden="true" />}
                    <button
                      type="button"
                      className={`pub-seat ${active ? 'is-selected' : ''}`}
                      aria-label={`Butaca ${name}${taken ? ', ocupada' : ''}`}
                      title={`Fila ${String.fromCharCode(65 + row)}, Butaca ${column + 1}${taken ? ' (Ocupada)' : active ? ' (Seleccionada)' : ' (Disponible)'}`}
                      data-seat={name}
                      aria-pressed={active}
                      disabled={taken}
                      onClick={() => onSelect(name)}
                    >
                      {taken ? '×' : column + 1}
                    </button>
                  </Fragment>
                );
              })}
              <span className="pub-row-label" aria-hidden="true">
                {String.fromCharCode(65 + row)}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="pub-legend">
        <span>
          <i /> Disponible
        </span>
        <span>
          <i className="is-selected" /> Seleccionada
        </span>
        <span>
          <i className="is-occupied">×</i> Ocupada
        </span>
      </div>
    </section>
  );
}
