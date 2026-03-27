'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [name, setName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
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
        .select('name, avatar_url')
        .eq('id', user.id)
        .single()

      if (profile) {
        setName(profile.name || '')
        setAvatarUrl(profile.avatar_url || null)
      }
      setLoading(false)
    }

    loadProfile()
  }, [supabase, router])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      setError('')

      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const filePath = `${user.id}/${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setAvatarUrl(publicUrl)
      setMessage("Photo uploaded! Don't forget to save changes.")
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setUploading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        name,
        avatar_url: avatarUrl 
      })
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

          {/* Profile Photo Upload */}
          <div className="flex flex-col items-center sm:flex-row gap-6 pb-6 border-b border-[var(--color-border)]">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center text-3xl font-bold shadow-xl">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  name ? name[0].toUpperCase() : 'U'
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent animate-spin rounded-full" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white flex items-center justify-center cursor-pointer shadow-lg transition-all hover:scale-110">
                <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </label>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-sm font-medium mb-1">Profile Photo</h3>
              <p className="text-xs text-[var(--color-muted)] mb-3">Upload a square image for best results. Max 2MB.</p>
              <label className="text-[var(--color-primary)] text-xs font-semibold cursor-pointer hover:underline">
                Change Photo
                <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
              </label>
            </div>
          </div>

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
            <p className="text-[11px] text-[var(--color-muted)] mt-2">This is how you&apos;ll appear on your dashboard.</p>
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
