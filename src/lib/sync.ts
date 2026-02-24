import { Trade } from './types'

// Google Sheet is the source of truth. App fetches from sheet on load.
// Writes still go to localStorage (cache) + sheet. Fetch failures fall back to localStorage.

/** Fetches all trades from Google Sheet. Returns { trades, skipped } when APPS_SCRIPT_URL is not set. */
export async function fetchTradesFromSheet(): Promise<{
  trades: Trade[]
  skipped: boolean
}> {
  try {
    const res = await fetch('/api/sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'getAll' }),
    })
    const data = await res.json()
    if (data.skipped || !res.ok) {
      return { trades: [], skipped: true }
    }
    const trades = Array.isArray(data.trades) ? data.trades : []
    return { trades, skipped: false }
  } catch {
    return { trades: [], skipped: true }
  }
}

export function syncUpsert(trade: Trade): void {
  fetch('/api/sheets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'upsert', trade }),
  }).catch(() => {})
}

export function syncDelete(id: string): void {
  fetch('/api/sheets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'delete', id }),
  }).catch(() => {})
}

export function syncAll(trades: Trade[]): void {
  fetch('/api/sheets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'syncAll', trades }),
  }).catch(() => {})
}
