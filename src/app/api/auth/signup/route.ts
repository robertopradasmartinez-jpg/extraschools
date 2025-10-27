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

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // Si es una empresa, crear el perfil de empresa
    if (role === 'COMPANY' && companyName) {
      await prisma.company.create({
        data: {
          userId: user.id,
          name: companyName,
          phone: companyPhone || '',
        },
      });
    }

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
