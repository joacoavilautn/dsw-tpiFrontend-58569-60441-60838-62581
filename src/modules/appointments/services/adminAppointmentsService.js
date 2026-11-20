import { instance } from '../../shared/api/axiosInstance';

export const getSpecialtiesOptions = async () => {
  const response = await instance.get('api/specialties/options');

  return response.data || [];
};

export const getDoctorsOptions = async (specialtyId = '') => {
  const params = {};

  if (specialtyId && specialtyId !== 'Todas') {
    params.specialtyId = specialtyId;
  }

  const response = await instance.get('api/doctors/options', { params });

  return response.data || [];
};

export const searchAppointments = async ({
  dni,
  specialityId,
  doctorId,
  date,
  pageNumber = 1,
  pageSize = 10,
} = {}) => {
  const params = {
    pageNumber,
    pageSize,
  };

  if (dni && String(dni).trim() !== '') {
    params.dni = String(dni).trim();
  }

  if (specialityId && specialityId !== 'Todas') {
    params.specialityId = specialityId;
  }

  if (doctorId && doctorId !== 'Todos') {
    params.doctorId = doctorId;
  }

  if (date && String(date).trim() !== '') {
    params.date = String(date).trim();
  }

  const response = await instance.get('api/appointments/search', { params });

  return {
    data: response.data.data || [],
    total: response.data.total || 0,
    pageIndex: response.data.pageIndex || 1,
    pageSize: response.data.pageSize || 10,
  };
};
