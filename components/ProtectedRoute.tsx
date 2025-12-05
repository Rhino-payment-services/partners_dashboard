'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      // Only check auth on client side
      if (typeof window === 'undefined') {
        setIsLoading(false)
        return
      }

      const authenticated = isAuthenticated()
      setIsAuth(authenticated)
      setIsLoading(false)

      if (!authenticated) {
        // Store the current path to redirect back after login
        const returnUrl = pathname !== '/auth/login' ? pathname : '/'
        router.push(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`)
      }
    }

    checkAuth()
  }, [router, pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuth) {
    return null
  }

  return <>{children}</>
}
