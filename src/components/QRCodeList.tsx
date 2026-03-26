'use client'

import QRPreview from './QRPreview'
import QRCode from 'qrcode'

interface QRCodeItem {
  id: string
  short_id: string
  title: string | null
  original_url: string
  scan_count: number
  last_scan: string | null
  created_at: string
  group_id: string | null
  group: { id: string; name: string } | null
}

interface QRCodeListProps {
  qrcodes: QRCodeItem[]
  appUrl: string
  onEdit: (qr: QRCodeItem) => void
  onDelete: (id: string) => void
  filterGroup: string | null
}

export default function QRCodeList({ qrcodes, appUrl, onEdit, onDelete, filterGroup }: QRCodeListProps) {
  const filtered = filterGroup
    ? qrcodes.filter((qr) => qr.group_id === filterGroup)
    : qrcodes

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Never'
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleDownload = async (shortUrl: string, title: string | null) => {
    try {
      const dataUrl = await QRCode.toDataURL(shortUrl, {
        width: 1024,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      })
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `qr-${(title || 'code').toLowerCase().replace(/\s+/g, '-')}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Failed to download QR code', err)
    }
  }

  if (filtered.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--color-primary-light)' }}>
          <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No QR codes yet</h3>
        <p className="text-[var(--color-muted)] text-sm">Create your first dynamic QR code to get started!</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {filtered.map((qr, i) => {
        const shortUrl = `${appUrl}/q/${qr.short_id}`
        return (
          <div
            key={qr.id}
            className="glass-card p-5 animate-fade-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* QR Preview */}
              <div className="flex-shrink-0">
                <QRPreview url={shortUrl} size={96} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-semibold text-base truncate">
                      {qr.title || 'Untitled QR Code'}
                    </h3>
                    {qr.group && (
                      <span className="badge badge-primary mt-1">{qr.group.name}</span>
                    )}
                  </div>
                </div>

                {/* URLs */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--color-muted)] w-12 flex-shrink-0">Short</span>
                    <button
                      onClick={() => copyToClipboard(shortUrl)}
                      className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] truncate transition-colors flex items-center gap-1.5"
                      title="Click to copy"
                    >
                      {shortUrl}
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--color-muted)] w-12 flex-shrink-0">Dest</span>
                    <a
                      href={qr.original_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[var(--color-foreground)] hover:text-[var(--color-primary)] truncate transition-colors"
                    >
                      {qr.original_url}
                    </a>
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-4 text-xs text-[var(--color-muted)]">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {qr.scan_count} scans
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Last: {formatDate(qr.last_scan)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Created {formatDate(qr.created_at)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex md:flex-col gap-2 flex-shrink-0">
                <button
                  onClick={() => handleDownload(shortUrl, qr.title)}
                  className="btn-primary !px-3 !py-2 text-xs"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
                <button
                  onClick={() => onEdit(qr)}
                  className="btn-secondary !px-3 !py-2 text-xs"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this QR code? This cannot be undone.')) {
                      onDelete(qr.id)
                    }
                  }}
                  className="btn-danger !px-3 !py-2 text-xs"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
