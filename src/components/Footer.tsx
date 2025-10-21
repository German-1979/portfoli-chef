import { Github, Linkedin, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { PersonalDataService } from '@/services/personalDataService';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [socialLinks, setSocialLinks] = useState([
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/German-1979',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://www.linkedin.com/in/gerdoming/',
    },
  ]);

  useEffect(() => {
    const loadPersonalData = async () => {
      try {
        const personalData = await PersonalDataService.getPersonalData();
        if (personalData) {
          const updatedLinks = [];
          
          if (personalData.github_username) {
            updatedLinks.push({
              name: 'GitHub',
              icon: Github,
              url: `https://github.com/${personalData.github_username}`,
            });
          }
          
          if (personalData.linkedin_url) {
            updatedLinks.push({
              name: 'LinkedIn',
              icon: Linkedin,
              url: personalData.linkedin_url,
            });
          }
          
          setSocialLinks(updatedLinks);
        }
      } catch (error) {
        console.error('Error loading personal data:', error);
      }
    };

    loadPersonalData();
  }, []);

  const quickLinks = [
    { name: 'Inicio', href: '#hero' },
    { name: 'Sobre Mí', href: '#sobre-mi' },
    { name: 'Proyectos', href: '#proyectos' },
    { name: 'Certificaciones', href: '#certificaciones' },
    { name: 'Contacto', href: '#contacto' },
  ];

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Columna 1 - Marca */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gradient">Profesional</h3>
            <p className="text-sm text-muted-foreground">
              Ingeniero y Analista de Datos apasionado por transformar datos en insights accionables.
            </p>
          </div>

          {/* Columna 2 - Enlaces rápidos */}
          <div className="space-y-4">
            <h4 className="font-semibold">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3 - Redes sociales */}
          <div className="space-y-4">
            <h4 className="font-semibold">Sígueme</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            © {currentYear} Profesional. Hecho con{' '}
            <Heart className="h-4 w-4 text-destructive fill-current" /> por Tu Nombre
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
