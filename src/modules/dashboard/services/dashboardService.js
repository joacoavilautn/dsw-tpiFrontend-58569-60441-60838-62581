import { instance } from '../../shared/api/axiosInstance';

export const getDoctorsCount = async () => {
  const response = await instance.get('api/doctors/count');

  return response.data;
};

export const getSpecialtiesCount = async () => {
  const response = await instance.get('api/specialties/count');

  return response.data;
};

export const getTodayAppointmentsCount = async () => {
  const response = await instance.get('api/appointments/today/count');

  return response.data;
};

export const getPreviewDoctors = async ({
  pageIndex = 1,
  pageSize = 5,
  name = '',
}) => {
  const trimmedName = name.trim();
  const params = {
    pageIndex,
    pageSize,
  };

  if (trimmedName.length >= 3) {
    params.name = trimmedName;
  }

  const response = await instance.get('api/doctors', { params });

  return {
    data: response.data?.data || [],
    total: response.data?.total || 0,
  };
};
