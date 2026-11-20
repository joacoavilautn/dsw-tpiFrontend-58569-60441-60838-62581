import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';

function CreateDoctorModal({ specialties, onSubmit, onClose }) {
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: '', licenseNumber: '', specialtyId: '' },
  });

  const submit = async (values) => {
    setServerError('');

    const { error } = await onSubmit({
      name: values.name.trim(),
      licenseNumber: values.licenseNumber.trim(),
      specialtyId: values.specialtyId,
    });

    if (error) {
      setServerError(error);

      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-med-primary-900 mb-4">
          Nuevo Doctor
        </h2>

        <form
          onSubmit={handleSubmit(submit)}
          noValidate
          className="flex flex-col gap-4"
        >
          <Input
            label="Nombre"
            placeholder="Juan Pérez"
            error={errors.name?.message}
            {...register('name', {
              required: 'El nombre es obligatorio',
              minLength: { value: 3, message: 'Mínimo 3 caracteres' },
              maxLength: { value: 100, message: 'Máximo 100 caracteres' },
              validate: (v) => v.trim().length >= 3 || 'Mínimo 3 caracteres',
            })}
          />

          <Input
            label="Matrícula"
            placeholder="MP12345"
            error={errors.licenseNumber?.message}
            {...register('licenseNumber', {
              required: 'La matrícula es obligatoria',
              minLength: { value: 2, message: 'Mínimo 2 caracteres' },
              maxLength: { value: 50, message: 'Máximo 50 caracteres' },
              validate: (v) => v.trim().length >= 2 || 'Mínimo 2 caracteres',
            })}
          />

          <div className="flex flex-col gap-1.5 w-full">
            <label
              htmlFor="specialtyId"
              className="text-xs font-semibold text-med-text-main"
            >
              Especialidad
            </label>
            <select
              id="specialtyId"
              className={`w-full border rounded-lg px-3.5 py-2.5 text-sm bg-white text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600 ${
                errors.specialtyId ? 'border-red-400' : 'border-med-border'
              }`}
              {...register('specialtyId', {
                required: 'La especialidad es obligatoria',
              })}
            >
              <option value="">Seleccione una especialidad</option>
              {specialties.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors.specialtyId && (
              <p className="text-xs text-red-500 font-medium">
                {errors.specialtyId.message}
              </p>
            )}
          </div>

          {serverError && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {serverError}
            </p>
          )}

          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateDoctorModal;
