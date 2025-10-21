import { PersonalDataService } from './personalDataService';

export interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  to_email?: string;
}

export class EmailService {
  // Enviar email usando Formspree
  static async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      // Configuración de Formspree
      const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xqayowpg';
      
      // Preparar datos para Formspree
      const formData = {
        name: emailData.name,
        email: emailData.email,
        subject: emailData.subject,
        message: emailData.message,
        _replyto: emailData.email,
        _subject: `Nuevo mensaje de contacto: ${emailData.subject}`
      };

      console.log('Enviando email via Formspree:', formData);

      // Enviar a Formspree
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        console.log('Email enviado exitosamente via Formspree');
        return true;
      } else {
        const errorText = await response.text();
        console.error('Error en Formspree:', response.status, errorText);
        throw new Error(`Error enviando email: ${response.status}`);
      }

    } catch (error) {
      console.error('Error procesando email:', error);
      throw error;
    }
  }

}
