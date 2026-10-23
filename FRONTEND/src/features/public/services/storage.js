export function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(`cinerama.public.v1.${key}`));
    if (value === null || (Array.isArray(fallback) && !Array.isArray(value))) return fallback;
    return value;
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  // El consumidor muestra un error si el navegador no permite guardar; no se afirma éxito.
  localStorage.setItem(`cinerama.public.v1.${key}`, JSON.stringify(value));
}
