import { Navbar } from '@/components/layout/Navbar'
import { HowItWorksSection } from '@/components/sections/HowItWorksSection'
import { FAQSection } from '@/components/sections/FAQSection'
import { PricingSection } from '@/components/sections/PricingSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cómo funciona Welko | Recepcionista IA para Clínicas',
  description: 'De cero a recepcionista IA en 5 pasos. Crea tu cuenta, configura tu clínica, conecta WhatsApp e Instagram y la IA empieza a atender pacientes 24/7.',
}

export default function ComoFuncionaPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <HowItWorksSection />
        <PricingSection />
        <FAQSection />
      </main>
    </>
  )
}
