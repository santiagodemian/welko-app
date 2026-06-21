import type { Metadata } from 'next'
import { Inter, Space_Grotesk, Geist_Mono } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

// Inter → mapped to --font-montserrat variable so all existing code gets Inter automatically
const inter = Inter({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const SITE_URL = 'https://polarisfootball.com'
const OG_IMAGE  = 'https://polarisfootball.com/og-image.png'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:  'Polaris Football — Guiding Football Careers',
    template: '%s | Polaris Football',
  },
  description:
    'We represent football players worldwide and connect them with the right opportunities to achieve their dreams.',
  keywords: ['football agent', 'football agency', 'player management', 'football careers', 'Polaris Football'],
  authors:   [{ name: 'Polaris Football', url: SITE_URL }],
  creator:   'Polaris Football',
  publisher: 'Polaris Football',
  robots:    { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon-192.png',   type: 'image/png', sizes: '192x192' },
    ],
    shortcut: '/favicon-32.png',
    apple:    '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type:        'website',
    url:         SITE_URL,
    siteName:    'Polaris Football',
    title:       'Polaris Football — Guiding Football Careers',
    description: 'We represent football players worldwide and connect them with the right opportunities.',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Polaris Football' }],
    locale: 'en_US',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Polaris Football — Guiding Football Careers',
    description: 'We represent football players worldwide and connect them with the right opportunities.',
    images:      [OG_IMAGE],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
