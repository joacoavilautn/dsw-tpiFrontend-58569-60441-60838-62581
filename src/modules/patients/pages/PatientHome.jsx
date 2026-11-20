import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import usePatientBooking from '../hooks/usePatientBooking';

function PatientHome() {
  const navigate = useNavigate();

  const {
    specialties,
    doctors,
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
  } = usePatientBooking();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { reason: '' } });

  const onConfirm = async (formData) => {
    await confirmBooking({ reason: formData.reason });
  };

  const handleReserveAnother = () => {
    resetBooking();
    reset();
  };

  const sortedDays = Object.keys(slotsByDay).sort();

  const formatDate = (dateStr) => {
    if (!dateStr) {
      return '';
    }

    const cleanDate = dateStr.split('T')[0];
    const [year, month, day] = cleanDate.split('-');

    return `${day}/${month}/${year}`;
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* 1. Card Superior: Selector de Especialidad y Doctor */}
      <Card className="p-6 sm:p-7">
        <div className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-primary-900">
            Reservar Turno Médico
          </h1>
          <p className="text-xs sm:text-sm text-med-text-sub mt-1">
            Seleccione la especialidad y el profesional para continuar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Especialidad */}
          <div className="md:col-span-5 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-med-text-sub">
              Seleccionar Especialidad
            </label>
            <div className="relative">
              <select
                value={selectedSpecialtyId}
                onChange={(e) => setSelectedSpecialtyId(e.target.value)}
                disabled={loadingSpecialties}
                className="w-full appearance-none px-3.5 py-2.5 text-sm bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600 pr-10 cursor-pointer disabled:opacity-60"
              >
                <option value="">
                  {loadingSpecialties
                    ? 'Cargando...'
                    : '— Todas las especialidades —'}
                </option>
                {specialties.map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.name}
                  </option>
                ))}
              </select>
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-med-text-muted">
                ▼
              </span>
            </div>
          </div>

          {/* Doctor */}
          <div className="md:col-span-4 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-med-text-sub">
              Seleccionar Doctor
            </label>
            <div className="relative">
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                disabled={loadingDoctors}
                className="w-full appearance-none px-3.5 py-2.5 text-sm bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600 pr-10 cursor-pointer disabled:opacity-60"
              >
                <option value="">
                  {loadingDoctors ? 'Cargando...' : '— Seleccione un médico —'}
                </option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-med-text-muted">
                ▼
              </span>
            </div>
          </div>

          {/* Matricula */}
          <div className="md:col-span-3 flex flex-col justify-end">
            {selectedDoctor && (
              <span className="text-xs text-med-text-muted text-center">
                Mat. {selectedDoctor.licenseNumber}
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
            {error}
          </div>
        )}
      </Card>

      {/* 2. Card del Médico Seleccionado */}
      {selectedDoctor && (
        <Card className="p-5 sm:p-6 flex items-center gap-4 border-med-border">
          <div className="relative shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-med-primary-100 flex items-center justify-center text-3xl border border-med-primary-200">
              👨‍⚕️
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <div className="overflow-hidden">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-med-primary-900">
                {selectedDoctor.name}
              </h2>
              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-med-primary-100 text-med-primary-700">
                Verificado
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-med-primary-700 mt-0.5">
              {selectedDoctor.specialtyName}
            </p>
            <p className="text-xs text-med-text-muted mt-0.5">
              Mat. {selectedDoctor.licenseNumber}
            </p>
          </div>
        </Card>
      )}

      {/* 3. Selector Semanal de Disponibilidad */}
      {selectedDoctorId && (
        <Card className="p-5 sm:p-6 border-med-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-med-border-subtle">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm sm:text-base text-med-primary-900">
                Turnos disponibles
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-med-text-sub">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-med-primary-900" />
                Disponible
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Seleccionado
              </span>
            </div>
          </div>

          {loadingSlots && (
            <p className="text-xs text-med-text-muted text-center py-8">
              Cargando horarios...
            </p>
          )}

          {!loadingSlots && sortedDays.length === 0 && (
            <p className="text-xs text-med-text-muted text-center py-8">
              No hay turnos disponibles para este médico.
            </p>
          )}

          {/* VISTA DESKTOP: Grid semanal (visible en sm+) */}
          {!loadingSlots && sortedDays.length > 0 && (
            <div className="hidden sm:grid sm:grid-cols-5 gap-3 pt-5">
              {sortedDays.map((dateKey) => {
                const daySlots = slotsByDay[dateKey] || [];

                return (
                  <div
                    key={dateKey}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="text-center">
                      <span className="text-[11px] font-bold text-med-text-sub uppercase">
                        {formatDate(dateKey)}
                      </span>
                    </div>

                    <div className="w-full flex flex-col gap-2">
                      {daySlots.map((slot) => {
                        const isSelected = selectedSlotId === slot.id;

                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => handleSelectSlot(slot)}
                            className={`w-full py-2 px-3 text-xs font-semibold rounded-lg border transition-all text-center ${
                              isSelected
                                ? 'bg-emerald-400 text-white border-emerald-400 shadow-sm'
                                : 'bg-white border-med-border text-med-primary-900 hover:border-med-primary-600 hover:bg-med-primary-50/50'
                            }`}
                          >
                            {slot.startTime}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VISTA MOBILE: bloques de horarios (visible en mobile) */}
          {!loadingSlots && sortedDays.length > 0 && (
            <div className="block sm:hidden pt-4 space-y-4">
              {sortedDays.map((dateKey) => {
                const daySlots = slotsByDay[dateKey] || [];

                return (
                  <div key={dateKey}>
                    <span className="block text-xs font-bold text-med-text-sub mb-2">
                      {formatDate(dateKey)}
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {daySlots.map((slot) => {
                        const isSelected = selectedSlotId === slot.id;

                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => handleSelectSlot(slot)}
                            className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all ${
                              isSelected
                                ? 'border-2 border-med-primary-900 bg-white text-med-primary-900 font-bold shadow-xs'
                                : 'bg-white border-med-border text-med-text-main hover:bg-gray-50'
                            }`}
                          >
                            {slot.startTime}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      {/* 4. Banner de Resumen + Formulario de Motivo + Confirmación */}
      {selectedSlot && selectedDoctor && (
        <form onSubmit={handleSubmit(onConfirm)}>
          <div className="bg-med-primary-50 border border-med-primary-200/60 rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
            <div className="border-l-4 border-med-primary-900 pl-3.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-med-text-sub">
                Resumen de Selección
              </span>
              <p className="text-base sm:text-lg font-bold text-med-primary-900 mt-0.5 flex items-center gap-2">
                <span>📅</span>
                <span>
                  {formatDate(selectedSlot.slotDate)}, {selectedSlot.startTime}{' '}
                  hs
                </span>
              </p>
              <p className="text-xs text-med-text-sub mt-0.5">
                {selectedDoctor.name} • {selectedDoctor.specialtyName} •
                Duración: 30 min
              </p>
            </div>

            {/* Campo Motivo de Consulta */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-med-text-sub">
                Motivo de la consulta <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Describa brevemente el motivo de su consulta..."
                className={`w-full border rounded-lg px-3.5 py-2.5 text-sm bg-white text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-2 focus:ring-med-primary-600 resize-none ${
                  errors.reason
                    ? 'border-red-400 bg-red-50/20'
                    : 'border-med-border'
                }`}
                {...register('reason', {
                  required: 'El motivo de la consulta es obligatorio.',
                  minLength: {
                    value: 5,
                    message: 'El motivo debe tener al menos 5 caracteres.',
                  },
                  maxLength: {
                    value: 200,
                    message: 'El motivo no puede superar los 200 caracteres.',
                  },
                })}
              />
              {errors.reason && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.reason.message}
                </p>
              )}
            </div>

            {bookingError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                {bookingError}
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={bookingLoading}
                className="flex items-center justify-center gap-2 bg-med-primary-900 hover:bg-med-primary-800 text-white font-medium py-3 px-6 rounded-xl shadow-md text-sm shrink-0 disabled:opacity-60"
              >
                <span>
                  {bookingLoading ? 'Confirmando...' : 'Confirmar Turno'}
                </span>
                <svg
                  className="w-5 h-5 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Modal de Confirmación Exitosa */}
      {confirmedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✓
            </div>
            <h3 className="text-xl font-bold text-med-primary-900">
              ¡Turno Confirmado con Éxito!
            </h3>
            <p className="text-xs text-med-text-sub mt-2 leading-relaxed">
              Tu turno ha sido reservado para el{' '}
              <strong className="text-med-text-main">
                {formatDate(selectedSlot?.slotDate)} a las{' '}
                {selectedSlot?.startTime} hs
              </strong>
              .
            </p>

            <div className="mt-5 p-3.5 bg-med-primary-50 border border-med-primary-200/60 rounded-xl text-xs text-med-primary-900 text-left space-y-1">
              <p>
                <strong>Médico:</strong>{' '}
                {confirmedAppointment?.doctor?.name || selectedDoctor?.name}
              </p>
              <p>
                <strong>Especialidad:</strong>{' '}
                {confirmedAppointment?.doctor?.specialty?.name ||
                  selectedDoctor?.specialtyName}
              </p>
              <p>
                <strong>Motivo:</strong> {confirmedAppointment?.reason}
              </p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                className="w-full text-xs py-2.5"
                onClick={() => navigate('/appointments')}
              >
                Ver Mis Turnos
              </Button>
              <Button
                variant="secondary"
                className="w-full text-xs py-2.5"
                onClick={handleReserveAnother}
              >
                Reservar Otro
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientHome;
