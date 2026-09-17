import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { usePublic } from '../context/PublicContext';
import { dateLabel, money } from '../utils/format';
import EmptyState from '../components/EmptyState';
import Poster from '../components/Poster';

export default function AccountPage() {
  const { user, orders, signOut } = usePublic();
  const ownOrders = orders.filter((order) =>
    user
      ? (order.customer.accountEmail || order.customer.email) === user.email
      : !order.customer.accountEmail,
  );
  return (
    <section className="pub-section pub-page">
      <div className="pub-section-heading">
        <div>
          <span className="pub-eyebrow">Tu cuenta</span>
          <h1>{user ? `Hola, ${user.name.split(' ')[0]}.` : 'Tus reservas de invitado.'}</h1>
        </div>
        {user ? (
          <button className="pub-button pub-secondary" onClick={signOut}>
            <LogOut size={17} /> Cerrar sesión
          </button>
        ) : (
          <Link className="pub-button" to="/web/login">
            Iniciar sesión
          </Link>
        )}
      </div>
      <p className="pub-lead">Comprobantes de demostración guardados en este navegador.</p>
      {user?.role === 'admin' && (
        <Link className="pub-text-link" to="/dashboard">
          Abrir panel de administración →
        </Link>
      )}
      <h2 className="pub-space-top">Mis entradas</h2>
      {ownOrders.length ? (
        <div className="pub-orders">
          {ownOrders.map((order) => (
            <article className="pub-order" key={order.id}>
              <Poster src={order.poster} title={order.movieTitle} />
              <div>
                <span className="pub-eyebrow">{order.id}</span>
                <h3>{order.movieTitle}</h3>
                <p>
                  {order.cinemaName} · {dateLabel(order.show.date)} · {order.show.time}
                </p>
                <p>
                  Butacas: {order.seats.join(', ')} · {money(order.total)}
                </p>
                <Link className="pub-text-link" to={`/web/comprobante/${order.id}`}>
                  Ver comprobante →
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Tu próxima historia está por comenzar"
          action={
            <Link className="pub-button" to="/web/peliculas">
              Explorar cartelera
            </Link>
          }
        >
          Aquí aparecerán las reservas que completes.
        </EmptyState>
      )}
    </section>
  );
}
