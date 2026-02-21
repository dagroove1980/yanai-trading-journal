import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

// Three-candlestick logo: bull / bear / bull (mirrors the AppLogo SVG)
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '32px',
          height: '32px',
          display: 'flex',
          backgroundColor: '#070B12',
          borderRadius: '7px',
          position: 'relative',
        }}
      >
        {/* Candle 1 — gold, left, short */}
        <div style={{ position: 'absolute', left: '4px',  top: '12px', width: '2px', height: '5px',  backgroundColor: '#F5B800', borderRadius: '1px', display: 'flex' }} />
        <div style={{ position: 'absolute', left: '2px',  top: '17px', width: '6px', height: '7px',  backgroundColor: '#F5B800', borderRadius: '1px', display: 'flex' }} />
        <div style={{ position: 'absolute', left: '4px',  top: '24px', width: '2px', height: '4px',  backgroundColor: '#F5B800', borderRadius: '1px', display: 'flex' }} />

        {/* Candle 2 — red, center, medium */}
        <div style={{ position: 'absolute', left: '14px', top: '5px',  width: '2px', height: '4px',  backgroundColor: '#FF3D5A', borderRadius: '1px', display: 'flex' }} />
        <div style={{ position: 'absolute', left: '12px', top: '9px',  width: '6px', height: '12px', backgroundColor: '#FF3D5A', borderRadius: '1px', display: 'flex' }} />
        <div style={{ position: 'absolute', left: '14px', top: '21px', width: '2px', height: '5px',  backgroundColor: '#FF3D5A', borderRadius: '1px', display: 'flex' }} />

        {/* Candle 3 — gold, right, tallest */}
        <div style={{ position: 'absolute', left: '24px', top: '2px',  width: '2px', height: '3px',  backgroundColor: '#F5B800', borderRadius: '1px', display: 'flex' }} />
        <div style={{ position: 'absolute', left: '22px', top: '5px',  width: '6px', height: '17px', backgroundColor: '#F5B800', borderRadius: '1px', display: 'flex' }} />
        <div style={{ position: 'absolute', left: '24px', top: '22px', width: '2px', height: '4px',  backgroundColor: '#F5B800', borderRadius: '1px', display: 'flex' }} />
      </div>
    ),
    { ...size }
  )
}
