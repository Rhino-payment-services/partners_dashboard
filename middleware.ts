import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware to block signup page access in production
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') || ''

  // Block signup route in production
  if (pathname.startsWith('/auth/signup')) {
    // Allow on localhost
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      return NextResponse.next()
    }

    // Allow on dev subdomain
    if (hostname.includes('dev.partners.rukapay.co.ug')) {
      return NextResponse.next()
    }

    // Block on production domain
    if (hostname.includes('partners.rukapay.co.ug') && !hostname.includes('dev.')) {
      // Redirect to home page
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/auth/signup/:path*',
}
