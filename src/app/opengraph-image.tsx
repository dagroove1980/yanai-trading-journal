import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = "TradeLog — Yanai's Trading Journal"
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#070B12',
          position: 'relative',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Gold radial glow at top */}
        <div
          style={{
            position: 'absolute',
            top: '-300px',
            left: '200px',
            width: '800px',
            height: '700px',
            background: 'radial-gradient(ellipse, rgba(245,184,0,0.16) 0%, transparent 65%)',
            display: 'flex',
          }}
        />

        {/* Decorative candlesticks — left side (faded) */}
        <div style={{ position: 'absolute', left: '40px', bottom: '0px', display: 'flex', alignItems: 'flex-end', gap: '16px', opacity: 0.12 }}>
          {/* candle A — gold short */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '4px', height: '35px', backgroundColor: '#F5B800', borderRadius: '2px', display: 'flex' }} />
            <div style={{ width: '28px', height: '70px', backgroundColor: '#F5B800', borderRadius: '5px', display: 'flex' }} />
            <div style={{ width: '4px', height: '25px', backgroundColor: '#F5B800', borderRadius: '2px', display: 'flex' }} />
          </div>
          {/* candle B — red medium */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
            <div style={{ width: '4px', height: '25px', backgroundColor: '#FF3D5A', borderRadius: '2px', display: 'flex' }} />
            <div style={{ width: '28px', height: '110px', backgroundColor: '#FF3D5A', borderRadius: '5px', display: 'flex' }} />
            <div style={{ width: '4px', height: '30px', backgroundColor: '#FF3D5A', borderRadius: '2px', display: 'flex' }} />
          </div>
          {/* candle C — gold tall */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '55px' }}>
            <div style={{ width: '4px', height: '30px', backgroundColor: '#F5B800', borderRadius: '2px', display: 'flex' }} />
            <div style={{ width: '28px', height: '160px', backgroundColor: '#F5B800', borderRadius: '5px', display: 'flex' }} />
            <div style={{ width: '4px', height: '20px', backgroundColor: '#F5B800', borderRadius: '2px', display: 'flex' }} />
          </div>
        </div>

        {/* Decorative candlesticks — right side (faded, mirrored pattern) */}
        <div style={{ position: 'absolute', right: '40px', bottom: '0px', display: 'flex', alignItems: 'flex-end', gap: '16px', opacity: 0.12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '50px' }}>
            <div style={{ width: '4px', height: '28px', backgroundColor: '#F5B800', borderRadius: '2px', display: 'flex' }} />
            <div style={{ width: '28px', height: '150px', backgroundColor: '#F5B800', borderRadius: '5px', display: 'flex' }} />
            <div style={{ width: '4px', height: '18px', backgroundColor: '#F5B800', borderRadius: '2px', display: 'flex' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '25px' }}>
            <div style={{ width: '4px', height: '22px', backgroundColor: '#FF3D5A', borderRadius: '2px', display: 'flex' }} />
            <div style={{ width: '28px', height: '105px', backgroundColor: '#FF3D5A', borderRadius: '5px', display: 'flex' }} />
            <div style={{ width: '4px', height: '28px', backgroundColor: '#FF3D5A', borderRadius: '2px', display: 'flex' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '4px', height: '32px', backgroundColor: '#F5B800', borderRadius: '2px', display: 'flex' }} />
            <div style={{ width: '28px', height: '65px', backgroundColor: '#F5B800', borderRadius: '5px', display: 'flex' }} />
            <div style={{ width: '4px', height: '22px', backgroundColor: '#F5B800', borderRadius: '2px', display: 'flex' }} />
          </div>
        </div>

        {/* ── Main content ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {/* Logo badge */}
          <div
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: 'rgba(245,184,0,0.1)',
              border: '2px solid rgba(245,184,0,0.28)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '32px',
              position: 'relative',
            }}
          >
            {/* Mini 3-candle icon inside badge */}
            <div style={{ position: 'absolute', left: '12px', top: '22px', width: '3px', height: '8px',  backgroundColor: '#F5B800', borderRadius: '1px', display: 'flex' }} />
            <div style={{ position: 'absolute', left: '8px',  top: '30px', width: '10px', height: '18px', backgroundColor: '#F5B800', borderRadius: '2px', display: 'flex' }} />
            <div style={{ position: 'absolute', left: '12px', top: '48px', width: '3px', height: '7px',  backgroundColor: '#F5B800', borderRadius: '1px', display: 'flex' }} />

            <div style={{ position: 'absolute', left: '38px', top: '12px', width: '3px', height: '7px',  backgroundColor: '#FF3D5A', borderRadius: '1px', display: 'flex' }} />
            <div style={{ position: 'absolute', left: '34px', top: '19px', width: '10px', height: '24px', backgroundColor: '#FF3D5A', borderRadius: '2px', display: 'flex' }} />
            <div style={{ position: 'absolute', left: '38px', top: '43px', width: '3px', height: '8px',  backgroundColor: '#FF3D5A', borderRadius: '1px', display: 'flex' }} />

            <div style={{ position: 'absolute', left: '62px', top: '8px',  width: '3px', height: '6px',  backgroundColor: '#F5B800', borderRadius: '1px', display: 'flex' }} />
            <div style={{ position: 'absolute', left: '58px', top: '14px', width: '10px', height: '34px', backgroundColor: '#F5B800', borderRadius: '2px', display: 'flex' }} />
            <div style={{ position: 'absolute', left: '62px', top: '48px', width: '3px', height: '7px',  backgroundColor: '#F5B800', borderRadius: '1px', display: 'flex' }} />
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: '100px',
              fontWeight: '800',
              color: '#F5B800',
              letterSpacing: '-4px',
              lineHeight: '1',
              marginBottom: '20px',
              display: 'flex',
            }}
          >
            TradeLog
          </div>

          {/* Gold divider */}
          <div
            style={{
              width: '64px',
              height: '3px',
              backgroundColor: 'rgba(245,184,0,0.45)',
              borderRadius: '2px',
              marginBottom: '24px',
              display: 'flex',
            }}
          />

          {/* Subtitle */}
          <div
            style={{
              fontSize: '30px',
              color: '#8FA8C8',
              fontWeight: '500',
              marginBottom: '28px',
              display: 'flex',
            }}
          >
            Yanai&apos;s Personal Trading Journal
          </div>

          {/* Tag pills — written statically (no .map) */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ padding: '10px 24px', backgroundColor: 'rgba(245,184,0,0.08)', border: '1px solid rgba(245,184,0,0.2)', borderRadius: '40px', fontSize: '22px', color: '#E8EEFF', display: 'flex' }}>
              Log trades
            </div>
            <div style={{ padding: '10px 24px', backgroundColor: 'rgba(245,184,0,0.08)', border: '1px solid rgba(245,184,0,0.2)', borderRadius: '40px', fontSize: '22px', color: '#E8EEFF', display: 'flex' }}>
              AI mentor feedback
            </div>
            <div style={{ padding: '10px 24px', backgroundColor: 'rgba(245,184,0,0.08)', border: '1px solid rgba(245,184,0,0.2)', borderRadius: '40px', fontSize: '22px', color: '#E8EEFF', display: 'flex' }}>
              Track your growth
            </div>
          </div>

        </div>
      </div>
    ),
    { ...size }
  )
}
