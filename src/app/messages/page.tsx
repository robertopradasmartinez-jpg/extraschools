import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ParentMessagesClient from '@/components/messages/ParentMessagesClient'

export default async function MessagesPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/signin')
  }

  // Redirigir empresas a su panel
  if (session.user.role === 'COMPANY') {
    redirect('/company/messages')
  }

  return <ParentMessagesClient />
}
