import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from './features/public/components/PublicLayout';
import HomePage from './features/public/pages/HomePage';
import NotFoundPage from './features/public/pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Navigate to="/WebHome" replace />} />
          <Route path="/web" element={<Navigate to="/WebHome" replace />} />
          <Route path="/WebHome" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
