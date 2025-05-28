import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Add security headers
  const headers = new Headers(request.headers)
  
  // Enable HTTP Strict Transport Security
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  
  // Prevent clickjacking
  headers.set('X-Frame-Options', 'DENY')
  
  // Enable XSS protection
  headers.set('X-XSS-Protection', '1; mode=block')
  
  // Disable MIME type sniffing
  headers.set('X-Content-Type-Options', 'nosniff')
  
  // Set referrer policy
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Set Content Security Policy
  headers.set('Content-Security-Policy', `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-insights.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: res.cloudinary.com cdn.jsdelivr.net;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s+/g, ' ').trim())

  // Return response with added headers
  return NextResponse.next({
    request: {
      headers,
    },
  })
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
