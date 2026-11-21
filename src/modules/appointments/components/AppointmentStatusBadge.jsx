const STATUS_CONFIG = {
  BOOKED: {
    label: 'Confirmado',
    badgeClass: 'bg-med-active-bg text-med-active-text',
    dotClass: 'bg-med-active-text',
  },
  CONFIRMADO: {
    label: 'Confirmado',
    badgeClass: 'bg-med-active-bg text-med-active-text',
    dotClass: 'bg-med-active-text',
  },
  ATTENDED: {
    label: 'Completado',
    badgeClass: 'bg-slate-100 text-slate-700',
    dotClass: 'bg-slate-500',
  },
  COMPLETADO: {
    label: 'Completado',
    badgeClass: 'bg-slate-100 text-slate-700',
    dotClass: 'bg-slate-500',
  },
  CANCELLED: {
    label: 'Cancelado',
    badgeClass: 'bg-med-danger-bg text-med-danger-text',
    dotClass: 'bg-med-danger-text',
  },
  CANCELADO: {
    label: 'Cancelado',
    badgeClass: 'bg-med-danger-bg text-med-danger-text',
    dotClass: 'bg-med-danger-text',
  },
};

function AppointmentStatusBadge({ status }) {
  const normalized = (status || '').toUpperCase();
  const config = STATUS_CONFIG[normalized];

  if (!config) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
        {status || 'Pendiente'}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.badgeClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      {config.label}
    </span>
  );
}

export default AppointmentStatusBadge;
