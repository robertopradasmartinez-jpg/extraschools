# 🔧 Solución: Usuarios COMPANY sin Perfil de Empresa

## 📋 Descripción del Problema

Se ha identificado un problema donde algunos usuarios registrados con rol `COMPANY` no tienen su registro correspondiente en la tabla `companies`. Esto puede ocurrir cuando:

1. El registro inicial falla parcialmente (usuario creado, empresa no)
2. Datos corruptos o eliminación accidental del perfil de empresa
3. Errores durante el proceso de signup

**Síntomas:**
- Usuario aparece como "COMPANY" en la tabla `User` de Supabase
- No hay registro correspondiente en la tabla `Company`
- Al intentar acceder al panel de empresa (`/company/dashboard`), se muestra un error
- No se puede gestionar actividades ni acceder a funciones de empresa

## ✅ Soluciones Disponibles

### Opción 1: Script SQL (Más Rápido) ⚡

**Ideal para:** Solución inmediata sin instalar dependencias

1. Abre Supabase Dashboard
2. Ve a SQL Editor
3. Ejecuta el script `fix-missing-companies.sql`

```bash
# El archivo está en la raíz del proyecto
cat fix-missing-companies.sql
```

El script:
- ✅ Identifica usuarios COMPANY sin empresa
- ✅ Crea automáticamente los perfiles faltantes
- ✅ Configura trial gratuito hasta 31-08-2026
- ✅ Verifica que todo esté correcto

### Opción 2: Script TypeScript (Más Completo) 🛠️

**Ideal para:** Ejecutar desde el entorno de desarrollo local

```bash
# Desde la raíz del proyecto
npx ts-node scripts/fix-missing-companies.ts
```

El script:
- ✅ Busca usuarios COMPANY sin perfil
- ✅ Muestra información detallada de cada caso
- ✅ Crea los perfiles faltantes
- ✅ Proporciona feedback en tiempo real
- ✅ Verifica el resultado final

### Opción 3: Manual (Para Casos Específicos) 👤

Si solo necesitas arreglar un usuario específico:

```sql
-- Reemplaza 'USER_ID_AQUI' con el ID del usuario
INSERT INTO "Company" (
  "userId",
  name,
  phone,
  description,
  "stripeSubscriptionId",
  "stripeCurrentPeriodEnd",
  "createdAt",
  "updatedAt"
) VALUES (
  'USER_ID_AQUI',
  'Nombre de la Empresa',
  '',
  '',
  'TRIAL_FREE_2026',
  '2026-08-31 23:59:59.999',
  NOW(),
  NOW()
);
```

## 🛡️ Prevención

Se han implementado las siguientes mejoras para prevenir este problema en el futuro:

### 1. **Transacciones Atómicas** en Signup
El código de registro ahora usa transacciones de Prisma para garantizar que:
- Si falla la creación de la empresa → se revierte la creación del usuario
- Usuario y empresa siempre se crean juntos o ninguno se crea

**Archivo modificado:** [`src/app/api/auth/signup/route.ts`](src/app/api/auth/signup/route.ts)

### 2. **Validación Estricta**
- Se requiere `companyName` obligatoriamente para registros de tipo COMPANY
- Validación en el frontend y backend

### 3. **Verificación en Layout**
El layout de empresa ahora verifica:
- ✅ Usuario autenticado
- ✅ Rol correcto (COMPANY o ADMIN)
- ✅ **Perfil de empresa existe**

Si falta el perfil, muestra un mensaje amigable con opciones para contactar soporte.

**Archivo modificado:** [`src/app/company/layout.tsx`](src/app/company/layout.tsx)

## 🔍 Verificación

Para verificar que no hay usuarios afectados:

```sql
-- En Supabase SQL Editor
SELECT COUNT(*) as usuarios_sin_empresa
FROM "User" u
WHERE u.role = 'COMPANY'
  AND NOT EXISTS (
    SELECT 1 FROM "Company" c WHERE c."userId" = u.id
  );
```

**Resultado esperado:** `0`

## 📞 Soporte

Si después de aplicar estas soluciones el problema persiste:

1. Verifica los logs de la aplicación durante el registro
2. Revisa las constraints de la base de datos
3. Comprueba los permisos de Supabase

## 📝 Notas Técnicas

- **Trial Period:** Todas las empresas se crean con trial gratuito hasta 31-08-2026
- **Datos por defecto:** 
  - `phone`: cadena vacía (puede editarse en perfil)
  - `description`: cadena vacía (puede editarse en perfil)
  - `name`: se usa el nombre del usuario como valor inicial
- **Stripe:** ID de suscripción es `TRIAL_FREE_2026` (placeholder)

## ✨ Resultado

Después de aplicar cualquiera de las soluciones:

- ✅ Los usuarios COMPANY pueden acceder al dashboard
- ✅ Pueden crear y gestionar actividades
- ✅ Tienen acceso completo a todas las funciones de empresa
- ✅ El sistema funciona normalmente

---

**Última actualización:** Febrero 2026
**Estado:** Problema identificado y resuelto
