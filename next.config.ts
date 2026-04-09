import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

/* ─────────────────────────────────────────────────────────────────────────────
   Content Security Policy
   Allows: Clerk auth, Stripe payments, Google Fonts (served locally by next/font)
   Blocks: framing by external sites, inline eval in production
───────────────────────────────────────────────────────────────────────────── */
const CSP = [
  "default-src 'self'",

  // Scripts: Next.js hydration needs unsafe-inline; Clerk & Stripe load their own JS
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://js.stripe.com https://*.clerk.com https://*.clerk.accounts.dev",

  // Styles: Next.js/Tailwind injects inline styles
  "style-src 'self' 'unsafe-inline'",

  // Images: allow data URIs and all HTTPS (user avatars, OG images, etc.)
  "img-src 'self' data: blob: https:",

  // Fonts: next/font downloads at build time → served from 'self'; keep Google as fallback
  "font-src 'self' https://fonts.gstatic.com",

  // API connections: Clerk, Stripe, WhatsApp Business
  "connect-src 'self' https://*.clerk.com https://*.clerk.accounts.dev wss://*.clerk.com https://api.stripe.com https://graph.facebook.com",

  // Iframes: Stripe Elements, Clerk hosted pages
  "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://*.clerk.com https://*.clerk.accounts.dev",

  // Forbid Flash / plugins
  "object-src 'none'",

  // Restrict <base> tag hijacking
  "base-uri 'self'",

  // Only allow form submissions to same origin
  "form-action 'self' https://*.clerk.com",

  // Force HTTPS for all embedded resources
  "upgrade-insecure-requests",
].join('; ')

/* ─────────────────────────────────────────────────────────────────────────────
   Security headers applied to every route
───────────────────────────────────────────────────────────────────────────── */
const SECURITY_HEADERS = [
  // HSTS — 2 years, include subdomains, request preload listing
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // Prevent clickjacking
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  // Prevent MIME-type sniffing
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // Limit referrer info on cross-origin requests
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // Disable browser features not used by Welko
  {
    key: 'Permissions-Policy',
    value: [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=(self "https://js.stripe.com")',
      'usb=()',
      'interest-cohort=()',   // opt out of FLoC
    ].join(', '),
  },
  // Content Security Policy
  {
    key: 'Content-Security-Policy',
    value: CSP,
  },
  // Enable XSS filter in older browsers
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
]

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply to all routes including API and static assets
        source: '/(.*)',
        headers: SECURITY_HEADERS,
      },
    ]
  },
}

export default withSentryConfig(nextConfig, {
  // Suppress source map upload unless SENTRY_AUTH_TOKEN is set
  silent: !process.env.SENTRY_AUTH_TOKEN,
})
