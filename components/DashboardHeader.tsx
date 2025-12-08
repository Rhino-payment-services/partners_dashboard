"use client"

import React, { useEffect, useState } from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { getPartnerProfile } from '@/lib/api'

export default function DashboardHeader() {
  const [partnerName, setPartnerName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPartnerName = async () => {
      try {
        const profile = await getPartnerProfile()
        setPartnerName(profile?.partner?.partnerName || null)
      } catch (error) {
        console.error('Error fetching partner profile:', error)
        setPartnerName(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPartnerName()
  }, [])

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 md:px-6 bg-white">
      <SidebarTrigger className="-ml-1" />
      <div className="flex-1" />
      {loading ? (
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
      ) : partnerName ? (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#08163d] text-white rounded-md">
          <span className="font-semibold text-sm md:text-base">{partnerName}</span>
        </div>
      ) : null}
    </header>
  )
}

