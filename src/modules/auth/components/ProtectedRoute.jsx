import { Navigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';

function ProtectedRoute({ children, redirectTo = '/login', allowedRole }) {
  const { isAuthenticated } = useAuth();
  const currentRole = localStorage.getItem('role');

  // Si no está autenticado, lo manda al login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si la ruta exige un rol específico (ej: ADMINISTRADOR) y el usuario no lo tiene
  if (allowedRole && currentRole !== allowedRole) {
    // Si es paciente y quiso entrar al admin, lo mandamos a su home '/'
    return <Navigate to={currentRole === 'PACIENTE' ? '/' : '/admin/login'} replace />;
  }

  return children;
}

export default ProtectedRoute;