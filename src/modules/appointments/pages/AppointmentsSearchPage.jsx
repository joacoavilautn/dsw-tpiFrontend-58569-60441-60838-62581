import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import TablePagination from '../../shared/components/TablePagination';
import useAppointmentsSearch from '../hooks/useAppointmentsSearch';

function AppointmentsSearchPage() {
  const {
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
  } = useAppointmentsSearch();

  const totalPages = Math.ceil(total / pageSize) || 1;

  const activeSpecialtyName =
    specialtiesOptions.find((s) => s.id === specialtyFilter)?.name || '';

  const activeDoctorName =
    doctorsOptions.find((d) => d.id === doctorFilter)?.name || '';

  const hasActiveFilters =
    Boolean(patientQuery.trim()) ||
    specialtyFilter !== 'Todas' ||
    doctorFilter !== 'Todos' ||
    Boolean(dateFilter);

  const formatDate = (dateString) => {
    if (!dateString) {
      return '-';
    }

    try {
      const d = new Date(dateString);

      return d.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const renderStatusBadge = (status) => {
    const norm = (status || '').toUpperCase();

    if (norm === 'BOOKED' || norm === 'CONFIRMADO') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-med-active-bg text-med-active-text">
          <span className="w-1.5 h-1.5 rounded-full bg-med-active-text" />
          Confirmado
        </span>
      );
    }

    if (norm === 'ATTENDED' || norm === 'COMPLETADO') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          Completado
        </span>
      );
    }

    if (norm === 'CANCELLED' || norm === 'CANCELADO') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-med-danger-bg text-med-danger-text">
          <span className="w-1.5 h-1.5 rounded-full bg-med-danger-text" />
          Cancelado
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
        {status || 'Pendiente'}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Título de la página */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
          Búsqueda y Filtrado de Citas
        </h1>
        <p className="text-sm text-med-text-sub mt-1">
          Gestione y supervise el flujo de pacientes del departamento.
        </p>
      </div>

      {error && (
        <div className="p-4 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl">
          {error}
        </div>
      )}

      {/* Card Superior: Criterios de Búsqueda */}
      <Card className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-med-border-subtle">
          <h2 className="text-base font-bold text-med-primary-900">
            Criterios de Búsqueda
          </h2>
          {loading && (
            <span className="text-xs text-med-text-muted animate-pulse">
              Consultando turnos...
            </span>
          )}
        </div>

        {/* Inputs de Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-4 items-end">
          {/* Nombre o DNI */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-med-text-sub">
              Nombre o DNI del Paciente
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-med-text-muted">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <input
                type="text"
                value={patientQuery}
                onChange={(e) => setPatientQuery(e.target.value)}
                placeholder="Nombre o DNI..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-1 focus:ring-med-primary-600"
              />
            </div>
          </div>

          {/* Especialidad */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-med-text-sub">
              Especialidad
            </label>
            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            >
              <option value="Todas">Todas las Especialidades</option>
              {specialtiesOptions.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.name}
                </option>
              ))}
            </select>
          </div>

          {/* Doctor */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-med-text-sub">
              Doctor
            </label>
            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            >
              <option value="Todos">Todos los Doctores</option>
              {doctorsOptions.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-med-text-sub">
              Fecha
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            />
          </div>

          {/* Botón Aplicar Filtros */}
          <div>
            <Button
              onClick={applyFilters}
              className="w-full flex items-center justify-center gap-2 bg-med-primary-900 hover:bg-med-primary-800 text-white font-medium py-2 rounded-lg cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span>Aplicar Filtros</span>
            </Button>
          </div>
        </div>

        {/* Chips de Filtros Activos */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-med-border-subtle">
            {patientQuery.trim() && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sky-100/70 text-sky-800">
                Paciente / DNI: {patientQuery}
              </span>
            )}
            {specialtyFilter !== 'Todas' && activeSpecialtyName && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sky-100/70 text-sky-800">
                Especialidad: {activeSpecialtyName}
              </span>
            )}
            {doctorFilter !== 'Todos' && activeDoctorName && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sky-100/70 text-sky-800">
                Doctor: {activeDoctorName}
              </span>
            )}
            {dateFilter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                Fecha: {dateFilter}
              </span>
            )}
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs text-med-text-sub hover:text-red-600 underline ml-2 cursor-pointer"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </Card>

      {/* Card Inferior: Registros de Citas */}
      <Card className="p-0 overflow-hidden border-med-border">
        <div className="p-5 border-b border-med-border">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Citas
          </h2>
        </div>

        {/* Tabla de Citas */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
              <tr>
                <th className="px-6 py-3.5">Fecha</th>
                <th className="px-6 py-3.5">Departamento</th>
                <th className="px-6 py-3.5">Paciente</th>
                <th className="px-6 py-3.5 text-center">Estado</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-med-border-subtle">
              {appointments.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-med-text-muted"
                  >
                    {loading
                      ? 'Buscando citas...'
                      : 'No se encontraron citas con los filtros seleccionados.'}
                  </td>
                </tr>
              ) : (
                appointments.map((item) => {
                  const appointmentId =
                    item.appointmentsId || item.id || item.appointmentId;
                  const doctorName =
                    item.doctor?.name || item.doctorName || 'Médico Asignado';
                  const departmentName =
                    item.doctor?.specialty?.name ||
                    item.department ||
                    'General';
                  const patientName =
                    item.patient?.fullName ||
                    item.patientName ||
                    'Paciente Registrado';
                  const patientDni = item.patient?.dni || item.dni || '-';
                  const appointmentDate = item.slotDate || item.createdAt;
                  const appointmentTime = item.startTime || item.time || '';

                  return (
                    <tr
                      key={appointmentId}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      {/* Fecha y Hora */}
                      <td className="px-6 py-4">
                        <p className="font-bold text-med-primary-900 text-sm">
                          {formatDate(appointmentDate)}
                        </p>
                        {appointmentTime && (
                          <p className="text-xs text-med-text-muted mt-0.5">
                            {appointmentTime}
                          </p>
                        )}
                      </td>

                      {/* Departamento / Especialidad con Icono */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-med-primary-100 text-med-primary-700 flex items-center justify-center shrink-0">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.75"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-med-primary-900">
                              {departmentName}
                            </p>
                            <p className="text-xs text-med-text-muted">
                              {doctorName}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Paciente y DNI */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-med-text-main">
                          {patientName}
                        </p>
                        <p className="text-xs text-med-text-muted mt-0.5">
                          DNI: {patientDni}
                        </p>
                      </td>

                      {/* Estado */}
                      <td className="px-6 py-4 text-center">
                        {renderStatusBadge(
                          item.appointmentsStatus || item.status
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            alert(
                              `Cita: ${departmentName} con ${doctorName}\nPaciente: ${patientName} (DNI: ${patientDni})\nMotivo: ${item.reason || 'Consulta médica'}`
                            )
                          }
                          className="text-xs font-semibold text-med-primary-700 hover:text-med-primary-900 transition hover:underline cursor-pointer"
                        >
                          Ver Detalle
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Paginador inferior normalizado */}
        <TablePagination
          currentPage={pageNumber}
          totalPages={totalPages}
          totalItems={total}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      </Card>
    </div>
  );
}

export default AppointmentsSearchPage;
