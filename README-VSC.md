# Portfolio Chef - Instrucciones para Visual Studio Code

## Configuración inicial

1. Clona el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd portfoli-chef
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea el archivo `.env` en la raíz del proyecto con las siguientes variables:
```
VITE_SUPABASE_URL=https://hbyynqvonuzvnodptjro.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhieXlucXZvbnV6dm5vZHB0anJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg0NzE3NzAsImV4cCI6MjAyNDA0Nzc3MH0.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhieXlucXZvbnV6dm5vZHB0anJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg0NzE3NzAsImV4cCI6MjAyNDA0Nzc3MH0
```

4. Ejecuta el proyecto:
```bash
npm run dev
```

## Estructura del proyecto

- `src/` - Código fuente principal
- `public/` - Archivos estáticos
- `supabase/` - Configuración de Supabase
- `supabase-migrations/` - Migraciones de base de datos
- `.env` - Variables de entorno (NO incluir en git)

## Funcionalidades principales

1. **Portfolio personal** con información profesional
2. **Panel de administración** para gestionar:
   - Datos personales
   - Proyectos
   - Certificaciones
   - Mensajes de contacto
   - Configuración de GitHub
3. **Integración con Supabase** para almacenamiento de datos
4. **Integración con GitHub** para mostrar repositorios
5. **Sistema de contacto** con WhatsApp y formulario de contacto

## Comandos útiles

```bash
# Desarrollo
npm run dev

# Construcción para producción
npm run build

# Vista previa de producción
npm run preview

# Linting
npm run lint
```

## Notas importantes

- El proyecto usa Vite como bundler
- Tailwind CSS para estilos
- Supabase para backend
- React Router para navegación
- TypeScript para tipado
