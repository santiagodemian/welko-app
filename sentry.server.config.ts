import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Only enable in production
  enabled: process.env.NODE_ENV === 'production',

  // Capture 10% of transactions for performance monitoring
  tracesSampleRate: 0.1,

  // Capture all errors
  sampleRate: 1.0,

  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'development',
})
