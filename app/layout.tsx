import type { Metadata } from 'next'
import { Montserrat, Geist_Mono } from 'next/font/google'
import { Providers } from './providers'
import { SplashScreen } from '@/components/ui/SplashScreen'
import './globals.css'

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Welko | Tu recepcionista inteligente',
  description:
    'Welko reemplaza a tu recepcionista con IA: agenda citas, responde consultas y gestiona pacientes 24/7 para clínicas estéticas y dentales.',
  keywords: ['recepcionista IA', 'clínicas estéticas', 'clínicas dentales', 'automatización', 'SaaS'],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
  },
  openGraph: {
    title: 'Welko | Tu recepcionista inteligente',
    description: 'Automatiza tu recepción con IA. Welko agenda, responde y gestiona pacientes 24/7.',
    type: 'website',
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
