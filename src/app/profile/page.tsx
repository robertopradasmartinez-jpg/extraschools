import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import ProfileClient from '@/components/profile/ProfileClient';

export const metadata = {
  title: 'Mi Perfil | ExtraSchools',
  description: 'Administra tu perfil de usuario',
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <ProfileClient user={session.user} />
      </div>
    </div>
  );
}
