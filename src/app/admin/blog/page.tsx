import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminBlogClient from '@/components/admin/AdminBlogClient'

export default async function AdminBlogPage() {
  const session = await auth()

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  return <AdminBlogClient />
}
