'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.08) 0%, transparent 50%)' }}>
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors mb-4 group">
            <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <br />
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold gradient-text">DynQR</h1>
          </Link>
          <p className="text-[var(--color-muted)] mt-2">Welcome back! Sign in to continue.</p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8">
          <form onSubmit={handleSignIn} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--color-danger)' }}>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-[var(--color-foreground)]">
                Email
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-[var(--color-foreground)]">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex justify-end">
              <Link href="/reset-password" className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors">
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--color-muted)] mb-4">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium transition-colors">
                Sign Up
              </Link>
            </p>
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
