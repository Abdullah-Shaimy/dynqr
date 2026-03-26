'use client'

import { useState } from 'react'

interface CreateQRModalProps {
  groups: Array<{ id: string; name: string }>
  onClose: () => void
  onCreated: () => void
}

export default function CreateQRModal({ groups, onClose, onCreated }: CreateQRModalProps) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [groupId, setGroupId] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/qrcodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || undefined,
          original_url: url,
          group_id: groupId || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create QR code')
      }

      onCreated()
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
          <h2 className="text-xl font-bold">Create QR Code</h2>
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
            <label htmlFor="create-title" className="block text-sm font-medium mb-2">Title (optional)</label>
            <input
              id="create-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="My awesome link"
            />
          </div>

          <div>
            <label htmlFor="create-url" className="block text-sm font-medium mb-2">Destination URL <span className="text-[var(--color-danger)]">*</span></label>
            <input
              id="create-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="input-field"
              placeholder="https://example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="create-group" className="block text-sm font-medium mb-2">Group (optional)</label>
            <select
              id="create-group"
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
              {loading ? 'Creating...' : 'Create QR Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
