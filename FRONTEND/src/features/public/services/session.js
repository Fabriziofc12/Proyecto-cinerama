const key = 'cinerama.public.v1.session';

export function readSession() {
  try {
    return JSON.parse(sessionStorage.getItem(key) || localStorage.getItem(key) || 'null');
  } catch {
    return null;
  }
}

export function saveSession(user, remember = true) {
  const target = remember ? localStorage : sessionStorage;
  const other = remember ? sessionStorage : localStorage;
  const previous = target.getItem(key);
  target.setItem(key, JSON.stringify(user));
  try {
    other.removeItem(key);
  } catch (error) {
    if (previous === null) target.removeItem(key);
    else target.setItem(key, previous);
    throw error;
  }
}

export function clearSession() {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
}
