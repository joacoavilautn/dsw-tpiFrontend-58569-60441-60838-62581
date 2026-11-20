import { instance } from '../../shared/api/axiosInstance';

export const getDoctorsOptions = async () => {
  const response = await instance.get('api/doctors/options');

  return Array.isArray(response.data)
    ? response.data
    : response.data?.data || [];
};

export const getDoctorAvailabilities = async (doctorId) => {
  const response = await instance.get(`api/doctors/${doctorId}/availabilities`);

  return Array.isArray(response.data) ? response.data : [];
};

export const saveDoctorAvailability = async ({
  doctorId,
  days,
  hasExistingAvailability,
}) => {
  const method = hasExistingAvailability ? 'put' : 'post';
  const response = await instance[method]('api/availabilities', {
    doctorId,
    days,
  });

  return response.data;
};
