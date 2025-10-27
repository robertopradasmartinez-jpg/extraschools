# 📧 SISTEMA DE MENSAJERÍA - IMPLEMENTACIÓN COMPLETA

## ✅ Estado: FUNCIONAL (requiere configuración de SMTP para emails)

Sistema completo de mensajería entre padres y empresas con notificaciones automáticas por email.

## 🎯 Funcionalidades Implementadas

### 1. **API Endpoint (/api/messages)** ✅
**Archivo**: `/src/app/api/messages/route.ts`

**Métodos implementados:**
- `POST` - Enviar nuevo mensaje
- `GET` - Obtener mensajes (recibidos/enviados)
- `PATCH` - Marcar mensaje como leído

**Características:**
- ✅ Crea mensaje en base de datos
- ✅ Envía email HTML de notificación a la empresa
- ✅ Protegido con autenticación (requiere sesión)
- ✅ Validación de campos requeridos
- ✅ Email con diseño profesional (HTML + CSS inline)
- ✅ Reply-to directo al remitente
- ✅ Link al panel de empresa en el email

### 2. **Modal de Contacto** ✅
**Archivo**: `/src/components/messages/ContactModal.tsx`

**Características:**
- ✅ Diseño modal con overlay
- ✅ Formulario con asunto y mensaje
- ✅ Validación de campos requeridos
- ✅ Loading states (botón deshabilitado durante envío)
- ✅ Mensaje de éxito con auto-cierre
- ✅ Manejo de errores con feedback visual
- ✅ Info box explicando el proceso
- ✅ Subject pre-rellenado con título de actividad

### 3. **Botón de Contacto** ✅
**Archivo**: `/src/components/messages/ContactButton.tsx`

**Características:**
- ✅ Botón integrado en página de actividad
- ✅ Abre modal de contacto
- ✅ Pasa datos de actividad y empresa
- ✅ Icono de mensaje
- ✅ Diseño consistente con el tema

### 4. **Panel de Mensajes de Empresa** ✅
**Archivo**: `/src/components/messages/CompanyMessagesClient.tsx`

**Características:**
- ✅ Tabs para mensajes recibidos/enviados
- ✅ Lista de mensajes con estados visuales
- ✅ Indicador de no leídos (badge y background)
- ✅ Vista detalle de mensaje
- ✅ Marcar como leído (manual)
- ✅ Auto-marcar como leído al abrir
- ✅ Botón de responder por email
- ✅ Refresh manual de mensajes
- ✅ Stats cards (no leídos, recibidos, total)
- ✅ Loading states
- ✅ Empty states
- ✅ Responsive design

## 📊 Base de Datos

### Schema Actualizado ✅
```prisma
model Message {
  id         String   @id @default(cuid())
  senderId   String
  receiverId String
  activityId String?
  subject    String
  content    String
  read       Boolean  @default(false)
  createdAt  DateTime @default(now())

  sender     User      @relation("SentMessages", fields: [senderId], references: [id])
  receiver   User      @relation("ReceivedMessages", fields: [receiverId], references: [id])
  activity   Activity? @relation("MessageActivity", fields: [activityId], references: [id], onDelete: SetNull)

  @@map("messages")
}

model Activity {
  // ... otros campos
  messages    Message[]  @relation("MessageActivity")
}
```

**Cambios aplicados:**
- ✅ Agregada relación `activity` en `Message`
- ✅ Agregada relación inversa en `Activity`
- ✅ Migración aplicada con `prisma db push`

## 🎨 Flujo de Usuario

### Para Padres (PARENT):
1. **Buscar actividad** → Ver página de detalle
2. **Click en "Contactar con la empresa"** → Se abre modal
3. **Rellenar formulario** (asunto pre-rellenado, escribir mensaje)
4. **Enviar mensaje** → Loading state → Mensaje de éxito
5. **Cierre automático del modal** después de 2 segundos
6. La empresa recibe email inmediatamente

### Para Empresas (COMPANY):
1. **Acceder a /company/messages**
2. **Ver lista de mensajes recibidos** (no leídos resaltados)
3. **Click en mensaje** → Ver detalle completo
4. **Auto-marca como leído** al abrir
5. **Responder por email** → Abre cliente de correo con Reply-to
6. **Tabs para ver enviados/recibidos**

