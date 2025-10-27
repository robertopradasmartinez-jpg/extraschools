import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export default async function DashboardRedirectPage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard');
  }

  // Redirigir según el rol
  if (session.user.role === 'COMPANY' || session.user.role === 'ADMIN') {
    redirect('/company/dashboard');
  } else {
    // Para padres, redirigir a favoritos o perfil
    redirect('/favorites');
  }
}
