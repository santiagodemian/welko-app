// Welcome email template — rendered server-side, sent via Resend
// Usage: renderWelcomeEmail({ name, plan, billing })

export interface WelcomeEmailProps {
  name: string
  plan: 'starter' | 'essential' | 'pro' | 'business'
  billing: 'monthly' | 'annual'
}

const PLAN_DETAILS = {
  starter:   { label: 'Starter',   price: '$799 MXN',   color: '#6B7280' },
  essential: { label: 'Essential', price: '$1,499 MXN',  color: '#059669' },
  pro:       { label: 'Pro',       price: '$2,999 MXN',  color: '#2563EB' },
  business:  { label: 'Business',  price: '$5,999 MXN',  color: '#D97706' },
}

const PLAN_FEATURES = {
  starter: [
    'IA conversacional 24/7 en WhatsApp',
    'Hasta 300 conversaciones al mes',
    'Recordatorios automáticos de cita',
    'Panel de métricas básico',
  ],
  essential: [
    'IA conversacional 24/7 en WhatsApp',
    'Agenda inteligente con Google Calendar',
    'Recordatorios + confirmaciones ilimitadas',
    'Widget de chat para tu sitio web',
    'Reportes semanales automáticos',
  ],
  pro: [
    'WhatsApp + Instagram + Facebook 24/7',
    'Hasta 2,000 conversaciones al mes',
    'CRM de clientes con historial completo',
    'Waitlist automático para cancelaciones',
    'Reconfirmación automática 24h antes',
    'Configuración de IA personalizada',
  ],
  business: [
    'Canales ilimitados + Voz IA',
    'Conversaciones ilimitadas',
    'Hasta 3 sedes incluidas',
    'Campañas de reactivación automáticas',
    'API access + Zapier + HubSpot',
    'Account manager dedicado',
  ],
}

export function renderWelcomeEmail({ name, plan, billing }: WelcomeEmailProps): string {
  const details  = PLAN_DETAILS[plan]
  const features = PLAN_FEATURES[plan]
  const firstName = name.split(' ')[0] || name

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bienvenido a Welko</title>
</head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#05101F 0%,#13244A 60%,#0E1F38 100%);border-radius:16px 16px 0 0;padding:40px 48px;text-align:center;">
              <div style="display:inline-flex;align-items:center;gap:10px;margin-bottom:24px;">
                <div style="width:36px;height:36px;background:rgba(255,255,255,0.12);border-radius:10px;display:inline-block;line-height:36px;text-align:center;font-size:18px;">🤖</div>
                <span style="color:#FFFFFF;font-size:22px;font-weight:800;letter-spacing:-0.04em;">Welko</span>
              </div>
              <h1 style="color:#FFFFFF;font-size:28px;font-weight:800;margin:0 0 12px;letter-spacing:-0.03em;line-height:1.2;">
                ¡Bienvenido, ${firstName}!
              </h1>
              <p style="color:rgba(240,244,252,0.65);font-size:16px;margin:0;font-weight:300;line-height:1.6;">
                Tu recepcionista IA ya está lista para trabajar.<br/>Nunca más perderás un mensaje.
              </p>
            </td>
          </tr>

          <!-- Plan badge -->
          <tr>
            <td style="background:#FFFFFF;padding:0 48px;">
              <div style="margin-top:-1px;border-top:1px solid #E5E7EB;padding:32px 0 24px;">
                <div style="display:inline-block;padding:6px 16px;border-radius:999px;background:${details.color}18;border:1px solid ${details.color}30;margin-bottom:20px;">
                  <span style="font-size:12px;font-weight:700;color:${details.color};text-transform:uppercase;letter-spacing:0.08em;">
                    Plan ${details.label} ${billing === 'annual' ? '· Anual (−20%)' : '· Mensual'}
                  </span>
                </div>
                <h2 style="color:#0A0F1A;font-size:18px;font-weight:700;margin:0 0 8px;letter-spacing:-0.02em;">
                  Lo que tienes activado:
                </h2>
                <table cellpadding="0" cellspacing="0" width="100%">
                  ${features.map(f => `
                  <tr>
                    <td style="padding:6px 0;">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="width:20px;vertical-align:top;padding-top:2px;">
                            <span style="color:#059669;font-size:14px;font-weight:700;">✓</span>
                          </td>
                          <td style="padding-left:8px;">
                            <span style="color:#374151;font-size:14px;line-height:1.5;">${f}</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>`).join('')}
                </table>
              </div>
            </td>
          </tr>

          <!-- Next steps -->
          <tr>
            <td style="background:#FFFFFF;padding:0 48px 32px;">
              <div style="border-top:1px solid #E5E7EB;padding-top:28px;">
                <h2 style="color:#0A0F1A;font-size:18px;font-weight:700;margin:0 0 20px;letter-spacing:-0.02em;">
                  3 pasos para arrancar hoy:
                </h2>
                ${[
                  ['1', '#13244A', 'Completa tu onboarding', 'Configura tu IA con tus servicios, precios y horarios en menos de 10 minutos.'],
                  ['2', '#2563EB', 'Conecta tu WhatsApp', 'Vincula tu número de WhatsApp Business y activa la respuesta automática.'],
                  ['3', '#059669', 'Prueba tu primer mensaje', 'Escríbete a ti mismo y ve cómo responde tu nueva recepcionista IA.'],
                ].map(([num, color, title, desc]) => `
                <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:16px;">
                  <tr>
                    <td style="width:36px;vertical-align:top;">
                      <div style="width:28px;height:28px;border-radius:50%;background:${color};text-align:center;line-height:28px;font-size:12px;font-weight:800;color:#fff;">${num}</div>
                    </td>
                    <td style="padding-left:12px;">
                      <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#0A0F1A;">${title}</p>
                      <p style="margin:0;font-size:13px;color:#6B7280;line-height:1.5;">${desc}</p>
                    </td>
                  </tr>
                </table>`).join('')}
              </div>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="background:#FFFFFF;padding:0 48px 40px;text-align:center;">
              <a href="https://welko.agency/onboarding"
                style="display:inline-block;background:#13244A;color:#FFFFFF;font-size:15px;font-weight:700;text-decoration:none;padding:14px 40px;border-radius:14px;letter-spacing:-0.01em;">
                Ir a mi dashboard →
              </a>
              <p style="margin:16px 0 0;font-size:12px;color:#9CA3AF;">
                ¿Tienes dudas? Escríbenos a <a href="mailto:hola@welko.org" style="color:#13244A;">hola@welko.org</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F9FAFB;border-radius:0 0 16px 16px;border-top:1px solid #E5E7EB;padding:24px 48px;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;color:#9CA3AF;">
                © ${new Date().getFullYear()} Welko · welko.agency
              </p>
              <p style="margin:0;font-size:11px;color:#D1D5DB;">
                🌱 1% de tu suscripción elimina CO₂ de la atmósfera
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
