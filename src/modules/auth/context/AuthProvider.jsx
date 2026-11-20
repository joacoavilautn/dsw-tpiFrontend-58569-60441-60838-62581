import { createContext, useState } from 'react';
import { login } from '../services/login';
import { loginAdmin } from '../services/adminLogin';
import { loginPatient } from '../services/patientLogin';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');

    return Boolean(token);
  });
  const [role, setRole] = useState(() => localStorage.getItem('role') || null);
  const [user, setUser] = useState(() => ({
    email: localStorage.getItem('email') || null,
    dni: localStorage.getItem('dni') || null,
  }));

  const singout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setRole(null);
    setUser({ email: null, dni: null });
  };

  const setAuthSession = (authData) => {
    const token = typeof authData === 'object' ? authData.token : authData;
    const nextRole = typeof authData === 'object' ? authData.role : null;
    const email = typeof authData === 'object' ? authData.email : null;
    const dni =
      typeof authData === 'object' && authData.dni
        ? String(authData.dni)
        : null;

    localStorage.setItem('token', token);

    if (nextRole) {
      localStorage.setItem('role', nextRole);
      setRole(nextRole);
    } else {
      localStorage.removeItem('role');
      setRole(null);
    }

    if (email) {
      localStorage.setItem('email', email);
    } else {
      localStorage.removeItem('email');
    }

    if (dni) {
      localStorage.setItem('dni', dni);
    } else {
      localStorage.removeItem('dni');
    }

    setUser({ email, dni });
    setIsAuthenticated(true);
  };

  const singin = async (username, password) => {
    const { data, error } = await login(username, password);

    if (error) {
      return { error };
    }

    setAuthSession(data);

    return { error: null };
  };

  const singinAdmin = async (email, password) => {
    const { data, error } = await loginAdmin(email, password);

    if (error) {
      return { error };
    }

    setAuthSession({ ...data, email, dni: null });

    return { error: null };
  };

  const singinPatient = async (email, dni) => {
    const { data, error } = await loginPatient(email, dni);

    if (error) {
      return { error };
    }

    setAuthSession({ ...data, email, dni: String(dni) });

    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role,
        user,
        singin,
        singinAdmin,
        singinPatient,
        singout,
        setAuthSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
