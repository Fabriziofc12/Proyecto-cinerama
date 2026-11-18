const PERU_NON_WORKING_DATES = new Set([
  // Add dates from each official PCM decree; national holidays are calculated below.
]);

function parseLocalDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new RangeError(`Fecha inválida: ${value}`);

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(year, month - 1, day, 12);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day)
    throw new RangeError(`Fecha inválida: ${value}`);

  return { year, month, day, date };
}

function easterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day, 12);
}

function peruNationalHolidays(year) {
  const fixedDates = [
    '01-01',
    '05-01',
    '06-07',
    '06-29',
    '07-23',
    '07-28',
    '07-29',
    '08-06',
    '08-30',
    '10-08',
    '11-01',
    '12-08',
    '12-09',
    '12-25',
  ];
  const easter = easterSunday(year);
  const maundyThursday = new Date(easter);
  maundyThursday.setDate(easter.getDate() - 3);
  const goodFriday = new Date(easter);
  goodFriday.setDate(easter.getDate() - 2);
  const localDate = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  return new Set([
    ...fixedDates.map((date) => `${year}-${date}`),
    localDate(maundyThursday),
    localDate(goodFriday),
  ]);
}

export function ticketPriceForDate(
  value,
  { preRelease = false, nonWorkingDates = PERU_NON_WORKING_DATES } = {},
) {
  const { year, date } = parseLocalDate(value);
  if (preRelease || peruNationalHolidays(year).has(value) || nonWorkingDates.has(value)) return 19;

  switch (date.getDay()) {
    case 1:
    case 3:
      return 13;
    case 2:
      return 12;
    default:
      return 19;
  }
}

export function bookingTotal(unitPrice, seats) {
  if (!Number.isFinite(unitPrice) || unitPrice < 0)
    throw new RangeError('El precio unitario debe ser un número no negativo.');
  if (!Array.isArray(seats)) throw new TypeError('Las butacas deben ser una lista.');

  return (Math.round(unitPrice * 100) * seats.length) / 100;
}
