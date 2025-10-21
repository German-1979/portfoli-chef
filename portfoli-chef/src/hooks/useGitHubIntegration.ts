import { useState, useEffect, useCallback } from 'react';
import { GitHubService } from '@/services/githubService';
import { ProjectsService } from '@/services/projectsService';
import { GitHubConfig, GitHubRepo, GitHubUser } from '@/types';

// Función global para refrescar proyectos (será llamada desde el contexto)
let refreshProjectsCallback: (() => Promise<void>) | null = null;

export const setRefreshProjectsCallback = (callback: () => Promise<void>) => {
  refreshProjectsCallback = callback;
};

export function useGitHubIntegration() {
  const [config, setConfig] = useState<GitHubConfig | null>(null);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar configuración inicial
  useEffect(() => {
    loadConfig();
  }, []);

  // Cargar configuración de GitHub
  const loadConfig = useCallback(async () => {
    try {
      const githubConfig = await GitHubService.getGitHubConfig();
      setConfig(githubConfig);
      
      if (githubConfig) {
        await loadUserData(githubConfig.username);
      }
    } catch (err) {
      console.error('Error loading GitHub config:', err);
    }
  }, []);

  // Cargar datos del usuario de GitHub
  const loadUserData = useCallback(async (username: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const [userData, reposData] = await Promise.all([
        GitHubService.getGitHubUser(username),
        GitHubService.getGitHubRepos(username)
      ]);
      
      setUser(userData);
      setRepos(reposData);
    } catch (err) {
      setError('Error al cargar datos de GitHub');
      console.error('Error loading GitHub data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Configurar usuario de GitHub
  const configureGitHub = useCallback(async (username: string, selectedRepos: string[]) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validar usuario
      const isValid = await GitHubService.validateGitHubUser(username);
      if (!isValid) {
        throw new Error('Usuario de GitHub no encontrado');
      }

      // Guardar configuración
      const newConfig = await GitHubService.upsertGitHubConfig({
        username,
        selected_repos: selectedRepos,
        sync_enabled: true,
        last_sync: null
      });

      setConfig(newConfig);
      
      // Cargar datos del usuario
      await loadUserData(username);
      
      return newConfig;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al configurar GitHub';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadUserData]);

  // Sincronizar proyectos desde GitHub
  const syncProjects = useCallback(async () => {
    if (!config) {
      throw new Error('No hay configuración de GitHub');
    }

    setLoading(true);
    setError(null);
    
    try {
      const syncedProjects = await ProjectsService.syncFromGitHub(
        config.username,
        config.selected_repos
      );

      // Actualizar última sincronización
      await GitHubService.updateLastSync();
      
      // Recargar configuración
      await loadConfig();
      
      // Refrescar proyectos en el contexto del sitio web
      console.log('Intentando refrescar proyectos en el contexto del sitio web...');
      
      // Método 1: Callback directo
      if (refreshProjectsCallback) {
        try {
          console.log('Callback encontrado, ejecutando...');
          await refreshProjectsCallback();
          console.log('✅ Proyectos refrescados exitosamente en el contexto del sitio web');
        } catch (error) {
          console.error('❌ Error refrescando proyectos:', error);
        }
      } else {
        console.warn('⚠️ No se encontró callback para refrescar proyectos');
      }
      
      // Método 2: Evento personalizado como fallback
      try {
        const event = new CustomEvent('projects-refresh', { 
          detail: { timestamp: Date.now() } 
        });
        window.dispatchEvent(event);
        console.log('📡 Evento de refrescar proyectos enviado');
      } catch (error) {
        console.error('❌ Error enviando evento:', error);
      }
      
      return syncedProjects;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al sincronizar proyectos';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [config, loadConfig]);

  // Actualizar repositorios seleccionados
  const updateSelectedRepos = useCallback(async (selectedRepos: string[]) => {
    if (!config) {
      throw new Error('No hay configuración de GitHub');
    }

    try {
      const updatedConfig = await GitHubService.upsertGitHubConfig({
        ...config,
        selected_repos: selectedRepos
      });
      
      setConfig(updatedConfig);
      return updatedConfig;
    } catch (err) {
      console.error('Error updating selected repos:', err);
      throw err;
    }
  }, [config]);

  // Obtener repositorios disponibles para selección
  const getAvailableRepos = useCallback(() => {
    return repos.map(repo => ({
      value: repo.name,
      label: repo.name,
      description: repo.description,
      stars: repo.stargazers_count,
      language: repo.language,
      updated: repo.updated_at
    }));
  }, [repos]);

  // Obtener repositorios destacados
  const getFeaturedRepos = useCallback(async (limit: number = 5) => {
    if (!config) return [];
    
    try {
      return await GitHubService.getFeaturedRepos(config.username, limit);
    } catch (err) {
      console.error('Error getting featured repos:', err);
      return [];
    }
  }, [config]);

  return {
    config,
    user,
    repos,
    loading,
    error,
    configureGitHub,
    syncProjects,
    updateSelectedRepos,
    getAvailableRepos,
    getFeaturedRepos,
    loadUserData,
    clearError: () => setError(null)
  };
}

