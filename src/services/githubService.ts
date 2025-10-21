import { supabase } from '@/lib/supabaseClient';
import { GitHubConfig, GitHubRepo, GitHubUser } from '@/types';

export class GitHubService {
  // Obtener configuración de GitHub
  static async getGitHubConfig(): Promise<GitHubConfig | null> {
    const { data, error } = await supabase
      .from('github_config')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching GitHub config:', error);
      return null;
    }

    return data;
  }

  // Crear o actualizar configuración de GitHub
  static async upsertGitHubConfig(config: Omit<GitHubConfig, 'id' | 'created_at' | 'updated_at'>): Promise<GitHubConfig> {
    console.log('🔄 Upserting GitHub config:', config);
    
    try {
      const { data, error } = await supabase
        .from('github_config')
        .upsert({
          ...config,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error upserting GitHub config:', error);
        throw error;
      }

      console.log('✅ GitHub config upserted successfully:', data);
      
      // Verificar que los datos se guardaron correctamente
      const verificationData = await this.getGitHubConfig();
      console.log('🔍 Verification data:', verificationData);
      
      return data;
    } catch (error) {
      console.error('💥 Critical error in upsertGitHubConfig:', error);
      throw error;
    }
  }

  // Obtener información del usuario de GitHub
  static async getGitHubUser(username: string): Promise<GitHubUser | null> {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching GitHub user:', error);
      return null;
    }
  }

  // Obtener repositorios del usuario de GitHub
  static async getGitHubRepos(username: string): Promise<GitHubRepo[]> {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching GitHub repos:', error);
      return [];
    }
  }

  // Obtener repositorios públicos del usuario
  static async getPublicRepos(username: string): Promise<GitHubRepo[]> {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos?type=public&sort=updated&per_page=100`);
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching public repos:', error);
      return [];
    }
  }

  // Obtener repositorios destacados (con más estrellas)
  static async getFeaturedRepos(username: string, limit: number = 10): Promise<GitHubRepo[]> {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=${limit}`);
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching featured repos:', error);
      return [];
    }
  }

  // Obtener tecnologías de un repositorio
  static async getRepoLanguages(repoFullName: string): Promise<string[]> {
    try {
      const response = await fetch(`https://api.github.com/repos/${repoFullName}/languages`);
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const languages = await response.json();
      return Object.keys(languages);
    } catch (error) {
      console.error('Error fetching repo languages:', error);
      return [];
    }
  }

  // Verificar si un usuario de GitHub existe
  static async validateGitHubUser(username: string): Promise<boolean> {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      return response.ok;
    } catch (error) {
      console.error('Error validating GitHub user:', error);
      return false;
    }
  }

  // Actualizar última sincronización
  static async updateLastSync(): Promise<void> {
    const config = await this.getGitHubConfig();
    
    if (config) {
      await this.upsertGitHubConfig({
        ...config,
        last_sync: new Date().toISOString()
      });
    }
  }
}
