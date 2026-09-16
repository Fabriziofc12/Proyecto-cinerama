import { useEffect, useState } from 'react';
import { PublicContext } from './PublicContext';
import { readStorage } from '../services/storage';
import { readSession, saveSession, clearSession } from '../services/session';

export default function PublicProvider({ children }) {
  const [user, setUser] = useState(readSession);
  const [orders, setOrders] = useState(() => readStorage('orders', []));
  useEffect(() => {
    const sync = () => {
      setOrders(readStorage('orders', []));
      setUser(readSession());
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const signIn = (value, remember = true) => {
    saveSession(value, remember);
    setUser(value);
  };
  const signOut = () => {
    clearSession();
    setUser(null);
  };
  const refreshOrders = () => setOrders(readStorage('orders', []));
  return (
    <PublicContext.Provider value={{ user, signIn, signOut, orders, refreshOrders }}>
      {children}
    </PublicContext.Provider>
  );
}
