import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin')
  }

  // Get total scans
  const { count: totalScans } = await supabase
    .from('scans')
    .select('id', { count: 'exact', head: true })
    .in('qrcode_id', (
      await supabase.from('qrcodes').select('id').eq('user_id', user.id)
    ).data?.map(q => q.id) || [])

  // Get unique QR codes
  const { count: uniqueQRs } = await supabase
    .from('qrcodes')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // Get scans in last 24 hours
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { count: recentScans } = await supabase
    .from('scans')
    .select('id', { count: 'exact', head: true })
    .gte('scanned_at', yesterday)
    .in('qrcode_id', (
      await supabase.from('qrcodes').select('id').eq('user_id', user.id)
    ).data?.map(q => q.id) || [])

  // Get scan data for chart (last 14 days)
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  const { data: chartData } = await supabase
    .from('scans')
    .select('scanned_at, qrcode_id')
    .gte('scanned_at', fourteenDaysAgo)
    .in('qrcode_id', (
      await supabase.from('qrcodes').select('id').eq('user_id', user.id)
    ).data?.map(q => q.id) || [])

  // Process chart data
  const dailyScans: Record<string, number> = {}
  for (let i = 0; i < 14; i++) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    dailyScans[d] = 0
  }
  chartData?.forEach(scan => {
    const date = scan.scanned_at.split('T')[0]
    if (dailyScans[date] !== undefined) {
      dailyScans[date]++
    }
  })
  const chartPoints = Object.entries(dailyScans)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date: date.split('-').slice(1).join('/'), count }))

  const maxCount = Math.max(...chartPoints.map(p => p.count), 1)

  // Get top QR codes
  const { data: qrCounts } = await supabase
    .from('qrcodes')
    .select('id, title, short_id, scans(id)')
    .eq('user_id', user.id)
  
  const topQRs = qrCounts
    ?.map(qr => ({
      title: qr.title || qr.short_id,
      scans: qr.scans?.length || 0,
      short_id: qr.short_id
    }))
    .sort((a, b) => b.scans - a.scans)
    .slice(0, 5) || []

  // Recent activity
  const { data: recentActivity } = await supabase
    .from('scans')
    .select('scanned_at, qrcodes(title, short_id)')
    .in('qrcode_id', (
      await supabase.from('qrcodes').select('id').eq('user_id', user.id)
    ).data?.map(q => q.id) || [])
    .order('scanned_at', { ascending: false })
    .limit(10)

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">detailed Analytics</h1>
        <p className="text-sm text-[var(--color-muted)]">Track your QR code performance across all campaigns.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-primary)] opacity-[0.03] rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500" />
          <span className="text-sm font-medium text-[var(--color-muted)]">Total Scans</span>
          <span className="text-4xl font-bold gradient-text">{totalScans || 0}</span>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[var(--color-success)]">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>All time high</span>
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-secondary)] opacity-[0.03] rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500" />
          <span className="text-sm font-medium text-[var(--color-muted)]">Active codes</span>
          <span className="text-4xl font-bold gradient-text">{uniqueQRs || 0}</span>
          <p className="text-[11px] text-[var(--color-muted)] mt-2 italic">Generating traffic</p>
        </div>

        <div className="glass-card p-6 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-primary)] opacity-[0.03] rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500" />
          <span className="text-sm font-medium text-[var(--color-muted)]">Scans (Last 24h)</span>
          <span className="text-4xl font-bold text-white">{recentScans || 0}</span>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[var(--color-primary)]">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Real-time tracking</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Card */}
        <div className="glass-card p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Scan Velocity</h3>
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[rgba(255,255,255,0.03)] border border-[var(--color-border)] text-[var(--color-muted)]">Last 14 Days</span>
          </div>
          
          <div className="h-[250px] flex items-end justify-between gap-2 px-1">
            {chartPoints.map((p, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative h-full justify-end">
                <div 
                  className="w-full max-w-[12px] rounded-full bg-[var(--color-primary)] transition-all duration-700 ease-out group-hover:opacity-100 opacity-40 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                  style={{ height: `${(p.count / maxCount) * 100}%`, minHeight: p.count > 0 ? '4px' : '0' }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-[var(--color-card)] border border-[var(--color-border)] rounded-md text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl">
                    {p.count} scans
                  </div>
                </div>
                <span className="text-[9px] text-[var(--color-muted)] font-medium rotate-45 sm:rotate-0 mt-1">{p.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Codes */}
        <div className="glass-card p-8 flex flex-col">
          <h3 className="font-semibold text-lg mb-6">Top Performing Codes</h3>
          <div className="space-y-4">
            {topQRs.length > 0 ? topQRs.map((qr, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] hover:border-[var(--color-border)] transition-all group">
                <div className="flex flex-col">
                  <span className="font-medium text-sm group-hover:text-[var(--color-primary)] transition-colors">{qr.title}</span>
                  <span className="text-[10px] text-[var(--color-muted)]">/q/{qr.short_id}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{qr.scans}</div>
                  <div className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider">Scans</div>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-12 text-[var(--color-muted)] text-sm italic">
                No scan data available yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-[var(--color-border)]">
          <h3 className="font-semibold text-lg">Recent Scan History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[rgba(255,255,255,0.02)]">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[var(--color-muted)] border-b border-[var(--color-border)]">QR Code</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[var(--color-muted)] border-b border-[var(--color-border)]">Short ID</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[var(--color-muted)] border-b border-[var(--color-border)] text-right">Scanned At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {recentActivity?.length ? recentActivity.map((scan, i) => (
                <tr key={i} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors group">
                  <td className="px-6 py-4 text-sm font-medium text-white group-hover:text-[var(--color-primary)] transition-colors">
                    {(scan.qrcodes as any)?.title || 'Untitled'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-md bg-[var(--color-primary-light)] text-[10px] font-mono text-[var(--color-primary-hover)] border border-[var(--color-border)]">
                      /q/{(scan.qrcodes as any)?.short_id}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-[var(--color-muted)] text-right">
                    {new Date(scan.scanned_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-sm text-[var(--color-muted)] italic">
                    Waiting for your first scan...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
