import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project } from '@/types';
import { ProjectsService } from '@/services/projectsService';
import { setRefreshProjectsCallback } from '@/hooks/useGitHubIntegration';

interface ProjectsContextType {
  projects: Project[];
  loading: boolean;
  error: string | null;
  addProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  refreshProjects: () => Promise<void>;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProjectsService.getAllProjects();
      setProjects(data);
      console.log('Proyectos cargados:', data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar proyectos');
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar proyectos al inicializar
  useEffect(() => {
    loadProjects();
    // Registrar callback para refrescar proyectos desde GitHub
    setRefreshProjectsCallback(loadProjects);
    console.log('Callback de refrescar proyectos registrado');
    
    // Listener para evento de refrescar proyectos
    const handleProjectsRefresh = () => {
      console.log('📡 Evento de refrescar proyectos recibido');
      loadProjects();
    };
    
    window.addEventListener('projects-refresh', handleProjectsRefresh);
    
    return () => {
      window.removeEventListener('projects-refresh', handleProjectsRefresh);
    };
  }, []);

  const addProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      const newProject = await ProjectsService.createProject(project);
      setProjects(prev => [newProject, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar proyecto');
      throw err;
    }
  };

  const updateProject = async (id: string, updatedData: Partial<Project>) => {
    try {
      setError(null);
      const updated = await ProjectsService.updateProject(id, updatedData);
      setProjects(prev =>
        prev.map(project =>
          project.id === id ? updated : project
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar proyecto');
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      setError(null);
      await ProjectsService.deleteProject(id);
      setProjects(prev => prev.filter(project => project.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar proyecto');
      throw err;
    }
  };

  const refreshProjects = async () => {
    await loadProjects();
  };

  return (
    <ProjectsContext.Provider value={{ 
      projects, 
      loading, 
      error, 
      addProject, 
      updateProject, 
      deleteProject, 
      refreshProjects 
    }}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects debe usarse dentro de ProjectsProvider');
  }
  return context;
}
