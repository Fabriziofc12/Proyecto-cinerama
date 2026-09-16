export default function BookingProgress({ step }) {
  return (
    <ol className="pub-steps" aria-label="Progreso de compra">
      {['Butacas', 'Datos y pago', 'Comprobante'].map((label, index) => (
        <li
          key={label}
          className={step >= index + 1 ? 'is-active' : ''}
          aria-current={step === index + 1 ? 'step' : undefined}
        >
          <span>{index + 1}</span>
          {label}
          {step > index + 1 && <small className="pub-sr-only">Completado</small>}
        </li>
      ))}
    </ol>
  );
}
