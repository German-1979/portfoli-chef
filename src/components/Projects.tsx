import { useState } from 'react';
import { Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useProjects } from '@/contexts/ProjectsContext';
import ProjectCard from './ProjectCard';
import ProjectForm from './ProjectForm';
import { Project } from '@/types';
import { toast } from 'sonner';

const Projects = () => {
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
  const [filterTech, setFilterTech] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Obtener todas las tecnologías únicas
  const allTechnologies = Array.from(
    new Set(projects.flatMap((p) => p.technologies))
  ).sort();

  // Filtrar proyectos
  const filteredProjects = projects.filter((project) => {
    const techMatch = !filterTech || project.technologies.includes(filterTech);
    const statusMatch = filterStatus === 'all' || project.status === filterStatus;
    return techMatch && statusMatch;
  });

  const handleSubmit = (data: Omit<Project, 'id'>) => {
    if (editingProject) {
      updateProject(editingProject.id, data);
      toast.success('Proyecto actualizado correctamente');
    } else {
      addProject(data);
      toast.success('Proyecto creado correctamente');
    }
    setIsDialogOpen(false);
    setEditingProject(undefined);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
    toast.success('Proyecto eliminado correctamente');
  };

  const handleAddNew = () => {
    setEditingProject(undefined);
    setIsDialogOpen(true);
  };

  return (
    <section id="proyectos" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Encabezado */}
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold">
              Mis <span className="text-gradient">Proyectos</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full"></div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explora una selección de proyectos que demuestran mis habilidades en análisis 
              de datos, visualización y desarrollo de software.
            </p>
          </div>

          {/* Filtros y botón agregar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <Badge
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setFilterStatus('all')}
              >
                Todos
              </Badge>
              <Badge
                variant={filterStatus === 'completed' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setFilterStatus('completed')}
              >
                Completados
              </Badge>
              <Badge
                variant={filterStatus === 'in-progress' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setFilterStatus('in-progress')}
              >
                En Progreso
              </Badge>
              {allTechnologies.slice(0, 5).map((tech) => (
                <Badge
                  key={tech}
                  variant={filterTech === tech ? 'secondary' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setFilterTech(filterTech === tech ? '' : tech)}
                >
                  {tech}
                </Badge>
              ))}
            </div>

            <Button onClick={handleAddNew} className="shadow-glow">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Proyecto
            </Button>
          </div>

          {/* Grid de proyectos */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  showActions
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No hay proyectos para mostrar. ¡Agrega tu primer proyecto!
              </p>
            </div>
          )}

          {/* Dialog para agregar/editar proyecto */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
                </DialogTitle>
              </DialogHeader>
              <ProjectForm
                project={editingProject}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setIsDialogOpen(false);
                  setEditingProject(undefined);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default Projects;
