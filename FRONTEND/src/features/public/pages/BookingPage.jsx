import BookingProgress from '../components/BookingProgress';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cinemas, movies, shows } from '../data/catalog';
import { usePublic } from '../context/PublicContext';
import { occupiedSeats, purchase, validateSeats } from '../services/demoBooking';
import { readStorage, writeStorage } from '../services/storage';
import { hasStarted } from '../utils/format';
import SeatMap from '../components/SeatMap';
import BookingSummary from '../components/BookingSummary';
import PaymentForm from '../components/PaymentForm';
import EmptyState from '../components/EmptyState';
import SeatSelectionSummary from '../components/SeatSelectionSummary';

function BookingFlow({ show }) {
  const navigate = useNavigate();
  const { user, orders, refreshOrders } = usePublic();
  const movie = movies.find((item) => item.id === show.movieId);
  const cinema = cinemas.find((item) => item.id === show.cinemaId);
  const [selected, setSelected] = useState(() => {
    const saved = readStorage(`draft.${show.id}`, []);
    return Array.isArray(saved)
      ? saved.filter((seat) => !occupiedSeats(show).has(seat)).slice(0, 8)
      : [];
  });
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const paying = useRef(false);
  const panel = useRef(null);
  const previousStep = useRef(step);
  useEffect(() => {
    if (step !== previousStep.current) {
      panel.current?.focus({ preventScroll: true });
      panel.current?.scrollIntoView({ block: 'start' });
      previousStep.current = step;
    }
  }, [step]);
  const occupied = occupiedSeats(show, orders);
  function select(seat) {
    setError('');
    if (!selected.includes(seat) && selected.length >= 8) {
      setError('Puedes elegir un máximo de 8 butacas por compra.');
      return;
    }
    const next = selected.includes(seat)
      ? selected.filter((item) => item !== seat)
      : [...selected, seat].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    setSelected(next);
    try {
      writeStorage(`draft.${show.id}`, next);
    } catch {
      setError(
        'El navegador no permite guardar la selección. Se conservará mientras mantengas esta página abierta.',
      );
    }
  }
  function next() {
    try {
      validateSeats(show, selected, readStorage('orders', []));
      setError('');
      setStep(2);
    } catch (failure) {
      setError(failure.message);
      refreshOrders();
    }
  }
  async function pay(fields) {
    if (paying.current) return;
    paying.current = true;
    setBusy(true);
    setError('');
    try {
      const result = await purchase({
        show,
        seats: selected,
        customer: {
          name: fields.name.trim(),
          email: fields.email.trim().toLowerCase(),
          accountEmail: user?.email || null,
        },
        card: fields.card,
        movie,
        cinema,
      });
      refreshOrders();
      try {
        writeStorage(`draft.${show.id}`, []);
      } catch {
        /* La compra ya está guardada. */
      }
      navigate(`/web/comprobante/${result.id}`, { replace: true });
    } catch (failure) {
      setError(failure.message || 'No pudimos completar la reserva. Inténtalo de nuevo.');
      refreshOrders();
    } finally {
      setBusy(false);
      paying.current = false;
    }
  }
  return (
    <section className="pub-section pub-page">
      <Link
        className="pub-text-link pub-back"
        to={`/web/pelicula/${movie.id}?cinemaId=${cinema.id}&date=${show.date}#funciones`}
      >
        <ArrowLeft size={17} /> Cambiar función
      </Link>
      <div className="pub-section-heading">
        <div>
          <span className="pub-eyebrow">Ya casi estás en el cine</span>
          <h1>Haz tuyo este momento.</h1>
        </div>
      </div>
      <BookingProgress step={step} />
      <div className="pub-booking-grid">
        <div
          className="pub-booking-main"
          ref={panel}
          tabIndex={-1}
          role="group"
          aria-label={step === 1 ? 'Paso 1: selecciona tus butacas' : 'Paso 2: datos y pago'}
        >
          {error && (
            <p className="pub-error" role="alert">
              {error}
            </p>
          )}
          {step === 1 ? (
            <>
              <span className="pub-eyebrow">Paso 1 de 3</span>
              <h2>Elige tu lugar favorito.</h2>
              <SeatMap show={show} selected={selected} occupied={occupied} onSelect={select} />
              <div className="pub-section-heading pub-seat-bottom">
                <SeatSelectionSummary selected={selected} price={show.price} onRemove={select} />
                <button className="pub-button" disabled={!selected.length} onClick={next}>
                  Continuar <ArrowRight size={18} />
                </button>
              </div>
            </>
          ) : (
            <PaymentForm
              user={user}
              total={show.price * selected.length}
              onPay={pay}
              onBack={() => {
                setStep(1);
                setError('');
              }}
              busy={busy}
            />
          )}
        </div>
        <BookingSummary movie={movie} cinema={cinema} show={show} selected={selected} />
      </div>
    </section>
  );
}

export default function BookingPage() {
  const [params] = useSearchParams();
  const show = shows.find((item) => item.id === params.get('funcion'));
  if (!show || hasStarted(show))
    return (
      <EmptyState
        title="Elige una función disponible"
        action={
          <Link className="pub-button" to="/web/peliculas">
            Ver cartelera
          </Link>
        }
      >
        Este enlace no tiene una función válida o su horario ya pasó.
      </EmptyState>
    );
  return <BookingFlow key={show.id} show={show} />;
}
