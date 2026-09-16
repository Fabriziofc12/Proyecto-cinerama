import test from 'node:test';
import assert from 'node:assert/strict';
import { readSession, saveSession, clearSession } from '../src/features/public/services/session.js';
function storage() {
  const data = new Map();
  return {
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => data.set(k, v),
    removeItem: (k) => data.delete(k),
  };
}
test('Recordar conserva la sesión; desmarcarla la limita a la pestaña y elimina la anterior', () => {
  globalThis.localStorage = storage();
  globalThis.sessionStorage = storage();
  const user = { name: 'Cliente', email: 'cliente@demo.pe', role: 'customer' };
  saveSession(user, true);
  assert.deepEqual(readSession(), user);
  globalThis.sessionStorage = storage();
  assert.deepEqual(readSession(), user);
  saveSession(user, false);
  assert.deepEqual(readSession(), user);
  globalThis.sessionStorage = storage();
  assert.equal(readSession(), null);
  saveSession(user, false);
  saveSession(user, true);
  clearSession();
  assert.equal(readSession(), null);
});
test('Un fallo al cambiar persistencia no anuncia una sesión nueva ni pierde la anterior', () => {
  globalThis.localStorage = storage();
  globalThis.sessionStorage = storage();
  const first = { email: 'first@demo.pe' };
  saveSession(first, true);
  globalThis.localStorage.removeItem = () => {
    throw Error('Almacenamiento bloqueado');
  };
  assert.throws(() => saveSession({ email: 'second@demo.pe' }, false));
  assert.deepEqual(readSession(), first);
});
