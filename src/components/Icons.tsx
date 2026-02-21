// Premium custom SVG icons — no emoji, no default UI libraries

// ─────────────────────────────────────────────────────────────
// App Logo — three candlesticks (bull / bear / bull = growth)
// ─────────────────────────────────────────────────────────────
export function AppLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left: small bullish candle */}
      <line x1="5.5" y1="21.5" x2="5.5" y2="24" stroke="#F5B800" strokeWidth="1.6" strokeLinecap="round"/>
      <rect x="3" y="15" width="5" height="6.5" rx="1.2" fill="#F5B800"/>
      <line x1="5.5" y1="11" x2="5.5" y2="15" stroke="#F5B800" strokeWidth="1.6" strokeLinecap="round"/>
      {/* Middle: bearish candle */}
      <line x1="15" y1="8" x2="15" y2="11" stroke="#FF3D5A" strokeWidth="1.6" strokeLinecap="round"/>
      <rect x="12.5" y="11" width="5" height="9" rx="1.2" fill="#FF3D5A"/>
      <line x1="15" y1="20" x2="15" y2="23" stroke="#FF3D5A" strokeWidth="1.6" strokeLinecap="round"/>
      {/* Right: large bullish candle */}
      <line x1="24.5" y1="3" x2="24.5" y2="6" stroke="#F5B800" strokeWidth="1.6" strokeLinecap="round"/>
      <rect x="22" y="6" width="5" height="14" rx="1.2" fill="#F5B800"/>
      <line x1="24.5" y1="20" x2="24.5" y2="23" stroke="#F5B800" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// Emotion Face Icons — 44×44 viewBox, center (22,22), r=20
// ─────────────────────────────────────────────────────────────

export function FearfulIcon({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22" cy="22" r="20" fill="rgba(139,92,246,0.13)" stroke="#8B5CF6" strokeWidth="1.5"/>
      {/* Worried brows — inner ends rise, tent shape */}
      <path d="M10 15.5 Q14 10 18 13.5" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <path d="M26 13.5 Q30 10 34 15.5" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      {/* Wide eyes */}
      <ellipse cx="15.5" cy="21" rx="3" ry="3.5" fill="#8B5CF6"/>
      <ellipse cx="28.5" cy="21" rx="3" ry="3.5" fill="#8B5CF6"/>
      <circle cx="16.8" cy="19.5" r="1.1" fill="rgba(255,255,255,0.5)"/>
      <circle cx="29.8" cy="19.5" r="1.1" fill="rgba(255,255,255,0.5)"/>
      {/* Downturned mouth */}
      <path d="M15.5 31.5 Q22 27.5 28.5 31.5" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      {/* Sweat drop */}
      <path d="M33.5 9.5 C33.5 9.5 36 13.5 33.5 14.2 C31 14.2 31 10.5 33.5 9.5Z" fill="#8B5CF6" opacity="0.65"/>
    </svg>
  )
}

