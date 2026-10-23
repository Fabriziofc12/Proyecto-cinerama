import { X } from 'lucide-react';
import { money } from '../utils/format';

export default function SeatSelectionSummary({ selected, price, onRemove }) {
  return (
    <div className="pub-selection-summary">
      <p role="status">
        {selected.length
          ? `${selected.length} ${selected.length === 1 ? 'butaca seleccionada' : 'butacas seleccionadas'} · ${money(price * selected.length)}`
          : 'Selecciona una butaca para continuar.'}
      </p>
      {!!selected.length && (
        <div className="pub-selected-chips" aria-label="Butacas seleccionadas">
          {selected.map((seat) => (
            <button
              key={seat}
              className="pub-filter-chip"
              type="button"
              onClick={() => onRemove(seat)}
              aria-label={`Quitar butaca ${seat}`}
            >
              {seat}
              <X size={14} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
