import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps any route that requires authentication.
 * Unauthenticated users are redirected to /login.
 * Shows nothing while auth state is loading.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null; // wait for Supabase session check

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
