import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || (session.user.role !== 'COMPANY' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const company = await prisma.company.findUnique({
      where: { userId: session.user.id },
    });

    if (!company) {
      return NextResponse.json({ error: 'Empresa no encontrada' }, { status: 404 });
    }

    // Verificar suscripción activa (excepto para admin)
    if (session.user.role !== 'ADMIN') {
      if (!company.stripeSubscriptionId || !company.stripeCurrentPeriodEnd) {
        return NextResponse.json(
          { error: 'Se requiere una suscripción activa para crear actividades' },
          { status: 403 }
        );
      }

      if (new Date(company.stripeCurrentPeriodEnd) <= new Date()) {
        return NextResponse.json(
          { error: 'Tu suscripción ha expirado. Por favor renuévala para continuar.' },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const {
      title,
      description,
      category,
      ageMin,
      ageMax,
      price,
      address,
      city,
      province,
      postalCode,
      latitude,
      longitude,
      images,
      published,
    } = body;

    // Validaciones
    if (!title || !description || !category || !city) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Crear actividad
    const activity = await prisma.activity.create({
      data: {
        companyId: company.id,
        title,
        description,
        category,
        ageMin: parseInt(ageMin),
        ageMax: parseInt(ageMax),
        price: parseFloat(price),
        address: address || '',
        city,
        province: province || '',
        postalCode: postalCode || '',
        latitude: latitude ? parseFloat(latitude) : 0,
        longitude: longitude ? parseFloat(longitude) : 0,
        images: images || [],
        published: published || false,
      },
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { error: 'Error al crear la actividad' },
      { status: 500 }
    );
  }
}
