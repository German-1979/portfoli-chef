import { ExternalLink, Award } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Certification } from '@/types';

interface CertificationCardProps {
  certification: Certification;
}

const CertificationCard = ({ certification }: CertificationCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
  };

  return (
    <Card className="gradient-card border-0 shadow-md hover:shadow-glow transition-all duration-300 flex flex-col h-[400px]">
      {/* Imagen de la certificación */}
      {certification.image_url ? (
        <div 
          className="relative h-40 overflow-hidden rounded-t-lg bg-muted flex items-center justify-center group cursor-pointer"
          title="Pasa el mouse para ampliar"
        >
          <img
            src={certification.image_url}
            alt={certification.name}
            className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-150 group-hover:z-10"
          />
          {/* Overlay para mejor visibilidad */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-t-lg"></div>
          {/* Indicador visual */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black/50 text-white text-xs px-2 py-1 rounded">
              🔍 Ampliar
            </div>
          </div>
        </div>
      ) : (
        <div className="relative h-40 overflow-hidden rounded-t-lg bg-gradient-primary flex items-center justify-center">
          <Award className="h-20 w-20 text-primary-foreground opacity-50" />
        </div>
      )}

      <CardHeader className="pb-2 flex-shrink-0">
        <h3 className="text-sm font-bold line-clamp-3 leading-tight h-[60px] flex items-start overflow-hidden">{certification.name}</h3>
        <p className="text-xs text-muted-foreground mt-2 h-[16px]">{certification.institution}</p>
        <p className="text-xs text-muted-foreground h-[16px]">{formatDate(certification.date_obtained)}</p>
      </CardHeader>

      <CardContent className="flex-1"></CardContent>

      <CardFooter className="flex flex-wrap gap-2 pt-2 flex-shrink-0">
        {certification.verification_url && (
          <Button size="sm" variant="default" asChild>
            <a
              href={certification.verification_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Verificar
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CertificationCard;
