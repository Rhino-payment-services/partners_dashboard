"use client"
import React from 'react'
import NavaBar from '@/components/NavaBar'

export default function DocumentationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      <NavaBar />
      <main className='flex-1 p-8 mx-auto w-full max-w-3xl'>
        {children}
      </main>
    </div>
  )
} 