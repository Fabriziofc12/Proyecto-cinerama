export function validateRegistration({ name, email, password, confirm }) {
  if (!name?.trim() || name.trim().length < 2) return 'Escribe tu nombre completo.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '')) return 'Escribe un correo válido.';
  if (!password || password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
  if (password !== confirm) return 'Las contraseñas no coinciden.';
  return '';
}

export function validCardFormat(card) {
  return /^\d{13,19}$/.test(String(card || '').replace(/[\s-]/g, ''));
}

export function validatePayment({ name, email, card, expiry, cvv }, now = new Date()) {
  if (!name?.trim() || name.trim().length < 2) return 'Escribe el nombre del titular.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || ''))
    return 'Escribe un correo válido para el comprobante.';
  if (!validCardFormat(card)) return 'Escribe un número de entre 13 y 19 dígitos.';
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry || ''))
    return 'Escribe el vencimiento en formato MM/AA.';
  const [month, year] = expiry.split('/').map(Number);
  if (new Date(2000 + year, month, 1) <= now) return 'La fecha de vencimiento debe ser futura.';
  if (!/^\d{3,4}$/.test(cvv || '')) return 'El CVV debe tener 3 o 4 dígitos.';
  return '';
}
