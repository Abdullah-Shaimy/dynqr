'use client'

import { } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useProfile } from '@/providers/ProfileProvider'

export default function Sidebar({ userName: initialUserName }: { userName?: string }) {
  const { profile } = useProfile()
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const userName = profile?.name || initialUserName
  const avatarUrl = profile?.avatar_url

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/signin')
    router.refresh()
  }

  const navItems = [
    {
      label: 'Back to Website',
      href: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      label: 'Analytics',
      href: '/dashboard/analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      label: 'Profile',
      href: '/dashboard/profile',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ]

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 flex flex-col" style={{ background: 'rgba(10,10,15,0.95)', borderRight: '1px solid var(--color-border)' }}>
      {/* Logo */}
      <div className="p-6 pb-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}>
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <span className="text-xl font-bold gradient-text">DynQR</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-medium transition-all ${
                isActive
                  ? 'text-white'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)]'
              }`}
              style={isActive ? { background: 'var(--color-primary-light)', color: 'var(--color-primary-hover)' } : {}}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold overflow-hidden relative" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}>
            {avatarUrl ? (
              <Image src={avatarUrl} alt={userName || 'User'} fill className="object-cover" />
            ) : (
              userName ? userName[0].toUpperCase() : 'U'
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName || 'User'}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-[var(--color-muted)] hover:text-[var(--color-danger)] hover:bg-[rgba(239,68,68,0.05)] transition-all mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>

        <div className="px-2 pt-4 border-t border-[var(--color-border)] opacity-60">
          <p className="text-[10px] text-[var(--color-muted)] mb-1">Developed & Maintained by</p>
          <a 
            href="https://abdullahshaimy.lk" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[11px] font-medium text-[var(--color-primary-hover)] hover:underline block"
          >
            Abdullah Shaimy
          </a>
        </div>
      </div>
    </aside>
  )
}
