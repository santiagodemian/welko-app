import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { ShieldCheck, Lock, ShieldAlert, FileText, Server, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Aviso de Privacidad Integral | Welko',
  description:
    'Aviso de Privacidad Integral de Welko. Cumplimiento con la LFPDPPP. Tratamiento de datos personales de salud, derechos ARCO y medidas de seguridad AES-256.',
}

/* ─── Design tokens ─── */
const NAVY  = '#1A2A56'
const GREEN = '#22C55E'

/* ─── Table of contents ─── */
const TOC = [
  { id: 'identidad',    label: 'Identidad del Responsable' },
  { id: 'calidad',      label: 'Calidad del Tratamiento' },
  { id: 'datos',        label: 'Datos Personales Recabados' },
  { id: 'finalidad',    label: 'Finalidad del Tratamiento' },
  { id: 'fundamento',   label: 'Fundamento Legal' },
  { id: 'transferencia','label': 'Transferencia de Datos' },
  { id: 'arco',         label: 'Derechos ARCO' },
  { id: 'seguridad',    label: 'Medidas de Seguridad Técnica' },
  { id: 'consentimiento','label': 'Consentimiento' },
  { id: 'cambios',      label: 'Cambios al Aviso' },
] as const

export default function PrivacidadPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24 px-4">
        <div className="max-w-3xl mx-auto flex flex-col gap-10">

          {/* ── Back link ── */}
          <Link
            href="/"
            className="text-sm font-medium w-fit flex items-center gap-1.5 transition-opacity hover:opacity-70"
            style={{ color: NAVY }}
          >
            ← Volver al inicio
          </Link>

          {/* ── Header ── */}
          <div className="flex flex-col gap-3">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold w-fit"
              style={{ background: '#E8F5E9', color: GREEN, border: `1px solid ${GREEN}33` }}
            >
              <ShieldCheck size={12} />
              Cumple LFPDPPP · México
            </div>
            <h1
              className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight"
              style={{ color: '#0A0F1A' }}
            >
              Aviso de Privacidad Integral
            </h1>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              Última actualización: 26 de marzo de 2026 · Versión 2.0
            </p>
          </div>

          <div className="h-px w-full" style={{ background: '#E5E7EB' }} />

          {/* ── Table of contents ── */}
          <nav
            className="rounded-2xl p-6 flex flex-col gap-2"
            style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>
              Contenido
            </p>
            {TOC.map((item, i) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="flex items-center gap-2 text-sm transition-colors duration-150 hover:opacity-70"
                style={{ color: NAVY }}
              >
                <span style={{ color: '#D1D5DB', fontSize: 11, fontVariantNumeric: 'tabular-nums' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {item.label}
                <ArrowRight size={12} style={{ color: '#D1D5DB', marginLeft: 'auto' }} />
              </a>
            ))}
          </nav>

          {/* ── Sections ── */}
          <div className="flex flex-col gap-10" style={{ color: '#374151', lineHeight: 1.75 }}>

            {/* 1 */}
            <Section id="identidad" num="01" title="Identidad y Domicilio del Responsable del Tratamiento">
              <p>
                <strong style={{ color: '#0A0F1A' }}>Welko</strong> (en adelante "el Responsable" o "Welko"),
                con domicilio en Ciudad de México, México, es el responsable del tratamiento de los datos
                personales que se recaban a través de la plataforma <em>welko.mx</em> y sus servicios
                asociados, de conformidad con la{' '}
                <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares
                (LFPDPPP)</strong> y su Reglamento.
              </p>
              <p className="mt-3">
                Para cualquier asunto relacionado con este Aviso, puede contactarnos en:{' '}
                <a href="mailto:privacidad@welko.org" style={{ color: NAVY, fontWeight: 600 }}>
                  privacidad@welko.org
                </a>
              </p>
            </Section>

            {/* 2 */}
            <Section id="calidad" num="02" title="Calidad del Tratamiento — Responsable y Encargado">
              <p>
                Welko actúa en una <strong>doble calidad</strong> según la relación con cada titular de datos:
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <RoleCard
                  role="Responsable del Tratamiento"
                  who="Respecto a los datos del médico o administrador de la clínica (usuario registrado)."
                  desc="Welko decide los fines y medios del tratamiento de los datos del contratante para brindar el servicio SaaS."
                  color={NAVY}
                />
                <RoleCard
                  role="Encargado del Tratamiento"
                  who="Respecto a los datos de salud de los pacientes de la clínica contratante."
                  desc="Welko procesa los datos de los pacientes exclusivamente por instrucción de la clínica. El médico o clínica es el Responsable ante sus pacientes y debe recabar el consentimiento de estos conforme a la normativa aplicable."
                  color={GREEN}
                />
              </div>
              <p className="mt-4">
                El tratamiento de datos de pacientes por parte de Welko se rige por el contrato de
                servicio suscrito con la clínica contratante, el cual incluye cláusulas de
                confidencialidad y protección de datos equivalentes a las obligaciones del Responsable.
              </p>
            </Section>

            {/* 3 */}
            <Section id="datos" num="03" title="Datos Personales Recabados">
              <p className="font-semibold" style={{ color: '#0A0F1A' }}>A. Datos del titular de la cuenta (médico / administrador de la clínica):</p>
              <BulletList items={[
                'Nombre completo e iniciales profesionales.',
                'Correo electrónico y número de teléfono de contacto.',
                'Nombre comercial y domicilio de la clínica.',
                'Horarios de atención y catálogo de tratamientos.',
                'Datos de facturación (RFC, razón social) — solo si aplica.',
              ]} />

              <p className="mt-5 font-semibold" style={{ color: '#0A0F1A' }}>
                B. Datos de pacientes de la clínica (procesados como Encargado):
              </p>
              <BulletList items={[
                'Nombre y apellidos del paciente.',
                'Número de teléfono (WhatsApp Business) utilizado para agendar.',
                'Historial de citas: fecha, hora, tratamiento solicitado, estado (confirmada / cancelada / asistida).',
                'Notas clínicas breves derivadas de la conversación con el asistente (ej. "primera visita", "alergia a la lidocaína"), cuando el paciente las proporcione voluntariamente.',
                'Canal de contacto (WhatsApp, llamada de voz).',
              ]} />

              <DataSensitiveNote />

              <p className="mt-5 font-semibold" style={{ color: '#0A0F1A' }}>C. Datos recabados automáticamente:</p>
              <BulletList items={[
                'Dirección IP y agente de navegador (logs de seguridad, conservados máximo 90 días).',
                'Cookies de sesión estrictamente necesarias (sin cookies publicitarias).',
                'Métricas de uso agregadas y anónimas para mejora del servicio.',
              ]} />
            </Section>

            {/* 4 */}
            <Section id="finalidad" num="04" title="Finalidad del Tratamiento">
              <p className="font-semibold" style={{ color: '#0A0F1A' }}>Finalidades primarias (necesarias para el servicio):</p>
              <BulletList items={[
                'Operar el recepcionista virtual con IA: responder consultas, agendar citas y enviar recordatorios de forma autónoma a través de WhatsApp Business.',
                'Gestionar la agenda y calendario de la clínica contratante en tiempo real.',
                'Procesar pagos y administrar la suscripción del plan contratado (mediante Stripe).',
                'Enviar confirmaciones de cita, recordatorios y notificaciones de cancelación al paciente.',
                'Generar reportes de rendimiento (citas agendadas, asistencia, conversión) para el panel de la clínica.',
              ]} />

              <p className="mt-5 font-semibold" style={{ color: '#0A0F1A' }}>Finalidades secundarias (requieren consentimiento adicional):</p>
              <BulletList items={[
                'Envío de comunicaciones comerciales o promociones de Welko al titular de la cuenta. Puede oponerse a este tratamiento en cualquier momento escribiendo a privacidad@welko.org.',
              ]} />

              <p className="mt-4 p-4 rounded-xl text-sm" style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D' }}>
                <strong>Importante:</strong> Los datos de los pacientes <em>nunca</em> se utilizan para
                entrenar modelos de inteligencia artificial públicos ni de terceros, ni para fines
                distintos al agendamiento y gestión de citas de la clínica contratante.
              </p>
            </Section>

            {/* 5 */}
            <Section id="fundamento" num="05" title="Fundamento Legal del Tratamiento">
              <BulletList items={[
                'LFPDPPP (Diario Oficial de la Federación, 5 de julio de 2010).',
                'Reglamento de la LFPDPPP (Diario Oficial de la Federación, 21 de diciembre de 2011).',
                'Lineamientos del Aviso de Privacidad (INAI, 2013).',
                'NOM-024-SSA3-2012 (Sistemas de información de registros electrónicos para la salud).',
              ]} />
            </Section>

            {/* 6 */}
            <Section id="transferencia" num="06" title="Transferencia de Datos a Terceros">
              <p>
                Welko no vende ni renta datos personales. Las transferencias a terceros se limitan a:
              </p>
              <div className="mt-4 flex flex-col gap-3">
                {[
                  {
                    third: 'Stripe, Inc.',
                    purpose: 'Procesamiento de pagos y suscripciones.',
                    basis: 'Necesaria para la ejecución del contrato. PCI DSS Nivel 1.',
                  },
                  {
                    third: 'Clerk, Inc.',
                    purpose: 'Autenticación de usuarios y gestión de sesiones.',
                    basis: 'Necesaria para la seguridad del servicio.',
                  },
                  {
                    third: 'Meta Platforms (WhatsApp Business API)',
                    purpose: 'Canal de comunicación con los pacientes de la clínica.',
                    basis: 'Necesaria para la operación del recepcionista virtual.',
                  },
                  {
                    third: 'Vercel, Inc.',
                    purpose: 'Infraestructura de alojamiento y entrega de contenido.',
                    basis: 'Todos los datos se procesan dentro del territorio nacional o bajo acuerdos de protección equivalentes.',
                  },
                ].map((t) => (
                  <div key={t.third} className="p-4 rounded-xl" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                    <p className="font-semibold text-sm" style={{ color: '#0A0F1A' }}>{t.third}</p>
                    <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>{t.purpose}</p>
                    <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>{t.basis}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm">
                Welko no realiza transferencias internacionales de datos de salud sin garantías
                contractuales equivalentes a la protección establecida en la LFPDPPP.
              </p>
            </Section>

            {/* 7 */}
            <Section id="arco" num="07" title="Derechos ARCO del Titular">
              <p>
                De conformidad con los artículos 22 al 27 de la LFPDPPP, el titular de los datos —
                o su representante legal — tiene derecho a:
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { letter: 'A', name: 'Acceso', desc: 'Conocer qué datos personales tenemos, cómo los tratamos y para qué fines.' },
                  { letter: 'R', name: 'Rectificación', desc: 'Solicitar la corrección de datos inexactos o incompletos.' },
                  { letter: 'C', name: 'Cancelación', desc: 'Solicitar la supresión de sus datos cuando no sea necesario conservarlos.' },
                  { letter: 'O', name: 'Oposición', desc: 'Oponerse al tratamiento de sus datos para finalidades secundarias.' },
                ].map((r) => (
                  <div key={r.letter} className="p-4 rounded-xl flex gap-3" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-black"
                      style={{ background: `${NAVY}12`, color: NAVY }}
                    >
                      {r.letter}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#0A0F1A' }}>{r.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 p-5 rounded-xl flex flex-col gap-3" style={{ background: `${NAVY}08`, border: `1px solid ${NAVY}18` }}>
                <p className="font-semibold text-sm" style={{ color: '#0A0F1A' }}>
                  ¿Cómo ejercer sus derechos ARCO?
                </p>
                <ol className="flex flex-col gap-2">
                  {[
                    'Envíe un correo a privacidad@welko.org con el asunto "Ejercicio de Derechos ARCO".',
                    'Indique el derecho que desea ejercer y los datos personales involucrados.',
                    'Acredite su identidad (identificación oficial vigente) o la de su representante legal.',
                    'Recibirá acuse de recibo en 5 días hábiles. La resolución se emitirá en máximo 20 días hábiles (prorrogables por 20 días más cuando sea justificado).',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#374151' }}>
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5"
                        style={{ background: NAVY, color: '#fff' }}
                      >
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
                <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                  Si considera que Welko no atiende correctamente su solicitud, puede acudir al{' '}
                  <strong>INAI</strong> (Instituto Nacional de Transparencia, Acceso a la Información
                  y Protección de Datos Personales) en{' '}
                  <a href="https://inai.org.mx" target="_blank" rel="noopener noreferrer" style={{ color: NAVY }}>
                    inai.org.mx
                  </a>.
                </p>
              </div>
            </Section>

            {/* 8 */}
            <Section id="seguridad" num="08" title="Medidas de Seguridad Técnica y Administrativa">
              <p>
                Welko implementa las siguientes medidas de seguridad conforme al Artículo 19 de la
                LFPDPPP y los <em>Lineamientos de protección de datos personales</em> del INAI:
              </p>

              <div className="mt-5 rounded-2xl overflow-hidden" style={{ border: '1px solid #E5E7EB' }}>
                {/* Card header */}
                <div
                  className="px-5 py-4 flex items-center gap-3"
                  style={{ background: NAVY, borderBottom: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <ShieldCheck size={16} color={GREEN} />
                  <p className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>
                    Arquitectura de Seguridad — Grado Médico
                  </p>
                  <div
                    className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                    style={{ background: `${GREEN}20`, border: `1px solid ${GREEN}40` }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} />
                    <span className="text-xs font-bold" style={{ color: GREEN }}>ACTIVO</span>
                  </div>
                </div>

                {/* Security items */}
                {[
                  {
                    Icon: Lock,
                    color: GREEN,
                    tag: 'EN REPOSO',
                    title: 'Cifrado AES-256-GCM',
                    desc: 'Todos los datos de pacientes (nombre, teléfono, historial de citas, notas clínicas) se cifran con AES-256-GCM antes de ser almacenados en la base de datos. Cada campo recibe un vector de inicialización (IV) único de 96 bits.',
                  },
                  {
                    Icon: ShieldAlert,
                    color: '#3B82F6',
                    tag: 'EN TRÁNSITO',
                    title: 'TLS 1.3 + HSTS',
                    desc: 'Toda comunicación entre el navegador, la API y los servicios de terceros viaja cifrada con TLS 1.3. El header Strict-Transport-Security (HSTS) con max-age de 2 años fuerza HTTPS en todos los subdominios.',
                  },
                  {
                    Icon: FileText,
                    color: '#8B5CF6',
                    tag: 'APLICACIÓN',
                    title: 'Content Security Policy (CSP)',
                    desc: 'Headers HTTP de seguridad configurados en la capa de infraestructura: CSP, X-Frame-Options (SAMEORIGIN), X-Content-Type-Options (nosniff), Referrer-Policy y Permissions-Policy que bloquean cámara, micrófono y geolocalización.',
                  },
                  {
                    Icon: Server,
                    color: '#F59E0B',
                    tag: 'ACCESO',
                    title: 'Control de acceso y auditoría',
                    desc: 'Acceso a datos de producción restringido por roles. Autenticación multifactor (MFA) obligatoria para el equipo de Welko. Logs de acceso y modificación de datos conservados durante 90 días.',
                  },
                ].map((item, i, arr) => (
                  <div
                    key={item.title}
                    className="px-5 py-4 flex gap-4"
                    style={{ borderBottom: i < arr.length - 1 ? '1px solid #F3F4F6' : 'none' }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${item.color}12` }}
                    >
                      <item.Icon size={14} color={item.color} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold" style={{ color: '#0A0F1A' }}>{item.title}</p>
                        <span
                          className="text-xs font-bold px-1.5 py-0.5 rounded"
                          style={{ background: `${item.color}12`, color: item.color }}
                        >
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-sm">
                En caso de vulneración de seguridad que afecte derechos patrimoniales o morales
                de los titulares, Welko notificará al INAI y a los afectados a la brevedad
                posible, conforme al Artículo 20 de la LFPDPPP.
              </p>
            </Section>

            {/* 9 */}
            <Section id="consentimiento" num="09" title="Consentimiento y Limitación del Tratamiento">
              <p>
                Al registrarse en Welko y hacer uso del servicio, el titular de la cuenta otorga
                su consentimiento tácito para el tratamiento de sus datos con las finalidades
                primarias descritas en este Aviso.
              </p>
              <p className="mt-3">
                Para el tratamiento de <strong>datos de pacientes</strong>, la clínica contratante —
                en su calidad de Responsable ante sus pacientes — es la obligada a recabar el
                consentimiento correspondiente, incluyendo el consentimiento expreso cuando se
                trate de datos de salud sensibles, conforme al Artículo 9 de la LFPDPPP.
              </p>
              <p className="mt-3">
                Welko proporciona a la clínica la leyenda de aviso de privacidad que puede
                compartirse con sus pacientes al inicio de cada conversación con el asistente
                virtual, disponible en el panel de configuración.
              </p>
            </Section>

            {/* 10 */}
            <Section id="cambios" num="10" title="Cambios a este Aviso de Privacidad">
              <p>
                Welko puede modificar este Aviso cuando sea necesario por cambios en la
                legislación, en el servicio o en sus prácticas de privacidad. Los cambios
                se publicarán en esta página con la fecha de última actualización. Si los
                cambios afectan significativamente el tratamiento de sus datos, se le
                notificará por correo electrónico con al menos <strong>30 días de anticipación</strong>.
              </p>
              <p className="mt-3">
                El uso continuado del servicio tras la notificación implica la aceptación
                de los cambios. Si no está de acuerdo, puede solicitar la cancelación de
                su cuenta en cualquier momento.
              </p>
            </Section>

          </div>

          {/* ── Footer CTA ── */}
          <div
            className="rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between"
            style={{ background: `${NAVY}08`, border: `1px solid ${NAVY}18` }}
          >
            <div>
              <p className="font-semibold text-sm" style={{ color: '#0A0F1A' }}>
                ¿Tienes preguntas sobre tu privacidad?
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                Nuestro equipo responde solicitudes ARCO en máximo 20 días hábiles.
              </p>
            </div>
            <Link
              href="/contacto"
              className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ background: NAVY, color: '#FFFFFF' }}
            >
              Contactar al área de privacidad →
            </Link>
          </div>

        </div>
      </main>

      <footer className="py-6 px-4 text-center text-xs" style={{ color: '#9CA3AF', borderTop: '1px solid #E5E7EB' }}>
        © {new Date().getFullYear()}{' '}Demian Santiago Mendoza Ledesma — Welko &ldquo;El Recepcionista IA Líder&rdquo;. Todos los derechos reservados.
      </footer>
    </>
  )
}

/* ─── Sub-components ─── */

function Section({
  id, num, title, children,
}: {
  id: string; num: string; title: string; children: React.ReactNode
}) {
  return (
    <section id={id} className="flex flex-col gap-4 scroll-mt-28">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold tabular-nums" style={{ color: '#D1D5DB' }}>{num}</span>
        <h2 className="text-lg font-bold tracking-tight" style={{ color: '#0A0F1A' }}>
          {title}
        </h2>
      </div>
      <div className="text-sm leading-relaxed" style={{ color: '#374151' }}>
        {children}
      </div>
    </section>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 flex flex-col gap-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm">
          <span className="mt-2 w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#1A2A56' }} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function RoleCard({
  role, who, desc, color,
}: {
  role: string; who: string; desc: string; color: string
}) {
  return (
    <div className="p-4 rounded-xl flex gap-3" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
      <div className="w-1 rounded-full flex-shrink-0 self-stretch" style={{ background: color }} />
      <div>
        <p className="font-semibold text-sm" style={{ color: '#0A0F1A' }}>{role}</p>
        <p className="text-xs font-medium mt-0.5" style={{ color }}>Aplica: {who}</p>
        <p className="text-sm mt-1.5" style={{ color: '#6B7280' }}>{desc}</p>
      </div>
    </div>
  )
}

function DataSensitiveNote() {
  return (
    <div className="mt-4 p-4 rounded-xl flex gap-3" style={{ background: '#FEF3C7', border: '1px solid #FCD34D' }}>
      <ShieldCheck size={16} color="#D97706" className="flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold" style={{ color: '#92400E' }}>
          Datos de salud — categoría sensible (Art. 9 LFPDPPP)
        </p>
        <p className="text-xs mt-1" style={{ color: '#B45309', lineHeight: 1.6 }}>
          El historial de citas y las notas clínicas constituyen <em>datos sensibles</em> conforme
          al Artículo 3 fracción VI de la LFPDPPP. Su tratamiento por parte de Welko se realiza
          exclusivamente como Encargado bajo instrucción de la clínica contratante, con
          cifrado AES-256-GCM en reposo y sin acceso por parte de personal no autorizado.
        </p>
      </div>
    </div>
  )
}
