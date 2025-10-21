import React, { createContext, useContext, useState, useEffect } from 'react';
import { Certification } from '@/types';
import { CertificationsService } from '@/services/certificationsService';

interface CertificationsContextType {
  certifications: Certification[];
  loading: boolean;
  error: string | null;
  addCertification: (certification: Omit<Certification, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateCertification: (id: string, certification: Partial<Certification>) => Promise<void>;
  deleteCertification: (id: string) => Promise<void>;
  refreshCertifications: () => Promise<void>;
}

const CertificationsContext = createContext<CertificationsContextType | undefined>(undefined);

export function CertificationsProvider({ children }: { children: React.ReactNode }) {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar certificaciones al inicializar
  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CertificationsService.getAllCertifications();
      setCertifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar certificaciones');
      console.error('Error loading certifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const addCertification = async (certification: Omit<Certification, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      const newCertification = await CertificationsService.createCertification(certification);
      setCertifications(prev => [newCertification, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar certificación');
      throw err;
    }
  };

  const updateCertification = async (id: string, updatedData: Partial<Certification>) => {
    try {
      setError(null);
      const updated = await CertificationsService.updateCertification(id, updatedData);
      setCertifications(prev =>
        prev.map(cert =>
          cert.id === id ? updated : cert
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar certificación');
      throw err;
    }
  };

  const deleteCertification = async (id: string) => {
    try {
      setError(null);
      await CertificationsService.deleteCertification(id);
      setCertifications(prev => prev.filter(cert => cert.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar certificación');
      throw err;
    }
  };

  const refreshCertifications = async () => {
    await loadCertifications();
  };

  return (
    <CertificationsContext.Provider value={{ 
      certifications, 
      loading, 
      error, 
      addCertification, 
      updateCertification, 
      deleteCertification, 
      refreshCertifications 
    }}>
      {children}
    </CertificationsContext.Provider>
  );
}

export function useCertifications() {
  const context = useContext(CertificationsContext);
  if (context === undefined) {
    throw new Error('useCertifications debe usarse dentro de CertificationsProvider');
  }
  return context;
}
