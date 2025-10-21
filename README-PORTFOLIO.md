# Profesional Chef - Sitio Profesional con React + Supabase

Un portafolio profesional moderno construido con React, TypeScript, Tailwind CSS y Supabase, que incluye integración con GitHub, gestión de certificaciones, sistema de contacto y panel de administración.

## 🚀 Características

### ✨ Funcionalidades Principales
- **Integración con GitHub**: Sincronización automática de proyectos desde repositorios públicos
- **Gestión de Certificaciones**: Sistema completo para agregar, editar y mostrar certificaciones
- **Sistema de Contacto**: Formulario de contacto funcional con gestión de mensajes
- **Descarga de CV**: Sistema para compartir y descargar CV en PDF
- **WhatsApp Integration**: Botón flotante para contacto directo por WhatsApp
- **Panel de Administración**: Interfaz completa para gestionar todo el contenido
- **Datos Personales**: Gestión centralizada de información personal

### 🛠️ Tecnologías
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State Management**: React Context + Custom Hooks
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

## 📋 Configuración Inicial

### 1. Configurar Supabase

#### Crear Proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Ve a **Settings** → **API** y copia:
   - Project URL
   - anon public key

#### Configurar Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu_url_de_proyecto_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_supabase
```

#### Ejecutar Migraciones
Ejecuta el archivo SQL en el SQL Editor de Supabase:

```sql
-- Copia y pega el contenido de supabase-migrations/001_create_tables.sql
```

### 2. Instalar Dependencias

```bash
npm install
# o
yarn install
# o
pnpm install
```

### 3. Ejecutar el Proyecto

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

## 🎯 Uso del Sistema

### Panel de Administración
Accede a `/admin` para gestionar todo el contenido:

#### 1. Datos Personales
- Configura tu nombre, profesión y descripción
- Agrega enlaces a redes sociales
- Configura número de WhatsApp
- Sube imagen de perfil

#### 2. Configuración de GitHub
- Conecta tu cuenta de GitHub
- Selecciona repositorios para mostrar
- Sincroniza proyectos automáticamente
- Gestiona tecnologías y estados

#### 3. Certificaciones
- Agrega certificaciones y cursos
- Sube imágenes y archivos PDF
- Configura URLs de verificación
- Organiza por fecha e institución

#### 4. Gestión de CV
- Sube tu CV a Google Drive o similar
- Configura URL pública para descarga
- Gestiona versiones del archivo

#### 5. Mensajes de Contacto
- Revisa mensajes recibidos
- Marca como leídos/no leídos
- Responde por email
- Busca y filtra mensajes

### Funcionalidades del Frontend

#### Botón de WhatsApp
```tsx
import { WhatsAppButton, WhatsAppFloatingButton } from '@/components/WhatsAppButton';

// Botón normal
<WhatsAppButton message="Hola! Me interesa tu trabajo." />

// Botón flotante
<WhatsAppFloatingButton />
```

#### Descarga de CV
```tsx
import { CVDownload } from '@/components/CVDownload';

<CVDownload variant="outline" size="lg" />
```

#### Formulario de Contacto
```tsx
import { ContactForm } from '@/components/ContactForm';

<ContactForm onSuccess={() => console.log('Mensaje enviado')} />
```

## 🔧 Servicios Disponibles

### ProjectsService
```typescript
import { ProjectsService } from '@/services/projectsService';

// Obtener todos los proyectos
const projects = await ProjectsService.getAllProjects();

// Sincronizar desde GitHub
const syncedProjects = await ProjectsService.syncFromGitHub(username, selectedRepos);
```

### CertificationsService
```typescript
import { CertificationsService } from '@/services/certificationsService';

// Obtener certificaciones
const certifications = await CertificationsService.getAllCertifications();

// Crear nueva certificación
const newCert = await CertificationsService.createCertification(certificationData);
```

### PersonalDataService
```typescript
import { PersonalDataService } from '@/services/personalDataService';

// Obtener datos personales
const personalData = await PersonalDataService.getPersonalData();

// Obtener URL de WhatsApp
const whatsappUrl = await PersonalDataService.getWhatsAppUrl("Mensaje personalizado");
```

### ContactService
```typescript
import { ContactService } from '@/services/contactService';

// Enviar mensaje
await ContactService.sendMessage(messageData);

// Obtener mensajes no leídos
const unreadMessages = await ContactService.getUnreadMessages();
```

## 🎨 Personalización

### Temas y Colores
El proyecto usa Tailwind CSS con variables CSS personalizables. Modifica `src/index.css` para cambiar colores y temas.

### Componentes UI
Todos los componentes UI están en `src/components/ui/` y siguen el sistema de diseño de shadcn/ui.

### Layout y Estructura
- `src/pages/Index.tsx`: Página principal del portafolio
- `src/pages/Admin.tsx`: Panel de administración
- `src/components/`: Componentes reutilizables
- `src/services/`: Servicios para interactuar con Supabase

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en Vercel
3. Despliega automáticamente

### Netlify
1. Conecta tu repositorio a Netlify
2. Configura las variables de entorno
3. Configura el build command: `npm run build`

### Otras Plataformas
El proyecto es una SPA estática que puede desplegarse en cualquier servicio de hosting estático.

## 🔒 Seguridad

- Las variables de entorno están protegidas
- Supabase maneja la autenticación y autorización
- Los datos sensibles se almacenan en Supabase
- Las URLs de archivos deben ser públicas para funcionar

## 📝 Notas Importantes

1. **GitHub API**: Usa la API pública de GitHub (no requiere token para repositorios públicos)
2. **Archivos**: Los CVs y certificaciones deben estar en URLs públicas
3. **WhatsApp**: El número debe incluir código de país (ej: +1234567890)
4. **Supabase**: Asegúrate de configurar las políticas RLS si es necesario

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:
1. Revisa la documentación de Supabase
2. Verifica las variables de entorno
3. Revisa la consola del navegador para errores
4. Abre un issue en GitHub

---

¡Disfruta construyendo tu portafolio profesional! 🎉





