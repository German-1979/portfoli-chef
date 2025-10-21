# Debugging: Sincronización de Proyectos GitHub

## 🔍 **Guía de Debugging Paso a Paso**

He implementado un sistema robusto con **dos métodos** para refrescar proyectos y logs detallados para debugging.

## 📋 **Pasos para Verificar**

### **1. Abrir Consola del Navegador**
- Presiona `F12` para abrir las herramientas de desarrollador
- Ve a la pestaña **"Console"**

### **2. Ir al Admin**
- Ve a `http://localhost:8082/admin`
- Ve a la pestaña **"GitHub"**

### **3. Verificar Logs de Registro**
En la consola deberías ver:
```
Callback de refrescar proyectos registrado
```

### **4. Seleccionar Repositorios**
- Selecciona algunos repositorios
- Haz clic en **"Guardar Selección"**
- Deberías ver: `Selección guardada: X repositorios seleccionados`

### **5. Sincronizar Proyectos**
- Haz clic en **"Sincronizar Proyectos"**
- En la consola deberías ver:
```
Intentando refrescar proyectos en el contexto del sitio web...
Callback encontrado, ejecutando...
✅ Proyectos refrescados exitosamente en el contexto del sitio web
📡 Evento de refrescar proyectos enviado
```

### **6. Verificar en el Sitio Web**
- Ve a `http://localhost:8082/`
- Ve a la sección **"Mis Proyectos"**
- En la consola deberías ver:
```
📡 Evento de refrescar proyectos recibido
Proyectos cargados: [array de proyectos]
```

## 🚨 **Si No Funciona**

### **Verificar en la Consola:**

#### **Si NO ves "Callback de refrescar proyectos registrado":**
- El contexto no se está inicializando correctamente
- Refresca la página del sitio web

#### **Si ves "⚠️ No se encontró callback para refrescar proyectos":**
- El callback no se está registrando
- Refresca ambas páginas (admin y sitio web)

#### **Si NO ves "📡 Evento de refrescar proyectos enviado":**
- Hay un error en la sincronización
- Revisa los logs de error anteriores

#### **Si NO ves "📡 Evento de refrescar proyectos recibido":**
- El listener del evento no está funcionando
- Refresca la página del sitio web

## 🔧 **Solución Manual (Si Todo Fallan)**

Si los métodos automáticos no funcionan, puedes refrescar manualmente:

### **Opción 1: Refresh del Sitio Web**
- Ve a `http://localhost:8082/`
- Presiona `F5` para refrescar
- Los proyectos deberían aparecer

### **Opción 2: Verificar Base de Datos**
- Ve al admin
- Ve a la pestaña **"Proyectos"** (si existe)
- Verifica que los proyectos se crearon

## 📊 **Logs Esperados**

### **En el Admin (durante sincronización):**
```
Intentando refrescar proyectos en el contexto del sitio web...
Callback encontrado, ejecutando...
✅ Proyectos refrescados exitosamente en el contexto del sitio web
📡 Evento de refrescar proyectos enviado
```

### **En el Sitio Web (al recibir evento):**
```
📡 Evento de refrescar proyectos recibido
Proyectos cargados: [array con los proyectos sincronizados]
```

## ⚠️ **Problemas Comunes**

### **1. Puerto Diferente**
- Asegúrate de usar el puerto correcto (`8082` en tu caso)
- Admin: `http://localhost:8082/admin`
- Sitio: `http://localhost:8082/`

### **2. Pestañas Diferentes**
- Admin y sitio web deben estar en la misma ventana del navegador
- O al menos en ventanas del mismo origen

### **3. Cache del Navegador**
- Presiona `Ctrl + F5` para refrescar sin cache
- O abre una ventana de incógnito

## 🎯 **Resultado Esperado**

Después de sincronizar, deberías ver:
- ✅ Proyectos aparecen inmediatamente en el sitio web
- ✅ No necesitas hacer refresh manual
- ✅ Los proyectos se mantienen después de refresh

**¡Prueba ahora y dime qué logs ves en la consola!**
