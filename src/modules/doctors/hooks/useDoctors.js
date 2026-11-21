import { useCallback, useEffect, useState } from 'react';
import {
  createDoctor,
  deleteDoctor,
  getDoctors,
  getSpecialtiesOptions,
} from '../services/doctorsService';

const PAGE_SIZE = 10;
const MIN_SEARCH_LENGTH = 3;

const getBackendMessage = (err, fallback) => {
  const data = err.response?.data;

  if (JSON.stringify(data || '').includes('DOCTOR_ALREADY_EXISTS')) {
    return 'Ya existe un médico con esa matrícula';
  }

  return data?.message || data?.title || fallback;
};

function useDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [total, setTotal] = useState(0);
  const [specialties, setSpecialties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const trimmedSearch = searchTerm.trim();
  const isShortSearch =
    trimmedSearch.length > 0 && trimmedSearch.length < MIN_SEARCH_LENGTH;
  const effectiveSearch =
    trimmedSearch.length >= MIN_SEARCH_LENGTH ? trimmedSearch : '';

  useEffect(() => {
    let cancelled = false;

    const fetchDoctors = async () => {
      setLoading(true);
      setError('');

      try {
        const result = await getDoctors({
          pageIndex,
          pageSize: PAGE_SIZE,
          name: effectiveSearch,
        });

        if (!cancelled) {
          setDoctors(result.data);
          setTotal(result.total);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            getBackendMessage(err, 'No se pudo cargar la lista de médicos')
          );
          setDoctors([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(fetchDoctors, effectiveSearch ? 300 : 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [pageIndex, effectiveSearch, reloadKey]);

  useEffect(() => {
    let cancelled = false;

    getSpecialtiesOptions()
      .then((options) => {
        if (!cancelled) {
          setSpecialties(options);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSpecialties([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPageIndex(1);
  };

  const addDoctor = async (values) => {
    try {
      await createDoctor(values);
      setPageIndex(1);
      reload();

      return { error: null };
    } catch (err) {
      return {
        error: getBackendMessage(err, 'No se pudo registrar el médico'),
      };
    }
  };

  const removeDoctor = async (id) => {
    try {
      await deleteDoctor(id);

      if (doctors.length === 1 && pageIndex > 1) {
        setPageIndex(pageIndex - 1);
      }

      reload();

      return { error: null };
    } catch (err) {
      return { error: getBackendMessage(err, 'No se pudo eliminar el médico') };
    }
  };

  return {
    doctors,
    total,
    specialties,
    searchTerm,
    isShortSearch,
    pageSize: PAGE_SIZE,
    pageIndex,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    loading,
    error,
    setPageIndex,
    handleSearchChange,
    addDoctor,
    removeDoctor,
  };
}

export default useDoctors;