## 📧 Sistema de Emails

### Configuración SMTP Requerida ✅
**Variables de entorno** (`.env`):
```bash
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="tu-email@gmail.com"
EMAIL_SERVER_PASSWORD="tu-app-password"
EMAIL_FROM="noreply@extraschools.com"
```

### Email de Notificación

**Template HTML con diseño profesional:**
- 📧 Header con gradiente rose
- 📦 Caja de mensaje con bordes
- 🔵 Botón CTA para ver en panel
- 💡 Consejo para respuesta rápida
- 📱 Responsive design

**Contenido del email:**
- Nombre de la empresa
- Título de la actividad
- Nombre y email del remitente
- Asunto del mensaje
- Contenido completo del mensaje
- Link directo al panel de empresa
- Reply-to automático al remitente

### Testing Email (Sin SMTP configurado):
Si no hay SMTP configurado:
- ✅ El mensaje SE GUARDA en la base de datos
- ⚠️ El email NO se envía (error logged en consola)
- ✅ El usuario ve mensaje de éxito
- ✅ La empresa puede ver el mensaje en su panel

## 🔧 API Endpoints

### POST /api/messages
**Crear nuevo mensaje**

**Body:**
```json
{
  "activityId": "cmg9cylxf000k1qb9kv7q2w1w",
  "subject": "Consulta sobre horarios",
  "content": "Hola, me gustaría saber más sobre los horarios..."
}
```

**Response:**
```json
{
  "success": true,
  "message": {
    "id": "...",
    "senderId": "...",
    "receiverId": "...",
    "activityId": "...",
    "subject": "...",
    "content": "...",
    "read": false,
    "createdAt": "2025-10-04T..."
  }
}
```

### GET /api/messages?type=received
**Obtener mensajes recibidos**

**Response:**
```json
{
  "messages": [
    {
      "id": "...",
      "subject": "...",
      "content": "...",
      "read": false,
      "createdAt": "...",
      "sender": {
        "name": "María García",
        "email": "maria@example.com"
      }
    }
  ]
}
```

### GET /api/messages?type=sent
**Obtener mensajes enviados**

### PATCH /api/messages
**Marcar mensaje como leído**

**Body:**
```json
{
  "messageId": "cm...",
  "read": true
}
```

## 📱 Páginas Implementadas

### 1. /activity/[id] ✅
**Cambios:**
- ✅ Agregado botón "Contactar con la empresa"
- ✅ Integrado `ContactButton` component
- ✅ Modal funcional

### 2. /company/messages ✅
**Funcionalidades:**
- ✅ Lista de mensajes recibidos/enviados
- ✅ Vista detalle de mensaje
- ✅ Marcar como leído
- ✅ Responder por email
- ✅ Stats de mensajes

### 3. /messages (Para padres) ⏳
**Estado**: PENDIENTE
**Necesita**: Página similar para que padres vean sus mensajes enviados

## ✨ Características Destacadas

### Auto-marcado como Leído
Cuando una empresa abre un mensaje, automáticamente se marca como leído.

### Email con Reply-To
El email incluye `replyTo` con el email del remitente, permitiendo respuesta directa.

### Estados Visuales
- 🟢 Mensajes no leídos: Background rosa + icono Mail
- ⚪ Mensajes leídos: Background blanco + icono MailOpen
- 🔵 Loading states en todos los procesos
- ⭕ Empty states cuando no hay mensajes

### Optimistic UI
- Actualización local inmediata al marcar como leído
- No requiere refresh completo de la página

## 🚀 Próximas Mejoras

### Alta Prioridad
- [ ] Configurar SMTP real (Gmail App Password recomendado)
- [ ] Crear página /messages para padres
- [ ] Badge de mensajes no leídos en header
- [ ] Notificación push cuando llega mensaje nuevo

### Media Prioridad
- [ ] Sistema de respuestas dentro de la plataforma
- [ ] Hilos de conversación
- [ ] Búsqueda de mensajes
- [ ] Filtros por actividad
- [ ] Archivado de mensajes

