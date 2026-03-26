import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.06) 0%, transparent 50%)' }}>
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}>
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <span className="text-xl font-bold gradient-text">DynQR</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/signin" className="btn-secondary !py-2 !px-5 text-sm">
            Sign In
          </Link>
          <Link href="/signup" className="btn-primary !py-2 !px-5 text-sm">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 md:px-12 pt-16 md:pt-28 pb-20 text-center max-w-4xl mx-auto">
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'var(--color-primary-light)', border: '1px solid var(--color-border)' }}>
            <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse-soft" />
            <span className="text-sm text-[var(--color-primary-hover)] font-medium">100% Free — No limits</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Dynamic QR Codes{' '}
            <span className="gradient-text">Made Simple</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-muted)] max-w-2xl mx-auto mb-10 leading-relaxed">
            Create QR codes that stay the same — but point anywhere you want. Update destinations, track scans, and manage everything from one dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="btn-primary !py-3.5 !px-8 text-base">
              Start Creating — It&apos;s Free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link href="/signin" className="btn-secondary !py-3.5 !px-8 text-base">
              I have an account
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-12 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need, <span className="gradient-text">nothing you don&apos;t</span>
            </h2>
            <p className="text-[var(--color-muted)] max-w-xl mx-auto">
              No bloat, no premium upsells. Just powerful QR code management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Dynamic Links</h3>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                Update where your QR code points anytime. No need to reprint or redistribute. One code, infinite destinations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Scan Analytics</h3>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                Track every scan. See total scan counts and when each code was last scanned. Data-driven decisions, for free.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Group Management</h3>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                Organize QR codes into groups. Filter, sort, and manage campaigns or categories with ease.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #ec4899, #be185d)' }}>
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant Redirects</h3>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                Lightning-fast redirects when someone scans your code. No waiting, no intermediate pages.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '500ms' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Auth</h3>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                Enterprise-grade authentication. Your QR codes are protected with Supabase security. Only you control your codes.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '600ms' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Clean QR Codes</h3>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                High-quality QR codes generated instantly. Perfect for print, digital displays, or sharing anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="gradient-border p-12 md:p-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to create your first QR code?
            </h2>
            <p className="text-[var(--color-muted)] mb-8 max-w-lg mx-auto">
              Join DynQR and start managing dynamic QR codes in seconds. Completely free, forever.
            </p>
            <Link href="/signup" className="btn-primary !py-3.5 !px-10 text-base">
              Get Started Now
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-8 text-center" style={{ borderTop: '1px solid var(--color-border)' }}>
        <p className="text-sm text-[var(--color-muted)]">
          © {new Date().getFullYear()} DynQR. Built with Next.js & Supabase. Free & Open.
        </p>
      </footer>
    </div>
  )
}
