import { useEffect, useState } from 'react';
import {
  getDoctorsCount,
  getPreviewDoctors,
  getSpecialtiesCount,
  getTodayAppointmentsCount,
} from '../services/dashboardService';

function useDashboardOverview() {
  const [counts, setCounts] = useState({
    activeDoctors: 0,
    addedThisMonth: 0,
    activeSpecialties: 0,
    todayAppointments: 0,
  });
  const [doctors, setDoctors] = useState([]);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [loading, setLoading] = useState(true);
  const [countsError, setCountsError] = useState('');
  const [doctorsError, setDoctorsError] = useState('');
  const pageSize = 5;

  const trimmedSearch = searchTerm.trim();
  const isShortSearch = trimmedSearch.length > 0 && trimmedSearch.length < 3;
  const effectiveSearch = trimmedSearch.length >= 3 ? trimmedSearch : '';

  useEffect(() => {
    let cancelled = false;

    const fetchCounts = async () => {
      try {
        const [doctorsRes, specialtiesRes, appointmentsRes] = await Promise.all(
          [
            getDoctorsCount(),
            getSpecialtiesCount(),
            getTodayAppointmentsCount(),
          ]
        );

        if (cancelled) {
          return;
        }

        setCounts({
          activeDoctors: doctorsRes?.total || 0,
          addedThisMonth: doctorsRes?.addedThisMonth || 0,
          activeSpecialties: specialtiesRes?.total || 0,
          todayAppointments: appointmentsRes?.total || 0,
        });
        setCountsError('');
      } catch (err) {
        if (!cancelled) {
          setCountsError(
            err.response?.data?.message ||
              'No se pudieron cargar las métricas del tablero'
          );
        }
      }
    };

    fetchCounts();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchDoctors = async () => {
      setLoading(true);
      setDoctorsError('');

      try {
        const result = await getPreviewDoctors({
          pageIndex,
          pageSize,
          name: effectiveSearch,
        });

        if (cancelled) {
          return;
        }

        setDoctors(result.data);
        setTotalDoctors(result.total);
      } catch (err) {
        if (!cancelled) {
          setDoctorsError(
            err.response?.data?.message ||
              'No se pudo cargar el directorio de profesionales'
          );
          setDoctors([]);
          setTotalDoctors(0);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    const delayMs = effectiveSearch ? 300 : 0;
    const timer = setTimeout(fetchDoctors, delayMs);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [pageIndex, effectiveSearch]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPageIndex(1);
  };

  const totalPages = Math.max(1, Math.ceil(totalDoctors / pageSize));
  const error = countsError || doctorsError;

  return {
    counts,
    doctors,
    totalDoctors,
    pageSize,
    pageIndex,
    totalPages,
    searchTerm,
    isShortSearch,
    loading,
    error,
    setPageIndex,
    handleSearchChange,
  };
}

export default useDashboardOverview;
