'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/signin')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single()

      if (profile) {
        setName(profile.name || '')
      }
      setLoading(false)
    }

    loadProfile()
  }, [supabase, router])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ name })
      .eq('id', user.id)

    if (updateError) {
      setError(updateError.message)
    } else {
      // Also update auth metadata for immediate UI sync
      await supabase.auth.updateUser({
        data: { name }
      })
      setMessage('Profile updated successfully!')
      router.refresh()
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent animate-spin rounded-full" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-[var(--color-muted)] text-sm mt-1">Manage your public information</p>
      </div>

      <div className="glass-card p-8">
        <form onSubmit={handleUpdate} className="space-y-6">
          {message && (
            <div className="p-4 rounded-xl text-sm" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: 'var(--color-success)' }}>
              {message}
            </div>
          )}
          {error && (
            <div className="p-4 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--color-danger)' }}>
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2 text-[var(--color-muted)]">Display Name</label>
            <div className="relative group">
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field pl-11 focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                placeholder="John Doe"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] group-focus-within:text-[var(--color-primary)] transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <p className="text-[11px] text-[var(--color-muted)] mt-2">This is how you'll appear on your dashboard.</p>
          </div>

          <div className="pt-2">
            <button type="submit" disabled={saving} className="btn-primary w-full md:w-auto px-10 py-3 flex items-center justify-center gap-2">
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
