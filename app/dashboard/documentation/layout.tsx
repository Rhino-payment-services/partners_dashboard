"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DocumentationLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || ''

  const isActive = (href: string) => {
    return pathname === href || pathname === href + '/'
  }

  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      <main className='flex-1 p-4 md:p-6 lg:p-8 mx-auto w-full max-w-6xl'>
        <nav className='mb-6 bg-white rounded-xl p-3 shadow flex gap-2 flex-wrap'>
          <Link href="/dashboard/documentation" className={`px-3 py-2 rounded ${isActive('/dashboard/documentation') ? 'bg-[#08163d] text-white' : 'text-[#08163d] hover:bg-gray-100'}`}>
            Overview
          </Link>
          <Link href="/dashboard/documentation/rukapay" className={`px-3 py-2 rounded ${isActive('/dashboard/documentation/rukapay') ? 'bg-[#08163d] text-white' : 'text-[#08163d] hover:bg-gray-100'}`}>
            RukaPay
          </Link>
          <Link href="/dashboard/documentation/mobile-money" className={`px-3 py-2 rounded ${isActive('/dashboard/documentation/mobile-money') ? 'bg-[#08163d] text-white' : 'text-[#08163d] hover:bg-gray-100'}`}>
            Mobile Money
          </Link>
          <Link href="/dashboard/documentation/bank" className={`px-3 py-2 rounded ${isActive('/dashboard/documentation/bank') ? 'bg-[#08163d] text-white' : 'text-[#08163d] hover:bg-gray-100'}`}>
            Bank
          </Link>
          <Link href="/dashboard/documentation/transaction-status" className={`px-3 py-2 rounded ${isActive('/dashboard/documentation/transaction-status') ? 'bg-[#08163d] text-white' : 'text-[#08163d] hover:bg-gray-100'}`}>
            Transaction Status
          </Link>
          <Link href="/dashboard/documentation/webhook" className={`px-3 py-2 rounded ${isActive('/dashboard/documentation/webhook') ? 'bg-[#08163d] text-white' : 'text-[#08163d] hover:bg-gray-100'}`}>
            Webhooks
          </Link>
        </nav>
        {children}
      </main>
    </div>
  )
}