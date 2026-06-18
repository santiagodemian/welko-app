// Contract expiry alert email template — sent via Resend

export interface ContractExpiryEmailProps {
  agentName: string
  players: Array<{
    fullName: string
    position: string | null
    currentClub: string | null
    contractExpiry: Date
    daysLeft: number
  }>
}

export function renderContractExpiryEmail({
  agentName,
  players,
}: ContractExpiryEmailProps): string {
  const firstName = agentName.split(' ')[0] || agentName
  const N = '#0A1628'
  const G = '#1E6FEB'

  const urgencyColor = (days: number) =>
    days <= 30 ? '#EF4444' : days <= 60 ? '#F59E0B' : '#3B82F6'

  const urgencyLabel = (days: number) =>
    days <= 30 ? '30-day window' : days <= 60 ? '60-day window' : '90-day window'

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Contract Expiry Alert — Polaris Football</title>
</head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:${N};border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
              <p style="color:${G};font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 8px;">Polaris Football</p>
              <h1 style="color:#ffffff;font-size:22px;font-weight:900;margin:0 0 8px;letter-spacing:-0.03em;line-height:1.2;">
                Contract Expiry Alert
              </h1>
              <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0;line-height:1.5;">
                Hi ${firstName} — ${players.length} player${players.length !== 1 ? 's have' : ' has'} contracts expiring soon.
              </p>
            </td>
          </tr>

          <!-- Players -->
          <tr>
            <td style="background:#ffffff;padding:32px 40px 8px;">
              ${players.map(p => {
                const expiry = new Date(p.contractExpiry).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                const color  = urgencyColor(p.daysLeft)
                const label  = urgencyLabel(p.daysLeft)
                return `
              <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:16px;border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:16px 20px;">
                    <table cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td>
                          <p style="font-size:15px;font-weight:800;color:${N};margin:0 0 2px;">${p.fullName}</p>
                          <p style="font-size:12px;color:#9CA3AF;margin:0;">${p.position ?? 'Unknown position'} · ${p.currentClub ?? 'Free agent'}</p>
                        </td>
                        <td style="text-align:right;vertical-align:top;">
                          <span style="display:inline-block;padding:4px 10px;border-radius:99px;background:${color}18;border:1px solid ${color}40;font-size:10px;font-weight:800;color:${color};letter-spacing:0.05em;text-transform:uppercase;">${label}</span>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top:10px;border-top:1px solid #F3F4F6;margin-top:10px;">
                          <p style="font-size:13px;color:#6B7280;margin:0;">
                            Expires <strong style="color:${color};">${expiry}</strong> — <strong>${p.daysLeft} days</strong> remaining
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>`
              }).join('')}
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="background:#ffffff;padding:8px 40px 32px;text-align:center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://polarisfootball.com'}/dashboard/players"
                style="display:inline-block;padding:13px 28px;background:${G};color:#ffffff;font-weight:800;font-size:14px;text-decoration:none;border-radius:10px;letter-spacing:-0.01em;">
                View Players in Dashboard →
              </a>
              <p style="font-size:12px;color:#9CA3AF;margin:16px 0 0;line-height:1.5;">
                Act now — the transfer window waits for no one.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F9FAFB;border-radius:0 0 16px 16px;padding:20px 40px;border-top:1px solid #E5E7EB;text-align:center;">
              <p style="font-size:11px;color:#9CA3AF;margin:0;">
                Polaris Football · polarisfootball.com<br/>
                You're receiving this because you have a Polaris Football account with contract alerts enabled.
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
