import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || (session.user.role !== 'COMPANY' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

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

    // Eliminar la actividad
    await prisma.activity.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting activity:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la actividad' },
      { status: 500 }
    );
  }
}
