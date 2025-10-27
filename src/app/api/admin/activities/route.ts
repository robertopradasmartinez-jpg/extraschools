import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET all activities with filters
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const published = searchParams.get('published');
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { company: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (published !== null && published !== '') {
      where.published = published === 'true';
    }

    if (category && category !== 'ALL') {
      where.category = category;
    }

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
          _count: {
            select: {
              reviews: true,
              favorites: true,
            },
          },
        },
      }),
      prisma.activity.count({ where }),
    ]);

    return NextResponse.json({
      activities,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Error al obtener actividades' },
      { status: 500 }
    );
  }
}

// PUT - Toggle published status
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { activityId, published } = await request.json();

    if (!activityId || typeof published !== 'boolean') {
      return NextResponse.json(
        { error: 'activityId y published son requeridos' },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.update({
      where: { id: activityId },
      data: { published },
      select: {
        id: true,
        title: true,
        published: true,
      },
    });

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error updating activity:', error);
    return NextResponse.json(
      { error: 'Error al actualizar actividad' },
      { status: 500 }
    );
  }
}

// DELETE - Delete activity
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const activityId = searchParams.get('activityId');

    if (!activityId) {
      return NextResponse.json(
        { error: 'activityId es requerido' },
        { status: 400 }
      );
    }

    await prisma.activity.delete({
      where: { id: activityId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting activity:', error);
    return NextResponse.json(
      { error: 'Error al eliminar actividad' },
      { status: 500 }
    );
  }
}
