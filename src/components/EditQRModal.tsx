'use client'

import { useState } from 'react'

interface EditQRModalProps {
  qrCode: {
    id: string
    title: string | null
    original_url: string
    group_id: string | null
  }
  groups: Array<{ id: string; name: string }>
  onClose: () => void
  onUpdated: () => void
}

export default function EditQRModal({ qrCode, groups, onClose, onUpdated }: EditQRModalProps) {
  const [title, setTitle] = useState(qrCode.title || '')
  const [url, setUrl] = useState(qrCode.original_url)
  const [groupId, setGroupId] = useState(qrCode.group_id || '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/qrcodes/${qrCode.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || null,
          original_url: url,
          group_id: groupId || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update QR code')
      }

      onUpdated()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Edit QR Code</h2>
          <button onClick={onClose} className="text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--color-danger)' }}>
              {error}
            </div>
          )}

          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium mb-2">Title</label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="My awesome link"
            />
          </div>

          <div>
            <label htmlFor="edit-url" className="block text-sm font-medium mb-2">Destination URL <span className="text-[var(--color-danger)]">*</span></label>
            <input
              id="edit-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="input-field"
              placeholder="https://example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="edit-group" className="block text-sm font-medium mb-2">Group</label>
            <select
              id="edit-group"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="input-field"
            >
              <option value="">No group</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
