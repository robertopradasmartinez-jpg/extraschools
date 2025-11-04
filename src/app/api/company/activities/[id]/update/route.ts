import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
          { error: 'Se requiere una suscripción activa para editar actividades' },
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

    const activity = await prisma.activity.findUnique({
      where: { id: params.id },
    });

    if (!activity || activity.companyId !== company.id) {
      return NextResponse.json({ error: 'Actividad no encontrada' }, { status: 404 });
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

    // Actualizar actividad
    const updatedActivity = await prisma.activity.update({
      where: { id: params.id },
      data: {
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

    return NextResponse.json(updatedActivity);
  } catch (error) {
    console.error('Error updating activity:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la actividad' },
      { status: 500 }
    );
  }
}
