import { useState } from 'react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import TablePagination from '../../shared/components/TablePagination';
import CreateDoctorModal from '../components/CreateDoctorModal';
import useDoctors from '../hooks/useDoctors';

function DoctorsPage() {
  const {
    doctors,
    total,
    specialties,
    searchTerm,
    isShortSearch,
    pageSize,
    pageIndex,
    totalPages,
    loading,
    error,
    setPageIndex,
    handleSearchChange,
    addDoctor,
    removeDoctor,
  } = useDoctors();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [actionError, setActionError] = useState('');

  const handleDelete = async (doc) => {
    if (!window.confirm(`¿Eliminar al profesional ${doc.name}?`)) {
      return;
    }

    const { error: deleteError } = await removeDoctor(doc.id);

    setActionError(deleteError || '');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Título y Acciones de Cabecera */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Directorio de Doctores
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Gestione el personal médico y supervise su disponibilidad actual.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Barra de Búsqueda */}
          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
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
              placeholder="Buscar doctor por nombre..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            />
          </div>

          <Button
            disabled
            title="Disponible próximamente"
            className="flex items-center gap-2 bg-med-primary-900 text-white opacity-50 cursor-not-allowed"
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Agregar Disponibilidad Horaria</span>
          </Button>

          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 bg-med-primary-700 hover:bg-med-primary-800 text-white"
          >
            <span>+</span>
            <span>Nuevo Doctor</span>
          </Button>
        </div>
      </div>

      {isShortSearch && (
        <p className="text-xs text-med-text-muted -mt-3">
          Ingrese al menos 3 caracteres para buscar.
        </p>
      )}
      {actionError && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {actionError}
        </p>
      )}

      {/* Tabla Principal */}
      <Card className="p-0 overflow-hidden border-med-border">
        <div className="p-5 border-b border-med-border">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Doctores
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
              <tr>
                <th className="px-6 py-3.5">Nombre del Doctor</th>
                <th className="px-6 py-3.5">Matrícula</th>
                <th className="px-6 py-3.5">Especialidad</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-med-border-subtle">
              {loading && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-med-text-muted"
                  >
                    Cargando médicos...
                  </td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-red-600"
                  >
                    {error}
                  </td>
                </tr>
              )}
              {!loading && !error && doctors.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-med-text-muted"
                  >
                    No se encontraron médicos.
                  </td>
                </tr>
              )}
              {!loading &&
                !error &&
                doctors.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-med-primary-100 flex items-center justify-center text-sm font-bold text-med-primary-700">
                          {doc.name?.charAt(0).toUpperCase()}
                        </div>
                        <p className="font-semibold text-med-primary-900 leading-tight">
                          {doc.name}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-med-text-sub">
                      {doc.licenseNumber}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-med-primary-100 text-med-primary-700">
                        {doc.specialty?.name}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        title="Eliminar profesional"
                        className="p-1.5 rounded-lg hover:bg-red-50 text-med-danger-text transition"
                        onClick={() => handleDelete(doc)}
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* El backend pagina desde 0; TablePagination desde 1 */}
        <TablePagination
          currentPage={pageIndex + 1}
          totalPages={totalPages}
          totalItems={total}
          pageSize={pageSize}
          onPageChange={(page) => setPageIndex(page - 1)}
        />
      </Card>

      {showCreateModal && (
        <CreateDoctorModal
          specialties={specialties}
          onSubmit={addDoctor}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}

export default DoctorsPage;
