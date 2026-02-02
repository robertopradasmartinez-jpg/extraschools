import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.review.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.message.deleteMany()
  await prisma.activity.deleteMany()
  await prisma.blogPost.deleteMany()
  await prisma.company.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10)

  // Admin user
  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@extraschools.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  // Parent users
  const parent1 = await prisma.user.create({
    data: {
      name: 'María García',
      email: 'maria@example.com',
      password: hashedPassword,
      role: 'PARENT',
    },
  })

  const parent2 = await prisma.user.create({
    data: {
      name: 'Juan Martínez',
      email: 'juan@example.com',
      password: hashedPassword,
      role: 'PARENT',
    },
  })

  // Company users
  // Fecha de suscripción: 1 año desde ahora
  const subscriptionEndDate = new Date()
  subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1)

  const companyUser1 = await prisma.user.create({
    data: {
      name: 'Academia Deportiva ABC',
      email: 'deportes@abc.com',
      password: hashedPassword,
      role: 'COMPANY',
      company: {
        create: {
          name: 'Academia Deportiva ABC',
          description: 'Especialistas en deportes para niños desde 1995. Ofrecemos fútbol, baloncesto, natación y más.',
          phone: '+34 612 345 678',
          website: 'https://deportesabc.com',
          stripeCustomerId: 'cus_demo_1',
          stripeSubscriptionId: 'sub_demo_1',
          stripePriceId: 'price_demo_1',
          stripeCurrentPeriodEnd: subscriptionEndDate,
        },
      },
    },
  })

  const companyUser2 = await prisma.user.create({
    data: {
      name: 'Escuela de Música Armonía',
      email: 'contacto@armonia.com',
      password: hashedPassword,
      role: 'COMPANY',
      company: {
        create: {
          name: 'Escuela de Música Armonía',
          description: 'Enseñanza musical de calidad para todas las edades. Piano, guitarra, violín y más.',
          phone: '+34 623 456 789',
          website: 'https://armonia.com',
          stripeCustomerId: 'cus_demo_2',
          stripeSubscriptionId: 'sub_demo_2',
          stripePriceId: 'price_demo_2',
          stripeCurrentPeriodEnd: subscriptionEndDate,
        },
      },
    },
  })

  const companyUser3 = await prisma.user.create({
    data: {
      name: 'Arte para Niños',
      email: 'info@arteniños.com',
      password: hashedPassword,
      role: 'COMPANY',
      company: {
        create: {
          name: 'Arte para Niños',
          description: 'Clases de pintura, escultura y artes plásticas para desarrollar la creatividad infantil.',
          phone: '+34 634 567 890',
          website: 'https://arteniños.com',
          stripeCustomerId: 'cus_demo_3',
          stripeSubscriptionId: 'sub_demo_3',
          stripePriceId: 'price_demo_3',
          stripeCurrentPeriodEnd: subscriptionEndDate,
        },
      },
    },
  })

  // Get companies
  const company1 = await prisma.company.findUnique({ where: { userId: companyUser1.id } })
  const company2 = await prisma.company.findUnique({ where: { userId: companyUser2.id } })
  const company3 = await prisma.company.findUnique({ where: { userId: companyUser3.id } })

  // Create activities
  if (company1) {
    await prisma.activity.create({
      data: {
        companyId: company1.id,
        title: 'Fútbol Base',
        description: 'Clases de fútbol para niños de 6 a 14 años. Aprenden técnica, táctica y trabajo en equipo en un ambiente divertido.',
        category: 'Deportes',
        ageMin: 6,
        ageMax: 14,
        price: 45.00,
        address: 'Calle Deporte 123',
        city: 'Madrid',
        province: 'Madrid',
        postalCode: '28001',
        latitude: 40.4168,
        longitude: -3.7038,
        images: ['https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800'],
        published: true,
      },
    })

    await prisma.activity.create({
      data: {
        companyId: company1.id,
        title: 'Natación Infantil',
        description: 'Clases de natación adaptadas a cada nivel. Desde iniciación hasta perfeccionamiento de estilos.',
        category: 'Deportes',
        ageMin: 4,
        ageMax: 12,
        price: 50.00,
        address: 'Avenida Piscina 45',
        city: 'Madrid',
        province: 'Madrid',
        postalCode: '28002',
        latitude: 40.4200,
        longitude: -3.7100,
        images: ['https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800'],
        published: true,
      },
    })
  }

  if (company2) {
    await prisma.activity.create({
      data: {
        companyId: company2.id,
        title: 'Piano para Principiantes',
        description: 'Clases de piano individual o en grupos reducidos. Método divertido y eficaz para iniciar a los niños en la música.',
        category: 'Música',
        ageMin: 5,
        ageMax: 16,
        price: 60.00,
        address: 'Plaza Musical 7',
        city: 'Barcelona',
        province: 'Barcelona',
        postalCode: '08001',
        latitude: 41.3851,
        longitude: 2.1734,
        images: ['https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800'],
        published: true,
      },
    })

    await prisma.activity.create({
      data: {
        companyId: company2.id,
        title: 'Guitarra Moderna',
        description: 'Aprende a tocar guitarra con canciones actuales. Desde lo básico hasta técnicas avanzadas.',
        category: 'Música',
        ageMin: 8,
        ageMax: 18,
        price: 55.00,
        address: 'Calle Melodía 34',
        city: 'Barcelona',
        province: 'Barcelona',
        postalCode: '08002',
        latitude: 41.3900,
        longitude: 2.1800,
        images: ['https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800'],
        published: true,
      },
    })
  }

  if (company3) {
    await prisma.activity.create({
      data: {
        companyId: company3.id,
        title: 'Pintura Creativa',
        description: 'Clases de pintura donde los niños exploran diferentes técnicas y materiales desarrollando su creatividad.',
        category: 'Arte',
        ageMin: 5,
        ageMax: 12,
        price: 40.00,
        address: 'Calle Artista 89',
        city: 'Valencia',
        province: 'Valencia',
        postalCode: '46001',
        latitude: 39.4699,
        longitude: -0.3763,
        images: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800'],
        published: true,
      },
    })

    await prisma.activity.create({
      data: {
        companyId: company3.id,
        title: 'Escultura y Modelado',
        description: 'Trabajamos con arcilla, pasta de modelar y otros materiales para crear obras tridimensionales.',
        category: 'Arte',
        ageMin: 7,
        ageMax: 14,
        price: 45.00,
        address: 'Avenida Escultor 12',
        city: 'Valencia',
        province: 'Valencia',
        postalCode: '46002',
        latitude: 39.4750,
        longitude: -0.3800,
        images: ['https://images.unsplash.com/photo-1596380782463-06d2ca1d0af8?w=800'],
        published: true,
      },
    })
  }

  // Create reviews
  const activities = await prisma.activity.findMany()
  if (activities.length > 0) {
    await prisma.review.create({
      data: {
        userId: parent1.id,
        activityId: activities[0].id,
        rating: 5,
        comment: 'Excelente actividad, mi hijo está encantado. Los profesores son muy profesionales.',
      },
    })

    await prisma.review.create({
      data: {
        userId: parent2.id,
        activityId: activities[0].id,
        rating: 4,
        comment: 'Muy buena experiencia. Las instalaciones están bien y el ambiente es muy agradable.',
      },
    })
  }

  // Create blog posts
  await prisma.blogPost.create({
    data: {
      title: 'Beneficios de las actividades extraescolares',
      slug: 'beneficios-actividades-extraescolares',
      content: 'Las actividades extraescolares ofrecen numerosos beneficios para el desarrollo integral de los niños...',
      excerpt: 'Descubre cómo las actividades extraescolares contribuyen al desarrollo de tus hijos.',
      published: true,
      publishedAt: new Date(),
    },
  })

  await prisma.blogPost.create({
    data: {
      title: 'Cómo elegir la actividad perfecta para tu hijo',
      slug: 'como-elegir-actividad-perfecta',
      content: 'Elegir la actividad adecuada depende de varios factores: edad, intereses, habilidades...',
      excerpt: 'Guía práctica para padres sobre cómo seleccionar actividades extraescolares.',
      published: true,
      publishedAt: new Date(),
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log('\n📧 Test credentials:')
  console.log('Admin: admin@extraschools.com / password123')
  console.log('Parent: maria@example.com / password123')
  console.log('Company: deportes@abc.com / password123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
