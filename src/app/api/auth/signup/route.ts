import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role, companyName, companyPhone } = body;

    // Validaciones
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    if (!['PARENT', 'COMPANY'].includes(role)) {
      return NextResponse.json(
        { error: 'Rol inválido' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 400 }
      );
    }

    // Hash de la contraseña
    const hashedPassword = await hash(password, 12);

    // Validación adicional para empresas
    if (role === 'COMPANY' && !companyName) {
      return NextResponse.json(
        { error: 'El nombre de la empresa es requerido' },
        { status: 400 }
      );
    }

    // Usar transacción para garantizar consistencia
    const user = await prisma.$transaction(async (tx) => {
      // Crear usuario
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
        },
      });

      // Si es una empresa, crear el perfil de empresa con prueba gratuita
      if (role === 'COMPANY') {
        // Fecha de fin de prueba gratuita: 31-08-2026
        const trialEndDate = new Date('2026-08-31T23:59:59.999Z');
        // Generar ID único para la suscripción trial
        const uniqueTrialId = `TRIAL_FREE_2026_${newUser.id}`;
        
        await tx.company.create({
          data: {
            userId: newUser.id,
            name: companyName!,
            phone: companyPhone || '',
            description: '',
            stripeSubscriptionId: uniqueTrialId,
            stripeCurrentPeriodEnd: trialEndDate,
          },
        });
      }

      return newUser;
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en signup:', error);
    return NextResponse.json(
      { error: 'Error al crear la cuenta' },
      { status: 500 }
    );
  }
}
