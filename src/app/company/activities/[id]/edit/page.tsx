import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import EditActivityForm from '@/components/company/EditActivityForm';

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

  return activity;
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

  const activity = await getActivity(params.id, session.user.id);

  if (!activity) {
    notFound();
  }

  return <EditActivityForm activity={activity} />;
}
