import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Github, FileText, MessageSquare, User, Award } from 'lucide-react';
import { PersonalDataPanel } from './PersonalDataPanel';
import { GitHubConfigPanel } from './GitHubConfigPanel';
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
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="github" className="flex items-center gap-2">
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </TabsTrigger>
            <TabsTrigger value="certifications" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Certificaciones</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Mensajes</span>
            </TabsTrigger>
            <TabsTrigger value="cv" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">CV</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Datos Personales
                </CardTitle>
                <CardDescription>
                  Gestiona tu información personal y profesional
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PersonalDataPanel />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="github" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="w-5 h-5" />
                  Configuración de GitHub
                </CardTitle>
                <CardDescription>
                  Configura la integración con GitHub para sincronizar tus proyectos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GitHubConfigPanel />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Certificaciones
                </CardTitle>
                <CardDescription>
                  Gestiona tus certificaciones profesionales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CertificationsPanel />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Mensajes de Contacto
                </CardTitle>
                <CardDescription>
                  Revisa y gestiona los mensajes recibidos a través del formulario de contacto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContactMessagesPanel />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cv" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Gestión de CV
                </CardTitle>
                <CardDescription>
                  Sube y gestiona tu currículum vitae
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CVManagementPanel />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

