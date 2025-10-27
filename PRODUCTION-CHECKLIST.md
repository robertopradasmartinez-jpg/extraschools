# ✅ Checklist para Producción - Completa

## 📋 Antes de Publicar

### Google Maps API
- [ ] API Key configurada en Google Cloud Console
- [ ] Restricciones de dominio actualizadas (https://tudominio.com/*)
- [ ] APIs habilitadas:
  - [ ] Maps JavaScript API
  - [ ] Places API (Autocomplete)
  - [ ] Geocoding API
- [ ] Método de pago configurado (para evitar límites estrictos)
- [ ] Alertas de cuota configuradas en Google Cloud

### Dominio y Hosting
- [ ] Plataforma de hosting elegida (Vercel/Railway/otro)
- [ ] Proyecto creado en la plataforma
- [ ] Código subido a GitHub/GitLab
- [ ] DNS configurado en GoDaddy:
  - [ ] Registro A: @ → IP de hosting
  - [ ] Registro CNAME: www → dominio de hosting
- [ ] SSL/HTTPS configurado (automático en Vercel)

### Base de Datos
- [ ] Base de datos de producción creada
- [ ] `DATABASE_URL` configurada
- [ ] Migraciones ejecutadas: `npx prisma migrate deploy`
- [ ] (Opcional) Seed ejecutado si necesitas datos de ejemplo
- [ ] Backup configurado

### Variables de Entorno
- [ ] Todas las variables configuradas en plataforma de hosting:
  ```bash
  DATABASE_URL=postgresql://...
  NEXTAUTH_URL=https://tudominio.com
  NEXTAUTH_SECRET=generar_uno_nuevo_seguro
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
  EMAIL_SERVER_HOST=smtp.gmail.com
  EMAIL_SERVER_PORT=587
  EMAIL_SERVER_USER=tu_email@gmail.com
  EMAIL_SERVER_PASSWORD=tu_app_password
  EMAIL_FROM=noreply@tudominio.com
  NEXT_PUBLIC_SUPABASE_URL=https://...
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
  SUPABASE_SERVICE_ROLE_KEY=eyJ...
  ```

### Seguridad
- [ ] `NEXTAUTH_SECRET` generado con: `openssl rand -base64 32`
- [ ] Contraseñas de admin cambiadas (no usar password123)
- [ ] Variables sensibles NUNCA en el código
- [ ] `.env` en `.gitignore`

### Email (Nodemailer)
- [ ] Si usas Gmail:
  - [ ] App Password generada (no tu contraseña real)
  - [ ] 2FA activado en tu cuenta de Gmail
  - [ ] "Less secure app access" NO necesario con App Password
- [ ] Emails de prueba enviados correctamente

## 🧪 Testing en Staging/Producción

### Funcionalidad Básica
- [ ] Página principal carga correctamente
- [ ] Navegación funciona (header, footer, links)
- [ ] Imágenes se cargan (si usas Supabase Storage, verificar URLs)
- [ ] CSS/Tailwind aplicado correctamente

### Autenticación
- [ ] Login funciona
- [ ] Registro funciona
- [ ] Emails de verificación se envían
- [ ] Logout funciona
- [ ] Sesiones persisten

### Google Maps
- [ ] Mapa se visualiza en página de detalle
- [ ] Mapa se visualiza en página de búsqueda
- [ ] Marcadores aparecen correctamente
- [ ] Street View funciona
- [ ] Autocomplete de direcciones funciona
- [ ] No hay errores en consola del navegador

### Actividades
- [ ] Crear actividad funciona
- [ ] Editar actividad funciona
- [ ] Eliminar actividad funciona
- [ ] Búsqueda funciona
- [ ] Filtros funcionan
- [ ] Imágenes se suben correctamente

### Otros Features
- [ ] Sistema de favoritos funciona
- [ ] Sistema de mensajería funciona
- [ ] Reviews funcionan
- [ ] Dashboard de empresa funciona
- [ ] Dashboard de admin funciona

## 📊 Después de Publicar

### Monitoreo (Primera Semana)
- [ ] Verificar uso de Google Maps API en [Google Cloud Console](https://console.cloud.google.com/apis/dashboard)
- [ ] Comprobar costos acumulados (debería ser $0 con tier gratuito)
- [ ] Revisar errores en logs de Vercel/hosting
- [ ] Confirmar que usuarios pueden registrarse y crear actividades
- [ ] Monitorear performance en Vercel Analytics

### Configuración de Alertas
- [ ] Google Cloud: Alertas de presupuesto configuradas
  - Al 50% del presupuesto ($25 si pones $50/mes)
  - Al 90% del presupuesto ($45)
- [ ] Vercel: Alertas de uso configuradas
- [ ] Base de datos: Alertas de storage configuradas

### SEO y Marketing (Opcional)
- [ ] Google Search Console configurado
- [ ] Google Analytics configurado
- [ ] Sitemap.xml generado
- [ ] Robots.txt configurado
- [ ] Open Graph meta tags configurados
- [ ] Twitter Card meta tags configurados

## 🔧 Comandos Útiles

### Generar NEXTAUTH_SECRET seguro:
```bash
openssl rand -base64 32
```

### Migrar base de datos a producción:
```bash
# Asegúrate de que DATABASE_URL apunte a producción
npx prisma migrate deploy
```

### Ver logs en tiempo real (Vercel CLI):
```bash
npx vercel logs
```

### Build local para verificar:
```bash
npm run build
npm start
```

## 🌐 Configuración DNS en GoDaddy

### Para Vercel:

**Registro A (dominio raíz):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 600
```

**Registro CNAME (www):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 600
```

### Para Railway:

Railway te dará instrucciones específicas cuando agregues tu dominio.

### Tiempo de propagación:
- **Mínimo**: 5-30 minutos
- **Máximo**: 24-48 horas (raro)
- **Verificar**: https://dnschecker.org/

## 💰 Costos Estimados Mensuales

### Tier Gratuito (Comenzando):
- **Vercel**: $0 (hasta 100GB bandwidth)
- **Google Maps**: $0 (hasta 28,000 cargas de mapa/mes)
- **Vercel Postgres**: $0 (hasta 256 MB)
- **Supabase**: $0 (hasta 500 MB DB + 1 GB storage)
- **Total**: **$0/mes** ✅

### Cuando Creces (1,000+ usuarios):
- **Vercel Pro**: $20/mes (opcional, más recursos)
- **Google Maps**: ~$10-50/mes (depende del tráfico)
- **Base de datos**: $10-25/mes (más storage)
- **Total estimado**: **$40-95/mes**

## 🆘 Troubleshooting Común

### Error: "Invalid API Key"
- ✅ Verifica que NEXT_PUBLIC_GOOGLE_MAPS_API_KEY esté en variables de entorno
- ✅ Verifica restricciones de dominio en Google Cloud Console
- ✅ Asegúrate de que las APIs estén habilitadas

### Error: "Failed to connect to database"
- ✅ Verifica DATABASE_URL en variables de entorno
- ✅ Asegúrate de que la BD de producción esté activa
- ✅ Verifica que las migraciones se hayan ejecutado

### Mapas no se muestran:
- ✅ Abre consola del navegador (F12) y busca errores
- ✅ Verifica que tu dominio esté en las restricciones de Google Maps
- ✅ Espera 5-10 minutos después de actualizar restricciones

### DNS no resuelve:
- ✅ Espera 30 minutos (propagación DNS)
- ✅ Limpia caché DNS: `ipconfig /flushdns` (Windows) o `sudo killall -HUP mDNSResponder` (Mac)
- ✅ Verifica en https://dnschecker.org/

### Emails no se envían:
- ✅ Si usas Gmail, verifica que sea App Password (no tu contraseña real)
- ✅ Verifica EMAIL_SERVER_HOST, PORT, USER, PASSWORD en variables de entorno
- ✅ Revisa logs en Vercel para ver errores específicos

## 📞 Soporte y Recursos

- **Google Maps Support**: https://developers.google.com/maps/support
- **Vercel Documentation**: https://vercel.com/docs
- **Prisma Documentation**: https://www.prisma.io/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **GoDaddy Support**: https://www.godaddy.com/help

---

**Última actualización**: Octubre 2025
**Estado**: ✅ Lista para usar
