import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Mail, Phone, Linkedin, Github, FileText, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { PersonalDataService } from '@/services/personalDataService';
import { PersonalData } from '@/types';

const personalDataSchema = z.object({
  full_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  profession: z.string().min(2, 'La profesión debe tener al menos 2 caracteres'),
  hero_description: z.string().optional(),
  about_description: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  whatsapp_number: z.string().optional(),
  linkedin_url: z.string().url('URL de LinkedIn inválida').optional().or(z.literal('')),
  github_username: z.string().optional(),
  profile_image_url: z.string().url('URL de imagen inválida').optional().or(z.literal(''))
});

type PersonalDataFormValues = z.infer<typeof personalDataSchema>;

export function PersonalDataPanel() {
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<PersonalDataFormValues>({
    resolver: zodResolver(personalDataSchema)
  });

  // Cargar datos personales
  useEffect(() => {
    loadPersonalData();
  }, []);

  const loadPersonalData = async () => {
    try {
      console.log('Loading personal data...'); // Debug log
      const data = await PersonalDataService.getPersonalData();
      console.log('Loaded data:', data); // Debug log
      setPersonalData(data);
      
      if (data) {
        const formData = {
          full_name: data.full_name,
          profession: data.profession,
          hero_description: data.hero_description || '',
          about_description: data.about_description || '',
          email: data.email || '',
          phone: data.phone || '',
          whatsapp_number: data.whatsapp_number || '',
          linkedin_url: data.linkedin_url || '',
          github_username: data.github_username || '',
          profile_image_url: data.profile_image_url || ''
        };
        console.log('Setting form data:', formData); // Debug log
        reset(formData);
      }
    } catch (error) {
      console.error('Error loading personal data:', error);
      // En caso de error, mantener los datos actuales si existen
      if (personalData) {
        const formData = {
          full_name: personalData.full_name,
          profession: personalData.profession,
          hero_description: personalData.hero_description || '',
          about_description: personalData.about_description || '',
          email: personalData.email || '',
          phone: personalData.phone || '',
          whatsapp_number: personalData.whatsapp_number || '',
          linkedin_url: personalData.linkedin_url || '',
          github_username: personalData.github_username || '',
          profile_image_url: personalData.profile_image_url || ''
        };
        reset(formData);
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formData: PersonalDataFormValues) => {
    setSaving(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      console.log('Submitting form data:', formData); // Debug log
      
      // Preparar datos para envío, asegurando que todos los campos estén incluidos
      const dataToSend = {
        full_name: formData.full_name,
        profession: formData.profession,
        hero_description: formData.hero_description || null,
        about_description: formData.about_description || null,
        email: formData.email || null,
        phone: formData.phone || null,
        whatsapp_number: formData.whatsapp_number || null,
        linkedin_url: formData.linkedin_url || null,
        github_username: formData.github_username || null,
        profile_image_url: formData.profile_image_url || null
      };
      
      console.log('Data to send to service:', dataToSend); // Debug log
      
      const updatedData = await PersonalDataService.upsertPersonalData(dataToSend);
      
      console.log('Updated data received:', updatedData); // Debug log);

      setPersonalData(updatedData);
      setStatus('success');
      
      // Actualizar el formulario con los datos guardados para mantener consistencia
      const formDataToSet = {
        full_name: updatedData.full_name,
        profession: updatedData.profession,
        hero_description: updatedData.hero_description || '',
        about_description: updatedData.about_description || '',
        email: updatedData.email || '',
        phone: updatedData.phone || '',
        whatsapp_number: updatedData.whatsapp_number || '',
        linkedin_url: updatedData.linkedin_url || '',
        github_username: updatedData.github_username || '',
        profile_image_url: updatedData.profile_image_url || ''
      };
      
      console.log('Resetting form with saved data:', formDataToSet);
      reset(formDataToSet);
      
      // Verificar que los datos se guardaron correctamente
      setTimeout(async () => {
        try {
          const verificationData = await PersonalDataService.getPersonalData();
          if (verificationData) {
            console.log('Verificación de datos guardados:', verificationData);
          }
        } catch (error) {
          console.error('Error verificando datos guardados:', error);
        }
        setStatus('idle');
      }, 3000);
      
    } catch (error) {
      console.error('Error in onSubmit:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Error al guardar los datos');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando datos personales...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Datos Personales
          </CardTitle>
          <CardDescription>
            Configura tu información personal que aparecerá en el portafolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nombre completo *
                </Label>
                <Input
                  id="full_name"
                  {...register('full_name')}
                  placeholder="Tu nombre completo"
                  className={errors.full_name ? 'border-red-500' : ''}
                />
                {errors.full_name && (
                  <p className="text-sm text-red-500">{errors.full_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Profesión *
                </Label>
                <Input
                  id="profession"
                  {...register('profession')}
                  placeholder="Desarrollador Full Stack"
                  className={errors.profession ? 'border-red-500' : ''}
                />
                {errors.profession && (
                  <p className="text-sm text-red-500">{errors.profession.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero_description">Descripción del Hero</Label>
              <Textarea
                id="hero_description"
                {...register('hero_description')}
                placeholder="Descripción para la sección principal (Hero)..."
                rows={3}
                className={errors.hero_description ? 'border-red-500' : ''}
              />
              {errors.hero_description && (
                <p className="text-sm text-red-500">{errors.hero_description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="about_description">Descripción de "Sobre Mí"</Label>
              <Textarea
                id="about_description"
                {...register('about_description')}
                placeholder="Descripción detallada para la sección 'Sobre Mí'..."
                rows={4}
                className={errors.about_description ? 'border-red-500' : ''}
              />
              {errors.about_description && (
                <p className="text-sm text-red-500">{errors.about_description.message}</p>
              )}
            </div>

            {/* Información de contacto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="tu@email.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="+1234567890"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp_number" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Número de WhatsApp
              </Label>
              <Input
                id="whatsapp_number"
                {...register('whatsapp_number')}
                placeholder="+1234567890"
                className={errors.whatsapp_number ? 'border-red-500' : ''}
              />
              <p className="text-sm text-gray-500">
                Incluye el código de país (ej: +1234567890)
              </p>
              {errors.whatsapp_number && (
                <p className="text-sm text-red-500">{errors.whatsapp_number.message}</p>
              )}
            </div>

            {/* Enlaces sociales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin_url" className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </Label>
                <Input
                  id="linkedin_url"
                  {...register('linkedin_url')}
                  placeholder="https://linkedin.com/in/tu-perfil"
                  className={errors.linkedin_url ? 'border-red-500' : ''}
                />
                {errors.linkedin_url && (
                  <p className="text-sm text-red-500">{errors.linkedin_url.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="github_username" className="flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  Usuario de GitHub
                </Label>
                <Input
                  id="github_username"
                  {...register('github_username')}
                  placeholder="tu-usuario-github"
                  className={errors.github_username ? 'border-red-500' : ''}
                />
                {errors.github_username && (
                  <p className="text-sm text-red-500">{errors.github_username.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile_image_url">URL de imagen de perfil</Label>
              <Input
                id="profile_image_url"
                {...register('profile_image_url')}
                placeholder="https://ejemplo.com/mi-foto.jpg"
                className={errors.profile_image_url ? 'border-red-500' : ''}
              />
              {errors.profile_image_url && (
                <p className="text-sm text-red-500">{errors.profile_image_url.message}</p>
              )}
            </div>

            {/* Estados de respuesta */}
            {status === 'success' && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-800">
                  Datos personales guardados correctamente
                </AlertDescription>
              </Alert>
            )}

            {status === 'error' && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-800">
                  {errorMessage || 'Error al guardar los datos'}
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={saving} className="w-full">
              {saving ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Datos Personales
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Vista previa */}
      {personalData && (
        <Card>
          <CardHeader>
            <CardTitle>Vista Previa</CardTitle>
            <CardDescription>
              Así se verá tu información en el portafolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {personalData.profile_image_url ? (
                <img 
                  src={personalData.profile_image_url} 
                  alt={personalData.full_name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg">{personalData.full_name}</h3>
                <p className="text-gray-600">{personalData.profession}</p>
                {personalData.hero_description && (
                  <p className="text-sm text-gray-500 mt-1">{personalData.hero_description}</p>
                )}
                {personalData.about_description && (
                  <p className="text-sm text-gray-500 mt-1">{personalData.about_description}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
