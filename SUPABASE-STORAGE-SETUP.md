# Configuración de Supabase Storage para ExtraSchools

## 📦 Estado Actual

✅ **Código actualizado** - La API ya usa Supabase Storage
✅ **SDK instalado** - `@supabase/supabase-js` añadido
❌ **Credenciales pendientes** - Necesitas añadir las keys al .env
❌ **Bucket pendiente** - Necesitas crear el bucket "uploads" en Supabase

---

## 🔧 Paso 1: Obtener las Credenciales de Supabase

1. Ve a tu dashboard de Supabase:
   ```
   https://supabase.com/dashboard/project/dsgqgircnjqlvodmgqla
   ```

2. En el menú lateral, ve a **"Project Settings"** ⚙️

3. Click en **"API"**

4. Copia las siguientes keys:

   - **URL**: Ya está configurada como `https://dsgqgircnjqlvodmgqla.supabase.co`
   - **anon public**: Copia este valor completo (empieza con `eyJhbGc...`)
   - **service_role**: Copia este valor completo (empieza con `eyJhbGc...`)

---

## 📝 Paso 2: Actualizar el archivo .env

Abre tu archivo `.env` y **reemplaza** estas líneas:

```bash
# Supabase - Para Storage y otras funcionalidades
NEXT_PUBLIC_SUPABASE_URL="https://dsgqgircnjqlvodmgqla.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="PEGA_AQUI_TU_ANON_KEY"
SUPABASE_SERVICE_ROLE_KEY="PEGA_AQUI_TU_SERVICE_ROLE_KEY"
```

**⚠️ IMPORTANTE:** 
- Reemplaza `PEGA_AQUI_TU_ANON_KEY` con la key "anon public"
- Reemplaza `PEGA_AQUI_TU_SERVICE_ROLE_KEY` con la key "service_role"
- NO compartas estas keys públicamente
- Añade `.env` a tu `.gitignore` (ya está configurado)

---

## 🪣 Paso 3: Crear el Bucket en Supabase

1. En tu dashboard de Supabase, ve a **"Storage"** en el menú lateral:
   ```
   https://supabase.com/dashboard/project/dsgqgircnjqlvodmgqla/storage/buckets
   ```

2. Click en **"Create a new bucket"** o **"New Bucket"**

3. Configura el bucket con estos valores:

   | Campo | Valor |
   |-------|-------|
   | **Name** | `uploads` |
   | **Public bucket** | ✅ **SÍ** (muy importante) |
   | **File size limit** | `2 MB` |
   | **Allowed MIME types** | `image/jpeg, image/png, image/webp, image/gif` |

4. Click en **"Create bucket"**

---

## 🔒 Paso 4: Configurar Políticas de Seguridad (Policies)

Para que las imágenes sean públicas pero solo usuarios autenticados puedan subir:

1. En Storage, click en el bucket **"uploads"**

2. Ve a la pestaña **"Policies"**

3. Click en **"New Policy"**

4. Selecciona **"Custom policy"**

5. **Política para SUBIR archivos** (INSERT):
   ```sql
   CREATE POLICY "Usuarios autenticados pueden subir"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'uploads');
   ```

6. **Política para LEER archivos** (SELECT):
   ```sql
   CREATE POLICY "Archivos son públicos"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'uploads');
   ```

---

## 🚀 Paso 5: Reiniciar el Servidor

Una vez configurado todo:

```bash
# Detén el servidor (Ctrl+C)
# Reinicia:
npm run dev
```

---

## ✅ Verificación

Para verificar que todo funciona:

1. Inicia sesión como administrador o empresa
2. Ve a crear un nuevo artículo del blog o actividad
3. Intenta subir una imagen
4. Deberías ver:
   - ✅ Preview de la imagen
   - ✅ URL que empieza con `https://dsgqgircnjqlvodmgqla.supabase.co/storage/v1/object/public/uploads/...`

---

## 🔍 Ver las Imágenes Subidas

Las imágenes se guardarán en:
```
https://supabase.com/dashboard/project/dsgqgircnjqlvodmgqla/storage/buckets/uploads
```

Podrás ver, descargar y eliminar imágenes desde allí.

---

## 💰 Límites de Almacenamiento

Supabase Free Tier incluye:
- ✅ 1 GB de almacenamiento
- ✅ 2 GB de transferencia mensual
- ✅ Suficiente para comenzar

Con el límite de 2MB por imagen, puedes almacenar ~500 imágenes.

---

## 🆘 Troubleshooting

### Error: "Invalid API key"
- Verifica que copiaste correctamente las keys
- Asegúrate de no tener espacios extra
- Reinicia el servidor

### Error: "Bucket not found"
- Verifica que el bucket se llama exactamente `uploads`
- Asegúrate de que es público

### Error: "Not authorized"
- Verifica las políticas de seguridad
- Asegúrate de estar logueado al subir imágenes

---

## 📚 Recursos

- [Documentación de Supabase Storage](https://supabase.com/docs/guides/storage)
- [Políticas de Seguridad](https://supabase.com/docs/guides/storage/security/access-control)
- [Limits y Pricing](https://supabase.com/pricing)

---

**¿Necesitas ayuda?** Revisa la consola del navegador (F12) para ver errores detallados.
