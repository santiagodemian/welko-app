'use client'

import { ThemeProvider } from 'next-themes'
import { ClerkProvider } from '@clerk/nextjs'
import { LangProvider } from '@/contexts/LangContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange={false}
      >
        <LangProvider>
          {children}
        </LangProvider>
      </ThemeProvider>
    </ClerkProvider>
  )
}
