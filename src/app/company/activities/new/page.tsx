import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hasActiveSubscription } from '@/lib/utils';
import { redirect } from 'next/navigation';
import NewActivityForm from '@/components/company/NewActivityForm';
import { CreditCard } from 'lucide-react';
import Link from 'next/link';

export default async function NewActivityPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { company: true },
  });

  if (!user?.company) {
    redirect('/company/dashboard');
  }

  const isActive = hasActiveSubscription(user.company);

  if (!isActive) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-rose-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Suscripción Requerida
          </h1>
          <p className="text-gray-600 mb-6">
            Para crear y publicar actividades necesitas tener una suscripción activa.
          </p>
          <div className="space-y-3">
            <Link
              href="/company/subscription"
              className="inline-block w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Ver Planes de Suscripción
            </Link>
            <Link
              href="/company/dashboard"
              className="inline-block w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <NewActivityForm />;
}
