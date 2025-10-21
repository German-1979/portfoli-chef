-- Crear tabla de proyectos
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  long_description TEXT,
  github_url VARCHAR(500) NOT NULL,
  demo_url VARCHAR(500),
  technologies TEXT[], -- Array de tecnologías
  image_url VARCHAR(500),
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('in-progress', 'completed')),
  github_repo_id INTEGER, -- ID del repositorio en GitHub
  github_updated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de certificaciones
CREATE TABLE IF NOT EXISTS certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  institution VARCHAR(255) NOT NULL,
  date_obtained DATE NOT NULL,
  verification_url VARCHAR(500),
  image_url VARCHAR(500),
  file_url VARCHAR(500), -- Para archivos PDF
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de datos personales
CREATE TABLE IF NOT EXISTS personal_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  profession VARCHAR(255) NOT NULL,
  short_description TEXT,
  email VARCHAR(255),
  phone VARCHAR(50),
  whatsapp_number VARCHAR(50),
  linkedin_url VARCHAR(500),
  github_username VARCHAR(100),
  cv_url VARCHAR(500),
  profile_image_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de configuración de GitHub
CREATE TABLE IF NOT EXISTS github_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  selected_repos TEXT[], -- Array de nombres de repositorios
  sync_enabled BOOLEAN DEFAULT true,
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de mensajes de contacto
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  read_status BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_certifications_date ON certifications(date_obtained);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(read_status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);

