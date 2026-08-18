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
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur md:px-6">
      <SidebarTrigger className="-ml-1 size-8 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-[#08163d]" />
      <div className="flex-1" />
      {loading ? (
        <div className="h-7 w-24 animate-pulse rounded-full bg-slate-100" />
      ) : partnerName ? (
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1 shadow-sm">
          <div className="flex size-5 items-center justify-center rounded-full bg-[#08163d] text-[9px] font-semibold text-white">
            {partnerName.slice(0, 2).toUpperCase()}
          </div>
          <span className="max-w-40 truncate text-xs font-semibold text-slate-700">{partnerName}</span>
        </div>
      ) : null}
    </header>
  )
}

