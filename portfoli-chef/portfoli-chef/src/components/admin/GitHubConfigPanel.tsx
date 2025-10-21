import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Github, RefreshCw, CheckCircle, AlertCircle, Star, Calendar } from 'lucide-react';
import { useGitHubIntegration } from '@/hooks/useGitHubIntegration';
import { toast } from 'sonner';

export function GitHubConfigPanel() {
  const {
    config,
    user,
    repos,
    loading,
    error,
    configureGitHub,
    syncProjects,
    updateSelectedRepos,
    getAvailableRepos,
    clearError
  } = useGitHubIntegration();

  const [username, setUsername] = useState('');
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Cargar configuración existente
  useEffect(() => {
    if (config) {
      setUsername(config.username);
      setSelectedRepos(config.selected_repos);
    }
  }, [config]);

  const handleConfigure = async () => {
    if (!username.trim()) return;

    setIsConfiguring(true);
    clearError();

    try {
      await configureGitHub(username.trim(), selectedRepos);
    } catch (error) {
      console.error('Error configuring GitHub:', error);
    } finally {
      setIsConfiguring(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    clearError();

    try {
      await syncProjects();
      toast.success('Proyectos sincronizados correctamente');
    } catch (error) {
      console.error('Error syncing projects:', error);
      toast.error('Error al sincronizar proyectos');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveSelection = async () => {
    setIsSaving(true);
    clearError();

    try {
      await updateSelectedRepos(selectedRepos);
      toast.success(`Selección guardada: ${selectedRepos.length} repositorios seleccionados`);
      
      // Recargar la configuración inmediatamente para asegurar sincronización
      try {
        const updatedConfig = await GitHubService.getGitHubConfig();
        if (updatedConfig) {
          setConfig(updatedConfig);
          setSelectedRepos(updatedConfig.selected_repos);
          console.log('Configuración recargada exitosamente:', updatedConfig);
        }
      } catch (error) {
        console.error('Error reloading config:', error);
      }
      
    } catch (error) {
      console.error('Error saving selection:', error);
      toast.error('Error al guardar la selección');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRepoToggle = (repoName: string) => {
    setSelectedRepos(prev => 
      prev.includes(repoName) 
        ? prev.filter(name => name !== repoName)
        : [...prev, repoName]
    );
  };

  const availableRepos = getAvailableRepos();

  return (
    <div className="space-y-6">
      {/* Configuración principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            Configuración de GitHub
          </CardTitle>
          <CardDescription>
            Conecta tu cuenta de GitHub para sincronizar proyectos automáticamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Usuario de GitHub</Label>
            <div className="flex gap-2">
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="tu-usuario-github"
                disabled={isConfiguring}
              />
              <Button 
                onClick={handleConfigure}
                disabled={isConfiguring || !username.trim()}
              >
                {isConfiguring ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Configurando...
                  </>
                ) : (
                  'Configurar'
                )}
              </Button>
            </div>
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {user && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-green-800">
                Conectado como <strong>{user.name || user.login}</strong>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Información del usuario */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>Información del Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <img 
                src={user.avatar_url} 
                alt={user.name || user.login}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="font-semibold">{user.name || user.login}</h3>
                <p className="text-sm text-gray-600">@{user.login}</p>
                {user.bio && <p className="text-sm mt-1">{user.bio}</p>}
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <span>{user.public_repos} repositorios</span>
                  <span>{user.followers} seguidores</span>
                  <span>{user.following} siguiendo</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selección de repositorios */}
      {repos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Seleccionar Repositorios</CardTitle>
            <CardDescription>
              Elige qué repositorios quieres mostrar en tu portafolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {selectedRepos.length} de {repos.length} repositorios seleccionados
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRepos(repos.map(r => r.name))}
                >
                  Seleccionar todos
                </Button>
              </div>

              <Separator />

              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {availableRepos.map((repo) => (
                  <div key={repo.value} className="flex items-center space-x-3">
                    <Checkbox
                      id={repo.value}
                      checked={selectedRepos.includes(repo.value)}
                      onCheckedChange={() => handleRepoToggle(repo.value)}
                    />
                    <div className="flex-1 min-w-0">
                      <Label 
                        htmlFor={repo.value}
                        className="font-medium cursor-pointer"
                      >
                        {repo.label}
                      </Label>
                      {repo.description && (
                        <p className="text-sm text-gray-600 truncate">
                          {repo.description}
                        </p>
                      )}
                      <div className="flex gap-2 mt-1">
                        {repo.language && (
                          <Badge variant="secondary" className="text-xs">
                            {repo.language}
                          </Badge>
                        )}
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Star className="w-3 h-3" />
                          {repo.stars}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(repo.updated).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSaveSelection}
                  disabled={selectedRepos.length === 0 || isSaving}
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    'Guardar Selección'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSync}
                  disabled={isSyncing || !config}
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Sincronizando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Sincronizar Proyectos
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado de sincronización */}
      {config && (
        <Card>
          <CardHeader>
            <CardTitle>Estado de Sincronización</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Última sincronización:</span>
                <span className="text-sm font-medium">
                  {config.last_sync 
                    ? new Date(config.last_sync).toLocaleString()
                    : 'Nunca'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sincronización automática:</span>
                <Badge variant={config.sync_enabled ? "default" : "secondary"}>
                  {config.sync_enabled ? 'Activada' : 'Desactivada'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


