import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Certifications from '@/components/Certifications';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const Index = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = '+56934163136'; // Tu número de WhatsApp
    const message = encodeURIComponent('Hola! Me interesa contactarte sobre tu trabajo.');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <About />
        <Projects />
        <Certifications />
        <Contact />
      </main>
      <Footer />
      {/* Botón de WhatsApp flotante simplificado */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleWhatsAppClick}
          size="lg"
          className="rounded-full shadow-lg hover:shadow-xl transition-shadow bg-green-600 hover:bg-green-700 text-white"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
