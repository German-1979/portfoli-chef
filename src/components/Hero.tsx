import React, { useState, useEffect } from 'react';
import { Linkedin, Download, ChevronDown, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PersonalDataService } from '@/services/personalDataService';
import { PersonalData } from '@/types';
import heroBackground from '@/assets/hero-background.jpg';
import profilePlaceholder from '@/assets/profile-placeholder.jpg';
import imagePerfil from '@/assets/Image_perfil.jpeg';

const Hero = () => {
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPersonalData();
  }, []);

  const loadPersonalData = async () => {
    try {
      const data = await PersonalDataService.getPersonalData();
      console.log('Personal data loaded:', data); // Debug log
      setPersonalData(data);
    } catch (error) {
      console.error('Error loading personal data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Datos por defecto si no hay datos en Supabase
  const defaultData = {
    full_name: 'Tu Nombre',
    profession: 'Ingeniero y Analista de Datos',
    hero_description: 'Transformando datos en insights accionables mediante análisis avanzado, visualización y machine learning',
    github_username: 'tu-usuario',
    linkedin_url: 'https://linkedin.com/in/tu-perfil',
    profile_image_url: null
  };

  const data = personalData || defaultData;

  // Función para manejar WhatsApp
  const handleWhatsAppClick = async () => {
    try {
      const whatsappUrl = await PersonalDataService.getWhatsAppUrl('Hola! Me interesa contactarte sobre tu trabajo.');
      if (whatsappUrl) {
        window.open(whatsappUrl, '_blank');
      } else {
        alert('Número de WhatsApp no configurado');
      }
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      alert('Error al abrir WhatsApp');
    }
  };

  return (
    <section id="hero" className="relative min-h-[80vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
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
      <div className="container mx-auto px-4 py-8 sm:py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 animate-fade-in-up">
          {/* Imagen de perfil */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-full blur-2xl opacity-30 animate-glow"></div>
              <img
                src={data.profile_image_url || imagePerfil}
                alt="Foto de perfil"
                className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full object-cover border-4 border-primary shadow-glow"
              />
            </div>
          </div>

          {/* Texto principal */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
              <span className="text-gradient">{data.full_name}</span>
            </h1>
            <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-muted-foreground">
              {data.profession}
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl font-normal text-muted-foreground max-w-2xl mx-auto">
              {data.hero_description || 'Transformando datos en insights accionables mediante análisis avanzado, visualización y machine learning'}
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 pt-1 sm:pt-2">
            <Button
              size="default"
              className="w-full sm:w-auto shadow-glow hover:shadow-lg transition-all bg-green-600 hover:bg-green-700 text-white"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
            <Button
              size="default"
              variant="outline"
              className="w-full sm:w-auto"
              asChild
            >
              <a 
                href={data.linkedin_url || 'https://linkedin.com/in/tu-perfil'} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </a>
            </Button>
            <Button
              size="default"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={async () => {
                try {
                  // Intentar obtener CV desde Supabase
                  const cvUrl = await PersonalDataService.getCVUrl();
                  if (cvUrl) {
                    window.open(cvUrl, '_blank');
                  } else {
                    // Fallback: usar URL directa si está disponible
                    const fallbackUrl = 'https://drive.google.com/uc?export=download&id=TU_ID_DEL_ARCHIVO';
                    if (fallbackUrl.includes('TU_ID_DEL_ARCHIVO')) {
                      alert('CV no disponible. Por favor configura la URL del CV en el panel de administración.');
                    } else {
                      window.open(fallbackUrl, '_blank');
                    }
                  }
                } catch (error) {
                  console.error('Error downloading CV:', error);
                  alert('Error al descargar el CV. Verifica la consola para más detalles.');
                }
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Descargar CV
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
