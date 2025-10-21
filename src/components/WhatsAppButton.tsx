import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PersonalDataService } from '@/services/personalDataService';

interface WhatsAppButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  message?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
}

export function WhatsAppButton({ 
  className = '',
  variant = 'default',
  size = 'default',
  message,
  children = 'Contactar por WhatsApp',
  showIcon = true
}: WhatsAppButtonProps) {
  const [whatsappUrl, setWhatsappUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const getWhatsAppUrl = async () => {
      try {
        const url = await PersonalDataService.getWhatsAppUrl(message);
        setWhatsappUrl(url);
      } catch (error) {
        console.error('Error getting WhatsApp URL:', error);
      } finally {
        setLoading(false);
      }
    };

    getWhatsAppUrl();
  }, [message]);

  const handleClick = () => {
    if (whatsappUrl) {
      window.open(whatsappUrl, '_blank');
    } else {
      alert('Número de WhatsApp no configurado');
    }
  };

  if (loading) {
    return (
      <Button
        variant={variant}
        size={size}
        className={`${className}`}
        disabled
      >
        {showIcon && <MessageCircle className="w-4 h-4 mr-2" />}
        Cargando...
      </Button>
    );
  }

  if (!whatsappUrl) {
    return (
      <Button
        variant={variant}
        size={size}
        className={`${className}`}
        disabled
      >
        {showIcon && <MessageCircle className="w-4 h-4 mr-2" />}
        WhatsApp no disponible
      </Button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={`${className} bg-green-600 hover:bg-green-700 text-white`}
    >
      {showIcon && <MessageCircle className="w-4 h-4 mr-2" />}
      {children}
    </Button>
  );
}

// Componente flotante de WhatsApp
export function WhatsAppFloatingButton({ 
  message = 'Hola! Me interesa contactarte sobre tu trabajo.',
  className = ''
}: { message?: string; className?: string }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <WhatsAppButton
        variant="default"
        size="lg"
        message={message}
        className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        <MessageCircle className="w-6 h-6" />
      </WhatsAppButton>
    </div>
  );
}

// Componente para mostrar el estado de WhatsApp
export function WhatsAppStatus() {
  const [whatsappNumber, setWhatsappNumber] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkWhatsAppStatus = async () => {
      try {
        const number = await PersonalDataService.getWhatsAppNumber();
        setWhatsappNumber(number);
      } catch (error) {
        console.error('Error checking WhatsApp status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkWhatsAppStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center text-sm text-muted-foreground">
        <Phone className="w-4 h-4 mr-2" />
        Verificando WhatsApp...
      </div>
    );
  }

  if (!whatsappNumber) {
    return (
      <div className="flex items-center text-sm text-muted-foreground">
        <Phone className="w-4 h-4 mr-2" />
        WhatsApp no configurado
      </div>
    );
  }

  return (
    <div className="flex items-center text-sm text-green-600">
      <Phone className="w-4 h-4 mr-2" />
      WhatsApp disponible
    </div>
  );
}

// Hook para usar WhatsApp en cualquier componente
export function useWhatsApp() {
  const [whatsappUrl, setWhatsappUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  const getWhatsAppUrl = React.useCallback(async (message?: string) => {
    try {
      const url = await PersonalDataService.getWhatsAppUrl(message);
      setWhatsappUrl(url);
      return url;
    } catch (error) {
      console.error('Error getting WhatsApp URL:', error);
      return null;
    }
  }, []);

  React.useEffect(() => {
    getWhatsAppUrl().finally(() => setLoading(false));
  }, [getWhatsAppUrl]);

  const openWhatsApp = React.useCallback((message?: string) => {
    if (message) {
      getWhatsAppUrl(message).then(url => {
        if (url) window.open(url, '_blank');
      });
    } else if (whatsappUrl) {
      window.open(whatsappUrl, '_blank');
    }
  }, [whatsappUrl, getWhatsAppUrl]);

  return {
    whatsappUrl,
    loading,
    openWhatsApp,
    getWhatsAppUrl
  };
}





