import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex flex-col items-center justify-center gap-4 text-center p-4">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-xl font-semibold text-light-text dark:text-dark-text">Page not found</p>
      <p className="text-sm text-light-muted dark:text-dark-muted">The page you're looking for doesn't exist.</p>
      <Link to={ROUTES.HOME} className="btn-primary w-auto px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold text-sm transition-colors">
        Go home
      </Link>
    </div>
  );
}
