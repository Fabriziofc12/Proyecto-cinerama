import { useMemo } from 'react';
import { CheckCircle2, Download, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dateLabel, languageLabel, money } from '../utils/format';
import { receiptHtml, receiptText } from '../utils/receipt';
import receiptStyles from '../styles/receipt.css?inline';
import { receiptNumber, ticketQrImage } from '../utils/ticketQr';

export default function TicketReceipt({ order }) {
  const document = useMemo(() => receiptHtml(order, receiptStyles), [order]);
  const qrImage = useMemo(() => ticketQrImage(order), [order]);
  return (
    <section className="pub-receipt">
      <CheckCircle2 className="pub-success-icon" size={46} />
      <span className="pub-eyebrow">Reserva de demostración completada</span>
      <h1>Tu plan de cine está listo.</h1>
      <p>
        Guardamos el comprobante en este navegador. No se ha realizado un cobro ni enviado un
        correo.
      </p>
      <div className="pub-ticket">
        <span className="pub-ticket-code">Boleta {receiptNumber(order)}</span>
        <small className="pub-ticket-reference">Reserva: {order.id}</small>
        <h2>{order.movieTitle}</h2>
        <p>{order.cinemaName}</p>
        <p>
          {dateLabel(order.show.date)} de {order.show.date.slice(0, 4)} · {order.show.time} ·{' '}
          {order.show.hall}
        </p>
        <p>
          {order.show.format} · {languageLabel(order.show.language)}
        </p>
        <div className="pub-ticket-bottom">
          <div>
            <small>Butacas</small>
            <strong>{order.seats.join(', ')}</strong>
          </div>
          <div>
            <small>Total simulado</small>
            <strong>{money(order.total)}</strong>
          </div>
        </div>
        <figure className="pub-ticket-qr">
          <img
            src={qrImage}
            width="280"
            height="280"
            alt={`QR de la boleta ${receiptNumber(order)}`}
          />
          <figcaption>Escanea para ver la función y las butacas.</figcaption>
        </figure>
        <small>Reserva de prueba · el QR no valida el ingreso al cine</small>
      </div>
      <div className="pub-actions">
        <a
          className="pub-button"
          href={`data:text/html;charset=utf-8,${encodeURIComponent(document)}`}
          download={`${order.id}.html`}
        >
          <Download size={17} /> Descargar comprobante
        </a>
        <button className="pub-button pub-secondary" onClick={() => window.print()}>
          <Printer size={17} /> Imprimir / PDF
        </button>
        <Link className="pub-button pub-secondary" to="/web/cuenta">
          Mis entradas
        </Link>
        <Link className="pub-text-link" to="/WebHome">
          Volver al inicio
        </Link>
      </div>
      <p className="pub-receipt-help">
        La descarga conserva el diseño en un archivo HTML. También puedes{' '}
        <a
          className="pub-text-link"
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(receiptText(order))}`}
          download={`${order.id}.txt`}
        >
          guardar una copia de texto
        </a>
        .
      </p>
    </section>
  );
}
