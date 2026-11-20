import { instance } from '../../shared/api/axiosInstance';

export const loginAdmin = async (email, password) => {
  try {
    const response = await instance.post('api/auth/admin/login', {
      email,
      password,
    });

    // El backend devuelve: { token: "...", role: "ADMINISTRADOR" }
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error.response?.data?.message ||
        'Error al iniciar sesión como administrador',
    };
  }
};
