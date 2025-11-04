import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import EditActivityForm from '@/components/company/EditActivityForm';
import { hasActiveSubscription } from '@/lib/utils';
import { CreditCard } from 'lucide-react';
import Link from 'next/link';

async function getActivity(activityId: string, userId: string) {
  const company = await prisma.company.findUnique({
    where: { userId },
  });

  if (!company) {
    return null;
  }

  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
  });

  if (!activity || activity.companyId !== company.id) {
    return null;
  }

  return { activity, company };
}

export default async function EditActivityPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  const result = await getActivity(params.id, session.user.id);

  if (!result) {
    notFound();
  }

  const { activity, company } = result;

  // Verificar si tiene suscripción activa
  const isActive = hasActiveSubscription(company);

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
            Para editar actividades necesitas tener una suscripción activa.
          </p>
          <div className="space-y-3">
            <Link
              href="/company/subscription"
              className="inline-block w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Ver Planes de Suscripción
            </Link>
            <Link
              href="/company/activities"
              className="inline-block w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Volver a Mis Actividades
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <EditActivityForm activity={activity} />;
}
