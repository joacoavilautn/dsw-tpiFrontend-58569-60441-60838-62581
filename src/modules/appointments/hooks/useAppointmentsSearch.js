import { useState, useEffect, useCallback } from 'react';
import {
  getSpecialtiesOptions,
  getDoctorsOptions,
  searchAppointments,
} from '../services/adminAppointmentsService';

export const useAppointmentsSearch = () => {
  const [appointments, setAppointments] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [patientQuery, setPatientQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('Todas');
  const [doctorFilter, setDoctorFilter] = useState('Todos');
  const [dateFilter, setDateFilter] = useState('');

  const [specialtiesOptions, setSpecialtiesOptions] = useState([]);
  const [doctorsOptions, setDoctorsOptions] = useState([]);

  useEffect(() => {
    const loadInitialOptions = async () => {
      try {
        const [specs, docs] = await Promise.all([
          getSpecialtiesOptions(),
          getDoctorsOptions(),
        ]);

        setSpecialtiesOptions(specs);
        setDoctorsOptions(docs);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Error al cargar las opciones de filtros.'
        );
      }
    };

    loadInitialOptions();
  }, []);

  useEffect(() => {
    const updateDoctors = async () => {
      try {
        const selectedSpecialty =
          specialtyFilter === 'Todas' ? '' : specialtyFilter;
        const docs = await getDoctorsOptions(selectedSpecialty);

        setDoctorsOptions(docs);
        setDoctorFilter('Todos');
      } catch {
        // error silencioso al refrescar doctores
      }
    };

    updateDoctors();
  }, [specialtyFilter]);

  const loadAppointments = useCallback(
    async (page = pageNumber) => {
      setLoading(true);
      setError(null);

      try {
        const response = await searchAppointments({
          dni: patientQuery,
          specialityId: specialtyFilter,
          doctorId: doctorFilter,
          date: dateFilter,
          pageNumber: page,
          pageSize,
        });

        setAppointments(response.data);
        setTotal(response.total);
      } catch (err) {
        setError(
          err.response?.data?.message || 'Error al buscar las citas médicas.'
        );
      } finally {
        setLoading(false);
      }
    },
    [
      doctorFilter,
      dateFilter,
      pageSize,
      pageNumber,
      patientQuery,
      specialtyFilter,
    ]
  );

  useEffect(() => {
    loadAppointments(pageNumber);
  }, [pageNumber, loadAppointments]);

  const applyFilters = () => {
    setPageNumber(1);
    loadAppointments(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1) {
      setPageNumber(newPage);
    }
  };

  const handleClearFilters = () => {
    setPatientQuery('');
    setSpecialtyFilter('Todas');
    setDoctorFilter('Todos');
    setDateFilter('');
    setPageNumber(1);
  };

  return {
    appointments,
    total,
    pageNumber,
    pageSize,
    loading,
    error,
    patientQuery,
    setPatientQuery,
    specialtyFilter,
    setSpecialtyFilter,
    doctorFilter,
    setDoctorFilter,
    dateFilter,
    setDateFilter,
    specialtiesOptions,
    doctorsOptions,
    applyFilters,
    handlePageChange,
    handleClearFilters,
    refreshAppointments: () => loadAppointments(pageNumber),
  };
};

export default useAppointmentsSearch;
