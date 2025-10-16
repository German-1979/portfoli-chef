import { Github, Linkedin, Download, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBackground from '@/assets/hero-background.jpg';
import profilePlaceholder from '@/assets/profile-placeholder.jpg';

const Hero = () => {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background con overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBackground} 
          alt="Hero background" 
          className="w-full h-full object-cover opacity-20 dark:opacity-10"
        />
        <div className="absolute inset-0 gradient-hero"></div>
      </div>

      {/* Contenido */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
          {/* Imagen de perfil */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-full blur-2xl opacity-30 animate-glow"></div>
              <img
                src={profilePlaceholder}
                alt="Foto de perfil"
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-primary shadow-glow"
              />
            </div>
          </div>

          {/* Texto principal */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Hola, soy{' '}
              <span className="text-gradient">Tu Nombre</span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-muted-foreground">
              Ingeniero y Analista de Datos
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Transformando datos en insights accionables mediante análisis avanzado, 
              visualización y machine learning
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="w-full sm:w-auto shadow-glow hover:shadow-lg transition-all"
              asChild
            >
              <a href="https://github.com/tu-usuario" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-5 w-5" />
                Ver GitHub
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
              asChild
            >
              <a href="https://linkedin.com/in/tu-perfil" target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-2 h-5 w-5" />
                LinkedIn
              </a>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto"
              asChild
            >
              <a href="#contacto">
                <Download className="mr-2 h-5 w-5" />
                Descargar CV
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <a 
        href="#sobre-mi" 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10"
        aria-label="Scroll hacia abajo"
      >
        <ChevronDown className="h-8 w-8 text-primary" />
      </a>
    </section>
  );
};

export default Hero;
