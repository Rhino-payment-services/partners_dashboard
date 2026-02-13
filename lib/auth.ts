'use client'

export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('accessToken')
}

export const getUser = () => {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem('user')
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export const isAuthenticated = (): boolean => {
  return !!getAccessToken()
}

export const logout = (returnUrl?: string) => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  const url = returnUrl
    ? `/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`
    : '/auth/login'
  window.location.href = url
}

