'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ProfileContextType {
  profile: {
    name: string | null
    avatar_url: string | null
  } | null
  loading: boolean
  refreshProfile: () => Promise<void>
  updateProfileState: (updates: { name?: string | null; avatar_url?: string | null }) => void
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileContextType['profile']>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchProfile = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('name, avatar_url')
          .eq('id', user.id)
          .single()

        if (!error && data) {
          setProfile({
            name: data.name,
            avatar_url: data.avatar_url
          })
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const updateProfileState = useCallback((updates: { name?: string | null; avatar_url?: string | null }) => {
    setProfile(prev => prev ? { ...prev, ...updates } : { name: updates.name ?? null, avatar_url: updates.avatar_url ?? null })
  }, [])

  return (
    <ProfileContext.Provider value={{ profile, loading, refreshProfile: fetchProfile, updateProfileState }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}
