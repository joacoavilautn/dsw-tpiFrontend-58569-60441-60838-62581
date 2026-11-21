import Button from '../../shared/components/Button';
import Modal from '../../shared/components/Modal';
import { formatDate } from '../../shared/helpers/formatDate';

function BookingConfirmationModal({
  appointment,
  doctor,
  slot,
  onViewAppointments,
  onReserveAnother,
}) {
  if (!appointment) {
    return null;
  }

  return (
    <Modal isOpen maxWidth="max-w-md" className="p-6 sm:p-8 text-center">
      <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
        ✓
      </div>
      <h3 className="text-xl font-bold text-med-primary-900">
        ¡Turno Confirmado con Éxito!
      </h3>
      <p className="text-xs text-med-text-sub mt-2 leading-relaxed">
        Tu turno ha sido reservado para el{' '}
        <strong className="text-med-text-main">
          {formatDate(slot?.slotDate)} a las {slot?.startTime} hs
        </strong>
        .
      </p>

      <div className="mt-5 p-3.5 bg-med-primary-50 border border-med-primary-200/60 rounded-xl text-xs text-med-primary-900 text-left space-y-1">
        <p>
          <strong>Médico:</strong> {appointment?.doctor?.name || doctor?.name}
        </p>
        <p>
          <strong>Especialidad:</strong>{' '}
          {appointment?.doctor?.specialty?.name || doctor?.specialtyName}
        </p>
        <p>
          <strong>Motivo:</strong> {appointment?.reason}
        </p>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button className="w-full text-xs py-2.5" onClick={onViewAppointments}>
          Ver Mis Turnos
        </Button>
        <Button
          variant="secondary"
          className="w-full text-xs py-2.5"
          onClick={onReserveAnother}
        >
          Reservar Otro
        </Button>
      </div>
    </Modal>
  );
}

export default BookingConfirmationModal;
