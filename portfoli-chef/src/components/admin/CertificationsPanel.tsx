import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Award, Plus, Edit, Trash2, ExternalLink, Calendar, Building, AlertCircle, CheckCircle } from 'lucide-react';
import { CertificationsService } from '@/services/certificationsService';
import { Certification } from '@/types';

const certificationSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  institution: z.string().min(2, 'La institución debe tener al menos 2 caracteres'),
  date_obtained: z.string().min(1, 'La fecha es requerida'),
  verification_url: z.string().url('URL inválida').optional().or(z.literal('')),
  image_url: z.string().url('URL de imagen inválida').optional().or(z.literal('')),
  file_url: z.string().url('URL de archivo inválida').optional().or(z.literal(''))
});

type CertificationFormValues = z.infer<typeof certificationSchema>;

export function CertificationsPanel() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationSchema)
  });

  // Cargar certificaciones
  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    try {
      const data = await CertificationsService.getAllCertifications();
      setCertifications(data);
    } catch (error) {
      console.error('Error loading certifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CertificationFormValues) => {
    setSaving(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const certificationData = {
        ...data,
        verification_url: data.verification_url || null,
        image_url: data.image_url || null,
        file_url: data.file_url || null
      };

      if (editingId) {
        // Actualizar certificación existente
        const updated = await CertificationsService.updateCertification(editingId, certificationData);
        setCertifications(prev => 
          prev.map(cert => cert.id === editingId ? updated : cert)
        );
      } else {
        // Crear nueva certificación
        const newCert = await CertificationsService.createCertification(certificationData);
        setCertifications(prev => [newCert, ...prev]);
      }

      reset();
      setEditingId(null);
      setStatus('success');
      
      // Limpiar el estado de éxito después de 3 segundos
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
      
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Error al guardar la certificación');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (certification: Certification) => {
    setEditingId(certification.id);
    setValue('name', certification.name);
    setValue('institution', certification.institution);
    setValue('date_obtained', certification.date_obtained);
    setValue('verification_url', certification.verification_url || '');
    setValue('image_url', certification.image_url || '');
    setValue('file_url', certification.file_url || '');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta certificación?')) return;

    try {
      await CertificationsService.deleteCertification(id);
      setCertifications(prev => prev.filter(cert => cert.id !== id));
      setStatus('success');
      
      // Limpiar el estado de éxito después de 3 segundos
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
      
    } catch (error) {
      console.error('Error deleting certification:', error);
      setStatus('error');
      setErrorMessage('Error al eliminar la certificación');
    }
  };

  const handleCancel = () => {
    reset();
    setEditingId(null);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando certificaciones...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Formulario de certificación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            {editingId ? 'Editar Certificación' : 'Agregar Nueva Certificación'}
          </CardTitle>
          <CardDescription>
            {editingId ? 'Modifica los datos de la certificación' : 'Agrega una nueva certificación a tu portafolio'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la certificación *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="React Developer Certificate"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="institution">Institución *</Label>
                <Input
                  id="institution"
                  {...register('institution')}
                  placeholder="Meta, Google, Microsoft, etc."
                  className={errors.institution ? 'border-red-500' : ''}
                />
                {errors.institution && (
                  <p className="text-sm text-red-500">{errors.institution.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_obtained">Fecha de obtención *</Label>
              <Input
                id="date_obtained"
                type="date"
                {...register('date_obtained')}
                className={errors.date_obtained ? 'border-red-500' : ''}
              />
              {errors.date_obtained && (
                <p className="text-sm text-red-500">{errors.date_obtained.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="verification_url">URL de verificación</Label>
              <Input
                id="verification_url"
                {...register('verification_url')}
                placeholder="https://certificates.example.com/verify/..."
                className={errors.verification_url ? 'border-red-500' : ''}
              />
              {errors.verification_url && (
                <p className="text-sm text-red-500">{errors.verification_url.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="image_url">URL de imagen</Label>
                <Input
                  id="image_url"
                  {...register('image_url')}
                  placeholder="https://ejemplo.com/certificado.jpg"
                  className={errors.image_url ? 'border-red-500' : ''}
                />
                {errors.image_url && (
                  <p className="text-sm text-red-500">{errors.image_url.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="file_url">URL del archivo PDF</Label>
                <Input
                  id="file_url"
                  {...register('file_url')}
                  placeholder="https://ejemplo.com/certificado.pdf"
                  className={errors.file_url ? 'border-red-500' : ''}
                />
                {errors.file_url && (
                  <p className="text-sm text-red-500">{errors.file_url.message}</p>
                )}
              </div>
            </div>

            {/* Estados de respuesta */}
            {status === 'success' && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-800">
                  Certificación {editingId ? 'actualizada' : 'agregada'} correctamente
                </AlertDescription>
              </Alert>
            )}

            {status === 'error' && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-800">
                  {errorMessage || 'Error al guardar la certificación'}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    {editingId ? 'Actualizar' : 'Agregar'} Certificación
                  </>
                )}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de certificaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Certificaciones ({certifications.length})</CardTitle>
          <CardDescription>
            Gestiona tus certificaciones existentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {certifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No hay certificaciones registradas</p>
              <p className="text-sm">Agrega tu primera certificación usando el formulario de arriba</p>
            </div>
          ) : (
            <div className="space-y-4">
              {certifications.map((certification) => (
                <div key={certification.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    {certification.image_url ? (
                      <img 
                        src={certification.image_url} 
                        alt={certification.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <Award className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">{certification.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building className="w-4 h-4" />
                        {certification.institution}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(certification.date_obtained).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2 mt-2">
                        {certification.verification_url && (
                          <Badge variant="secondary" className="text-xs">
                            Verificable
                          </Badge>
                        )}
                        {certification.file_url && (
                          <Badge variant="outline" className="text-xs">
                            PDF disponible
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {certification.verification_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(certification.verification_url!, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(certification)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(certification.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}



