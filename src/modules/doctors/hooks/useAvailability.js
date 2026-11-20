import { useEffect, useState } from 'react';
import {
  getDoctorAvailabilities,
  getDoctorsOptions,
  saveDoctorAvailability,
} from '../services/availabilityService';

export const WEEK_DAYS = [
  { value: 'LUNES', label: 'Lunes' },
  { value: 'MARTES', label: 'Martes' },
  { value: 'MIERCOLES', label: 'Miércoles' },
  { value: 'JUEVES', label: 'Jueves' },
  { value: 'VIERNES', label: 'Viernes' },
  { value: 'SABADO', label: 'Sábado' },
];

const DEFAULT_START = '08:00';
const DEFAULT_END = '12:00';

const buildEmptySchedule = () =>
  Object.fromEntries(
    WEEK_DAYS.map(({ value }) => [
      value,
      { active: false, startTime: DEFAULT_START, endTime: DEFAULT_END },
    ])
  );

const toInputTime = (time) => String(time || '').slice(0, 5);

const normalizeDay = (day) =>
  String(day || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, '')
    .toUpperCase();

const BACKEND_DAYS = [...WEEK_DAYS.map(({ value }) => value), 'DOMINGO'];

const buildScheduleFromBackend = (availabilities) => {
  const schedule = buildEmptySchedule();
  const preservedDays = [];
  const seen = new Set();
  let problem = '';

  availabilities.forEach(({ day, startTime, endTime }) => {
    const key = normalizeDay(day);
    const range = {
      startTime: toInputTime(startTime),
      endTime: toInputTime(endTime),
    };

    if (seen.has(key)) {
      problem = `El médico tiene más de un horario para ${key}. El formulario no puede representarlo y guardar haría perder datos.`;
    } else if (schedule[key]) {
      schedule[key] = { active: true, ...range };
    } else if (BACKEND_DAYS.includes(key)) {
      preservedDays.push({ day: key, ...range });
    } else {
      problem = `El backend devolvió un día desconocido ("${day}"). No se puede guardar sin perder datos.`;
    }

    seen.add(key);
  });

  return { schedule, preservedDays, problem };
};

const getErrorMessage = (err, fallback) =>
  err.response?.data?.message || err.response?.data?.title || fallback;

function useAvailability() {
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [schedule, setSchedule] = useState(buildEmptySchedule);
  const [hasExistingAvailability, setHasExistingAvailability] = useState(false);
  const [preservedDays, setPreservedDays] = useState([]);
  const [loadProblem, setLoadProblem] = useState('');
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    getDoctorsOptions()
      .then((options) => {
        if (!cancelled) {
          setDoctors(options);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            getErrorMessage(err, 'No se pudo cargar la lista de médicos')
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingDoctors(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setSchedule(buildEmptySchedule());
    setHasExistingAvailability(false);
    setPreservedDays([]);
    setLoadProblem('');

    if (!doctorId) {
      return undefined;
    }

    let cancelled = false;

    setLoadingSchedule(true);

    getDoctorAvailabilities(doctorId)
      .then((availabilities) => {
        if (!cancelled) {
          const loaded = buildScheduleFromBackend(availabilities);

          setSchedule(loaded.schedule);
          setPreservedDays(loaded.preservedDays);
          setLoadProblem(loaded.problem);
          setHasExistingAvailability(availabilities.length > 0);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            getErrorMessage(
              err,
              'No se pudieron cargar los horarios del médico'
            )
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingSchedule(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [doctorId, reloadKey]);

  const selectDoctor = (id) => {
    setDoctorId(id);
    setError('');
    setSuccess('');
  };

  const updateDay = (day, changes) => {
    setSchedule((current) => ({
      ...current,
      [day]: { ...current[day], ...changes },
    }));
    setError('');
    setSuccess('');
  };

  const validate = () => {
    if (!doctorId) {
      return 'Debe seleccionar un médico';
    }

    if (loadProblem) {
      return loadProblem;
    }

    const activeDays = WEEK_DAYS.filter(({ value }) => schedule[value].active);

    if (activeDays.length + preservedDays.length === 0) {
      return 'Debe activar al menos un día';
    }

    for (const { value, label } of activeDays) {
      const { startTime, endTime } = schedule[value];

      if (!startTime || !endTime) {
        return `${label}: complete la hora de entrada y de salida`;
      }

      if (startTime >= endTime) {
        return `${label}: la hora de entrada debe ser menor que la de salida`;
      }
    }

    return '';
  };

  const save = async (confirmReplace) => {
    if (saving) {
      return;
    }

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      setSuccess('');

      return;
    }

    if (hasExistingAvailability && !confirmReplace()) {
      return;
    }

    const days = [
      ...WEEK_DAYS.filter(({ value }) => schedule[value].active).map(
        ({ value }) => ({
          day: value,
          startTime: schedule[value].startTime,
          endTime: schedule[value].endTime,
        })
      ),
      ...preservedDays,
    ];

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await saveDoctorAvailability({
        doctorId,
        days,
        hasExistingAvailability,
      });
      setSuccess('Disponibilidad guardada correctamente');
      setReloadKey((key) => key + 1);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo guardar la disponibilidad'));
    } finally {
      setSaving(false);
    }
  };

  return {
    doctors,
    doctorId,
    schedule,
    hasExistingAvailability,
    preservedDays,
    loadProblem,
    loadingDoctors,
    loadingSchedule,
    saving,
    error,
    success,
    selectDoctor,
    updateDay,
    save,
  };
}

export default useAvailability;
