import { useState } from 'react';
import { Plus, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCertifications } from '@/contexts/CertificationsContext';
import CertificationCard from './CertificationCard';
import CertificationForm from './CertificationForm';
import { Certification } from '@/types';
import { toast } from 'sonner';

const Certifications = () => {
  const { certifications, addCertification, updateCertification, deleteCertification } =
    useCertifications();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState<
    Certification | undefined
  >(undefined);

  const handleSubmit = (data: Omit<Certification, 'id'>) => {
    if (editingCertification) {
      updateCertification(editingCertification.id, data);
      toast.success('Certificación actualizada correctamente');
    } else {
      addCertification(data);
      toast.success('Certificación creada correctamente');
    }
    setIsDialogOpen(false);
    setEditingCertification(undefined);
  };

  const handleEdit = (certification: Certification) => {
    setEditingCertification(certification);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteCertification(id);
    toast.success('Certificación eliminada correctamente');
  };

  const handleAddNew = () => {
    setEditingCertification(undefined);
    setIsDialogOpen(true);
  };

  return (
    <section id="certificaciones" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Encabezado */}
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="text-gradient">Certificaciones</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full"></div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Credenciales profesionales que validan mi experiencia y conocimientos técnicos.
            </p>
          </div>

          {/* Botón agregar */}
          <div className="flex justify-end">
            <Button onClick={handleAddNew} className="shadow-glow">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Certificación
            </Button>
          </div>

          {/* Grid de certificaciones */}
          {certifications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {certifications.map((certification) => (
                <CertificationCard
                  key={certification.id}
                  certification={certification}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  showActions
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg">
                No hay certificaciones registradas. ¡Agrega tu primera certificación!
              </p>
            </div>
          )}

          {/* Dialog para agregar/editar certificación */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCertification ? 'Editar Certificación' : 'Nueva Certificación'}
                </DialogTitle>
              </DialogHeader>
              <CertificationForm
                certification={editingCertification}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setIsDialogOpen(false);
                  setEditingCertification(undefined);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
