'use client'

interface StatsCardsProps {
  totalQRCodes: number
  totalScans: number
  activeQRCodes: number
}

export default function StatsCards({ totalQRCodes, totalScans, activeQRCodes }: StatsCardsProps) {
  const stats = [
    {
      label: 'Total QR Codes',
      value: totalQRCodes,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      bgColor: 'rgba(99,102,241,0.08)',
    },
    {
      label: 'Total Scans',
      value: totalScans,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      bgColor: 'rgba(16,185,129,0.08)',
    },
    {
      label: 'Active Codes',
      value: activeQRCodes,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      bgColor: 'rgba(245,158,11,0.08)',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, i) => (
        <div key={i} className="glass-card p-6 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
          <div className="flex items-center justify-between mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
              style={{ background: stat.gradient }}
            >
              {stat.icon}
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">{stat.value.toLocaleString()}</p>
          <p className="text-sm text-[var(--color-muted)]">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
