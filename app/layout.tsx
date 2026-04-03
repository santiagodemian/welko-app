import type { Metadata } from 'next'
import { Montserrat, Geist_Mono } from 'next/font/google'
import { Providers } from './providers'
import { SplashScreen } from '@/components/ui/SplashScreen'
import './globals.css'

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const OG_IMAGE = 'https://welko.agency/og-image.png'
const SITE_URL = 'https://welko.agency'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Welko | Recepcionista IA',
    template: '%s | Welko',
  },
  description:
    'Tu negocio siempre disponible. Welko automatiza la atención al cliente con IA: responde al instante, agenda citas y nunca deja un mensaje sin contestar — 24/7, sin esfuerzo.',
  keywords: ['recepcionista IA', 'automatización', 'atención al cliente IA', 'agendamiento automático', 'WhatsApp IA', 'Welko'],
  authors: [{ name: 'Welko', url: SITE_URL }],
  creator: 'Welko',
  publisher: 'Welko',
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/icon.svg',        type: 'image/svg+xml' },
      { url: '/favicon-32.png',  type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16.png',  type: 'image/png', sizes: '16x16' },
    ],
    shortcut:   '/favicon-32.png',
    apple:      '/apple-touch-icon.png',
    other: [
      { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type:        'website',
    url:         SITE_URL,
    siteName:    'Welko',
    title:       'Welko | Recepcionista IA',
    description: 'Tu negocio siempre disponible. Welko automatiza la atención al cliente con IA: responde al instante, agenda y nunca deja un mensaje sin contestar — 24/7.',
    images: [
      {
        url:    OG_IMAGE,
        width:  1200,
        height: 630,
        alt:    'Welko — Recepcionista IA',
      },
    ],
    locale: 'es_MX',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Welko | Recepcionista IA',
    description: 'Tu negocio siempre disponible. Welko automatiza la atención con IA: responde al instante, agenda y nunca pierde un mensaje — 24/7.',
    images:      [OG_IMAGE],
    site:        '@welkoai',
    creator:     '@welkoai',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${montserrat.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <SplashScreen />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
