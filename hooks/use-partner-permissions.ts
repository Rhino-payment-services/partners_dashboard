'use client'

import { useState, useEffect } from 'react'
import { getPartnerProfile } from '@/lib/api'

interface PartnerPermissions {
  canViewTransactions: boolean
  canManageApiKeys: boolean
  canViewAnalytics: boolean
  canManageMembers: boolean
  canConfigureTariffs: boolean
  role: string
}

export function usePartnerPermissions() {
  const [permissions, setPermissions] = useState<PartnerPermissions | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const profile = await getPartnerProfile()
        if (profile.permissions) {
          setPermissions(profile.permissions)
          setIsOwner(profile.isOwner || false)
        } else {
          // Default to owner permissions if not set (backward compatibility)
          setPermissions({
            canViewTransactions: true,
            canManageApiKeys: true,
            canViewAnalytics: true,
            canManageMembers: true,
            canConfigureTariffs: true,
            role: 'OWNER',
          })
          setIsOwner(true)
        }
      } catch (error) {
        console.error('Failed to load permissions', error)
        // Default to no permissions on error
        setPermissions({
          canViewTransactions: false,
          canManageApiKeys: false,
          canViewAnalytics: false,
          canManageMembers: false,
          canConfigureTariffs: false,
          role: 'VIEWER',
        })
        setIsOwner(false)
      } finally {
        setLoading(false)
      }
    }

    loadPermissions()
  }, [])

  return {
    permissions,
    isOwner,
    loading,
    canViewTransactions: permissions?.canViewTransactions ?? false,
    canManageApiKeys: permissions?.canManageApiKeys ?? false,
    canViewAnalytics: permissions?.canViewAnalytics ?? false,
    canManageMembers: permissions?.canManageMembers ?? false,
    canConfigureTariffs: permissions?.canConfigureTariffs ?? false,
    role: permissions?.role || 'VIEWER',
  }
}
