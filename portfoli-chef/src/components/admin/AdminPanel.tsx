import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Github, FileText, MessageSquare, User, Award } from 'lucide-react';
import { GitHubConfigPanel } from './GitHubConfigPanel';
import { PersonalDataPanel } from './PersonalDataPanel';
import { CertificationsPanel } from './CertificationsPanel';
import { ContactMessagesPanel } from './ContactMessagesPanel';
import { CVManagementPanel } from './CVManagementPanel';

interface AdminPanelProps {
  className?: string;
}

export function AdminPanel({ className = '' }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('personal');

  return (
    <div className={`min-h-screen bg-gray-50 p-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600">
            Gestiona tu portafolio profesional desde aquí
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Datos Personales</span>
            </TabsTrigger>
            <TabsTrigger value="github" className="flex items-center gap-2">
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </TabsTrigger>
            <TabsTrigger value="certifications" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Certificaciones</span>
            </TabsTrigger>
            <TabsTrigger value="cv" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">CV</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Mensajes</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <PersonalDataPanel />
          </TabsContent>

          <TabsContent value="github" className="space-y-6">
            <GitHubConfigPanel />
          </TabsContent>

          <TabsContent value="certifications" className="space-y-6">
            <CertificationsPanel />
          </TabsContent>

          <TabsContent value="cv" className="space-y-6">
            <CVManagementPanel />
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <ContactMessagesPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Componente de estadísticas rápidas
export function AdminStats() {
  const [stats, setStats] = useState({
    projects: 0,
    certifications: 0,
    unreadMessages: 0,
    lastSync: null as string | null
  });

  React.useEffect(() => {
    // Aquí cargarías las estadísticas desde los servicios
    // Por ahora las dejamos como placeholder
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Proyectos</CardTitle>
          <Github className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.projects}</div>
          <p className="text-xs text-muted-foreground">
            Proyectos sincronizados
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Certificaciones</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.certifications}</div>
          <p className="text-xs text-muted-foreground">
            Certificados registrados
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mensajes</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.unreadMessages}</div>
          <p className="text-xs text-muted-foreground">
            Mensajes sin leer
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Última Sincronización</CardTitle>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.lastSync ? 'Hoy' : 'Nunca'}
          </div>
          <p className="text-xs text-muted-foreground">
            Con GitHub
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
