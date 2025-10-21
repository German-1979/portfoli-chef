import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageSquare, Mail, User, Calendar, Eye, EyeOff, Trash2, Search, CheckCircle, AlertCircle } from 'lucide-react';
import { ContactService } from '@/services/contactService';
import { ContactMessage } from '@/types';

export function ContactMessagesPanel() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUnread, setFilterUnread] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Cargar mensajes
  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const [allMessages, count] = await Promise.all([
        ContactService.getAllMessages(),
        ContactService.getUnreadCount()
      ]);
      setMessages(allMessages);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await ContactService.markAsRead(messageId);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, read_status: true } : msg
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await ContactService.markAllAsRead();
      setMessages(prev => 
        prev.map(msg => ({ ...msg, read_status: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all messages as read:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este mensaje?')) return;

    try {
      await ContactService.deleteMessage(messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadMessages();
      return;
    }

    try {
      const results = await ContactService.searchMessages(searchTerm);
      setMessages(results);
    } catch (error) {
      console.error('Error searching messages:', error);
    }
  };

  // Filtrar mensajes
  const filteredMessages = messages.filter(message => {
    if (filterUnread && message.read_status) return false;
    return true;
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando mensajes...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas y controles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total mensajes</p>
                <p className="text-2xl font-bold">{messages.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sin leer</p>
                <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
              </div>
              <EyeOff className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Leídos</p>
                <p className="text-2xl font-bold text-green-600">{messages.length - unreadCount}</p>
              </div>
              <Eye className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles de búsqueda y filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Gestionar Mensajes</CardTitle>
          <CardDescription>
            Busca y gestiona los mensajes de contacto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Input
                  placeholder="Buscar por nombre, email o mensaje..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button onClick={handleSearch}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterUnread ? "default" : "outline"}
                onClick={() => setFilterUnread(!filterUnread)}
              >
                <EyeOff className="w-4 h-4 mr-2" />
                Solo sin leer
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  onClick={handleMarkAllAsRead}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Marcar todos como leídos
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de mensajes */}
      <Card>
        <CardHeader>
          <CardTitle>Mensajes ({filteredMessages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredMessages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No hay mensajes</p>
              <p className="text-sm">
                {searchTerm ? 'No se encontraron mensajes con ese criterio' : 'Los mensajes aparecerán aquí cuando recibas contactos'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    !message.read_status ? 'bg-blue-50 border-blue-200' : 'bg-white'
                  }`}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (!message.read_status) {
                      handleMarkAsRead(message.id);
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{message.name}</h3>
                        {!message.read_status && (
                          <Badge variant="destructive" className="text-xs">
                            Nuevo
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {message.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(message.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      {message.subject && (
                        <p className="font-medium text-gray-800 mb-1">{message.subject}</p>
                      )}
                      <p className="text-gray-700 line-clamp-2">{message.message}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMessage(message.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de mensaje detallado */}
      {selectedMessage && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {selectedMessage.name}
                </CardTitle>
                <CardDescription>
                  {selectedMessage.email} • {new Date(selectedMessage.created_at).toLocaleString()}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => setSelectedMessage(null)}
              >
                Cerrar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {selectedMessage.subject && (
              <div className="mb-4">
                <h3 className="font-medium text-lg">{selectedMessage.subject}</h3>
              </div>
            )}
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>
            <div className="mt-6 flex gap-2">
              <Button
                variant="outline"
                onClick={() => window.open(`mailto:${selectedMessage.email}`)}
              >
                <Mail className="w-4 h-4 mr-2" />
                Responder por email
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDeleteMessage(selectedMessage.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar mensaje
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}



