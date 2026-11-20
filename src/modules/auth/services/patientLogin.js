import { instance } from '../../shared/api/axiosInstance';

export const loginPatient = async (email, dni) => {
  try {
    const response = await instance.post('api/auth/patient/login', {
      email,
      dni: Number(dni), // El backend de C# espera DNI como número long
    });

    // El backend devuelve: { token: "...", role: "PACIENTE" }
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error.response?.data?.message || 'Error al iniciar sesión como paciente',
    };
  }
};