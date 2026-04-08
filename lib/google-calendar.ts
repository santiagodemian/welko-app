/**
 * Welko — Google Calendar integration
 *
 * Uses the Google Calendar REST API directly (no googleapis SDK dependency).
 * Each clinic stores an encrypted OAuth2 refresh token in Clinic.googleRefreshToken.
 *
 * Required env vars:
 *   GOOGLE_CLIENT_ID      — OAuth2 client ID from Google Cloud Console
 *   GOOGLE_CLIENT_SECRET  — OAuth2 client secret
 *   NEXT_PUBLIC_APP_URL   — e.g. https://welko.agency (used for redirect URI)
 *
 * Scopes requested:
 *   https://www.googleapis.com/auth/calendar.events
 */

import { db } from '@/lib/db'
import { decrypt, encrypt, isEncrypted } from '@/lib/encryption'

const GOOGLE_TOKEN_URL   = 'https://oauth2.googleapis.com/token'
const GOOGLE_CALENDAR_URL = 'https://www.googleapis.com/calendar/v3'
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://welko.agency'}/api/calendar/callback`

// ── OAuth URL ─────────────────────────────────────────────────────────────────

export function getOAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id:     process.env.GOOGLE_CLIENT_ID ?? '',
    redirect_uri:  REDIRECT_URI,
    response_type: 'code',
    scope:         'https://www.googleapis.com/auth/calendar.events',
    access_type:   'offline',
    prompt:        'consent', // always ask for consent to get refresh_token
    state,
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}

// ── Token exchange ────────────────────────────────────────────────────────────

export async function exchangeCodeForTokens(code: string): Promise<{ access_token: string; refresh_token?: string }> {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id:     process.env.GOOGLE_CLIENT_ID ?? '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      redirect_uri:  REDIRECT_URI,
      grant_type:    'authorization_code',
    }).toString(),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Token exchange failed: ${err.error_description ?? err.error ?? res.status}`)
  }
  return res.json()
}

// ── Access token refresh ──────────────────────────────────────────────────────

async function refreshAccessToken(refreshToken: string): Promise<string> {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id:     process.env.GOOGLE_CLIENT_ID ?? '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      grant_type:    'refresh_token',
    }).toString(),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Token refresh failed: ${err.error_description ?? err.error ?? res.status}`)
  }
  const data = await res.json()
  return data.access_token as string
}

// ── Get access token for a clinic ────────────────────────────────────────────

async function getAccessToken(clinicId: string): Promise<string | null> {
  const clinic = await db.clinic.findUnique({
    where: { id: clinicId },
    select: { googleRefreshToken: true },
  })
  if (!clinic?.googleRefreshToken) return null

  const refreshToken = isEncrypted(clinic.googleRefreshToken)
    ? decrypt(clinic.googleRefreshToken)
    : clinic.googleRefreshToken

  return refreshToken ? refreshAccessToken(refreshToken) : null
}

// ── Calendar event helpers ────────────────────────────────────────────────────

interface CalendarEventPayload {
  patientName:     string
  service:         string | null
  appointmentAt:   Date
  durationMins:    number  // default 60
  clinicName:      string
  clinicAddress:   string | null
  appointmentValue: number | null
}

function buildEvent(payload: CalendarEventPayload) {
  const end = new Date(payload.appointmentAt.getTime() + payload.durationMins * 60_000)
  const valueStr = payload.appointmentValue
    ? ` | Valor: $${Intl.NumberFormat('es-MX').format(payload.appointmentValue)} MXN`
    : ''

  return {
    summary: `${payload.service ?? 'Cita'} — ${payload.patientName}`,
    description: `Paciente: ${payload.patientName}\nClínica: ${payload.clinicName}${valueStr}\n\nAgendado automáticamente por Welko IA`,
    start: { dateTime: payload.appointmentAt.toISOString(), timeZone: 'America/Mexico_City' },
    end:   { dateTime: end.toISOString(),                   timeZone: 'America/Mexico_City' },
    ...(payload.clinicAddress ? { location: payload.clinicAddress } : {}),
    reminders: { useDefault: false, overrides: [] }, // Welko handles reminders via WhatsApp
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Creates a Google Calendar event for a lead's appointment.
 * Returns the created event ID, or null if the clinic has no Google Calendar connected.
 */
export async function createCalendarEvent(
  clinicId: string,
  payload: CalendarEventPayload,
): Promise<string | null> {
  const accessToken = await getAccessToken(clinicId)
  if (!accessToken) return null

  const res = await fetch(`${GOOGLE_CALENDAR_URL}/calendars/primary/events`, {
    method: 'POST',
    headers: {
      Authorization:  `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(buildEvent(payload)),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    console.error('[Welko] Google Calendar createEvent failed:', err)
    return null
  }

  const data = await res.json()
  return (data.id as string) ?? null
}

/**
 * Updates an existing Google Calendar event.
 * No-op if eventId is null or clinic has no calendar connected.
 */
export async function updateCalendarEvent(
  clinicId: string,
  eventId: string,
  payload: CalendarEventPayload,
): Promise<void> {
  const accessToken = await getAccessToken(clinicId)
  if (!accessToken) return

  const res = await fetch(`${GOOGLE_CALENDAR_URL}/calendars/primary/events/${eventId}`, {
    method: 'PUT',
    headers: {
      Authorization:  `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(buildEvent(payload)),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    console.error('[Welko] Google Calendar updateEvent failed:', err)
  }
}

/**
 * Deletes a Google Calendar event.
 * No-op if eventId is null or clinic has no calendar connected.
 */
export async function deleteCalendarEvent(clinicId: string, eventId: string): Promise<void> {
  const accessToken = await getAccessToken(clinicId)
  if (!accessToken) return

  await fetch(`${GOOGLE_CALENDAR_URL}/calendars/primary/events/${eventId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

/**
 * Stores an encrypted refresh token for the clinic.
 */
export async function storeRefreshToken(clinicId: string, refreshToken: string): Promise<void> {
  await db.clinic.update({
    where: { id: clinicId },
    data:  { googleRefreshToken: encrypt(refreshToken) },
  })
}

/**
 * Returns true if the clinic has a Google Calendar connected.
 */
export async function isCalendarConnected(clinicId: string): Promise<boolean> {
  const clinic = await db.clinic.findUnique({
    where: { id: clinicId },
    select: { googleRefreshToken: true },
  })
  return !!clinic?.googleRefreshToken
}
