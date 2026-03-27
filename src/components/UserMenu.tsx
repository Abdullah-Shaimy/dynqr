'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface UserMenuProps {
  user: {
    email?: string
    user_metadata?: {
      name?: string
    }
  }
}

export default function UserMenu({ user }: UserMenuProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function getProfile() {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', authUser.id)
          .single()
        
        if (profile?.avatar_url) {
          setAvatarUrl(profile.avatar_url)
        }
      }
    }
    getProfile()
  }, [supabase])

  const displayName = user.user_metadata?.name || user.email?.split('@')[0] || 'User'
  const initial = displayName[0].toUpperCase()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setIsOpen(false)
    router.refresh()
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-[rgba(255,255,255,0.05)] transition-all border border-transparent hover:border-[var(--color-border)]"
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            initial
          )}
        </div>
        <span className="text-sm font-medium hidden sm:inline-block text-[var(--color-foreground)]">{displayName}</span>
        <svg className={`w-4 h-4 text-[var(--color-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl overflow-hidden glass-card shadow-2xl z-50 animate-fade-in border border-[var(--color-border)]" style={{ transformOrigin: 'top right' }}>
          <div className="p-4 border-b border-[var(--color-border)] bg-[rgba(255,255,255,0.02)]">
            <p className="text-xs text-[var(--color-muted)] mb-1">Signed in as</p>
            <p className="text-sm font-medium truncate">{user.email}</p>
          </div>
          
          <div className="p-2">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[rgba(255,255,255,0.05)]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>
            
            <Link
              href="/dashboard/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[rgba(255,255,255,0.05)]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile Settings
            </Link>
          </div>

          <div className="p-2 border-t border-[var(--color-border)]">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-[var(--color-danger)] hover:bg-[rgba(239,68,68,0.05)]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
