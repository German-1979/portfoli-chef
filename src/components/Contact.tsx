import { useForm } from 'react-hook-form';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContactFormData } from '@/types';
import { toast } from 'sonner';
import { useState } from 'react';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    // Simulación de envío de email (aquí integrarías con EmailJS o similar)
    try {
      // Simular delay de envío
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      console.log('Formulario enviado:', data);
      toast.success('¡Mensaje enviado correctamente! Te responderé pronto.', {
        icon: <CheckCircle className="h-5 w-5" />,
      });
      reset();
    } catch (error) {
      toast.error('Hubo un error al enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Encabezado */}
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="text-gradient">Contacto</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full"></div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ¿Tienes un proyecto en mente o quieres colaborar? 
              ¡Me encantaría escuchar de ti! Envíame un mensaje y te responderé pronto.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Información de contacto */}
            <Card className="gradient-card border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>Información de Contacto</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Email</h4>
                  <a
                    href="mailto:tu-email@ejemplo.com"
                    className="text-primary hover:underline"
                  >
                    tu-email@ejemplo.com
                  </a>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Ubicación</h4>
                  <p className="text-muted-foreground">Tu Ciudad, País</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Disponibilidad</h4>
                  <p className="text-muted-foreground">
                    Disponible para proyectos freelance y oportunidades de colaboración
                  </p>
                </div>

                <div className="pt-4">
                  <h4 className="font-semibold mb-4">Descarga mi CV</h4>
                  <Button className="w-full shadow-glow">
                    Descargar CV (PDF)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Formulario de contacto */}
            <Card className="gradient-card border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Envíame un Mensaje</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre *</Label>
                    <Input
                      id="name"
                      {...register('name', { required: 'El nombre es obligatorio' })}
                      placeholder="Tu nombre"
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email', {
                        required: 'El email es obligatorio',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Email inválido',
                        },
                      })}
                      placeholder="tu@email.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Asunto *</Label>
                    <Input
                      id="subject"
                      {...register('subject', { required: 'El asunto es obligatorio' })}
                      placeholder="Asunto del mensaje"
                    />
                    {errors.subject && (
                      <p className="text-sm text-destructive">{errors.subject.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensaje *</Label>
                    <Textarea
                      id="message"
                      {...register('message', {
                        required: 'El mensaje es obligatorio',
                        minLength: {
                          value: 10,
                          message: 'El mensaje debe tener al menos 10 caracteres',
                        },
                      })}
                      placeholder="Escribe tu mensaje aquí..."
                      rows={5}
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive">{errors.message.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full shadow-glow"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Enviando...'
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar Mensaje
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
