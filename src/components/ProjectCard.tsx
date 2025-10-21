import { Github, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  // Debug: Log project data to see what's available
  console.log('Project data:', project);
  console.log('GitHub URL:', project.github_url);

  return (
    <Card 
      className="gradient-card border-0 shadow-md hover:shadow-glow transition-all duration-300 flex flex-col h-full"
    >
      {/* Imagen del proyecto */}
      {project.image_url && (
        <div className="relative h-40 overflow-hidden rounded-t-lg">
          <img
            src={project.image_url}
            alt={project.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute top-2 right-2">
            <Badge
              variant={project.status === 'completed' ? 'default' : 'secondary'}
              className={project.status === 'completed' ? 'bg-accent' : 'bg-secondary'}
            >
              {project.status === 'completed' ? 'Completado' : 'En Progreso'}
            </Badge>
          </div>
        </div>
      )}

      <CardHeader>
        <h3 className="text-xl font-bold">{project.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2">
        {project.github_url ? (
          <Button
            size="sm"
            variant="default"
            asChild
          >
            <a href={project.github_url} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </a>
          </Button>
        ) : (
          <div className="text-xs text-muted-foreground">
            ⚠️ GitHub URL no disponible
          </div>
        )}

        {project.demo_url && (
          <Button
            size="sm"
            variant="secondary"
            asChild
          >
            <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Demo
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
