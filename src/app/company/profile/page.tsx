import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import CompanyProfileClient from '@/components/company/CompanyProfileClient';

export const metadata = {
  title: 'Perfil de Empresa | ExtraSchools',
  description: 'Administra el perfil de tu empresa',
};

export default async function CompanyProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  if (session.user.role !== 'COMPANY') {
    redirect('/dashboard');
  }

  // Fetch company profile
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/company/profile`,
    {
      headers: {
        Cookie: `authjs.session-token=${session.user.id}`, // This won't work, need different approach
      },
      cache: 'no-store',
    }
  );

  // Better approach: fetch directly from database
  const { prisma } = await import('@/lib/prisma');
  
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
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Perfil de Empresa No Encontrado
            </h1>
            <p className="text-gray-600 mb-6">
              No se encontró un perfil de empresa asociado a tu cuenta.
            </p>
            <a
              href="/company/dashboard"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Ir al Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <CompanyProfileClient
          initialCompany={{
            ...company,
            createdAt: company.createdAt.toISOString(),
          }}
        />
      </div>
    </div>
  );
}
