import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Upload, Download, ExternalLink, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import { PersonalDataService } from '@/services/personalDataService';

export function CVManagementPanel() {
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [newCvUrl, setNewCvUrl] = useState('');

  // Cargar URL del CV actual
  useEffect(() => {
    loadCVUrl();
  }, []);

  const loadCVUrl = async () => {
    try {
      const url = await PersonalDataService.getCVUrl();
      setCvUrl(url);
    } catch (error) {
      console.error('Error loading CV URL:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCV = async () => {
    if (!newCvUrl.trim()) return;

    setSaving(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      await PersonalDataService.updateCVUrl(newCvUrl.trim());
      setCvUrl(newCvUrl.trim());
      setNewCvUrl('');
      setStatus('success');
      
      // Limpiar el estado de éxito después de 3 segundos
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
      
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Error al actualizar el CV');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadCV = () => {
    if (!cvUrl) return;

    const link = document.createElement('a');
    link.href = cvUrl;
    link.download = 'CV.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRemoveCV = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar el CV?')) return;

    setSaving(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      await PersonalDataService.updateCVUrl('');
      setCvUrl(null);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Error al eliminar el CV');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando información del CV...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estado actual del CV */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Estado del CV
          </CardTitle>
          <CardDescription>
            Gestiona el archivo de tu CV que los visitantes pueden descargar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cvUrl ? (
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-800">
                  CV configurado correctamente
                </AlertDescription>
              </Alert>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-medium">CV.pdf</p>
                    <p className="text-sm text-gray-600">Archivo disponible para descarga</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadCV}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descargar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(cvUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveCV}
                    disabled={saving}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-yellow-800">
                No hay CV configurado. Los visitantes no podrán descargar tu CV.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Actualizar CV */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Actualizar CV
          </CardTitle>
          <CardDescription>
            Sube tu CV a un servicio de almacenamiento (Google Drive, Dropbox, etc.) y pega la URL aquí
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cv-url">URL del CV</Label>
            <Input
              id="cv-url"
              value={newCvUrl}
              onChange={(e) => setNewCvUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/... o https://tu-sitio.com/cv.pdf"
              disabled={saving}
            />
            <p className="text-sm text-gray-500">
              Asegúrate de que el archivo sea público y accesible
            </p>
          </div>

          {/* Estados de respuesta */}
          {status === 'success' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-green-800">
                CV actualizado correctamente
              </AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800">
                {errorMessage || 'Error al actualizar el CV'}
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleUpdateCV}
            disabled={saving || !newCvUrl.trim()}
            className="w-full"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Actualizando...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Actualizar CV
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Instrucciones */}
      <Card>
        <CardHeader>
          <CardTitle>Instrucciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="font-medium">1.</span>
              <span>Sube tu CV a Google Drive, Dropbox, o cualquier servicio de almacenamiento</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium">2.</span>
              <span>Configura el archivo como público para que cualquiera pueda acceder</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium">3.</span>
              <span>Copia la URL del archivo y pégalo en el campo de arriba</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium">4.</span>
              <span>Haz clic en "Actualizar CV" para guardar los cambios</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Para Google Drive, asegúrate de usar el enlace de descarga directa. 
              Puedes obtenerlo cambiando el formato de la URL de 
              <code className="bg-blue-100 px-1 rounded">/view</code> a 
              <code className="bg-blue-100 px-1 rounded">/export?format=pdf</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



