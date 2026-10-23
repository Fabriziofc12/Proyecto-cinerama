import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
export default function NotFoundPage() {
  return (
    <EmptyState
      title="Esta escena no está en el guion"
      action={
        <Link className="pub-button" to="/WebHome">
          Volver al inicio
        </Link>
      }
    >
      La página que buscas no existe o cambió de dirección.
    </EmptyState>
  );
}
