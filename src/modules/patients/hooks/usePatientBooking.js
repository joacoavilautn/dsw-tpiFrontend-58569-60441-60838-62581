import { useState, useEffect } from 'react';
import useAuth from '../../auth/hooks/useAuth';
import {
  getSpecialtiesOptions,
  getDoctorsOptions,
  getDoctorSlots,
  bookAppointment,
} from '../services/patientAppointmentsService';

const usePatientBooking = () => {
  const { user } = useAuth();

  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [slotsByDay, setSlotsByDay] = useState({});
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSpecialties, setLoadingSpecialties] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);
  const [slotsReloadKey, setSlotsReloadKey] = useState(0);

  useEffect(() => {
    setLoadingSpecialties(true);
    setError('');

    getSpecialtiesOptions()
      .then((data) => {
        setSpecialties(data);
      })
      .catch(() => {
        setError('No se pudieron cargar las especialidades.');
      })
      .finally(() => {
        setLoadingSpecialties(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedSpecialtyId && selectedSpecialtyId !== '') {
      return;
    }

    setLoadingDoctors(true);
    setError('');
    setSelectedDoctorId('');
    setSlots([]);
    setSlotsByDay({});
    setSelectedSlotId(null);
    setSelectedSlot(null);

    getDoctorsOptions(selectedSpecialtyId)
      .then((data) => {
        setDoctors(data);
      })
      .catch(() => {
        setError('No se pudieron cargar los médicos.');
      })
      .finally(() => {
        setLoadingDoctors(false);
      });
  }, [selectedSpecialtyId]);

  useEffect(() => {
    if (!selectedDoctorId) {
      setSlots([]);
      setSlotsByDay({});
      setSelectedSlotId(null);
      setSelectedSlot(null);

      return;
    }

    setLoadingSlots(true);
    setError('');
    setSelectedSlotId(null);
    setSelectedSlot(null);

    getDoctorSlots(selectedDoctorId)
      .then((data) => {
        const available = data.filter((s) => s.status === 'AVAILABLE');

        setSlots(available);

        const grouped = {};

        available.forEach((slot) => {
          const key = slot.slotDate
            ? slot.slotDate.split('T')[0]
            : slot.slotDate;

          if (!grouped[key]) {
            grouped[key] = [];
          }

          grouped[key].push(slot);
        });

        setSlotsByDay(grouped);
      })
      .catch(() => {
        setError('No se pudieron cargar los turnos disponibles.');
      })
      .finally(() => {
        setLoadingSlots(false);
      });
  }, [selectedDoctorId, slotsReloadKey]);

  const handleSelectSlot = (slot) => {
    setSelectedSlotId(slot.id);
    setSelectedSlot(slot);
  };

  const confirmBooking = async ({ reason }) => {
    const dni = user?.dni;

    if (!selectedDoctorId || !selectedSlotId || !dni) {
      setBookingError('Faltan datos para confirmar el turno.');

      return;
    }

    setBookingLoading(true);
    setBookingError('');

    try {
      const result = await bookAppointment({
        doctorId: selectedDoctorId,
        availabilitySlotId: selectedSlotId,
        dni,
        reason,
      });

      setConfirmedAppointment(result);
      setSlotsReloadKey((k) => k + 1);
    } catch (err) {
      const status = err?.response?.status;
      const code = err?.response?.data?.errorCode || err?.response?.data?.code;

      if (
        status === 409 &&
        (code === 'APPOINTMENT_CONFLICT' || code === 'SLOT_NOT_AVAILABLE')
      ) {
        setBookingError(
          'Este turno ya fue ocupado por otro paciente. Por favor, seleccione otro horario.'
        );
      } else {
        setBookingError(
          err?.response?.data?.message ||
            'No se pudo confirmar el turno. Intente nuevamente.'
        );
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const resetBooking = () => {
    setConfirmedAppointment(null);
    setBookingError('');
    setSelectedSlotId(null);
    setSelectedSlot(null);
  };

  const selectedDoctor =
    doctors.find((d) => String(d.id) === String(selectedDoctorId)) || null;

  return {
    specialties,
    doctors,
    slots,
    slotsByDay,
    selectedSpecialtyId,
    setSelectedSpecialtyId,
    selectedDoctorId,
    setSelectedDoctorId,
    selectedDoctor,
    selectedSlotId,
    selectedSlot,
    handleSelectSlot,
    loadingSpecialties,
    loadingDoctors,
    loadingSlots,
    bookingLoading,
    error,
    bookingError,
    confirmedAppointment,
    confirmBooking,
    resetBooking,
  };
};

export default usePatientBooking;
