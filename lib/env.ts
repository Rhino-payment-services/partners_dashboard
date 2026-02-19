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
 * Get the API base URL (origin, no path) based on environment.
 * No NEXT_PUBLIC_PARTNER_ENVIRONMENT needed: client uses hostname, server uses NODE_ENV.
 * Production hostname / NODE_ENV=production → NEXT_PUBLIC_API_URL
 * Localhost / NODE_ENV=development → NEXT_PUBLIC_API_URL_LOCAL
 * Dev subdomain etc. → NEXT_PUBLIC_API_URL_DEV
 */
export function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    // Server-side: use NODE_ENV (e.g. next dev → local API, next start in prod → production API)
    if (process.env.NODE_ENV === 'production') {
      return process.env.NEXT_PUBLIC_API_URL || 'https://api.rukapay.net'
    }
    return process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:8000'
  }

  // Client-side: use hostname only
  const hostname = window.location.hostname
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:8000'
  }
  if (hostname === 'partners.rukapay.co.ug') {
    return process.env.NEXT_PUBLIC_API_URL || 'https://api.rukapay.net'
  }
  return process.env.NEXT_PUBLIC_API_URL_DEV || 'https://dev-api.rukapay.net'
}

/**
 * Get the API base URL with /api/v1 (for partner-auth, gateway, etc.)
 */
export function getApiBaseUrlWithV1(): string {
  const base = getApiBaseUrl()
  return base.includes('/api/v1') ? base : `${base}/api/v1`
}

/**
 * Get the Gateway API base URL (includes /api/v1/gateway)
 */
export function getGatewayApiBaseUrl(): string {
  return `${getApiBaseUrl()}/api/v1/gateway`
}
