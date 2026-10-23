export const money = (value) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value);

export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function nextDays(count = 7, start = new Date()) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(start);
    date.setDate(date.getDate() + index);
    return localDate(date);
  });
}

export function dateLabel(value) {
  return new Intl.DateTimeFormat('es-PE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date(`${value}T12:00:00`));
}

export const languageLabel = (language) => (language === 'ES' ? 'Doblada' : 'Subtitulada');
export const hasStarted = (show, now = new Date()) =>
  new Date(`${show.date}T${show.time}:00`) <= now;
