import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen">
      {/* Sidebar - hidden on mobile, shown on md+ */}
      <div className="hidden md:block">
        <Sidebar userName={profile?.name || user.email?.split('@')[0] || 'User'} />
      </div>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 px-4 py-3 flex items-center justify-between" style={{ background: 'rgba(10,10,15,0.95)', borderBottom: '1px solid var(--color-border)', backdropFilter: 'blur(20px)' }}>
        <span className="text-lg font-bold gradient-text">DynQR</span>
      </div>

      {/* Main content */}
      <main className="md:ml-64 min-h-screen p-4 md:p-8 pt-16 md:pt-8">
        {children}
      </main>
    </div>
  )
}
