-- Script SQL para reparar usuarios de tipo COMPANY que no tienen registro en la tabla companies
-- Ejecutar directamente en Supabase SQL Editor o pgAdmin

-- 1. Primero, verificar cuántos usuarios tienen este problema
SELECT COUNT(*) as usuarios_sin_empresa
FROM "User" u
WHERE u.role = 'COMPANY'
  AND NOT EXISTS (
    SELECT 1 FROM "Company" c WHERE c."userId" = u.id
  );

-- 2. Ver la lista de usuarios afectados
SELECT 
  u.id,
  u.name,
  u.email,
  u."createdAt"
FROM "User" u
WHERE u.role = 'COMPANY'
  AND NOT EXISTS (
    SELECT 1 FROM "Company" c WHERE c."userId" = u.id
  )
ORDER BY u."createdAt" DESC;

-- 3. Crear perfiles de empresa para todos los usuarios COMPANY que no lo tengan
-- IMPORTANTE: Revisar los resultados de las queries anteriores antes de ejecutar esta
INSERT INTO "Company" (
  "userId",
  name,
  phone,
  description,
  "stripeSubscriptionId",
  "stripeCurrentPeriodEnd",
  "createdAt",
  "updatedAt"
)
SELECT 
  u.id,
  COALESCE(u.name, 'Mi Empresa') as name, -- Usar el nombre del usuario o un valor por defecto
  '' as phone,
  '' as description,
  CONCAT('TRIAL_FREE_2026_', u.id) as "stripeSubscriptionId", -- ID único por usuario
  '2026-08-31 23:59:59.999'::timestamp as "stripeCurrentPeriodEnd",
  NOW() as "createdAt",
  NOW() as "updatedAt"
FROM "User" u
WHERE u.role = 'COMPANY'
  AND NOT EXISTS (
    SELECT 1 FROM "Company" c WHERE c."userId" = u.id
  );

-- 4. Verificar que se crearon correctamente
SELECT 
  u.name as usuario,
  u.email,
  c.name as empresa,
  c."stripeSubscriptionId",
  c."stripeCurrentPeriodEnd"
FROM "User" u
JOIN "Company" c ON c."userId" = u.id
WHERE u.role = 'COMPANY'
ORDER BY c."createdAt" DESC;

-- 5. Verificar que ya no quedan usuarios sin empresa
SELECT COUNT(*) as usuarios_sin_empresa
FROM "User" u
WHERE u.role = 'COMPANY'
  AND NOT EXISTS (
    SELECT 1 FROM "Company" c WHERE c."userId" = u.id
  );
