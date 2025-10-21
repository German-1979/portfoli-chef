import { supabase } from '@/lib/supabaseClient';
import { Certification } from '@/types';

export class CertificationsService {
  // Obtener todas las certificaciones
  static async getAllCertifications(): Promise<Certification[]> {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .order('date_obtained', { ascending: false });

    if (error) {
      console.error('Error fetching certifications:', error);
      throw error;
    }

    return data || [];
  }

  // Obtener una certificación por ID
  static async getCertificationById(id: string): Promise<Certification | null> {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching certification:', error);
      return null;
    }

    return data;
  }

  // Crear una nueva certificación
  static async createCertification(certification: Omit<Certification, 'id' | 'created_at' | 'updated_at'>): Promise<Certification> {
    const { data, error } = await supabase
      .from('certifications')
      .insert(certification)
      .select()
      .single();

    if (error) {
      console.error('Error creating certification:', error);
      throw error;
    }

    return data;
  }

  // Actualizar una certificación
  static async updateCertification(id: string, updates: Partial<Certification>): Promise<Certification> {
    const { data, error } = await supabase
      .from('certifications')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating certification:', error);
      throw error;
    }

    return data;
  }

  // Eliminar una certificación
  static async deleteCertification(id: string): Promise<void> {
    const { error } = await supabase
      .from('certifications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting certification:', error);
      throw error;
    }
  }

  // Obtener certificaciones por institución
  static async getCertificationsByInstitution(institution: string): Promise<Certification[]> {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .eq('institution', institution)
      .order('date_obtained', { ascending: false });

    if (error) {
      console.error('Error fetching certifications by institution:', error);
      throw error;
    }

    return data || [];
  }

  // Obtener certificaciones recientes (últimos 6 meses)
  static async getRecentCertifications(): Promise<Certification[]> {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .gte('date_obtained', sixMonthsAgo.toISOString().split('T')[0])
      .order('date_obtained', { ascending: false });

    if (error) {
      console.error('Error fetching recent certifications:', error);
      throw error;
    }

    return data || [];
  }
}
