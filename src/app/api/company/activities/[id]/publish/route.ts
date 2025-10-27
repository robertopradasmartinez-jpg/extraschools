import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || (session.user.role !== 'COMPANY' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { published } = body;

    // Verificar que la actividad pertenece a la empresa
    const company = await prisma.company.findUnique({
      where: { userId: session.user.id },
    });

    if (!company) {
      return NextResponse.json({ error: 'Empresa no encontrada' }, { status: 404 });
    }

    const activity = await prisma.activity.findUnique({
      where: { id: params.id },
    });

    if (!activity || activity.companyId !== company.id) {
      return NextResponse.json({ error: 'Actividad no encontrada' }, { status: 404 });
    }

    // Actualizar el estado de publicación
    const updatedActivity = await prisma.activity.update({
      where: { id: params.id },
      data: { published },
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
