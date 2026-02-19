// Script para actualizar todas las empresas con periodo de prueba único
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Actualizando todas las empresas con periodo de prueba gratuita...\n');
  
  // Fecha de fin de prueba: 31 de agosto de 2026
  const trialEndDate = new Date('2026-08-31T23:59:59.999Z');
  
  // Obtener todas las empresas
  const companies = await prisma.company.findMany({
    select: {
      id: true,
      name: true,
      userId: true,
    },
  });

  if (companies.length === 0) {
    console.log('❌ No se encontraron empresas en la base de datos.');
    return;
  }

  console.log(`📊 Total de empresas a actualizar: ${companies.length}\n`);
  
  let updated = 0;
  
  for (const company of companies) {
    try {
      // Generar un ID único para el trial basado en el ID de la empresa
      const trialId = `TRIAL_FREE_2026_${company.id}`;
      
      await prisma.company.update({
        where: { id: company.id },
        data: {
          stripeSubscriptionId: trialId,
          stripeCurrentPeriodEnd: trialEndDate,
          stripeCustomerId: null,
          stripePriceId: null,
        },
      });
      
      console.log(`✅ ${company.name} - Actualizada con trial ID: ${trialId}`);
      updated++;
    } catch (error) {
      console.error(`❌ Error actualizando ${company.name}:`, error.message);
    }
  }

  console.log(`\n🎉 Actualización completada: ${updated}/${companies.length} empresas actualizadas`);
  console.log(`📅 Todas las empresas tienen acceso gratuito hasta: 31 de agosto de 2026`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
