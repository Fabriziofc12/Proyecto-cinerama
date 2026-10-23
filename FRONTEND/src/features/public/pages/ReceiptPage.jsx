import BookingProgress from '../components/BookingProgress';
import { Link, useParams } from 'react-router-dom';
import { usePublic } from '../context/PublicContext';
import TicketReceipt from '../components/TicketReceipt';
import EmptyState from '../components/EmptyState';
export default function ReceiptPage() {
  const { id } = useParams();
  const { orders, user } = usePublic();
  const order = orders.find(
    (item) =>
      item.id === id &&
      (user
        ? (item.customer.accountEmail || item.customer.email) === user.email
        : !item.customer.accountEmail),
  );
  return order ? (
    <>
      <div className="pub-section pub-receipt-progress">
        <BookingProgress step={3} />
      </div>
      <TicketReceipt order={order} />
    </>
  ) : (
    <EmptyState
      title="Comprobante no disponible"
      action={
        <Link className="pub-button" to="/web/cuenta">
          Mis entradas
        </Link>
      }
    >
      Inicia sesión con la cuenta de la reserva o revisa este enlace en el navegador donde se
      realizó.
    </EmptyState>
  );
}
