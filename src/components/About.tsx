import { Code2, Database, LineChart, Cloud, Brain, GitBranch } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const About = () => {
  const skills = [
    {
      category: 'Lenguajes',
      icon: Code2,
      items: ['Python', 'SQL', 'R', 'JavaScript', 'Java'],
    },
    {
      category: 'Frameworks & Librerías',
      icon: Brain,
      items: ['Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'React'],
    },
    {
      category: 'Bases de Datos',
      icon: Database,
      items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Snowflake'],
    },
    {
      category: 'Visualización',
      icon: LineChart,
      items: ['Tableau', 'Power BI', 'Matplotlib', 'Seaborn', 'Plotly'],
    },
    {
      category: 'Cloud & DevOps',
      icon: Cloud,
      items: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes'],
    },
    {
      category: 'Control de Versiones',
      icon: GitBranch,
      items: ['Git', 'GitHub', 'GitLab', 'CI/CD'],
    },
  ];

  return (
    <section id="sobre-mi" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Encabezado */}
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold">
              Sobre <span className="text-gradient">Mí</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full"></div>
          </div>

          {/* Biografía */}
          <Card className="gradient-card border-0 shadow-lg animate-fade-in-up">
            <CardContent className="p-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Soy un Ingeniero y Analista de Datos apasionado por descubrir insights valiosos 
                a través del análisis de datos. Con más de X años de experiencia en la industria, 
                he trabajado en proyectos que abarcan desde análisis exploratorio hasta implementación 
                de modelos de machine learning en producción. Me especializo en transformar datos 
                complejos en información accionable que impulsa la toma de decisiones estratégicas.
              </p>
            </CardContent>
          </Card>

          {/* Habilidades Técnicas */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center">Habilidades Técnicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill, index) => {
                const Icon = skill.icon;
                return (
                  <Card 
                    key={skill.category} 
                    className="gradient-card border-0 shadow-md hover:shadow-glow transition-all duration-300 animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h4 className="font-semibold text-lg">{skill.category}</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {skill.items.map((item) => (
                          <Badge 
                            key={item} 
                            variant="secondary"
                            className="bg-primary/10 text-primary hover:bg-primary/20"
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

          {/* Call to Action - Descargar CV */}
          <div className="text-center pt-8">
            <Button size="lg" className="shadow-glow">
              Descargar CV Completo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
