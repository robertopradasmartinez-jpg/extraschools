// Script para verificar que las empresas tienen el periodo de prueba
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Verificando empresas con periodo de prueba...\n');
  
  const companies = await prisma.company.findMany({
    select: {
      id: true,
      name: true,
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  if (companies.length === 0) {
    console.log('❌ No se encontraron empresas en la base de datos.');
    return;
  }

  console.log(`📊 Total de empresas: ${companies.length}\n`);
  
  companies.forEach((company, index) => {
    const isTrial = company.stripeSubscriptionId?.startsWith('TRIAL_');
    const isActive = company.stripeCurrentPeriodEnd && new Date(company.stripeCurrentPeriodEnd) > new Date();
    
    console.log(`${index + 1}. ${company.name}`);
    console.log(`   Email: ${company.user.email}`);
    console.log(`   Estado: ${isTrial ? '🎉 PRUEBA GRATUITA' : '💳 Suscripción de pago'}`);
    console.log(`   ID Suscripción: ${company.stripeSubscriptionId || 'Sin suscripción'}`);
    console.log(`   Válido hasta: ${company.stripeCurrentPeriodEnd ? new Date(company.stripeCurrentPeriodEnd).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}`);
    console.log(`   Acceso activo: ${isActive ? '✅ SÍ' : '❌ NO'}`);
    console.log('');
  });

  const trialsCount = companies.filter(c => c.stripeSubscriptionId?.startsWith('TRIAL_')).length;
  console.log(`\n✅ Empresas con prueba gratuita: ${trialsCount}/${companies.length}`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
