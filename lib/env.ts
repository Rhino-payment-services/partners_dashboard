/**
 * Environment utilities for checking if features should be enabled
 */

/**
 * Check if signup/registration is allowed based on the current environment
 * Allowed on:
 * - localhost (any port)
 * - dev.partners.rukapay.co.ug
 * Blocked on:
 * - partners.rukapay.co.ug (production)
 */
export function isSignupAllowed(): boolean {
  if (typeof window === 'undefined') {
    // Server-side: check environment variable
    const env = process.env.NEXT_PUBLIC_PARTNER_ENVIRONMENT
    return env === 'development' || env === 'dev'
  }

  // Client-side: check hostname
  const hostname = window.location.hostname
  
  // Allow on localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return true
  }
  
  // Allow on dev subdomain
  if (hostname === 'dev.partners.rukapay.co.ug') {
    return true
  }
  
  // Block on production
  if (hostname === 'partners.rukapay.co.ug') {
    return false
  }
  
  // Default: allow for other environments (staging, etc.)
  return true
}

/**
 * Get the current environment name
 */
export function getEnvironment(): 'development' | 'production' | 'staging' {
  if (typeof window === 'undefined') {
    const env = process.env.NEXT_PUBLIC_PARTNER_ENVIRONMENT
    if (env === 'production' || env === 'prod') return 'production'
    if (env === 'staging') return 'staging'
    return 'development'
  }

  const hostname = window.location.hostname
  
  if (hostname === 'partners.rukapay.co.ug') {
    return 'production'
  }
  
  if (hostname === 'dev.partners.rukapay.co.ug') {
    return 'development'
  }
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'development'
  }
  
  return 'staging'
}

/**
 * Get the API base URL based on environment
 * Production: https://api.rukapay.net/
 * Development: https://dev-api.rukapay.net/
 */
export function getApiBaseUrl(): string {
  const env = getEnvironment()
  
  if (env === 'production') {
    return 'https://api.rukapay.net'
  }
  
  // Development and staging use dev API
  return 'https://dev-api.rukapay.net'
}

/**
 * Get the Gateway API base URL (includes /api/v1/gateway)
 */
export function getGatewayApiBaseUrl(): string {
  return `${getApiBaseUrl()}/api/v1/gateway`
}
