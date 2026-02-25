/**
 * Script para reparar usuarios de tipo COMPANY que no tienen registro en la tabla companies
 * 
 * Ejecutar con: npx ts-node scripts/fix-missing-companies.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixMissingCompanies() {
  try {
    console.log('🔍 Buscando usuarios de tipo COMPANY sin perfil de empresa...\n');

    // Buscar usuarios COMPANY sin company asociada
    const usersWithoutCompany = await prisma.user.findMany({
      where: {
        role: 'COMPANY',
        company: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (usersWithoutCompany.length === 0) {
      console.log('✅ No se encontraron problemas. Todos los usuarios COMPANY tienen su perfil de empresa.');
      return;
    }

    console.log(`⚠️  Encontrados ${usersWithoutCompany.length} usuario(s) sin perfil de empresa:\n`);
    usersWithoutCompany.forEach((user) => {
      console.log(`   - ${user.name} (${user.email})`);
    });

    console.log('\n🔧 Creando perfiles de empresa faltantes...\n');

    // Fecha de fin de prueba gratuita: 31-08-2026
    const trialEndDate = new Date('2026-08-31T23:59:59.999Z');

    let created = 0;
    for (const user of usersWithoutCompany) {
      try {
        // Generar un ID único para la suscripción trial
        const uniqueTrialId = `TRIAL_FREE_2026_${user.id}`;
        
        await prisma.company.create({
          data: {
            userId: user.id,
            name: user.name || 'Mi Empresa', // Usar el nombre del usuario o un valor por defecto
            phone: '',
            description: '',
            stripeSubscriptionId: uniqueTrialId,
            stripeCurrentPeriodEnd: trialEndDate,
          },
        });
        console.log(`   ✓ Perfil de empresa creado para: ${user.name || user.email}`);
        created++;
      } catch (error: any) {
        console.error(`   ✗ Error al crear perfil para ${user.name || user.email}:`, error.message);
      }
    }

    console.log(`\n✅ Proceso completado. Se crearon ${created} perfil(es) de empresa.`);

    // Verificar resultado
    console.log('\n🔍 Verificando...');
    const stillMissing = await prisma.user.count({
      where: {
        role: 'COMPANY',
        company: null,
      },
    });

    if (stillMissing === 0) {
      console.log('✅ Todos los usuarios COMPANY ahora tienen su perfil de empresa.\n');
    } else {
      console.log(`⚠️  Aún quedan ${stillMissing} usuario(s) sin perfil de empresa.\n`);
    }
  } catch (error) {
    console.error('❌ Error durante la reparación:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
fixMissingCompanies()
  .then(() => {
    console.log('Script finalizado.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error fatal:', error);
    process.exit(1);
  });
