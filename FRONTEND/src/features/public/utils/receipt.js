import { dateLabel, languageLabel, money } from './format.js';
import { receiptNumber, ticketQrImage } from './ticketQr.js';

export const escapeHtml = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[character],
  );

export function receiptRows(order) {
  return [
    ['Boleta', receiptNumber(order)],
    ['Reserva', order.id],
    ['Película', order.movieTitle],
    ['Cine', order.cinemaName],
    ['Fecha', `${dateLabel(order.show.date)} de ${order.show.date.slice(0, 4)}`],
    ['Hora y sala', `${order.show.time} · ${order.show.hall}`],
    ['Formato', `${order.show.format} · ${languageLabel(order.show.language)}`],
    ['Butacas', order.seats.join(', ')],
    ['Total simulado', money(order.total)],
    ['Cliente', order.customer.name],
    ['Correo', order.customer.email],
  ];
}

export function receiptText(order) {
  return [
    'CINERAMA · COMPROBANTE DE DEMOSTRACIÓN',
    'Sin validez como entrada. No se realizó ningún cobro.',
    '',
    ...receiptRows(order).map(([label, value]) => `${label}: ${value}`),
  ].join('\n');
}

export function receiptHtml(order, stylesheet = '') {
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(order.id)} · Cinerama</title><style>${stylesheet}</style></head>
<body><main class="receipt-document"><header><b>CINERAMA</b><span>EL CINE SE SIENTE.</span></header>
<p class="receipt-eyebrow">Comprobante de demostración</p><h1>${escapeHtml(order.movieTitle)}</h1>
<p>Tu plan de cine, en un solo lugar.</p><dl>${receiptRows(order)
    .map(
      ([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`,
    )
    .join('')}</dl>
<figure class="receipt-qr"><img src="${ticketQrImage(order)}" width="280" height="280" alt="QR de la boleta ${escapeHtml(receiptNumber(order))}"><figcaption>Escanea para leer la función y las butacas. No valida el ingreso.</figcaption></figure>
<footer><strong>Sin validez como entrada.</strong><p>No se realizó ningún cobro ni se envió un correo. Conserva este archivo para consultar tu reserva de prueba.</p></footer>
<p class="receipt-print-tip">Para guardar como PDF: abre Imprimir en tu navegador y elige «Guardar como PDF».</p></main></body></html>`;
}
