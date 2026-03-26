'use client'

import { useState } from 'react'

interface Group {
  id: string
  name: string
}

interface GroupManagerProps {
  groups: Group[]
  onGroupsChanged: () => void
}

export default function GroupManager({ groups, onGroupsChanged }: GroupManagerProps) {
  const [newGroupName, setNewGroupName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGroupName.trim()) return
    setLoading(true)

    await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newGroupName }),
    })

    setNewGroupName('')
    setLoading(false)
    onGroupsChanged()
  }

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return

    await fetch(`/api/groups/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName }),
    })

    setEditingId(null)
    onGroupsChanged()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this group? QR codes in this group will be ungrouped.')) return

    await fetch(`/api/groups/${id}`, { method: 'DELETE' })
    onGroupsChanged()
  }

  return (
    <div className="glass-card p-6 mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <h3 className="font-semibold">Groups</h3>
          <span className="badge badge-primary">{groups.length}</span>
        </div>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-3 animate-fade-in">
          {/* Create new group */}
          <form onSubmit={handleCreate} className="flex gap-2">
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="input-field flex-1"
              placeholder="New group name..."
            />
            <button type="submit" disabled={loading || !newGroupName.trim()} className="btn-primary px-4">
              Add
            </button>
          </form>

          {/* Groups list */}
          {groups.length === 0 ? (
            <p className="text-sm text-[var(--color-muted)] text-center py-3">No groups yet</p>
          ) : (
            <div className="space-y-2">
              {groups.map((group) => (
                <div key={group.id} className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'var(--color-surface)' }}>
                  {editingId === group.id ? (
                    <>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="input-field flex-1 !py-1.5 !text-sm"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdate(group.id)
                          if (e.key === 'Escape') setEditingId(null)
                        }}
                      />
                      <button onClick={() => handleUpdate(group.id)} className="text-[var(--color-success)] hover:opacity-80 p-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-[var(--color-muted)] hover:opacity-80 p-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-sm">{group.name}</span>
                      <button
                        onClick={() => { setEditingId(group.id); setEditName(group.name) }}
                        className="text-[var(--color-muted)] hover:text-[var(--color-foreground)] p-1 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(group.id)}
                        className="text-[var(--color-muted)] hover:text-[var(--color-danger)] p-1 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
