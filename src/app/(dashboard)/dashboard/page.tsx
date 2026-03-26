'use client'

import { useState, useEffect, useCallback } from 'react'
import StatsCards from '@/components/StatsCards'
import QRCodeList from '@/components/QRCodeList'
import CreateQRModal from '@/components/CreateQRModal'
import EditQRModal from '@/components/EditQRModal'
import GroupManager from '@/components/GroupManager'

interface QRCode {
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

interface Group {
  id: string
  name: string
}

export default function Dashboard() {
  const [qrcodes, setQrcodes] = useState<QRCode[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingQR, setEditingQR] = useState<QRCode | null>(null)
  const [filterGroup, setFilterGroup] = useState<string | null>(null)

  const appUrl = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL || ''

  const fetchData = useCallback(async () => {
    const [qrRes, groupRes] = await Promise.all([
      fetch('/api/qrcodes'),
      fetch('/api/groups'),
    ])
    const qrData = await qrRes.json()
    const groupData = await groupRes.json()
    setQrcodes(Array.isArray(qrData) ? qrData : [])
    setGroups(Array.isArray(groupData) ? groupData : [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleDelete = async (id: string) => {
    await fetch(`/api/qrcodes/${id}`, { method: 'DELETE' })
    fetchData()
  }

  const totalScans = qrcodes.reduce((sum, qr) => sum + (qr.scan_count || 0), 0)
  const activeQRCodes = qrcodes.filter((qr) => qr.scan_count > 0).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
          <p className="text-[var(--color-muted)]">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-[var(--color-muted)] text-sm mt-1">Manage your dynamic QR codes</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create QR Code
        </button>
      </div>

      {/* Stats */}
      <StatsCards
        totalQRCodes={qrcodes.length}
        totalScans={totalScans}
        activeQRCodes={activeQRCodes}
      />

      {/* Group Manager */}
      <GroupManager groups={groups} onGroupsChanged={fetchData} />

      {/* Filter bar */}
      {groups.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilterGroup(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterGroup === null
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
            }`}
          >
            All
          </button>
          {groups.map((g) => (
            <button
              key={g.id}
              onClick={() => setFilterGroup(g.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterGroup === g.id
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      )}

      {/* QR Code List */}
      <QRCodeList
        qrcodes={qrcodes}
        appUrl={appUrl}
        onEdit={setEditingQR}
        onDelete={handleDelete}
        filterGroup={filterGroup}
      />

      {/* Modals */}
      {showCreateModal && (
        <CreateQRModal
          groups={groups}
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchData}
        />
      )}

      {editingQR && (
        <EditQRModal
          qrCode={editingQR}
          groups={groups}
          onClose={() => setEditingQR(null)}
          onUpdated={fetchData}
        />
      )}
    </div>
  )
}
