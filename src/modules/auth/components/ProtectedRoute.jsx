import { Navigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';

function ProtectedRoute({
  children,
  redirectTo = '/login',
  allowedRole,
  allowedRoles,
}) {
  const { isAuthenticated, role } = useAuth();
  const requiredRoles = allowedRoles || (allowedRole ? [allowedRole] : []);

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
    const fallbackRoute =
      role === 'PACIENTE'
        ? '/'
        : role === 'ADMINISTRADOR'
          ? '/admin/home'
          : redirectTo;

    return <Navigate to={fallbackRoute} replace />;
  }

  return children;
}

export default ProtectedRoute;
