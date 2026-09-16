import { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { CinemaProvider } from './context/CinemaContext';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import PublicProvider from './features/public/context/PublicProvider';
import PublicLayout from './features/public/components/PublicLayout';
import AdminGuard from './features/public/components/AdminGuard';
import ErrorBoundary from './features/public/components/ErrorBoundary';
import HomePage from './features/public/pages/HomePage';
import AuthPage from './features/public/pages/AuthPage';
import CinemasPage from './features/public/pages/CinemasPage';
import MoviesPage from './features/public/pages/MoviesPage';
import BookingPage from './features/public/pages/BookingPage';
import MovieDetailsPage from './features/public/pages/MovieDetailsPage';
import CinemaDetailsPage from './features/public/pages/CinemaDetailsPage';
import AccountPage from './features/public/pages/AccountPage';
import ReceiptPage from './features/public/pages/ReceiptPage';
import NotFoundPage from './features/public/pages/NotFoundPage';

// Los gráficos y pantallas administrativas se descargan al abrir sus rutas.
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MovieManagement = lazy(() => import('./pages/MovieManagement'));
const CinemaManagement = lazy(() => import('./pages/CinemaManagement'));
const Scheduling = lazy(() => import('./pages/Scheduling'));
const TicketOperations = lazy(() => import('./pages/TicketOperations'));
const Payments = lazy(() => import('./pages/Payments'));
const UsersAccess = lazy(() => import('./pages/UsersAccess'));
const Reports = lazy(() => import('./pages/Reports'));
const Settings = lazy(() => import('./pages/Settings'));

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} />
      <div className="main-content">
        <Topbar
          onMenuToggle={() => setSidebarOpen((open) => !open)}
          onNotifToggle={() => setNotifOpen((open) => !open)}
          notifOpen={notifOpen}
          onNotifClose={() => setNotifOpen(false)}
        />
        <div className="page-content">
          <Suspense fallback={<p role="status">Cargando panel…</p>}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <PublicProvider>
        <CinemaProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/WebHome" replace />} />
              <Route path="/web" element={<Navigate to="/WebHome" replace />} />
              <Route element={<PublicLayout />}>
                <Route path="/WebHome" element={<HomePage />} />
                <Route path="/web/peliculas" element={<MoviesPage />} />
                <Route path="/web/pelicula/:id" element={<MovieDetailsPage />} />
                <Route path="/web/cines" element={<CinemasPage />} />
                <Route path="/web/cine/:id" element={<CinemaDetailsPage />} />
                <Route path="/web/login" element={<AuthPage />} />
                <Route path="/web/compra" element={<BookingPage />} />
                <Route path="/web/cuenta" element={<AccountPage />} />
                <Route path="/web/comprobante/:id" element={<ReceiptPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
              <Route
                element={
                  <AdminGuard>
                    <AdminLayout />
                  </AdminGuard>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/movies/*" element={<MovieManagement />} />
                <Route path="/cinema/*" element={<CinemaManagement />} />
                <Route path="/scheduling/*" element={<Scheduling />} />
                <Route path="/tickets/*" element={<TicketOperations />} />
                <Route path="/payments/*" element={<Payments />} />
                <Route path="/users/*" element={<UsersAccess />} />
                <Route path="/reports/*" element={<Reports />} />
                <Route path="/settings/*" element={<Settings />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CinemaProvider>
      </PublicProvider>
    </ErrorBoundary>
  );
}
