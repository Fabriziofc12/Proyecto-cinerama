import { readStorage, writeStorage } from './storage.js';
import { hasStarted } from '../utils/format.js';
import { validCardFormat } from '../utils/validation.js';

export function occupiedSeats(show, orders = readStorage('orders', [])) {
  return new Set([
    ...show.occupied,
    ...orders.filter((order) => order.show.id === show.id).flatMap((order) => order.seats),
  ]);
}

export function validateSeats(show, seats, orders = []) {
  if (hasStarted(show)) throw new Error('Esta función ya comenzó. Elige otro horario.');
  if (!seats.length || seats.length > 8 || new Set(seats).size !== seats.length)
    throw new Error('Selecciona entre 1 y 8 butacas.');
  const occupied = occupiedSeats(show, orders);
  if (seats.some((seat) => !/^[A-H](10|[1-9])$/.test(seat) || occupied.has(seat)))
    throw new Error('Una de tus butacas ya no está disponible. Vuelve y elige otra.');
}

export async function purchase({ show, seats, customer, card, movie, cinema }) {
  // Solo se comprueba el formato; no se transmite ni almacena información de tarjeta.
  if (!validCardFormat(card)) {
    throw new Error('Escribe un número de entre 13 y 19 dígitos.');
  }
  await new Promise((resolve) => setTimeout(resolve, 900));
  const commit = () => {
    const orders = readStorage('orders', []);
    validateSeats(show, seats, orders);
    const order = {
      id: `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      receiptSeries: 'B001',
      receiptNumber:
        orders.reduce(
          (max, item) =>
            item.receiptSeries === 'B001' && Number.isSafeInteger(item.receiptNumber)
              ? Math.max(max, item.receiptNumber)
              : max,
          0,
        ) + 1,
      show,
      seats,
      customer,
      movieTitle: movie.title,
      poster: movie.poster,
      cinemaName: cinema.name,
      total: seats.length * show.price,
      createdAt: new Date().toISOString(),
    };
    writeStorage('orders', [order, ...orders]);
    return order;
  };
  // Evita compras simultáneas de la misma butaca en pestañas de este navegador.
  return navigator.locks ? navigator.locks.request('cinerama-demo-purchase', commit) : commit();
}
