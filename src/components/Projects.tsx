import { useState } from 'react';
import { Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useProjects } from '@/contexts/ProjectsContext';
import ProjectCard from './ProjectCard';

const Projects = () => {
  const { projects } = useProjects();
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

  return (
    <section id="proyectos" className="py-12 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Encabezado */}
          <div className="text-center space-y-3 sm:space-y-4 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold">
              Mis <span className="text-gradient">Proyectos</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full"></div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explora una selección de proyectos que demuestran mis habilidades en Ingeniería de Datos, Análisis de Datos, Ciencia de Datos y Visualización de Datos.
            </p>
          </div>

          {/* Filtros */}
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
          </div>

          {/* Grid de proyectos */}
          {filteredProjects.length > 0 ? (
            <>
              {/* Mobile Carousel */}
              <div className="md:hidden">
                <Carousel className="w-full">
                  <CarouselContent>
                    {filteredProjects.map((project) => (
                      <CarouselItem key={project.id} className="basis-full">
                        <div className="h-[320px]">
                          <ProjectCard project={project} />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden" />
                  <CarouselNext className="hidden" />
                </Carousel>
                
                {/* Mobile indicators */}
                <div className="flex justify-center mt-4 space-x-2">
                  {filteredProjects.map((_, index) => (
                    <div
                      key={index}
                      className="w-2 h-2 rounded-full bg-primary/30"
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Desliza para ver más proyectos
                </p>
              </div>

              {/* Desktop Grid */}
              <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No hay proyectos para mostrar.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;
