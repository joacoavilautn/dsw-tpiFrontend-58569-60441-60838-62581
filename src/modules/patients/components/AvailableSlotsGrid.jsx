import Card from '../../shared/components/Card';
import { formatDate } from '../../shared/helpers/formatDate';

function AvailableSlotsGrid({
  slotsByDay,
  selectedSlotId,
  loading,
  onSelectSlot,
}) {
  const sortedDays = Object.keys(slotsByDay).sort();

  return (
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

      {loading && (
        <p className="text-xs text-med-text-muted text-center py-8">
          Cargando horarios...
        </p>
      )}

      {!loading && sortedDays.length === 0 && (
        <p className="text-xs text-med-text-muted text-center py-8">
          No hay turnos disponibles para este médico.
        </p>
      )}

      {/* VISTA DESKTOP: Grid semanal (visible en sm+) */}
      {!loading && sortedDays.length > 0 && (
        <div className="hidden sm:grid sm:grid-cols-5 gap-3 pt-5">
          {sortedDays.map((dateKey) => {
            const daySlots = slotsByDay[dateKey] || [];

            return (
              <div key={dateKey} className="flex flex-col items-center gap-3">
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
                        onClick={() => onSelectSlot(slot)}
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
      {!loading && sortedDays.length > 0 && (
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
                        onClick={() => onSelectSlot(slot)}
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
  );
}

export default AvailableSlotsGrid;
