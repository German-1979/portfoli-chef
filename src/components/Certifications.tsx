import { Award } from 'lucide-react';
import { useCertifications } from '@/contexts/CertificationsContext';
import CertificationCard from './CertificationCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';

const Certifications = () => {
  const { certifications } = useCertifications();

  return (
    <section id="certificaciones" className="py-12 sm:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Encabezado */}
          <div className="text-center space-y-3 sm:space-y-4 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="text-gradient">Certificaciones</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full"></div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Credenciales profesionales que validan mi experiencia y conocimientos técnicos.
            </p>
          </div>

          {/* Carrusel de certificaciones */}
          {certifications.length > 0 ? (
            <div className="w-full max-w-7xl mx-auto px-4">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-1">
                  {certifications.map((certification) => (
                    <CarouselItem key={certification.id} className="pl-1 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                      <div className="p-2">
                        <CertificationCard certification={certification} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex -left-12" />
                <CarouselNext className="hidden sm:flex -right-12" />
              </Carousel>
              
              {/* Instrucciones para móvil */}
              <div className="text-center mt-4 sm:hidden">
                {/* Mobile indicators */}
                <div className="flex justify-center mb-2 space-x-2">
                  {certifications.map((_, index) => (
                    <div
                      key={index}
                      className="w-2 h-2 rounded-full bg-primary/30"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Desliza para ver más certificaciones
                </p>
              </div>
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
