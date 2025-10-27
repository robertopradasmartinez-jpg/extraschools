import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';

export const metadata = {
  title: 'Panel de Administración | ExtraSchools',
  description: 'Panel de control para administradores',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Check if user is authenticated and is admin
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/admin');
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
