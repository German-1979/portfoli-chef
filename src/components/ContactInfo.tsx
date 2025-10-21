import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PersonalDataService } from '@/services/personalDataService';
import { PersonalData } from '@/types';

const ContactInfo = () => {
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

  const handleCVDownload = () => {
    if (personalData?.cv_url) {
      // Abrir el CV en una nueva pestaña
      window.open(personalData.cv_url, '_blank');
    } else {
      console.error('CV URL not available');
      alert('CV no disponible. Por favor, configura la URL del CV en el panel de administración.');
    }
  };

  if (loading) {
    return (
      <Card className="gradient-card border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gradient-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mail className="h-5 w-5 text-primary" />
          <span>Información de Contacto</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email */}
        <div>
          <h4 className="font-semibold mb-2">Email</h4>
          {personalData?.email ? (
            <a 
              href={`mailto:${personalData.email}`}
              className="text-primary hover:underline"
            >
              {personalData.email}
            </a>
          ) : (
            <span className="text-muted-foreground">tu-email@ejemplo.com</span>
          )}
        </div>

        {/* Ubicación */}
        <div>
          <h4 className="font-semibold mb-2">Ubicación</h4>
          <p className="text-muted-foreground">Santiago, Chile</p>
        </div>

        {/* Disponibilidad */}
        <div>
          <h4 className="font-semibold mb-2">Disponibilidad</h4>
          <p className="text-muted-foreground">
            Proyectos freelance, oportunidades de colaboración y contratación directa
          </p>
        </div>

        {/* Descarga de CV */}
        <div className="pt-4">
          <h4 className="font-semibold mb-4">Descarga mi CV</h4>
          <Button 
            onClick={handleCVDownload}
            className="w-full shadow-glow"
            disabled={!personalData?.cv_url}
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar CV (PDF)
          </Button>
          {!personalData?.cv_url && (
            <p className="text-xs text-muted-foreground mt-2">
              Configura la URL del CV en el panel de administración
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfo;
