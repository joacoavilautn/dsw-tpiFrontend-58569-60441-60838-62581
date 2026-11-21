import { useState } from 'react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import TablePagination from '../../shared/components/TablePagination';
import useSpecialties from '../hooks/useSpecialties';
import CreateSpecialtyModal from '../components/CreateSpecialtyModal';

function SpecialtiesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    specialties,
    total,
    pageIndex,
    pageSize,
    searchTerm,
    loading,
    error,
    setPageIndex,
    setSearchTerm,
    handleCreateSpecialty,
    handleDeleteSpecialty,
  } = useSpecialties();

  const totalPages = Math.ceil(total / pageSize) || 1;

  const onDeleteClick = async (specialty) => {
    const confirmed = window.confirm(
      `¿Está seguro de que desea eliminar la especialidad "${specialty.name}"?`
    );

    if (confirmed) {
      await handleDeleteSpecialty(specialty.id);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Cabecera con Título, Buscador y Botón */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Directorio de Especialidades
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Administre las categorías médicas, servicios y disponibilidad del
            personal especializado.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Buscador */}
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
              placeholder="Buscar especialidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            />
          </div>

          {/* Botón Nueva Especialidad */}
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-med-primary-900 hover:bg-med-primary-800 text-white font-medium cursor-pointer"
          >
            <span>+</span>
            <span>Nueva Especialidad</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl">
          {error}
        </div>
      )}

      {/* Tabla Principal de Especialidades */}
      <Card className="p-0 overflow-hidden border-med-border">
        <div className="p-5 border-b border-med-border flex items-center justify-between">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Especialidades
          </h2>
          {loading && (
            <span className="text-xs text-med-text-muted animate-pulse">
              Cargando especialidades...
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
              <tr>
                <th className="px-6 py-3.5">Nombre de la Especialidad</th>
                <th className="px-6 py-3.5">Descripción</th>
                <th className="px-6 py-3.5 text-center">Estado</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-med-border-subtle">
              {specialties.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-med-text-muted"
                  >
                    {loading
                      ? 'Cargando listado...'
                      : 'No se encontraron especialidades registradas.'}
                  </td>
                </tr>
              ) : (
                specialties.map((spec) => (
                  <tr
                    key={spec.id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    {/* Nombre con icono en caja celeste */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-med-primary-100 text-med-primary-700 flex items-center justify-center shrink-0">
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
                        <span className="font-semibold text-med-primary-900">
                          {spec.name}
                        </span>
                      </div>
                    </td>

                    {/* Descripción */}
                    <td className="px-6 py-4 text-med-text-sub max-w-md">
                      {spec.description}
                    </td>

                    {/* Estado (Active) */}
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-med-active-bg text-med-active-text">
                        Activa
                      </span>
                    </td>

                    {/* Acciones: Eliminar */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-med-text-muted">
                        <button
                          title="Eliminar especialidad"
                          className="p-1.5 rounded-lg hover:bg-red-50 text-med-danger-text transition cursor-pointer"
                          onClick={() => onDeleteClick(spec)}
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
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginador compartido */}
        <TablePagination
          currentPage={pageIndex}
          totalPages={totalPages}
          totalItems={total}
          pageSize={pageSize}
          onPageChange={setPageIndex}
        />
      </Card>

      <CreateSpecialtyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitSpecialty={handleCreateSpecialty}
      />
    </div>
  );
}

export default SpecialtiesPage;
