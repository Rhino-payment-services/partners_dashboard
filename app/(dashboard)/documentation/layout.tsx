"use client"
import React from 'react'

export default function DocumentationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      <main className='flex-1 p-4 md:p-6 lg:p-8 mx-auto w-full max-w-6xl'>
        {children}
      </main>
    </div>
  )
} 