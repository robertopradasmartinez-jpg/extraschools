import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import BlogPostForm from '@/components/admin/BlogPostForm'

export default async function NewBlogPostPage() {
  const session = await auth()

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  return <BlogPostForm />
}
