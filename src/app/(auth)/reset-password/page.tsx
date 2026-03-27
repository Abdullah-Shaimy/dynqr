'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.08) 0%, transparent 50%)' }}>
        <div className="w-full max-w-md animate-fade-in">
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)' }}>
              <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Check your email</h2>
            <p className="text-[var(--color-muted)] text-sm">
              We&apos;ve sent a password reset link to <strong className="text-[var(--color-foreground)]">{email}</strong>.
            </p>
            <Link href="/signin" className="btn-secondary mt-6 inline-flex">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.08) 0%, transparent 50%)' }}>
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold gradient-text">DynQR</h1>
          </Link>
          <p className="text-[var(--color-muted)] mt-2">Reset your password</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleReset} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--color-danger)' }}>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-[var(--color-foreground)]">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/signin" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors block mb-6">
              ← Back to Sign In
            </Link>
            <div className="pt-6 border-t border-[var(--color-border)] opacity-60">
              <p className="text-[10px] text-[var(--color-muted)] mb-1">Developed & Maintained by</p>
              <a 
                href="https://abdullahshaimy.lk" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs font-medium text-[var(--color-primary-hover)] hover:underline"
              >
                Abdullah Shaimy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