### Baja Prioridad
- [ ] Chat en tiempo real (WebSockets)
- [ ] Adjuntar archivos
- [ ] Mensajes programados
- [ ] Templates de respuesta
- [ ] Analytics de mensajes

## 🔐 Seguridad

### Implementado ✅
- ✅ Autenticación requerida para enviar/recibir mensajes
- ✅ Validación de que el usuario es el receptor antes de marcar como leído
- ✅ No se exponen IDs sensibles en la UI
- ✅ Sanitización de inputs en formularios

### Pendiente ⏳
- [ ] Rate limiting en API (prevenir spam)
- [ ] Captcha en formulario de contacto
- [ ] Moderación de contenido
- [ ] Bloqueo de usuarios

## 📝 Configuración para Testing

### 1. Gmail App Password (Recomendado)
```bash
# .env
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="tu-email@gmail.com"
EMAIL_SERVER_PASSWORD="xxxx xxxx xxxx xxxx"  # App Password de Google
EMAIL_FROM="noreply@extraschools.com"
```

**Pasos:**
1. Ve a tu cuenta de Google
2. Seguridad → Verificación en 2 pasos (activar)
3. Contraseñas de aplicaciones → Crear nueva
4. Copia la contraseña de 16 caracteres
5. Úsala en `EMAIL_SERVER_PASSWORD`

### 2. Mailtrap (Para desarrollo)
```bash
EMAIL_SERVER_HOST="smtp.mailtrap.io"
EMAIL_SERVER_PORT="2525"
EMAIL_SERVER_USER="tu-mailtrap-username"
EMAIL_SERVER_PASSWORD="tu-mailtrap-password"
EMAIL_FROM="noreply@extraschools.com"
```

### 3. SendGrid (Producción)
```bash
EMAIL_SERVER_HOST="smtp.sendgrid.net"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="apikey"
EMAIL_SERVER_PASSWORD="SG.xxxxx"
EMAIL_FROM="noreply@extraschools.com"
```

## 🧪 Testing Checklist

### Funcionalidad Básica
- [x] Modal de contacto se abre correctamente
- [x] Formulario valida campos requeridos
- [x] Mensaje se guarda en base de datos
- [x] Loading states funcionan
- [x] Mensaje de éxito aparece
- [x] Modal se cierra automáticamente

### Panel de Mensajes
- [x] Lista de mensajes se carga
- [x] Tabs cambian correctamente
- [x] Click en mensaje abre detalle
- [x] Marcar como leído funciona
- [x] Stats se actualizan
- [x] Refresh manual funciona

### Emails (requiere SMTP)
- [ ] Email llega a la empresa
- [ ] Diseño HTML se ve correctamente
- [ ] Link al panel funciona
- [ ] Reply-to funciona
- [ ] Información del mensaje es correcta

### Edge Cases
- [x] Usuario no autenticado no puede enviar
- [x] Campos vacíos no se envían
- [x] Error de red se maneja correctamente
- [x] Mensaje largo se muestra completo
- [x] Fechas se formatean correctamente

## 📖 Ejemplos de Uso

### Enviar Mensaje (Frontend)
```tsx
const response = await fetch('/api/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    activityId: 'cm...',
    subject: 'Consulta sobre horarios',
    content: 'Hola, me gustaría saber...'
  })
});
```

### Obtener Mensajes
```tsx
const response = await fetch('/api/messages?type=received');
const { messages } = await response.json();
```

### Marcar como Leído
```tsx
await fetch('/api/messages', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messageId: 'cm...', read: true })
});
```

## 🎨 Componentes Reutilizables

### ContactModal
Puede reutilizarse para cualquier tipo de contacto:
```tsx
<ContactModal
  isOpen={true}
  onClose={() => {}}
  activityId="cm..."
  activityTitle="Fútbol para niños"
  companyName="Deportes ABC"
/>
```

### ContactButton
```tsx
<ContactButton
  activityId="cm..."
  activityTitle="Fútbol para niños"
  companyName="Deportes ABC"
/>
```

## 💡 Notas Importantes

