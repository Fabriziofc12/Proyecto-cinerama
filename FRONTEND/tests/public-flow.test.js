import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { filterShows, movies, cinemas, shows } from '../src/features/public/data/catalog.js';
import { localDate, nextDays } from '../src/features/public/utils/format.js';
import { validatePayment, validateRegistration } from '../src/features/public/utils/validation.js';
import {
  occupiedSeats,
  purchase,
  validateSeats,
} from '../src/features/public/services/demoBooking.js';
import { login, register } from '../src/features/public/services/demoAuth.js';
import { readStorage, writeStorage } from '../src/features/public/services/storage.js';

let saved;
beforeEach(() => {
  saved = new Map();
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key) => saved.get(key) ?? null,
      setItem: (key, value) => saved.set(key, value),
    },
  });
});
const future = shows.find((show) => show.date === nextDays()[1] && show.movieId === 5);
const booking = (seats) => ({
  show: future,
  seats,
  customer: { name: 'Prueba', email: 'prueba@example.com' },
  card: '4242424242424242',
  movie: movies.find((movie) => movie.id === future.movieId),
  cinema: cinemas.find((cinema) => cinema.id === future.cinemaId),
});
const payment = {
  name: 'Prueba',
  email: 'prueba@example.com',
  card: '4242 4242 4242 4242',
  expiry: '12/30',
  cvv: '123',
};

test('las fechas locales no cambian de día al convertir a UTC y cruzan el fin de mes', () => {
  assert.equal(localDate(new Date(2026, 8, 12, 23, 45)), '2026-09-12');
  assert.deepEqual(nextDays(3, new Date(2026, 11, 31)), ['2026-12-31', '2027-01-01', '2027-01-02']);
});

test('ciudad, cine, película y día filtran conjuntamente', () => {
  const matches = filterShows({ movieId: 5, city: 'Lima', cinemaId: '1', date: nextDays()[1] });
  assert.equal(matches.length, 3);
  assert.ok(
    matches.every(
      (show) => show.movieId === 5 && show.cinemaId === 1 && show.date === nextDays()[1],
    ),
  );
  assert.equal(filterShows({ city: 'Callao', cinemaId: 1 }).length, 0);
});

test('preventa y próximos estrenos no se mezclan con la cartelera', () => {
  assert.equal(filterShows({ movieId: 4, date: nextDays()[0] }).length, 0);
  assert.ok(filterShows({ movieId: 4, date: nextDays()[2] }).length > 0);
  assert.equal(filterShows({ movieId: 7 }).length, 0);
  assert.equal(filterShows({ movieId: 8 }).length, 0);
});

test('no se reservan butacas ocupadas, inexistentes, repetidas ni más de ocho', () => {
  for (const seats of [
    [],
    ['B4'],
    ['Z1'],
    ['A1', 'A1'],
    Array.from({ length: 9 }, (_, i) => `A${i + 1}`),
  ]) {
    assert.throws(() => validateSeats(future, seats));
  }
  assert.doesNotThrow(() => validateSeats(future, ['E4', 'E5']));
  assert.throws(() => validateSeats({ ...future, date: '2020-01-01' }, ['E4']));
});

test('el pago exige campos válidos, fecha futura y números inventados de 13 a 19 dígitos', () => {
  const now = new Date(2026, 8, 12);
  assert.equal(validatePayment(payment, now), '');
  for (const card of [
    '1234567890123',
    '9876543210987654',
    '1234567890123456789',
    '4000000000000002',
  ]) {
    assert.equal(validatePayment({ ...payment, card, cvv: '9876' }, now), '');
  }
  for (const patch of [
    { name: '' },
    { email: 'correo' },
    { card: '123' },
    { card: '12345678901234567890' },
    { card: 'abcd567890123456' },
    { expiry: '01/20' },
    { expiry: '13/30' },
    { cvv: '12' },
  ]) {
    assert.notEqual(validatePayment({ ...payment, ...patch }, now), '');
  }
});

test('el registro exige coincidencia de contraseña y correo válido', () => {
  const account = {
    name: 'Prueba',
    email: 'prueba@example.com',
    password: 'Cinerama123',
    confirm: 'Cinerama123',
  };
  assert.equal(validateRegistration(account), '');
  assert.notEqual(validateRegistration({ ...account, confirm: 'otra' }), '');
  assert.notEqual(validateRegistration({ ...account, email: 'invalido' }), '');
});

test('una compra guarda función, importe y butacas, sin datos de tarjeta', async () => {
  const order = await purchase({ ...booking(['E4', 'E5']), card: '9876543210987654' });
  assert.equal(order.receiptSeries, 'B001');
  assert.equal(order.receiptNumber, 1);
  const second = await purchase({ ...booking(['F1']), card: '4000000000000002' });
  assert.equal(second.receiptNumber, 2);
  assert.equal(order.total, future.price * 2);
  assert.equal(order.movieTitle, 'Michael');
  assert.equal(order.show.id, future.id);
  assert.ok(occupiedSeats(future).has('E4'));
  assert.equal(readStorage('orders', []).length, 2);
  assert.ok(!JSON.stringify([...saved.values()]).includes('9876543210987654'));
  assert.ok(!JSON.stringify([...saved.values()]).includes('4000000000000002'));
});

test('un número con formato inválido no crea pedidos ni ocupa butacas', async () => {
  await assert.rejects(purchase({ ...booking(['E4']), card: '123' }), /dígitos/);
  assert.equal(readStorage('orders', []).length, 0);
  assert.ok(!occupiedSeats(future).has('E4'));
});

test('dos compras simultáneas no pueden confirmar la misma butaca', async () => {
  const results = await Promise.allSettled([purchase(booking(['E4'])), purchase(booking(['E4']))]);
  assert.equal(results.filter((result) => result.status === 'fulfilled').length, 1);
  assert.equal(results.filter((result) => result.status === 'rejected').length, 1);
  assert.equal(readStorage('orders', []).length, 1);
});

test('no se confirma una compra cuando falla el almacenamiento', async () => {
  localStorage.setItem = () => {
    throw new Error('Almacenamiento lleno');
  };
  await assert.rejects(purchase(booking(['E4'])), /Almacenamiento lleno/);
});

test('cliente y administrador demo tienen roles diferentes y se rechaza contraseña incorrecta', async () => {
  assert.equal((await login('cliente@demo.pe', 'Cinerama123')).role, 'customer');
  assert.equal((await login('admin@demo.pe', 'Cinerama123')).role, 'admin');
  await assert.rejects(login('admin@demo.pe', 'incorrecta'));
});

test('la cuenta registrada permite iniciar sesión y no guarda la contraseña en texto', async () => {
  await register({ name: 'Prueba', email: 'NUEVO@example.com', password: 'DemoPassword123' });
  assert.equal((await login('nuevo@example.com', 'DemoPassword123')).role, 'customer');
  await assert.rejects(
    register({ name: 'Otra', email: 'nuevo@example.com', password: 'OtraPassword123' }),
    /registrado/,
  );
  assert.ok(!JSON.stringify([...saved.values()]).includes('DemoPassword123'));
});

test('datos locales corruptos se recuperan con un estado vacío', () => {
  saved.set('cinerama.public.v1.orders', '{corrupto');
  assert.deepEqual(readStorage('orders', []), []);
  writeStorage('orders', { invalid: true });
  assert.deepEqual(readStorage('orders', []), []);
});