export function NeutralIcon({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22" cy="22" r="20" fill="rgba(90,125,160,0.1)" stroke="#5A7DA0" strokeWidth="1.5"/>
      {/* Flat straight brows */}
      <line x1="11" y1="14.5" x2="19" y2="14.5" stroke="#5A7DA0" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="25" y1="14.5" x2="33" y2="14.5" stroke="#5A7DA0" strokeWidth="1.8" strokeLinecap="round"/>
      {/* Plain circular eyes */}
      <circle cx="15.5" cy="21.5" r="2.8" fill="#5A7DA0"/>
      <circle cx="28.5" cy="21.5" r="2.8" fill="#5A7DA0"/>
      <circle cx="16.7" cy="20.2" r="1" fill="rgba(255,255,255,0.5)"/>
      <circle cx="29.7" cy="20.2" r="1" fill="rgba(255,255,255,0.5)"/>
      {/* Flat line mouth */}
      <line x1="15.5" y1="30.5" x2="28.5" y2="30.5" stroke="#5A7DA0" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

export function ConfidentIcon({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22" cy="22" r="20" fill="rgba(0,200,150,0.1)" stroke="#00C896" strokeWidth="1.5"/>
      {/* Relaxed, slightly arched brows */}
      <path d="M11 14 Q15 11.5 19 14" stroke="#00C896" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <path d="M25 14 Q29 11.5 33 14" stroke="#00C896" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      {/* Hooded/relaxed eyes */}
      <circle cx="15.5" cy="21.5" r="2.8" fill="#00C896"/>
      <circle cx="28.5" cy="21.5" r="2.8" fill="#00C896"/>
      {/* Half-closed lids */}
      <path d="M12.5 19.5 Q15.5 17.8 18.5 19.5" stroke="#00C896" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M25.5 19.5 Q28.5 17.8 31.5 19.5" stroke="#00C896" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <circle cx="16.7" cy="20.2" r="1" fill="rgba(255,255,255,0.5)"/>
      <circle cx="29.7" cy="20.2" r="1" fill="rgba(255,255,255,0.5)"/>
      {/* Calm smile */}
      <path d="M15.5 29 Q22 33.5 28.5 29" stroke="#00C896" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

export function GreedyIcon({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22" cy="22" r="20" fill="rgba(245,159,11,0.12)" stroke="#F59E0B" strokeWidth="1.5"/>
      {/* Raised, arched brows */}
      <path d="M11 13 Q15 9.5 19 12.5" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <path d="M25 12.5 Q29 9.5 33 13" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      {/* Dollar-sign eyes */}
      <circle cx="15.5" cy="21" r="4.5" fill="rgba(245,159,11,0.18)" stroke="#F59E0B" strokeWidth="1.2"/>
      <circle cx="28.5" cy="21" r="4.5" fill="rgba(245,159,11,0.18)" stroke="#F59E0B" strokeWidth="1.2"/>
      {/* $ symbols via path: vertical bar + two arcs */}
      {/* Left $ */}
      <line x1="15.5" y1="17.5" x2="15.5" y2="24.5" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round"/>
      <path d="M18 18.8 C18 18.8 13 18.8 13 20.2 C13 21.6 18 21.6 18 23 C18 24.4 13 24.4 13 24.4" stroke="#F59E0B" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
      {/* Right $ */}
      <line x1="28.5" y1="17.5" x2="28.5" y2="24.5" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round"/>
      <path d="M31 18.8 C31 18.8 26 18.8 26 20.2 C26 21.6 31 21.6 31 23 C31 24.4 26 24.4 26 24.4" stroke="#F59E0B" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
      {/* Wide grin */}
      <path d="M13.5 30 Q22 37.5 30.5 30" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

export function ExcitedIcon({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22" cy="22" r="20" fill="rgba(245,184,0,0.12)" stroke="#F5B800" strokeWidth="1.5"/>
      {/* Very arched raised brows */}
      <path d="M10 14.5 Q15 9 19 13" stroke="#F5B800" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <path d="M25 13 Q29 9 34 14.5" stroke="#F5B800" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      {/* Star/sparkle eyes — filled circle + 4 rays */}
      <circle cx="15.5" cy="21" r="3" fill="#F5B800"/>
      <line x1="15.5" y1="16.5" x2="15.5" y2="18.8" stroke="#F5B800" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="15.5" y1="23.2" x2="15.5" y2="25.5" stroke="#F5B800" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="11" y1="21" x2="13.3" y2="21" stroke="#F5B800" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="17.7" y1="21" x2="20" y2="21" stroke="#F5B800" strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="28.5" cy="21" r="3" fill="#F5B800"/>
      <line x1="28.5" y1="16.5" x2="28.5" y2="18.8" stroke="#F5B800" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="28.5" y1="23.2" x2="28.5" y2="25.5" stroke="#F5B800" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="24" y1="21" x2="26.3" y2="21" stroke="#F5B800" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="30.7" y1="21" x2="33" y2="21" stroke="#F5B800" strokeWidth="1.3" strokeLinecap="round"/>
      {/* Big excited smile */}
      <path d="M13 29.5 Q22 38 31 29.5" stroke="#F5B800" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      {/* Floating sparkles */}
      <circle cx="37" cy="11" r="1.5" fill="#F5B800" opacity="0.75"/>
      <circle cx="38.5" cy="16" r="1" fill="#F5B800" opacity="0.5"/>
      <circle cx="35" cy="8" r="1" fill="#F5B800" opacity="0.5"/>
    </svg>
  )
}

// Map for easy lookup by emotion value
export const EMOTION_ICON_MAP = {
  fearful:   FearfulIcon,
  neutral:   NeutralIcon,
  confident: ConfidentIcon,
  greedy:    GreedyIcon,
  excited:   ExcitedIcon,
} as const
