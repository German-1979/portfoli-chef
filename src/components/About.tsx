import React, { useState, useEffect } from 'react';
import { Code2, Database, LineChart, Cloud, Brain, GitBranch } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { PersonalDataService } from '@/services/personalDataService';
import { PersonalData } from '@/types';

const About = () => {
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPersonalData();
  }, []);

  const loadPersonalData = async () => {
    try {
      const data = await PersonalDataService.getPersonalData();
      setPersonalData(data);
    } catch (error) {
      console.error('Error loading personal data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Descripción por defecto si no hay datos en Supabase
  const defaultDescription = `Soy un Ingeniero y Analista de Datos apasionado por descubrir insights valiosos 
  a través del análisis de datos. Con más de X años de experiencia en la industria, 
  he trabajado en proyectos que abarcan desde análisis exploratorio hasta implementación 
  de modelos de machine learning en producción. Me especializo en transformar datos 
  complejos en información accionable que impulsa la toma de decisiones estratégicas.`;

  const description = personalData?.about_description || defaultDescription;

  const skills = [
    {
      category: 'Lenguajes',
      icon: Code2,
      items: ['Python', 'SQL', 'PySpark', 'DAX'],
    },
    {
      category: 'Frameworks & Librerías',
      icon: Brain,
      items: ['Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch'],
    },
    {
      category: 'Bases de Datos',
      icon: Database,
      items: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQL Server'],
    },
    {
      category: 'Visualización',
      icon: LineChart,
      items: ['Power BI', 'Matplotlib', 'Seaborn', 'Plotly'],
    },
    {
      category: 'Cloud & DevOps',
      icon: Cloud,
      items: ['Azure', 'GCP', 'Docker', 'Kubernetes'],
    },
    {
      category: 'Control de Versiones',
      icon: GitBranch,
      items: ['Git', 'GitHub', 'CI/CD'],
    },
  ];

  const handleDownloadCV = async () => {
    try {
      const cvUrl = await PersonalDataService.getCVUrl();
      if (cvUrl) {
        window.open(cvUrl, '_blank');
      } else {
        alert('CV no disponible. Por favor configura la URL del CV en el panel de administración.');
      }
    } catch (error) {
      console.error('Error downloading CV:', error);
      alert('Error al descargar el CV');
    }
  };

  return (
    <section id="sobre-mi" className="py-12 sm:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
          {/* Encabezado */}
          <div className="text-center space-y-3 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Sobre <span className="text-gradient">Mí</span>
            </h2>
            <div className="w-16 h-1 bg-gradient-primary mx-auto rounded-full"></div>
          </div>

          {/* Biografía */}
          <Card className="gradient-card border-0 shadow-lg animate-fade-in-up">
            <CardContent className="p-4 sm:p-8">
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed text-center max-w-4xl mx-auto">
                {description}
              </p>
            </CardContent>
          </Card>

          {/* Habilidades Técnicas */}
          <div className="space-y-6 sm:space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-center">Habilidades Técnicas</h3>
            
            {/* Mobile Carousel */}
            <div className="md:hidden mt-6">
              <Carousel className="w-full">
                <CarouselContent>
                  {skills.map((skill, index) => {
                    const Icon = skill.icon;
                    return (
                      <CarouselItem key={skill.category} className="basis-full">
                        <Card 
                          className="gradient-card border-0 shadow-md hover:shadow-glow transition-all duration-300 animate-scale-in w-full h-[200px]"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <CardContent className="p-4 space-y-3 text-center h-full flex flex-col justify-center">
                            <div className="flex items-center justify-center space-x-2">
                              <div className="p-1.5 bg-primary/10 rounded-lg">
                                <Icon className="h-4 w-4 text-primary" />
                              </div>
                              <h4 className="font-semibold text-sm">{skill.category}</h4>
                            </div>
                            <div className="flex flex-wrap gap-1.5 justify-center">
                              {skill.items.map((item) => (
                                <Badge 
                                  key={item} 
                                  variant="secondary"
                                  className="bg-primary/10 text-primary hover:bg-primary/20 text-xs"
                                >
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className="hidden" />
                <CarouselNext className="hidden" />
              </Carousel>
              
              {/* Mobile indicators */}
              <div className="flex justify-center mt-4 space-x-2">
                {skills.map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 rounded-full bg-primary/30"
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Desliza para ver más habilidades
              </p>
            </div>

            {/* Desktop Grid */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 justify-items-center mt-4">
              {skills.map((skill, index) => {
                const Icon = skill.icon;
                return (
                  <Card 
                    key={skill.category} 
                    className="gradient-card border-0 shadow-md hover:shadow-glow transition-all duration-300 animate-scale-in w-full max-w-sm h-[250px]"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-4 sm:p-6 space-y-3 text-center h-full flex flex-col justify-center">
                      <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                        <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        </div>
                        <h4 className="font-semibold text-sm sm:text-base md:text-lg">{skill.category}</h4>
                      </div>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                        {skill.items.map((item) => (
                          <Badge 
                            key={item} 
                            variant="secondary"
                            className="bg-primary/10 text-primary hover:bg-primary/20 text-xs sm:text-sm"
                          >
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
