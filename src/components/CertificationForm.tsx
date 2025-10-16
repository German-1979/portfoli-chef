import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Certification } from '@/types';

interface CertificationFormProps {
  certification?: Certification;
  onSubmit: (data: Omit<Certification, 'id'>) => void;
  onCancel: () => void;
}

const CertificationForm = ({
  certification,
  onSubmit,
  onCancel,
}: CertificationFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: certification || {
      name: '',
      institution: '',
      dateObtained: '',
      verificationUrl: '',
      image: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre de la Certificación *</Label>
        <Input
          id="name"
          {...register('name', { required: 'El nombre es obligatorio' })}
          placeholder="AWS Certified Solutions Architect"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="institution">Institución Emisora *</Label>
        <Input
          id="institution"
          {...register('institution', { required: 'La institución es obligatoria' })}
          placeholder="Amazon Web Services"
        />
        {errors.institution && (
          <p className="text-sm text-destructive">{errors.institution.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateObtained">Fecha de Obtención *</Label>
        <Input
          id="dateObtained"
          type="date"
          {...register('dateObtained', {
            required: 'La fecha de obtención es obligatoria',
          })}
        />
        {errors.dateObtained && (
          <p className="text-sm text-destructive">{errors.dateObtained.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="verificationUrl">URL de Verificación (Opcional)</Label>
        <Input
          id="verificationUrl"
          {...register('verificationUrl')}
          placeholder="https://www.credly.com/badges/..."
          type="url"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">URL de Imagen/Badge (Opcional)</Label>
        <Input
          id="image"
          {...register('image')}
          placeholder="https://ejemplo.com/badge.png"
          type="url"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {certification ? 'Actualizar Certificación' : 'Crear Certificación'}
        </Button>
      </div>
    </form>
  );
};

export default CertificationForm;
