import test from 'node:test';
import assert from 'node:assert/strict';
import jsQR from 'jsqr';
import {
  createTicketQr,
  ticketQrText,
  receiptNumber,
  ticketQrImage,
} from '../src/features/public/utils/ticketQr.js';
const order = {
  id: 'DEMO-QR-TEST',
  receiptSeries: 'B001',
  receiptNumber: 27,
  movieTitle: 'Película: La Posesión de la Momia',
  cinemaName: 'Cinerama Pacífico',
  show: { date: '2026-09-20', time: '18:30', hall: 'Sala 1' },
  seats: ['A1', 'A2'],
  customer: { name: 'Privado', email: 'privado@example.com' },
};
test('el QR se decodifica con los datos exactos de la función, sin datos personales', () => {
  const qr = createTicketQr(order),
    scale = 5,
    margin = 4,
    size = (qr.getModuleCount() + margin * 2) * scale;
  const rgba = new Uint8ClampedArray(size * size * 4).fill(255);
  for (let row = 0; row < qr.getModuleCount(); row++)
    for (let col = 0; col < qr.getModuleCount(); col++)
      if (qr.isDark(row, col)) {
        for (let y = 0; y < scale; y++)
          for (let x = 0; x < scale; x++) {
            const i = (((row + margin) * scale + y) * size + (col + margin) * scale + x) * 4;
            rgba[i] = rgba[i + 1] = rgba[i + 2] = 0;
          }
      }
  assert.equal(jsQR(rgba, size, size)?.data, ticketQrText(order));
  assert.ok(!ticketQrText(order).includes('Privado'));
  assert.ok(!ticketQrText(order).includes('@'));
  assert.equal(receiptNumber(order), 'B001-00000027');
  assert.notEqual(ticketQrImage(order), ticketQrImage({ ...order, id: 'OTRA', receiptNumber: 28 }));
});
test('las reservas anteriores conservan un número y un QR estable', () => {
  const legacy = { ...order, receiptSeries: undefined, receiptNumber: undefined };
  assert.equal(receiptNumber(legacy), legacy.id);
  assert.equal(ticketQrImage(legacy), ticketQrImage(legacy));
});
