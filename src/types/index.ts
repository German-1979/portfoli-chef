// Tipos para el sistema de gestión del sitio profesional con Supabase

export interface Project {
  id: string;
  name: string;
  description: string | null;
  long_description: string | null;
  github_url: string;
  demo_url: string | null;
  technologies: string[];
  image_url: string | null;
  status: 'in-progress' | 'completed';
  github_repo_id: number | null;
  github_updated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: string;
  name: string;
  institution: string;
  date_obtained: string;
  verification_url: string | null;
  image_url: string | null;
  file_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PersonalData {
  id: string;
  full_name: string;
  profession: string;
  short_description: string | null;
  hero_description: string | null;
  about_description: string | null;
  email: string | null;
  phone: string | null;
  whatsapp_number: string | null;
  linkedin_url: string | null;
  github_username: string | null;
  cv_url: string | null;
  profile_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface GitHubConfig {
  id: string;
  username: string;
  selected_repos: string[];
  sync_enabled: boolean;
  last_sync: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read_status: boolean;
  created_at: string;
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

// Tipos para GitHub API
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  languages_url: string;
  updated_at: string;
  created_at: string;
  pushed_at: string;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
}
