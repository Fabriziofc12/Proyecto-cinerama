import test from 'node:test';
import assert from 'node:assert/strict';
import { receiptHtml, receiptText } from '../src/features/public/utils/receipt.js';
import { cinemaMapLinks } from '../src/features/public/utils/cinema.js';
import { normalizeSearch } from '../src/features/public/utils/search.js';

test('la búsqueda admite títulos con tildes, mayúsculas y espacios', () => {
  assert.ok(normalizeSearch('La Posesión de la Momia').includes(normalizeSearch('  POSESION ')));
  assert.equal(normalizeSearch(''), '');
});

const order = {
  id: 'DEMO-LOCAL',
  movieTitle: 'Película de prueba',
  cinemaName: 'Cinerama Pacífico',
  show: { date: '2026-09-20', time: '18:30', hall: 'Sala 1', format: '2D', language: 'ES' },
  seats: ['A1', 'A2'],
  total: 42,
  customer: { name: '<script>alert("x")</script>', email: 'prueba@example.com' },
};

test('el comprobante descargable conserva los datos y escapa HTML ingresado por el cliente', () => {
  const html = receiptHtml(order, 'body { color: #222; }');
  assert.ok(html.startsWith('<!doctype html>'));
  assert.ok(html.includes('lang="es"'));
  assert.ok(html.includes('DEMO-LOCAL'));
  assert.ok(html.includes('2026'));
  assert.ok(html.includes('A1, A2'));
  assert.ok(html.includes('Sin validez como entrada.'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('src="data:image/svg+xml;'));
  assert.ok(!html.includes('src="https://'));
  assert.match(receiptText(order), /Butacas: A1, A2/);
  assert.match(receiptText(order), /Total simulado: S\/\s*42[.,]00/);
});

test('los enlaces a Maps incluyen sede, dirección y ciudad sin perder caracteres especiales', () => {
  const cinema = { name: 'Cinerama & Sol', address: 'Av. San Martín 727', city: 'Ica' };
  const links = cinemaMapLinks(cinema);
  const directions = new URL(links.directions);
  assert.equal(directions.origin, 'https://www.google.com');
  assert.equal(directions.pathname, '/maps/dir/');
  assert.equal(
    directions.searchParams.get('destination'),
    'Cinerama & Sol, Av. San Martín 727, Ica, Perú',
  );
  assert.equal(
    new URL(links.location).searchParams.get('query'),
    directions.searchParams.get('destination'),
  );
});
