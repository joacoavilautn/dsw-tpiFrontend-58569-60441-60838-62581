import { instance } from '../../../modules/shared/api/axiosInstance';

const getSpecialtiesOptions = async () => {
  const response = await instance.get('api/specialties/options');

  return response.data;
};

const getDoctorsOptions = async (specialtyId) => {
  const params = specialtyId ? { specialtyId } : {};
  const response = await instance.get('api/doctors/options', { params });

  return response.data;
};

const getDoctorSlots = async (doctorId) => {
  const response = await instance.get(`api/doctors/${doctorId}/slots`);

  return response.data;
};

const bookAppointment = async ({
  doctorId,
  availabilitySlotId,
  dni,
  reason,
}) => {
  const response = await instance.post('api/appointments', {
    doctorId,
    availabilitySlotId,
    patient: { dni: Number(dni) },
    reason,
  });

  return response.data;
};

const getPatientAppointments = async (dni) => {
  const response = await instance.get(`api/appointments/patient?dni=${dni}`);

  return response.data;
};

const cancelAppointment = async (id) => {
  const response = await instance.delete(`api/appointments/${id}`);

  return response.data;
};

export {
  getSpecialtiesOptions,
  getDoctorsOptions,
  getDoctorSlots,
  bookAppointment,
  getPatientAppointments,
  cancelAppointment,
};
