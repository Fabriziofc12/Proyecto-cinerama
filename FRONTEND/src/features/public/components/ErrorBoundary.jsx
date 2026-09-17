import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <div className="pub-site">
          <div className="pub-empty" role="alert">
            <h1>No pudimos cargar esta pantalla.</h1>
            <p>Inténtalo nuevamente. Tus reservas guardadas seguirán disponibles.</p>
            <button className="pub-button" onClick={() => window.location.reload()}>
              Reintentar
            </button>
            <a className="pub-text-link" href="/WebHome">
              Volver al inicio
            </a>
          </div>
        </div>
      );
    return this.props.children;
  }
}
