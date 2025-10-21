import { Award } from 'lucide-react';
import { useCertifications } from '@/contexts/CertificationsContext';
import CertificationCard from './CertificationCard';

const Certifications = () => {
  const { certifications } = useCertifications();

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

          {/* Grid de certificaciones */}
          {certifications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {certifications.map((certification) => (
                <CertificationCard
                  key={certification.id}
                  certification={certification}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg">
                No hay certificaciones registradas.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
