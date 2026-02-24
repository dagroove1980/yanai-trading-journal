import { NextResponse } from 'next/server'

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL

/** Debug endpoint: returns fetch result without exposing the URL */
export async function GET() {
  if (!APPS_SCRIPT_URL) {
    return NextResponse.json({ configured: false, error: 'APPS_SCRIPT_URL not set' })
  }

  try {
    const res1 = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'getAll' }),
      redirect: 'manual' as const,
    })

    let res = res1
    if (res.status === 301 || res.status === 302) {
      const location = res.headers.get('location')
      if (location) {
        res = await fetch(location, { method: 'GET' })
      }
    }

    const data = await res.json()
    return NextResponse.json({
      configured: true,
      httpStatus: res.status,
      ok: data.ok,
      skipped: data.skipped ?? false,
      tradesCount: Array.isArray(data.trades) ? data.trades.length : 0,
      error: data.error ?? null,
    })
  } catch (err) {
    return NextResponse.json({
      configured: true,
      error: err instanceof Error ? err.message : String(err),
    })
  }
}
