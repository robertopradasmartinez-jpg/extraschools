-- Script para actualizar TODAS las empresas con prueba gratuita
-- Establece una prueba gratuita hasta el 31-08-2026 para todas las empresas

UPDATE companies 
SET 
  "stripeSubscriptionId" = 'TRIAL_FREE_2026',
  "stripeCurrentPeriodEnd" = '2026-08-31 23:59:59.999+00'::timestamptz,
  "stripeCustomerId" = NULL,
  "stripePriceId" = NULL,
  "updatedAt" = NOW();

-- Verificar las actualizaciones
SELECT 
  id, 
  name, 
  "stripeSubscriptionId", 
  "stripeCurrentPeriodEnd"::date as "trial_end_date"
FROM companies;
