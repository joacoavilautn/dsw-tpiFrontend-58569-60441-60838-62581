import { instance } from '../../shared/api/axiosInstance';

// pageIndex usa base 0, igual que el backend.
export const getDoctors = async ({
  pageIndex = 0,
  pageSize = 10,
  name = '',
}) => {
  const params = { pageIndex, pageSize };

  if (name) {
    params.name = name;
  }

  const response = await instance.get('api/doctors', { params });

  return {
    data: response.data?.data || [],
    total: response.data?.total || 0,
  };
};

export const getSpecialtiesOptions = async () => {
  const response = await instance.get('api/specialties/options');

  return Array.isArray(response.data)
    ? response.data
    : response.data?.data || [];
};

export const createDoctor = async ({ name, licenseNumber, specialtyId }) => {
  const response = await instance.post('api/doctors', {
    name,
    licenseNumber,
    specialtyId,
  });

  return response.data;
};

export const deleteDoctor = async (id) => {
  await instance.delete(`api/doctors/${id}`);
};
