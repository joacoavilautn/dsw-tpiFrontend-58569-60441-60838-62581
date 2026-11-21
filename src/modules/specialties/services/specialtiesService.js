import { instance } from '../../shared/api/axiosInstance';

export const getSpecialties = async ({
  pageIndex = 1,
  pageSize = 10,
  name = '',
} = {}) => {
  const params = {
    pageIndex,
    pageSize,
  };
  const trimmedName = name.trim();

  if (trimmedName.length >= 3) {
    params.name = trimmedName;
  }

  const response = await instance.get('api/specialties', { params });

  return {
    data: response.data.data || [],
    total: response.data.total || 0,
  };
};

export const createSpecialty = async ({ name, description }) => {
  const response = await instance.post('api/specialties', {
    name,
    description,
  });

  return response.data;
};

export const deleteSpecialty = async (id) => {
  const response = await instance.delete(`api/specialties/${id}`);

  return response.data;
};
