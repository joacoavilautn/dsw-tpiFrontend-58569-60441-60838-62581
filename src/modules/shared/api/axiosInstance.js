import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (config) => {
    return config;
  },
  (error) => {
    const status = error.response?.status || error.status;

    if (status === 401) {
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      const isLoginPage =
        window.location.pathname === '/login' ||
        window.location.pathname === '/admin/login';

      localStorage.clear();

      if (!isLoginPage) {
        window.location.href = isAdminRoute ? '/admin/login' : '/login';
      }
    }

    return Promise.reject(error);
  }
);

export { instance };
