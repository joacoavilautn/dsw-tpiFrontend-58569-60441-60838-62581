import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';
import Modal from '../../shared/components/Modal';

function CreateSpecialtyModal({ isOpen, onClose, onSubmitSpecialty }) {
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const handleClose = () => {
    reset();
    setServerError('');
    onClose();
  };

  const onFormSubmit = async (data) => {
    setServerError('');

    const result = await onSubmitSpecialty({
      name: data.name.trim(),
      description: data.description.trim(),
    });

    if (result?.success) {
      reset();
      onClose();
    } else {
      if (result?.status === 409) {
        setServerError('Ya existe una especialidad con ese nombre.');
      } else {
        setServerError(result?.error || 'No se pudo guardar la especialidad.');
      }
    }
  };

  return (
    <Modal isOpen={isOpen} maxWidth="max-w-lg" className="overflow-hidden">
      <div className="px-6 py-5 border-b border-med-border flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-med-text-main">
            Registrar Nueva Especialidad
          </h2>
          <p className="text-xs text-med-text-sub mt-0.5">
            Complete los datos para agregar una especialidad médica al sistema.
          </p>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="text-med-text-sub hover:text-med-text-main p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4">
        {serverError && (
          <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
            {serverError}
          </div>
        )}

        <Input
          label="Nombre de la Especialidad"
          placeholder="Ej: Traumatología"
          error={errors.name?.message}
          {...register('name', {
            required: 'El nombre es obligatorio',
            minLength: {
              value: 3,
              message: 'Debe contener al menos 3 caracteres',
            },
            maxLength: {
              value: 100,
              message: 'No puede exceder los 100 caracteres',
            },
          })}
        />

        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-xs font-semibold text-med-text-main">
            Descripción
          </label>
          <textarea
            rows={3}
            placeholder="Describa el alcance de la atención clínica..."
            className={`w-full border rounded-lg px-3.5 py-2.5 text-sm bg-white text-med-text-main placeholder-med-text-muted transition focus:outline-none focus:ring-2 focus:ring-med-primary-600 focus:border-transparent ${
              errors.description
                ? 'border-red-400 bg-red-50/20'
                : 'border-med-border'
            }`}
            {...register('description', {
              required: 'La descripción es obligatoria',
              minLength: {
                value: 10,
                message: 'Debe contener al menos 10 caracteres',
              },
              maxLength: {
                value: 100,
                message: 'No puede exceder los 100 caracteres',
              },
            })}
          />
          {errors.description && (
            <p className="text-xs text-red-500 font-medium">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-med-border flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="default" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar Especialidad'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateSpecialtyModal;
