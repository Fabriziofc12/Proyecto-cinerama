import { readStorage, writeStorage } from './storage.js';

export const demoCredentials = { email: 'cliente@demo.pe', password: 'Cinerama123' };
export const adminCredentials = { email: 'admin@demo.pe', password: 'Cinerama123' };

async function hash(password, salt) {
  const buffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`${salt}:${password}`),
  );
  return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function login(email, password) {
  const normalized = email.trim().toLowerCase();
  if (
    password === demoCredentials.password &&
    [demoCredentials.email, adminCredentials.email].includes(normalized)
  ) {
    return {
      name: normalized === adminCredentials.email ? 'Admin Central' : 'Invitado Cinerama',
      email: normalized,
      role: normalized === adminCredentials.email ? 'admin' : 'customer',
    };
  }
  const accounts = readStorage('accounts', []);
  const account = accounts.find((item) => item.email === normalized);
  if (!account || (await hash(password, account.salt)) !== account.hash)
    throw new Error('El correo o la contraseña no son correctos.');
  return { name: account.name, email: account.email, role: 'customer' };
}

export async function register({ name, email, password }) {
  const normalized = email.trim().toLowerCase();
  const accounts = readStorage('accounts', []);
  if (
    [demoCredentials.email, adminCredentials.email].includes(normalized) ||
    accounts.some((item) => item.email === normalized)
  )
    throw new Error('Este correo ya está registrado. Inicia sesión.');
  const salt = crypto.randomUUID();
  const account = { name: name.trim(), email: normalized, salt, hash: await hash(password, salt) };
  writeStorage('accounts', [...accounts, account]);
  return { name: account.name, email: normalized, role: 'customer' };
}
