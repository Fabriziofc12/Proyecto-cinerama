import { Navigate, useLocation } from 'react-router-dom';
import { usePublic } from '../context/PublicContext';
// Control de navegación de la demo. Una implementación real requiere autorización en servidor.
export default function AdminGuard({ children }) {
  const { user } = usePublic();
  const location = useLocation();
  return user?.role === 'admin' ? (
    children
  ) : (
    <Navigate to={`/web/login?next=${encodeURIComponent(location.pathname)}`} replace />
  );
}
