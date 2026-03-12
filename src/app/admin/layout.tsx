import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminNav from '@/components/AdminNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF9F6' }}>
      <AdminNav email={user.email || ''} />
      <div className="max-w-[1120px] mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}
