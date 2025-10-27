import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'COMPANY') {
      return NextResponse.json(
        { error: 'No autorizado. Solo usuarios de tipo empresa pueden acceder.' },
        { status: 403 }
      );
    }

    // Get company profile
    const company = await prisma.company.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Perfil de empresa no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ company });
  } catch (error) {
    console.error('Error fetching company profile:', error);
    return NextResponse.json(
      { error: 'Error al obtener el perfil de empresa' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'COMPANY') {
      return NextResponse.json(
        { error: 'No autorizado. Solo usuarios de tipo empresa pueden actualizar.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, phone, website, logo, whatsappEnabled } = body;

    // Validate required fields
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'El nombre de la empresa debe tener al menos 2 caracteres' },
        { status: 400 }
      );
    }

    // Validate phone format (optional)
    if (phone && !/^[0-9+\s()-]{9,20}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Formato de teléfono inválido' },
        { status: 400 }
      );
    }

    // Validate website URL format (optional)
    if (website && website.trim()) {
      try {
        new URL(website);
      } catch {
        return NextResponse.json(
          { error: 'Formato de URL inválido' },
          { status: 400 }
        );
      }
    }

    // Check if company exists
    const existingCompany = await prisma.company.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!existingCompany) {
      return NextResponse.json(
        { error: 'Perfil de empresa no encontrado' },
        { status: 404 }
      );
    }

    // Update company profile
    const updatedCompany = await prisma.company.update({
      where: {
        userId: session.user.id,
      },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        phone: phone?.trim() || null,
        website: website?.trim() || null,
        logo: logo?.trim() || null,
        whatsappEnabled: whatsappEnabled ?? false,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Perfil de empresa actualizado correctamente',
      company: updatedCompany,
    });
  } catch (error) {
    console.error('Error updating company profile:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el perfil de empresa' },
      { status: 500 }
    );
  }
}
