import Button from '../../shared/components/Button';
import useAvailability, { WEEK_DAYS } from '../hooks/useAvailability';

const timeInputClass =
  'border border-med-border rounded-lg px-2.5 py-1.5 text-sm bg-white text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600 disabled:bg-gray-100 disabled:text-med-text-muted';

const REPLACE_WARNING =
  'Este médico ya tiene horarios configurados. Guardar reemplazará los horarios del mes actual. ¿Desea continuar?';

function DoctorAvailabilityModal({ onClose }) {
  const {
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
  } = useAvailability();

  const handleSubmit = (event) => {
    event.preventDefault();
    save(() => window.confirm(REPLACE_WARNING));
  };

  const formDisabled = !doctorId || loadingSchedule || saving;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl max-h-[95vh] overflow-y-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-med-primary-900">
          Agregar Disponibilidad Horaria
        </h2>
        <p className="text-sm text-med-text-sub mt-1 mb-4">
          Configure los días y horarios de atención del médico.
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="availabilityDoctor"
              className="text-xs font-semibold text-med-text-main"
            >
              Médico
            </label>
            <select
              id="availabilityDoctor"
              value={doctorId}
              onChange={(e) => selectDoctor(e.target.value)}
              disabled={loadingDoctors || saving}
              className="w-full border border-med-border rounded-lg px-3.5 py-2.5 text-sm bg-white text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600"
            >
              <option value="">
                {loadingDoctors
                  ? 'Cargando médicos...'
                  : 'Seleccione un médico'}
              </option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>

          {doctorId && hasExistingAvailability && !loadingSchedule && (
            <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
              Este médico ya tiene horarios configurados. Al guardar se
              reemplazarán los horarios del mes actual.
            </p>
          )}

          {loadProblem && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {loadProblem}
            </p>
          )}
          {preservedDays.length > 0 && (
            <p className="text-xs text-med-text-sub bg-med-primary-50 rounded-lg px-3 py-2">
              Se conservarán sin cambios los horarios de:{' '}
              {preservedDays
                .map((d) => `${d.day} (${d.startTime} a ${d.endTime})`)
                .join(', ')}
              .
            </p>
          )}

          <div className="flex flex-col divide-y divide-med-border-subtle border border-med-border rounded-lg">
            {WEEK_DAYS.map(({ value, label }) => {
              const day = schedule[value];

              return (
                <div
                  key={value}
                  className="flex flex-wrap items-center gap-3 px-4 py-3"
                >
                  <span className="w-24 text-sm font-semibold text-med-primary-900">
                    {label}
                  </span>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={day.active}
                    aria-label={`${label} activo`}
                    disabled={formDisabled}
                    onClick={() => updateDay(value, { active: !day.active })}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition disabled:opacity-50 ${
                      day.active
                        ? 'bg-med-active-bg text-med-active-text'
                        : 'bg-gray-100 text-med-text-muted'
                    }`}
                  >
                    {day.active ? 'Activo' : 'Inactivo'}
                  </button>

                  <div className="flex items-center gap-2 ml-auto">
                    <input
                      type="time"
                      aria-label={`${label} hora de entrada`}
                      value={day.startTime}
                      disabled={formDisabled || !day.active}
                      onChange={(e) =>
                        updateDay(value, { startTime: e.target.value })
                      }
                      className={timeInputClass}
                    />
                    <span className="text-xs text-med-text-muted">a</span>
                    <input
                      type="time"
                      aria-label={`${label} hora de salida`}
                      value={day.endTime}
                      disabled={formDisabled || !day.active}
                      onChange={(e) =>
                        updateDay(value, { endTime: e.target.value })
                      }
                      className={timeInputClass}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {loadingSchedule && (
            <p className="text-xs text-med-text-muted">Cargando horarios...</p>
          )}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
              {success}
            </p>
          )}

          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={formDisabled}>
              {saving ? 'Guardando...' : 'Guardar Disponibilidad'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DoctorAvailabilityModal;
