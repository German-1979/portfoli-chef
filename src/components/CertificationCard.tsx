import { ExternalLink, Edit, Trash2, Award } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Certification } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface CertificationCardProps {
  certification: Certification;
  onEdit?: (certification: Certification) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

const CertificationCard = ({
  certification,
  onEdit,
  onDelete,
  showActions = false,
}: CertificationCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
  };

  return (
    <Card className="gradient-card border-0 shadow-md hover:shadow-glow transition-all duration-300 flex flex-col h-full">
      {/* Imagen de la certificación */}
      {certification.image ? (
        <div className="relative h-40 overflow-hidden rounded-t-lg bg-muted flex items-center justify-center">
          <img
            src={certification.image}
            alt={certification.name}
            className="w-full h-full object-contain p-4"
          />
        </div>
      ) : (
        <div className="relative h-40 overflow-hidden rounded-t-lg bg-gradient-primary flex items-center justify-center">
          <Award className="h-20 w-20 text-primary-foreground opacity-50" />
        </div>
      )}

      <CardHeader>
        <h3 className="text-lg font-bold line-clamp-2">{certification.name}</h3>
        <p className="text-sm text-muted-foreground">{certification.institution}</p>
        <p className="text-xs text-muted-foreground">{formatDate(certification.dateObtained)}</p>
      </CardHeader>

      <CardContent className="flex-1"></CardContent>

      <CardFooter className="flex flex-wrap gap-2">
        {certification.verificationUrl && (
          <Button size="sm" variant="default" asChild>
            <a
              href={certification.verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Verificar
            </a>
          </Button>
        )}

        {showActions && onEdit && (
          <Button size="sm" variant="outline" onClick={() => onEdit(certification)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        )}

        {showActions && onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Se eliminará permanentemente la
                  certificación.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(certification.id)}>
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
};

export default CertificationCard;
