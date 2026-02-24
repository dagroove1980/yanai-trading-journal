import { NextRequest, NextResponse } from 'next/server'

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL

// Apps Script web apps redirect (302) to script.googleusercontent.com.
// The redirect target only accepts GET — POST would return 405. The script
// runs on the initial POST; the redirect Location points to the result.
async function callAppsScript(body: object): Promise<{ ok: boolean }> {
  const url = APPS_SCRIPT_URL!
  const res1 = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual' as const,
  })

  if (res1.status === 301 || res1.status === 302) {
    const location = res1.headers.get('location')
    if (location) {
      const res2 = await fetch(location, { method: 'GET' })
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
