// Utilidad para debuggear problemas de persistencia en Supabase
import { supabase } from '@/lib/supabaseClient';

export class PersistenceDebugger {
  // Verificar conexión a Supabase
  static async checkConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('personal_data')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('❌ Error de conexión a Supabase:', error);
        return false;
      }
      
      console.log('✅ Conexión a Supabase exitosa');
      return true;
    } catch (error) {
      console.error('💥 Error crítico de conexión:', error);
      return false;
    }
  }

  // Verificar estructura de tablas
  static async checkTableStructure(): Promise<void> {
    console.log('🔍 Verificando estructura de tablas...');
    
    const tables = ['personal_data', 'github_config', 'certifications', 'projects'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.error(`❌ Error en tabla ${table}:`, error);
        } else {
          console.log(`✅ Tabla ${table} accesible`);
        }
      } catch (error) {
        console.error(`💥 Error crítico en tabla ${table}:`, error);
      }
    }
  }

  // Verificar datos actuales
  static async checkCurrentData(): Promise<void> {
    console.log('📊 Verificando datos actuales...');
    
    try {
      // Personal Data
      const { data: personalData, error: personalError } = await supabase
        .from('personal_data')
        .select('*')
        .limit(1)
        .single();
      
      if (personalError) {
        console.log('ℹ️ No hay datos personales:', personalError.message);
      } else {
        console.log('✅ Datos personales encontrados:', personalData);
      }

      // GitHub Config
      const { data: githubConfig, error: githubError } = await supabase
        .from('github_config')
        .select('*')
        .limit(1)
        .single();
      
      if (githubError) {
        console.log('ℹ️ No hay configuración de GitHub:', githubError.message);
      } else {
        console.log('✅ Configuración de GitHub encontrada:', githubConfig);
      }

      // Certifications
      const { data: certifications, error: certError } = await supabase
        .from('certifications')
        .select('*');
      
      if (certError) {
        console.log('❌ Error obteniendo certificaciones:', certError);
      } else {
        console.log(`✅ ${certifications?.length || 0} certificaciones encontradas`);
      }

      // Projects
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*');
      
      if (projectsError) {
        console.log('❌ Error obteniendo proyectos:', projectsError);
      } else {
        console.log(`✅ ${projects?.length || 0} proyectos encontrados`);
      }

    } catch (error) {
      console.error('💥 Error verificando datos:', error);
    }
  }

  // Ejecutar verificación completa
  static async runFullCheck(): Promise<void> {
    console.log('🚀 Iniciando verificación completa de persistencia...');
    
    const connectionOk = await this.checkConnection();
    if (!connectionOk) {
      console.error('❌ No se puede continuar sin conexión a Supabase');
      return;
    }
    
    await this.checkTableStructure();
    await this.checkCurrentData();
    
    console.log('✅ Verificación completa finalizada');
  }

  // Limpiar datos de prueba (solo para desarrollo)
  static async clearTestData(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ No se puede limpiar datos en producción');
      return;
    }
    
    console.log('🧹 Limpiando datos de prueba...');
    
    try {
      // Limpiar en orden correcto (respetando foreign keys)
      await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('certifications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('github_config').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('personal_data').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      console.log('✅ Datos de prueba limpiados');
    } catch (error) {
      console.error('❌ Error limpiando datos:', error);
    }
  }
}

// Función global para usar en la consola del navegador
(window as any).debugPersistence = PersistenceDebugger;
