# 🚀 Guía Paso a Paso: GoDaddy + Vercel + Google Maps

## Tu Situación Actual:
- ✅ Dominio contratado en GoDaddy
- ✅ Aplicación Next.js funcionando en local
- ✅ Google Maps API configurada y funcionando

## Lo que vas a hacer:
1. Desplegar tu app en Vercel (gratis)
2. Conectar tu dominio de GoDaddy a Vercel
3. Configurar Google Maps para producción

---

## 📝 PASO 1: Preparar tu Código

### 1.1 Sube tu código a GitHub

Si no lo has hecho ya:

```bash
# En tu terminal, desde la carpeta del proyecto
git init
git add .
git commit -m "Initial commit"

# Crea un repo en GitHub.com y luego:
git remote add origin https://github.com/TU_USUARIO/extraschools.git
git branch -M main
git push -u origin main
```

### 1.2 Genera NEXTAUTH_SECRET seguro

```bash
openssl rand -base64 32
```

Copia el resultado, lo necesitarás después.

---

## 🌐 PASO 2: Desplegar en Vercel (15 minutos)

### 2.1 Crear cuenta en Vercel

1. Ve a [vercel.com](https://vercel.com/)
2. Haz clic en "Sign Up"
3. Selecciona "Continue with GitHub"
4. Autoriza Vercel para acceder a tus repos

### 2.2 Importar tu proyecto

1. En el dashboard de Vercel, haz clic en **"Add New..."** → **"Project"**
2. Busca tu repositorio `extraschools`
3. Haz clic en **"Import"**

### 2.3 Configurar Build Settings

Vercel detectará automáticamente que es Next.js. Déjalo como está:
- **Framework Preset**: Next.js
- **Build Command**: `next build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 2.4 Configurar Variables de Entorno

Antes de hacer clic en "Deploy", expande **"Environment Variables"** y agrega:

```bash
# Base de datos (por ahora usa tu local o crea una nueva)
DATABASE_URL=postgresql://user:password@host:5432/database

# NextAuth
NEXTAUTH_URL=https://tu-proyecto-xxxxxx.vercel.app
NEXTAUTH_SECRET=el_secret_que_generaste_antes

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyArb-KdZFQ3JFYsQ-3pZvMbxuA1SMZ7fEI

# Email (opcional por ahora, puedes agregarlo después)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=tu_email@gmail.com
EMAIL_SERVER_PASSWORD=tu_app_password
EMAIL_FROM=noreply@extraschools.com

# Supabase (si lo usas)
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_key
```

**Importante:** Para `NEXTAUTH_URL`, usa la URL temporal de Vercel por ahora. La cambiarás después por tu dominio real.

### 2.5 Hacer Deploy

1. Haz clic en **"Deploy"**
2. Espera 2-3 minutos mientras Vercel construye tu app
3. Vercel te dará una URL temporal: `https://extraschools-xxxxxx.vercel.app`
4. ¡Pruébala! Debería funcionar (excepto tal vez la base de datos si no la has configurado)

---

## 🗄️ PASO 3: Base de Datos de Producción (10 minutos)

### Opción A: Vercel Postgres (Recomendado)

1. En tu proyecto de Vercel → pestaña **"Storage"**
2. Haz clic en **"Create Database"** → **"Postgres"**
3. Dale un nombre: `extraschools-db`
4. Selecciona región: **Europe** (más cerca de España)
5. Haz clic en **"Create"**

6. Vercel automáticamente agregará estas variables:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL` ← **Esta es la que necesitas**
   - `POSTGRES_URL_NON_POOLING`

7. Ve a **"Settings"** → **"Environment Variables"**
8. Cambia el nombre de `POSTGRES_PRISMA_URL` a `DATABASE_URL` (o copia su valor)

### Opción B: Supabase (Alternativa gratuita)

1. Ve a [supabase.com](https://supabase.com/)
2. Crea cuenta con GitHub
3. Haz clic en **"New project"**
4. Nombre: `extraschools`
5. Database Password: (guárdala bien)
6. Región: **Europe**
7. Espera 2 minutos mientras se crea

8. Una vez creado, ve a **"Settings"** → **"Database"**
9. En **"Connection string"** → **"URI"** copia la connection string
10. Reemplaza `[YOUR-PASSWORD]` con tu contraseña
11. En Vercel, agrega/actualiza `DATABASE_URL` con esa connection string

### 3.1 Migrar la Base de Datos

En tu terminal local:

```bash
# Asegúrate de que DATABASE_URL en .env apunte a producción
# O usa directamente:
DATABASE_URL="postgresql://..." npx prisma migrate deploy

# Opcional: agregar datos de ejemplo
DATABASE_URL="postgresql://..." npx prisma db seed
```

### 3.2 Re-deployar en Vercel

Vercel detectará los cambios de variables de entorno y re-desplegará automáticamente.
O puedes forzarlo:
1. Ve a "Deployments"
2. En el último deployment, haz clic en los tres puntos "..." → "Redeploy"

---

## 🔗 PASO 4: Conectar tu Dominio de GoDaddy (20 minutos)

### 4.1 En Vercel: Agregar Dominio

1. En tu proyecto de Vercel → **"Settings"** → **"Domains"**
2. Haz clic en **"Add"**
3. Escribe tu dominio: `tudominio.com` (por ejemplo: `extraschools.com`)
4. Haz clic en **"Add"**

### 4.2 Vercel te mostrará instrucciones

Vercel te pedirá configurar registros DNS. Apunta estos valores:

**Para el dominio raíz (tudominio.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Para www (www.tudominio.com):**
```
Type: CNAME
Name: www  
Value: cname.vercel-dns.com
```

### 4.3 En GoDaddy: Configurar DNS

1. Ve a [godaddy.com](https://www.godaddy.com/) e inicia sesión
2. Ve a **"My Products"**
3. Busca tu dominio y haz clic en **"DNS"** (o "Manage DNS")

4. **Modificar/Agregar Registro A:**
   - Si ya existe un registro A con Name `@`, haz clic en el lápiz para editarlo
   - Si no existe, haz clic en **"Add"** → **"A"**
   - Configura:
     ```
     Type: A
     Name: @
     Value: 76.76.21.21
     TTL: 600 seconds (o 1/2 hour)
     ```
   - Haz clic en **"Save"**

5. **Modificar/Agregar Registro CNAME:**
   - Si ya existe un registro CNAME con Name `www`, edítalo
   - Si no existe, haz clic en **"Add"** → **"CNAME"**
   - Configura:
     ```
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     TTL: 600 seconds
     ```
   - Haz clic en **"Save"**

### 4.4 Esperar Propagación DNS

- **Tiempo estimado**: 5-30 minutos (puede ser hasta 24h en casos raros)
- **Verificar**: Ve a [dnschecker.org](https://dnschecker.org/) y busca tu dominio

### 4.5 En Vercel: Verificar

1. Vuelve a Vercel → "Settings" → "Domains"
2. Debería decir **"Valid Configuration"** con un ✅ verde
3. Vercel emitirá automáticamente un certificado SSL (HTTPS)
4. En 5-10 minutos, tu sitio estará disponible en `https://tudominio.com`

---

## 🔑 PASO 5: Actualizar Google Maps API (5 minutos)

### 5.1 En Google Cloud Console

1. Ve a [console.cloud.google.com](https://console.cloud.google.com/)
2. Selecciona tu proyecto
3. Ve a **"APIs & Services"** → **"Credentials"**
4. Haz clic en tu API Key

### 5.2 Agregar Restricciones de Dominio

En **"Application restrictions"** → **"HTTP referrers"**:

Agrega estos referrers (reemplaza `tudominio.com` con tu dominio real):

```
# Desarrollo
http://localhost:3000/*
http://localhost:3001/*
http://192.168.1.117:3000/*

# Staging (URL temporal de Vercel)
https://tu-proyecto-xxxxxx.vercel.app/*

# Producción (tu dominio real)
https://tudominio.com/*
https://www.tudominio.com/*
https://*.tudominio.com/*
```

Ejemplo completo si tu dominio es `extraschools.com`:
```
http://localhost:3000/*
http://localhost:3001/*
https://extraschools-abc123.vercel.app/*
https://extraschools.com/*
https://www.extraschools.com/*
https://*.extraschools.com/*
```

### 5.3 Guardar

Haz clic en **"Save"** abajo.

### 5.4 Actualizar NEXTAUTH_URL

En Vercel:
1. **"Settings"** → **"Environment Variables"**
2. Edita `NEXTAUTH_URL`
3. Cambia de `https://tu-proyecto-xxx.vercel.app` a `https://tudominio.com`
4. Haz clic en **"Save"**
5. Vercel re-desplegará automáticamente

---

## ✅ PASO 6: Verificación Final (10 minutos)

### 6.1 Prueba tu sitio en producción:

Abre `https://tudominio.com` y verifica:

**Funcionalidad básica:**
- [ ] Página principal carga
- [ ] Navegación funciona
- [ ] Imágenes se cargan
- [ ] CSS se aplica correctamente

**Autenticación:**
- [ ] Puedes registrarte
- [ ] Puedes hacer login
- [ ] Puedes hacer logout

**Google Maps:**
- [ ] Abre la página de búsqueda `/search`
- [ ] Abre el navegador en modo incógnito (Cmd+Shift+N en Chrome)
- [ ] Verifica que los mapas se muestren
- [ ] Abre consola del navegador (F12) → No debería haber errores rojos
- [ ] Haz clic en un marcador → debe abrir popup
- [ ] Crea una nueva actividad → autocomplete debe funcionar

**Base de datos:**
- [ ] Crea una nueva actividad
- [ ] Edita una actividad
- [ ] Verifica que los cambios persisten

### 6.2 Si algo no funciona:

**Ver logs en Vercel:**
1. Ve a tu proyecto en Vercel
2. Pestaña **"Deployments"**
3. Haz clic en el deployment más reciente
4. Busca la pestaña **"Runtime Logs"**
5. Busca errores en rojo

**Comandos útiles:**
```bash
# Ver logs en tiempo real desde terminal
npx vercel logs

# Ver variables de entorno configuradas
npx vercel env ls
```

---

## 🎉 ¡LISTO!

Tu aplicación ahora está en producción:
- ✅ Accesible en tu dominio: `https://tudominio.com`
- ✅ HTTPS automático (SSL)
- ✅ Google Maps funcionando
- ✅ Base de datos en la nube
- ✅ Deployments automáticos en cada push a GitHub

---

## 📊 Siguientes Pasos (Opcional)

### Analytics y Monitoreo
- [ ] Configurar Vercel Analytics
- [ ] Configurar Google Analytics
- [ ] Configurar Google Search Console

### SEO
- [ ] Agregar meta tags Open Graph
- [ ] Crear sitemap.xml
- [ ] Configurar robots.txt

### Email Marketing
- [ ] Configurar Nodemailer con Gmail App Password
- [ ] Crear templates de email
- [ ] Configurar emails transaccionales

### Performance
- [ ] Configurar Vercel Edge Config
- [ ] Optimizar imágenes con Next/Image
- [ ] Implementar ISR (Incremental Static Regeneration)

---

## 🆘 Problemas Comunes

### "Site can't be reached"
- ⏰ Espera 30 minutos para propagación DNS
- 🔄 Limpia caché DNS: `ipconfig /flushdns` (Windows) o `sudo dscacheutil -flushcache` (Mac)
- ✅ Verifica en [whatsmydns.net](https://www.whatsmydns.net/)

### "Invalid API Key" en Google Maps
- ✅ Verifica que el dominio esté en las restricciones
- ⏰ Espera 5 minutos después de actualizar restricciones
- ✅ Verifica que NEXT_PUBLIC_GOOGLE_MAPS_API_KEY esté en variables de entorno de Vercel

### "Database connection failed"
- ✅ Verifica DATABASE_URL en Vercel Environment Variables
- ✅ Asegúrate de haber ejecutado `npx prisma migrate deploy`
- ✅ Verifica que la BD de producción esté activa

### Build falla en Vercel
- ✅ Asegúrate de que `npm run build` funcione localmente
- ✅ Revisa los logs del build en Vercel
- ✅ Verifica que todas las dependencias estén en `package.json`

---

## 💡 Tips Pro

1. **Cada push a GitHub = Deploy automático**: Vercel detecta cambios automáticamente
2. **Preview deployments**: Cada PR tiene su propia URL de preview
3. **Rollback fácil**: En Vercel → Deployments → Click en un deployment anterior → "Promote to Production"
4. **Logs en tiempo real**: `npx vercel logs --follow`
5. **Variables de entorno por ambiente**: Puedes tener diferentes valores para Production, Preview, Development

---

**¿Necesitas ayuda?** Contacta:
- Vercel Support: https://vercel.com/support
- Vercel Discord: https://vercel.com/discord

**Última actualización**: Octubre 2025
