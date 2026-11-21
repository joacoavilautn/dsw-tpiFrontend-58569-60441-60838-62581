import { useState, useEffect, useCallback } from 'react';
import useAuth from '../../auth/hooks/useAuth';
import {
  getPatientAppointments,
  cancelAppointment,
} from '../services/patientAppointmentsService';

const usePatientAppointments = () => {
  const { user } = useAuth();

  const dni = user?.dni;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAppointments = useCallback(() => {
    if (!dni) {
      return;
    }

    setLoading(true);
    setError('');

    getPatientAppointments(dni)
      .then((data) => {
        setAppointments(data);
      })
      .catch(() => {
        setError('No se pudieron cargar los turnos.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dni]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCancelAppointment = async (id) => {
    try {
      await cancelAppointment(id);
      fetchAppointments();
    } catch {
      setError('No se pudo cancelar el turno. Intente nuevamente.');
    }
  };

  return {
    appointments,
    loading,
    error,
    handleCancelAppointment,
  };
};

export default usePatientAppointments;
