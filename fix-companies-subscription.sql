-- Actualizar todas las empresas existentes para tener suscripciones activas
-- Esto soluciona el error 404 en las páginas de actividades

UPDATE companies
SET 
  "stripeCustomerId" = CONCAT('cus_demo_', id),
  "stripeSubscriptionId" = CONCAT('sub_demo_', id),
  "stripePriceId" = 'price_demo_standard',
  "stripeCurrentPeriodEnd" = NOW() + INTERVAL '1 year'
WHERE 
  "stripeSubscriptionId" IS NULL 
  OR "stripeCurrentPeriodEnd" IS NULL 
  OR "stripeCurrentPeriodEnd" < NOW();

-- Verificar los cambios
SELECT 
  id, 
  name, 
  "stripeSubscriptionId", 
  "stripeCurrentPeriodEnd"
FROM companies;