1. **SMTP es opcional para testing**: El sistema funciona sin SMTP, solo no envía emails
2. **Los mensajes se guardan siempre**: Aunque falle el email, el mensaje queda en BD
3. **Reply-to automático**: Las empresas pueden responder directamente desde su email
4. **Auto-marcar como leído**: Al abrir un mensaje se marca automáticamente
5. **Estados visuales claros**: Los mensajes no leídos se resaltan en rosa

---

## 🔄 ACTUALIZACIÓN: Sistema de Respuestas Empresas → Padres

### ✅ Nuevas Funcionalidades (Octubre 2025)

#### 1. **Modal de Respuesta para Empresas** ✅
**Archivo**: `/src/components/messages/ReplyMessageModal.tsx`

**Características:**
- ✅ Modal con formulario de respuesta
- ✅ Muestra mensaje original del padre
- ✅ Campo de texto para escribir respuesta
- ✅ Loading states y validación
- ✅ Envío directo desde la web (sin abrir email client)
- ✅ Auto-cierre tras envío exitoso
- ✅ Refresca lista de mensajes automáticamente

#### 2. **API Actualizada - Soporte Bidireccional** ✅
**Endpoint POST actualizado** para manejar:
- ✅ Padre → Empresa (con `activityId`)
- ✅ Empresa → Padre (con `receiverId`)
- ✅ Email HTML diferenciado según dirección
- ✅ Links al panel correcto (empresa o padre)
- ✅ Notificaciones por email en ambas direcciones

**Nuevos parámetros POST:**
```typescript
{
  receiverId?: string,      // Para respuestas directas (empresa → padre)
  activityId?: string,       // Para mensajes iniciales (padre → empresa)
  subject: string,
  content: string
}
```

#### 3. **Página de Mensajes para Padres** ✅
**Archivo**: `/src/app/messages/page.tsx`
**Componente**: `/src/components/messages/ParentMessagesClient.tsx`

**Características:**
- ✅ Tabs: Recibidos / Enviados
- ✅ Lista de mensajes con indicadores visuales
- ✅ Vista de detalle del mensaje
- ✅ Marca como leído automáticamente
- ✅ Enlace a actividad relacionada
- ✅ Botón de responder por email
- ✅ Diseño consistente con panel de empresa

#### 4. **Badge de Mensajes No Leídos en Header** ✅
**Actualización**: `/src/components/layout/Header.tsx`

**Características:**
- ✅ Contador en tiempo real (actualiza cada 30s)
- ✅ Badge rojo con número visible
- ✅ Redirección inteligente según rol:
  - PARENT → `/messages`
  - COMPANY → `/company/messages`
- ✅ Visible en desktop y móvil
- ✅ Muestra "9+" si hay más de 9 mensajes

#### 5. **Flujo Completo de Conversación**

**Padre → Empresa:**
1. Padre ve actividad y hace click en "Contactar empresa"
2. Modal se abre, padre escribe mensaje
3. Mensaje se guarda en BD
4. Email enviado a empresa con notificación
5. Badge en header de empresa muestra "1"
6. Empresa recibe email y ve mensaje en panel

**Empresa → Padre (NUEVO):**
1. Empresa abre mensaje recibido
2. Click en "Responder Mensaje"
3. Modal se abre mostrando mensaje original
4. Empresa escribe respuesta
5. Respuesta se guarda en BD
6. Email enviado al padre con notificación
7. Badge en header del padre muestra "1"
8. Padre recibe email y ve respuesta en `/messages`

### 📊 Emails Diferenciados

**Email a Empresa (cuando padre contacta):**
- Título: "📩 Nuevo mensaje sobre [Actividad]"
- Link: `/company/messages`
- Consejo: "Responde rápido para conseguir clientes"

**Email a Padre (cuando empresa responde):**
- Título: "📩 Nueva respuesta sobre [Actividad]"
- Link: `/messages`
- Mensaje: "Has recibido respuesta de [Empresa]"

---

**Estado**: ✅ Sistema completo bidireccional y funcional
**Requiere**: Configuración de SMTP para emails (Zoho configurado)
**Próximo paso**: Continuar con otras funcionalidades del proyecto
**Última actualización**: 6 de Octubre 2025
