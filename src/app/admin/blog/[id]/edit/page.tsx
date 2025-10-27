import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import BlogPostForm from '@/components/admin/BlogPostForm'

interface Props {
  params: {
    id: string
  }
}

export default async function EditBlogPostPage({ params }: Props) {
  const session = await auth()

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  return <BlogPostForm postId={params.id} />
}
