import { X } from 'lucide-react';
import { cinemas } from '../data/catalog';
import { dateLabel, languageLabel } from '../utils/format';

export default function ActiveFilters({ filters, onChange }) {
  const labels = {
    q: `Título: ${filters.q || ''}`,
    city: filters.city,
    cinemaId: cinemas.find((cinema) => cinema.id === Number(filters.cinemaId))?.name,
    date:
      filters.date &&
      /^\d{4}-\d{2}-\d{2}$/.test(filters.date) &&
      !Number.isNaN(Date.parse(filters.date))
        ? dateLabel(filters.date)
        : filters.date,
    genre: filters.genre,
    format: filters.format,
    language: filters.language ? languageLabel(filters.language) : '',
  };
  const active = Object.entries(labels).filter(([key]) => filters[key]);
  if (!active.length) return null;
  return (
    <div className="pub-active-filters" aria-label="Filtros aplicados">
      {active.map(([key, label]) => (
        <button
          key={key}
          className="pub-filter-chip"
          onClick={() =>
            onChange({ ...filters, [key]: '', ...(key === 'city' ? { cinemaId: '' } : {}) })
          }
          aria-label={`Quitar filtro ${label || filters[key]}`}
        >
          {label || filters[key]} <X size={14} />
        </button>
      ))}
    </div>
  );
}
