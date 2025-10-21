import { supabase } from '@/lib/supabaseClient';
import { PersonalData } from '@/types';

export class PersonalDataService {
  // Obtener datos personales (solo debe haber un registro)
  static async getPersonalData(): Promise<PersonalData | null> {
    console.log('Fetching personal data from Supabase...'); // Debug log
    const { data, error } = await supabase
      .from('personal_data')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching personal data:', error);
      return null;
    }

    console.log('Personal data fetched successfully:', data); // Debug log
    return data;
  }

  // Crear o actualizar datos personales
  static async upsertPersonalData(personalData: Omit<PersonalData, 'id' | 'created_at' | 'updated_at'>): Promise<PersonalData> {
    console.log('Upserting personal data:', personalData); // Debug log
    
    // Primero intentar obtener datos existentes
    const existingData = await this.getPersonalData();
    
    if (existingData) {
      // Actualizar datos existentes
      console.log('Updating existing data with ID:', existingData.id);
      
      // Preparar datos para actualización, asegurando que todos los campos estén incluidos
      const updateData = {
        full_name: personalData.full_name,
        profession: personalData.profession,
        hero_description: personalData.hero_description || null,
        about_description: personalData.about_description || null,
        email: personalData.email || null,
        phone: personalData.phone || null,
        whatsapp_number: personalData.whatsapp_number || null,
        linkedin_url: personalData.linkedin_url || null,
        github_username: personalData.github_username || null,
        cv_url: personalData.cv_url || null,
        profile_image_url: personalData.profile_image_url || null,
        updated_at: new Date().toISOString()
      };
      
      console.log('Update data prepared:', updateData);
      
      const { data, error } = await supabase
        .from('personal_data')
        .update(updateData)
        .eq('id', existingData.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating personal data:', error);
        throw error;
      }

      console.log('Personal data updated successfully:', data);
      return data;
    } else {
      // Crear nuevos datos
      console.log('Creating new personal data');
      
      // Preparar datos para inserción
      const insertData = {
        full_name: personalData.full_name,
        profession: personalData.profession,
        hero_description: personalData.hero_description || null,
        about_description: personalData.about_description || null,
        email: personalData.email || null,
        phone: personalData.phone || null,
        whatsapp_number: personalData.whatsapp_number || null,
        linkedin_url: personalData.linkedin_url || null,
        github_username: personalData.github_username || null,
        cv_url: personalData.cv_url || null,
        profile_image_url: personalData.profile_image_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('Insert data prepared:', insertData);
      
      const { data, error } = await supabase
        .from('personal_data')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Error creating personal data:', error);
        throw error;
      }

      console.log('Personal data created successfully:', data);
      return data;
    }
  }

  // Actualizar datos personales
  static async updatePersonalData(id: string, updates: Partial<PersonalData>): Promise<PersonalData> {
    const { data, error } = await supabase
      .from('personal_data')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating personal data:', error);
      throw error;
    }

    return data;
  }

  // Obtener URL del CV
  static async getCVUrl(): Promise<string | null> {
    const personalData = await this.getPersonalData();
    return personalData?.cv_url || null;
  }

  // Actualizar URL del CV
  static async updateCVUrl(cvUrl: string): Promise<void> {
    const personalData = await this.getPersonalData();
    
    if (personalData) {
      await this.updatePersonalData(personalData.id, { cv_url: cvUrl });
    } else {
      // Si no hay datos personales, crear un registro básico
      await this.upsertPersonalData({
        full_name: 'Tu Nombre',
        profession: 'Tu Profesión',
        cv_url: cvUrl
      });
    }
  }

  // Obtener número de WhatsApp
  static async getWhatsAppNumber(): Promise<string | null> {
    const personalData = await this.getPersonalData();
    return personalData?.whatsapp_number || null;
  }

  // Actualizar número de WhatsApp
  static async updateWhatsAppNumber(whatsappNumber: string): Promise<void> {
    const personalData = await this.getPersonalData();
    
    if (personalData) {
      await this.updatePersonalData(personalData.id, { whatsapp_number: whatsappNumber });
    } else {
      // Si no hay datos personales, crear un registro básico
      await this.upsertPersonalData({
        full_name: 'Tu Nombre',
        profession: 'Tu Profesión',
        whatsapp_number: whatsappNumber
      });
    }
  }

  // Generar URL de WhatsApp
  static async getWhatsAppUrl(message?: string): Promise<string | null> {
    const whatsappNumber = await this.getWhatsAppNumber();
    
    if (!whatsappNumber) {
      return null;
    }

    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    const encodedMessage = message ? encodeURIComponent(message) : '';
    
    return `https://wa.me/${cleanNumber}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
  }
}
