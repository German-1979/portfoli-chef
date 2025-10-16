import React, { createContext, useContext, useState, useEffect } from 'react';
import { Certification } from '@/types';

interface CertificationsContextType {
  certifications: Certification[];
  addCertification: (certification: Omit<Certification, 'id'>) => void;
  updateCertification: (id: string, certification: Partial<Certification>) => void;
  deleteCertification: (id: string) => void;
}

const CertificationsContext = createContext<CertificationsContextType | undefined>(undefined);

export function CertificationsProvider({ children }: { children: React.ReactNode }) {
  const [certifications, setCertifications] = useState<Certification[]>(() => {
    const stored = localStorage.getItem('certifications');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('certifications', JSON.stringify(certifications));
  }, [certifications]);

  const addCertification = (certification: Omit<Certification, 'id'>) => {
    const newCertification: Certification = {
      ...certification,
      id: crypto.randomUUID(),
    };
    setCertifications(prev => [...prev, newCertification]);
  };

  const updateCertification = (id: string, updatedData: Partial<Certification>) => {
    setCertifications(prev =>
      prev.map(cert =>
        cert.id === id ? { ...cert, ...updatedData } : cert
      )
    );
  };

  const deleteCertification = (id: string) => {
    setCertifications(prev => prev.filter(cert => cert.id !== id));
  };

  return (
    <CertificationsContext.Provider value={{ certifications, addCertification, updateCertification, deleteCertification }}>
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
