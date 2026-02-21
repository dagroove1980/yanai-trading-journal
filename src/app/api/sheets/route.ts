import { NextRequest, NextResponse } from 'next/server'

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL

// Apps Script web apps always redirect once (302).
// Node fetch changes POST→GET on redirect, so we follow manually.
async function callAppsScript(body: object): Promise<{ ok: boolean }> {
  const url = APPS_SCRIPT_URL!
  const init = {
    method: 'POST' as const,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual' as const,
  }

  const res1 = await fetch(url, init)

  // Follow the redirect manually, keeping POST method
  if (res1.status === 301 || res1.status === 302) {
    const location = res1.headers.get('location')
    if (location) {
      const res2 = await fetch(location, init)
      return res2.json()
    }
  }

  return res1.json()
}

export async function POST(req: NextRequest) {
  if (!APPS_SCRIPT_URL) {
    // Not configured yet — silently succeed so the app doesn't break
    return NextResponse.json({ ok: true, skipped: true })
  }

  try {
    const body = await req.json()
    const result = await callAppsScript(body)
    return NextResponse.json(result)
  } catch (err) {
    console.error('Sheets sync error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
