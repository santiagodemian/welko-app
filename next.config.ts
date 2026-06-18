import type { NextConfig } from 'next'

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://js.stripe.com https://*.clerk.com https://*.clerk.accounts.dev",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://*.clerk.com https://*.clerk.accounts.dev wss://*.clerk.com https://api.stripe.com https://graph.facebook.com",
  "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://*.clerk.com https://*.clerk.accounts.dev",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://*.clerk.com",
  "upgrade-insecure-requests",
].join('; ')

const SECURITY_HEADERS = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options',    value: 'nosniff' },
  { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: ['camera=()', 'microphone=()', 'geolocation=()', 'payment=(self "https://js.stripe.com")', 'usb=()', 'interest-cohort=()'].join(', '),
  },
  { key: 'Content-Security-Policy', value: CSP },
  { key: 'X-XSS-Protection',        value: '1; mode=block' },
]

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Legacy routes → Polaris equivalents
      { source: '/platform',           destination: '/services', permanent: true },
      { source: '/demo',               destination: '/about',    permanent: true },
      { source: '/partners',           destination: '/players',  permanent: true },
      { source: '/pricing',            destination: '/contact',  permanent: true },
      { source: '/precios',            destination: '/contact',  permanent: true },
      { source: '/soporte',            destination: '/contact',  permanent: true },
      { source: '/contacto',           destination: '/contact',  permanent: true },
      { source: '/solutions/:path*',   destination: '/services', permanent: true },
      { source: '/platform/:path*',    destination: '/services', permanent: true },
    ]
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: SECURITY_HEADERS,
      },
    ]
  },
}

export default nextConfig
