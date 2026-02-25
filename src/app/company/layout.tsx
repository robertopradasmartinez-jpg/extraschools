import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import CompanyDashboardLayout from '@/components/company/CompanyDashboardLayout';
import Link from 'next/link';

export default async function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Verificar que el usuario está autenticado y es una empresa
  if (!session) {
    redirect('/auth/signin?callbackUrl=/company/dashboard');
  }

  if (session.user.role !== 'COMPANY' && session.user.role !== 'ADMIN') {
    redirect('/');
  }

  // Verificar que el usuario de tipo COMPANY tiene un perfil de empresa
  if (session.user.role === 'COMPANY') {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { company: true },
    });

    if (!user?.company) {
      // Usuario COMPANY sin perfil de empresa - mostrar error
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Perfil de Empresa No Encontrado
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Tu cuenta está registrada como empresa pero no tiene un perfil de empresa asociado. 
                Esto puede deberse a un error durante el registro.
              </p>
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">
                  Por favor, contacta con el soporte para resolver este problema:
                </p>
                <Link
                  href="/contact"
                  className="inline-block w-full px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                >
                  Contactar Soporte
                </Link>
                <Link
                  href="/"
                  className="inline-block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Volver al Inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return <CompanyDashboardLayout>{children}</CompanyDashboardLayout>;
}
