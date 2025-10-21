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
import ContactInfo from './ContactInfo';
import { EmailService } from '@/services/emailService';

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
    
    try {
      // Intentar enviar email usando EmailJS
      const emailSent = await EmailService.sendEmail({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message
      });

      if (emailSent) {
        toast.success('¡Mensaje enviado correctamente! Te responderé pronto.', {
          icon: <CheckCircle className="h-5 w-5" />,
        });
        reset();
      } else {
        throw new Error('No se pudo enviar el email');
      }
      
    } catch (error) {
      console.error('Error enviando email:', error);
      
      // Fallback: usar mailto
      try {
        const mailtoLink = await EmailService.createMailtoLink({
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message
        });
        
        // Abrir cliente de email
        window.open(mailtoLink, '_blank');
        
        toast.info('Se abrió tu cliente de email. Completa el envío manualmente.', {
          duration: 5000,
        });
        
      } catch (fallbackError) {
        console.error('Error en fallback:', fallbackError);
        toast.error('Hubo un error al enviar el mensaje. Inténtalo de nuevo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-12 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Encabezado */}
          <div className="text-center space-y-3 sm:space-y-4 animate-fade-in">
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
            <ContactInfo />

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
