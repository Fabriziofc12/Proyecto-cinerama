import qrcode from 'qrcode-generator';

qrcode.stringToBytes = (text) => Array.from(new TextEncoder().encode(text));

export function receiptNumber(order) {
  return order.receiptSeries && Number.isSafeInteger(order.receiptNumber)
    ? `${order.receiptSeries}-${String(order.receiptNumber).padStart(8, '0')}`
    : order.id;
}

export function ticketQrText(order) {
  // Información legible sin servidor y sin datos personales o bancarios.
  return [
    'CINERAMA | RESERVA DE PRUEBA',
    `Boleta: ${receiptNumber(order)}`,
    `Reserva: ${order.id}`,
    `Película: ${order.movieTitle}`,
    `Cine: ${order.cinemaName}`,
    `Función: ${order.show.date} ${order.show.time}`,
    `Sala: ${order.show.hall}`,
    `Butacas: ${order.seats.join(', ')}`,
    'Sin validez como entrada.',
  ].join('\n');
}

export function createTicketQr(order) {
  const qr = qrcode(0, 'M');
  qr.addData(ticketQrText(order));
  qr.make();
  return qr;
}

export function ticketQrImage(order) {
  const svg = createTicketQr(order).createSvgTag({ cellSize: 4, margin: 16, scalable: true });
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
