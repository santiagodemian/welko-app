import { Navbar } from '@/components/layout/Navbar'
import { DemoChat } from '@/components/sections/DemoChat'
import { DashboardWalkthrough } from '@/components/sections/DashboardWalkthrough'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Demo en vivo | Welko',
  description: 'Habla con la recepcionista IA de Welko ahora mismo. Sin registro, sin trucos — respuestas reales de la IA para cualquier especialidad.',
}

export default function DemoPage() {
  return (
    <>
      <Navbar />
      <DemoChat />
      <DashboardWalkthrough />
    </>
  )
}
