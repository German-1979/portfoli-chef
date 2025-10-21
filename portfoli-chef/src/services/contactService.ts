import { supabase } from '@/lib/supabaseClient';
import { ContactMessage, ContactFormData } from '@/types';
import { EmailService } from './emailService';

export class ContactService {
  // Enviar mensaje de contacto
  static async sendMessage(messageData: ContactFormData): Promise<ContactMessage> {
    try {
      // Primero guardar en la base de datos
      const { data, error } = await supabase
        .from('contact_messages')
        .insert({
          name: messageData.name,
          email: messageData.email,
          subject: messageData.subject,
          message: messageData.message
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving message to database:', error);
        throw error;
      }

      // Luego enviar email automáticamente
      try {
        await EmailService.sendEmail({
          name: messageData.name,
          email: messageData.email,
          subject: messageData.subject,
          message: messageData.message,
          to_email: 'germandominguezc@gmail.com' // Tu Gmail configurado directamente
        });
        console.log('Email enviado exitosamente a germandominguezc@gmail.com');
      } catch (emailError) {
        console.error('Error enviando email:', emailError);
        // Si falla el email, lanzamos el error para que el usuario sepa
        throw new Error('El mensaje se guardó pero hubo un problema enviando el email. Inténtalo de nuevo.');
      }

      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Obtener todos los mensajes (para admin)
  static async getAllMessages(): Promise<ContactMessage[]> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }

    return data || [];
  }

  // Obtener mensajes no leídos
  static async getUnreadMessages(): Promise<ContactMessage[]> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('read_status', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching unread messages:', error);
      throw error;
    }

    return data || [];
  }

  // Marcar mensaje como leído
  static async markAsRead(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('contact_messages')
      .update({ read_status: true })
      .eq('id', messageId);

    if (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }

  // Marcar todos los mensajes como leídos
  static async markAllAsRead(): Promise<void> {
    const { error } = await supabase
      .from('contact_messages')
      .update({ read_status: true })
      .eq('read_status', false);

    if (error) {
      console.error('Error marking all messages as read:', error);
      throw error;
    }
  }

  // Eliminar mensaje
  static async deleteMessage(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  // Obtener conteo de mensajes no leídos
  static async getUnreadCount(): Promise<number> {
    const { count, error } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('read_status', false);

    if (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }

    return count || 0;
  }

  // Obtener mensajes por rango de fechas
  static async getMessagesByDateRange(startDate: string, endDate: string): Promise<ContactMessage[]> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages by date range:', error);
      throw error;
    }

    return data || [];
  }

  // Buscar mensajes por texto
  static async searchMessages(searchTerm: string): Promise<ContactMessage[]> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,subject.ilike.%${searchTerm}%,message.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching messages:', error);
      throw error;
    }

    return data || [];
  }
}
