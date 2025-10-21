import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, Mail, User, MessageSquare, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ContactService } from '@/services/contactService';
import { ContactFormData } from '@/types';

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  subject: z.string().min(5, 'El asunto debe tener al menos 5 caracteres'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres')
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactFormProps {
  className?: string;
  onSuccess?: () => void;
}

export function ContactForm({ className = '', onSuccess }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      await ContactService.sendMessage(data);
      setSubmitStatus('success');
      reset();
      onSuccess?.();
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Error al enviar el mensaje');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Envíame un mensaje
        </CardTitle>
        <CardDescription>
          Estoy interesado en escuchar sobre tus proyectos y oportunidades.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                Nombre completo
              </label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Tu nombre completo"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
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
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Asunto
            </label>
            <Input
              id="subject"
              {...register('subject')}
              placeholder="¿En qué puedo ayudarte?"
              className={errors.subject ? 'border-red-500' : ''}
            />
            {errors.subject && (
              <p className="text-sm text-red-500">{errors.subject.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Mensaje
            </label>
            <Textarea
              id="message"
              {...register('message')}
              placeholder="Cuéntame más sobre tu proyecto o consulta..."
              rows={6}
              className={errors.message ? 'border-red-500' : ''}
            />
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message.message}</p>
            )}
          </div>

          {submitStatus === 'success' && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                ¡Mensaje enviado correctamente! Te responderé pronto.
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === 'error' && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {errorMessage || 'Error al enviar el mensaje. Inténtalo de nuevo.'}
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar mensaje
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Componente simplificado para contacto rápido
export function QuickContactForm({ className = '' }: { className?: string }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !message) return;

    setIsSubmitting(true);
    setStatus('idle');

    try {
      await ContactService.sendMessage({
        name: 'Contacto rápido',
        email,
        subject: 'Consulta rápida',
        message
      });
      
      setStatus('success');
      setEmail('');
      setMessage('');
    } catch (error) {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <Input
        type="email"
        placeholder="Tu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Textarea
        placeholder="Tu mensaje..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        required
      />
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Enviando...' : 'Enviar'}
      </Button>
      
      {status === 'success' && (
        <p className="text-sm text-green-600">¡Mensaje enviado!</p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-600">Error al enviar el mensaje</p>
      )}
    </form>
  );
}



