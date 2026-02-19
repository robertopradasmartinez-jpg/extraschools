-- Script para actualizar empresas existentes con prueba gratuita
-- Este script establece una prueba gratuita hasta el 31-08-2026 
-- para todas las empresas que no tienen suscripción activa o que están usando 
-- suscripciones de demostración

-- Actualizar empresas sin suscripción
UPDATE companies 
SET 
  "stripeSubscriptionId" = 'TRIAL_FREE_2026',
  "stripeCurrentPeriodEnd" = '2026-08-31 23:59:59.999+00'::timestamptz,
  "updatedAt" = NOW()
WHERE 
  "stripeSubscriptionId" IS NULL 
  OR "stripeSubscriptionId" = '';

-- Actualizar empresas con suscripciones de demostración (del seed)
UPDATE companies 
SET 
  "stripeSubscriptionId" = 'TRIAL_FREE_2026',
  "stripeCurrentPeriodEnd" = '2026-08-31 23:59:59.999+00'::timestamptz,
  "stripeCustomerId" = NULL,
  "stripePriceId" = NULL,
  "updatedAt" = NOW()
WHERE 
  "stripeSubscriptionId" LIKE 'sub_demo_%';

-- Verificar las actualizaciones
SELECT 
  id, 
  name, 
  "stripeSubscriptionId", 
  "stripeCurrentPeriodEnd"::date as "trial_end_date"
FROM companies 
WHERE "stripeSubscriptionId" = 'TRIAL_FREE_2026';
