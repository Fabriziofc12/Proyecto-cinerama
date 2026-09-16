import { useState } from 'react';
import { CreditCard, ArrowLeft, LoaderCircle } from 'lucide-react';
import { validatePayment } from '../utils/validation';
import { money } from '../utils/format';

export default function PaymentForm({ user, total, onPay, onBack, busy }) {
  const [fields, setFields] = useState({
    name: user?.name || '',
    email: user?.email || '',
    card: '',
    expiry: '',
    cvv: '',
  });
  const [error, setError] = useState('');
  const update = (key, value) => setFields((previous) => ({ ...previous, [key]: value }));
  function submit(event) {
    event.preventDefault();
    const message = validatePayment(fields);
    setError(message);
    if (!message) onPay(fields);
  }
  return (
    <form className="pub-payment" onSubmit={submit} noValidate aria-busy={busy}>
      <span className="pub-eyebrow">Paso 2 de 3</span>
      <h2>Completa tu reserva.</h2>
      <p className="pub-muted">Revisa tus datos y el resumen antes de continuar.</p>
      <div className="pub-demo-info">
        <CreditCard size={22} />
        <div>
          <strong>Reserva de prueba · sin cobros</strong>
          <p>
            Puedes inventar un número de 13 a 19 dígitos, un vencimiento futuro y un CVV de 3 o 4
            dígitos. Estos datos no se guardan. No uses una tarjeta real.
          </p>
        </div>
      </div>
      <fieldset disabled={busy}>
        <label>
          Nombre del titular
          <input
            autoComplete="off"
            value={fields.name}
            onChange={(event) => update('name', event.target.value)}
            placeholder="Nombre completo"
            required
          />
        </label>
        <label>
          Correo del comprobante
          <input
            type="email"
            autoComplete="email"
            value={fields.email}
            onChange={(event) => update('email', event.target.value)}
            placeholder="tu@correo.com"
            required
          />
        </label>
        <label>
          Número de tarjeta de prueba
          <input
            inputMode="numeric"
            autoComplete="off"
            maxLength={23}
            value={fields.card}
            onChange={(event) =>
              update(
                'card',
                event.target.value
                  .replace(/\D/g, '')
                  .slice(0, 19)
                  .replace(/(.{4})/g, '$1 ')
                  .trim(),
              )
            }
            placeholder="Número de 13 a 19 dígitos"
            required
          />
        </label>
        <div className="pub-form-row">
          <label>
            Vencimiento
            <input
              inputMode="numeric"
              autoComplete="off"
              placeholder="MM/AA"
              maxLength={5}
              value={fields.expiry}
              onChange={(event) => {
                const digits = event.target.value.replace(/\D/g, '').slice(0, 4);
                update(
                  'expiry',
                  digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits,
                );
              }}
              required
            />
          </label>
          <label>
            CVV de prueba
            <input
              inputMode="numeric"
              autoComplete="off"
              maxLength={4}
              placeholder="3 o 4 dígitos"
              value={fields.cvv}
              onChange={(event) => update('cvv', event.target.value.replace(/\D/g, '').slice(0, 4))}
              required
            />
          </label>
        </div>
      </fieldset>
      {error && (
        <p className="pub-error" role="alert">
          {error}
        </p>
      )}
      <div className="pub-actions">
        <button type="button" className="pub-button pub-secondary" onClick={onBack} disabled={busy}>
          <ArrowLeft size={17} /> Butacas
        </button>
        <button type="submit" className="pub-button" disabled={busy}>
          {busy ? (
            <>
              <LoaderCircle className="pub-spinner" size={17} /> Procesando…
            </>
          ) : (
            `Confirmar reserva · ${money(total)}`
          )}
        </button>
      </div>
    </form>
  );
}
