import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
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
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
