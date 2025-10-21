# Configuración de Email Automático para Portfolio

## ✅ Estado Actual
El formulario de contacto ya está configurado para enviar emails automáticamente a **germandominguezc@gmail.com**.

## 🔧 Cómo Funciona Actualmente

### Opción 1: EmailJS (Recomendado)
Si configuras EmailJS, los emails se enviarán automáticamente sin intervención del usuario.

### Opción 2: Mailto (Fallback)
Si no hay configuración de EmailJS, se abrirá automáticamente el cliente de email del usuario con el mensaje pre-llenado.

## 📧 Configuración de EmailJS (Opcional pero Recomendada)

### Paso 1: Crear cuenta en EmailJS
1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crea una cuenta gratuita
3. Verifica tu email

### Paso 2: Configurar servicio de email
1. En el dashboard, ve a **Email Services**
2. Haz clic en **Add New Service**
3. Selecciona **Gmail** (o tu proveedor de email)
4. Conecta tu cuenta de Gmail
5. Copia el **Service ID** (ej: `service_abc123`)

### Paso 3: Crear template de email
1. Ve a **Email Templates**
2. Haz clic en **Create New Template**
3. Usa este template:

```
Subject: Nuevo mensaje de contacto - {{subject}}

Hola,

Has recibido un nuevo mensaje de contacto desde tu portfolio:

Nombre: {{from_name}}
Email: {{from_email}}
Asunto: {{subject}}

Mensaje:
{{message}}

---
Puedes responder directamente a este email para contactar al remitente.

Saludos,
Tu Portfolio
```

4. Copia el **Template ID** (ej: `template_xyz789`)

### Paso 4: Obtener Public Key
1. Ve a **Account** → **General**
2. Copia tu **Public Key** (ej: `user_abc123def456`)

### Paso 5: Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto con:

```env
VITE_EMAILJS_SERVICE_ID=tu_service_id_aqui
VITE_EMAILJS_TEMPLATE_ID=tu_template_id_aqui
VITE_EMAILJS_PUBLIC_KEY=tu_public_key_aqui
```

### Paso 6: Reiniciar el servidor
```bash
npm run dev
```

## 🚀 Funcionamiento Actual

### Sin EmailJS configurado:
- ✅ Los mensajes se guardan en la base de datos
- ✅ Se abre automáticamente el cliente de email del usuario
- ✅ El mensaje está pre-llenado con todos los datos
- ✅ El destinatario es automáticamente `germandominguezc@gmail.com`

### Con EmailJS configurado:
- ✅ Los mensajes se guardan en la base de datos
- ✅ Los emails se envían automáticamente a tu Gmail
- ✅ No requiere intervención del usuario
- ✅ Funciona en tiempo real

## 📱 Prueba del Sistema

1. Ve a la sección de contacto en tu portfolio
2. Llena el formulario con datos de prueba
3. Haz clic en "Enviar mensaje"
4. Verifica que:
   - Aparezca el mensaje de éxito
   - Se abra tu cliente de email (si no hay EmailJS)
   - O recibas el email automáticamente (si hay EmailJS)

## 🔍 Verificación en Consola

Abre las herramientas de desarrollador (F12) y ve a la consola para ver los logs:
- `"EmailJS no configurado, usando mailto como fallback"` - Usando mailto
- `"Enviando email con EmailJS"` - Usando EmailJS
- `"Email enviado exitosamente"` - Email enviado correctamente

## ⚠️ Notas Importantes

- El sistema funciona inmediatamente sin configuración adicional
- EmailJS es opcional pero mejora la experiencia del usuario
- Todos los mensajes se guardan en la base de datos independientemente del método de envío
- Tu Gmail (`germandominguezc@gmail.com`) está configurado como destino por defecto
