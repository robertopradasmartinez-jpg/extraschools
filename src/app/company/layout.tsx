import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import CompanyDashboardLayout from '@/components/company/CompanyDashboardLayout';

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

  return <CompanyDashboardLayout>{children}</CompanyDashboardLayout>;
}
