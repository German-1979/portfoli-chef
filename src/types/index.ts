// Tipos para el sistema de gestión del portfolio

export interface Project {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  githubUrl: string;
  demoUrl?: string;
  technologies: string[];
  image?: string;
  createdAt: string;
  status: 'in-progress' | 'completed';
}

export interface Certification {
  id: string;
  name: string;
  institution: string;
  dateObtained: string;
  verificationUrl?: string;
  image?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Skill {
  category: string;
  items: string[];
}
