import { Trade } from './types'

// Fire-and-forget — localStorage is always the source of truth.
// Sheet sync failures are silent so the app never breaks.

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
