import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Project } from '@/types';

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: Omit<Project, 'id'>) => void;
  onCancel: () => void;
}

const ProjectForm = ({ project, onSubmit, onCancel }: ProjectFormProps) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: project || {
      name: '',
      description: '',
      githubUrl: '',
      demoUrl: '',
      technologies: [],
      image: '',
      status: 'in-progress',
      createdAt: new Date().toISOString(),
    },
  });

  const status = watch('status');

  const onFormSubmit = (data: any) => {
    const technologies = data.technologies
      ? data.technologies.split(',').map((t: string) => t.trim()).filter((t: string) => t)
      : [];

    onSubmit({
      ...data,
      technologies,
      createdAt: project?.createdAt || new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Proyecto *</Label>
        <Input
          id="name"
          {...register('name', { required: 'El nombre es obligatorio' })}
          placeholder="Mi Proyecto Increíble"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción Breve *</Label>
        <Textarea
          id="description"
          {...register('description', { required: 'La descripción es obligatoria' })}
          placeholder="Una breve descripción del proyecto..."
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="githubUrl">URL del Repositorio GitHub *</Label>
        <Input
          id="githubUrl"
          {...register('githubUrl', { required: 'La URL de GitHub es obligatoria' })}
          placeholder="https://github.com/usuario/proyecto"
          type="url"
        />
        {errors.githubUrl && (
          <p className="text-sm text-destructive">{errors.githubUrl.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="demoUrl">URL de Demo (Opcional)</Label>
        <Input
          id="demoUrl"
          {...register('demoUrl')}
          placeholder="https://mi-proyecto-demo.com"
          type="url"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="technologies">Tecnologías (separadas por coma) *</Label>
        <Input
          id="technologies"
          {...register('technologies', { required: 'Las tecnologías son obligatorias' })}
          placeholder="React, TypeScript, Tailwind CSS"
          defaultValue={project?.technologies?.join(', ') || ''}
        />
        {errors.technologies && (
          <p className="text-sm text-destructive">{errors.technologies.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">URL de Imagen (Opcional)</Label>
        <Input
          id="image"
          {...register('image')}
          placeholder="https://ejemplo.com/imagen.jpg"
          type="url"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Estado del Proyecto</Label>
        <Select
          value={status}
          onValueChange={(value) => setValue('status', value as 'in-progress' | 'completed')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in-progress">En Progreso</SelectItem>
            <SelectItem value="completed">Completado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {project ? 'Actualizar Proyecto' : 'Crear Proyecto'}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;
