import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import usePatientAppointments from '../hooks/usePatientAppointments';

const STATUS_LABEL = {
  BOOKED: 'Confirmado',
};

function AppointmentsPage() {
  const navigate = useNavigate();

  const { appointments, loading, error, handleCancelAppointment } =
    usePatientAppointments();

  const formatDate = (dateStr) => {
    if (!dateStr) {
      return '';
    }

    const [year, month, day] = dateStr.split('-');

    return `${day}/${month}/${year}`;
  };

  const onCancelClick = (id) => {
    const confirmed = window.confirm(
      '¿Está seguro que desea cancelar este turno?'
    );

    if (confirmed) {
      handleCancelAppointment(id);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Mis Turnos Médicos
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Consulta y gestiona las citas médicas programadas.
          </p>
        </div>
        <Button onClick={() => navigate('/')}>+ Solicitar Nuevo Turno</Button>
      </div>

      {loading && (
        <p className="text-sm text-med-text-muted text-center py-8">
          Cargando turnos...
        </p>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && appointments.length === 0 && (
        <div className="p-8 bg-gray-50 border border-med-border rounded-xl text-center">
          <p className="text-sm text-med-text-muted">
            No tenés turnos activos. ¡Reservá uno nuevo!
          </p>
        </div>
      )}

      {!loading && appointments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {appointments.map((appt) => {
            const statusLabel = STATUS_LABEL[appt.status] || appt.status;
            const isConfirmed = appt.status === 'BOOKED';

            return (
              <Card
                key={appt.appointmentsId}
                className="flex flex-col justify-between gap-4 p-6"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-med-primary-100 text-med-primary-700">
                      {appt.doctor?.specialty?.name || 'Especialidad'}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        isConfirmed
                          ? 'bg-med-active-bg text-med-active-text'
                          : 'bg-med-leave-bg text-med-leave-text'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {statusLabel}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-med-primary-900">
                    {appt.doctor?.name || 'Médico'}
                  </h3>
                  <p className="text-sm text-med-text-sub mt-2">
                    Fecha:{' '}
                    <strong className="text-med-text-main font-semibold">
                      {formatDate(appt.slotDate)}
                    </strong>{' '}
                    a las{' '}
                    <strong className="text-med-text-main font-semibold">
                      {appt.startTime} hs
                    </strong>
                  </p>
                  {appt.reason && (
                    <p className="text-xs text-med-text-muted mt-1">
                      Motivo: {appt.reason}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 pt-3 border-t border-med-border">
                  <Button
                    variant="outline"
                    className="w-full text-xs"
                    onClick={() => onCancelClick(appt.appointmentsId)}
                  >
                    Cancelar Turno
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AppointmentsPage;
