import { supabase } from '@/lib/supabaseClient';
import { Project, GitHubRepo } from '@/types';
import { GitHubService } from './githubService';

export class ProjectsService {
  // Obtener proyectos seleccionados (solo los que están en la configuración de GitHub)
  static async getAllProjects(): Promise<Project[]> {
    try {
      // Obtener configuración de GitHub
      const githubConfig = await GitHubService.getGitHubConfig();
      
      if (!githubConfig || !githubConfig.selected_repos || githubConfig.selected_repos.length === 0) {
        console.log('No hay configuración de GitHub o repositorios seleccionados');
        return [];
      }
      
      console.log('Repositorios seleccionados:', githubConfig.selected_repos);
      
      // Obtener solo los proyectos que coinciden con los repositorios seleccionados
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .in('name', githubConfig.selected_repos)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching selected projects:', error);
        throw error;
      }

      console.log('Proyectos seleccionados obtenidos:', data);
      return data || [];
    } catch (error) {
      console.error('Error getting selected projects:', error);
      // Fallback: obtener todos los proyectos si hay error
      const { data, error: fallbackError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (fallbackError) {
        console.error('Error fetching all projects (fallback):', fallbackError);
        throw fallbackError;
      }

      return data || [];
    }
  }

  // Obtener un proyecto por ID
  static async getProjectById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching project:', error);
      return null;
    }

    return data;
  }

  // Crear un nuevo proyecto
  static async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      throw error;
    }

    return data;
  }

  // Actualizar un proyecto
  static async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating project:', error);
      throw error;
    }

    return data;
  }

  // Eliminar un proyecto
  static async deleteProject(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  // Sincronizar proyectos desde GitHub
  static async syncFromGitHub(username: string, selectedRepos: string[]): Promise<Project[]> {
    try {
      // Obtener repositorios de GitHub
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const repos: GitHubRepo[] = await response.json();
      
      // Filtrar solo los repositorios seleccionados
      const filteredRepos = repos.filter(repo => selectedRepos.includes(repo.name));

      const syncedProjects: Project[] = [];

      for (const repo of filteredRepos) {
        // Obtener tecnologías del repositorio
        const languagesResponse = await fetch(repo.languages_url);
        const languages = languagesResponse.ok ? await languagesResponse.json() : {};
        const technologies = Object.keys(languages);

        const projectData = {
          name: repo.name,
          description: repo.description,
          long_description: repo.description,
          github_url: repo.html_url,
          demo_url: repo.homepage,
          technologies,
          status: 'completed' as const,
          github_repo_id: repo.id,
          github_updated_at: repo.updated_at,
        };

        // Verificar si el proyecto ya existe
        const { data: existingProject } = await supabase
          .from('projects')
          .select('id')
          .eq('github_repo_id', repo.id)
          .single();

        if (existingProject) {
          // Actualizar proyecto existente
          const updatedProject = await this.updateProject(existingProject.id, projectData);
          syncedProjects.push(updatedProject);
        } else {
          // Crear nuevo proyecto
          const newProject = await this.createProject(projectData);
          syncedProjects.push(newProject);
        }
      }

      return syncedProjects;
    } catch (error) {
      console.error('Error syncing from GitHub:', error);
      throw error;
    }
  }

  // Obtener proyectos por estado
  static async getProjectsByStatus(status: 'in-progress' | 'completed'): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects by status:', error);
      throw error;
    }

    return data || [];
  }
}
