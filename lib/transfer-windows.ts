/**
 * Transfer window date utilities.
 * European windows (UEFA guidelines). Adjust per federation as needed.
 *
 * Winter: 1 Jan → last day of January
 * Summer: 1 Jun → last day of August
 */

export interface WindowState {
  isOpen: boolean
  name: 'Summer' | 'Winter'
  label: string       // e.g. "Summer Window · 38 days remaining"
  daysUntilOpen: number   // 0 if already open
  daysUntilClose: number  // 0 if already closed
  daysRemaining: number   // days left in window (if open), else days until next opens
  opensAt: Date
  closesAt: Date
  urgency: 'open-critical' | 'open' | 'approaching' | 'closed'
}

function getWindowsForYear(year: number) {
  return {
    winter: {
      open:  new Date(year, 0, 1),   // Jan 1
      close: new Date(year, 1, 1),   // Feb 1 (exclusive)
    },
    summer: {
      open:  new Date(year, 5, 1),   // Jun 1
      close: new Date(year, 8, 1),   // Sep 1 (exclusive)
    },
  }
}

export function getTransferWindowState(now = new Date()): WindowState {
  const year = now.getFullYear()
  const windows = getWindowsForYear(year)
  const nextYear = getWindowsForYear(year + 1)

  const diffDays = (a: Date, b: Date) => Math.ceil((a.getTime() - b.getTime()) / 86_400_000)

  // Winter window (this year)
  if (now >= windows.winter.open && now < windows.winter.close) {
    const daysLeft = diffDays(windows.winter.close, now)
    return {
      isOpen: true, name: 'Winter',
      label: `Winter Window · ${daysLeft} day${daysLeft === 1 ? '' : 's'} remaining`,
      daysUntilOpen: 0, daysUntilClose: daysLeft, daysRemaining: daysLeft,
      opensAt: windows.winter.open, closesAt: windows.winter.close,
      urgency: daysLeft <= 7 ? 'open-critical' : 'open',
    }
  }

  // Summer window (this year)
  if (now >= windows.summer.open && now < windows.summer.close) {
    const daysLeft = diffDays(windows.summer.close, now)
    return {
      isOpen: true, name: 'Summer',
      label: `Summer Window · ${daysLeft} day${daysLeft === 1 ? '' : 's'} remaining`,
      daysUntilOpen: 0, daysUntilClose: daysLeft, daysRemaining: daysLeft,
      opensAt: windows.summer.open, closesAt: windows.summer.close,
      urgency: daysLeft <= 7 ? 'open-critical' : 'open',
    }
  }

  // Between windows — find next
  const candidates = [
    { name: 'Winter' as const, ...windows.summer.close <= now ? nextYear.winter : windows.winter },
    { name: 'Summer' as const, ...windows.summer },
    { name: 'Winter' as const, ...nextYear.winter },
  ]

  // Next upcoming window
  const next = candidates.find(c => c.open > now)!
  const daysUntil = diffDays(next.open, now)
  const approaching = daysUntil <= 30

  return {
    isOpen: false, name: next.name,
    label: approaching
      ? `${next.name} Window · Opens in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`
      : `${next.name} Window · ${daysUntil} days away`,
    daysUntilOpen: daysUntil, daysUntilClose: 0, daysRemaining: daysUntil,
    opensAt: next.open, closesAt: next.close,
    urgency: approaching ? 'approaching' : 'closed',
  }
}
