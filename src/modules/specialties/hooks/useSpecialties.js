import { useState, useEffect, useCallback } from 'react';
import {
  getSpecialties,
  createSpecialty,
  deleteSpecialty,
} from '../services/specialtiesService';

export const useSpecialties = () => {
  const [specialties, setSpecialties] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadSpecialties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const trimmed = searchTerm.trim();
      const queryName = trimmed.length >= 3 ? trimmed : '';
      const response = await getSpecialties({
        pageIndex,
        pageSize,
        name: queryName,
      });

      let items = response.data;
      let totalItems = response.total;

      if (trimmed.length > 0 && trimmed.length < 3) {
        items = items.filter((item) =>
          item.name.toLowerCase().includes(trimmed.toLowerCase())
        );
        totalItems = items.length;
      }

      setSpecialties(items);
      setTotal(totalItems);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Ocurrió un error al cargar las especialidades.'
      );
    } finally {
      setLoading(false);
    }
  }, [pageIndex, pageSize, searchTerm]);

  useEffect(() => {
    loadSpecialties();
  }, [loadSpecialties]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPageIndex(0);
  };

  const handleCreateSpecialty = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      await createSpecialty(formData);
      await loadSpecialties();

      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Ocurrió un error al crear la especialidad.';

      setError(message);

      return {
        success: false,
        error: message,
        status: err.response?.status,
      };
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSpecialty = async (id) => {
    setLoading(true);
    setError(null);

    try {
      await deleteSpecialty(id);
      await loadSpecialties();

      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Ocurrió un error al eliminar la especialidad.';

      setError(message);

      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return {
    specialties,
    total,
    pageIndex,
    pageSize,
    searchTerm,
    loading,
    error,
    setPageIndex,
    setSearchTerm: handleSearchChange,
    handleCreateSpecialty,
    handleDeleteSpecialty,
    refreshSpecialties: loadSpecialties,
  };
};

export default useSpecialties;
