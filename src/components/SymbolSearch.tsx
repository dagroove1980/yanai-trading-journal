'use client'

import { useState } from 'react'
import { searchSymbols, SymbolEntry, AssetType } from '@/lib/symbols'

const TYPE_STYLE: Record<AssetType, { bg: string; color: string }> = {
  Stock:   { bg: 'rgba(0,200,150,0.15)',   color: '#00C896' },
  ETF:     { bg: 'rgba(245,184,0,0.15)',   color: '#F5B800' },
  Futures: { bg: 'rgba(129,140,248,0.15)', color: '#818CF8' },
  Crypto:  { bg: 'rgba(251,146,60,0.15)',  color: '#FB923C' },
  Forex:   { bg: 'rgba(244,114,182,0.15)', color: '#F472B6' },
}

interface Props {
  value: string
  onChange: (symbol: string) => void
}

export default function SymbolSearch({ value, onChange }: Props) {
  const [results, setResults] = useState<SymbolEntry[]>([])
  const [open, setOpen] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.toUpperCase()
    onChange(raw)
    const found = searchSymbols(raw)
    setResults(found)
    setOpen(found.length > 0 && raw.length > 0)
  }

  const handleFocus = () => {
    if (value.length > 0) {
      const found = searchSymbols(value)
      setResults(found)
      setOpen(found.length > 0)
    }
  }

  const handleBlur = () => {
    // Delay so onPointerDown on list items fires first
    setTimeout(() => setOpen(false), 150)
  }

  const handleSelect = (entry: SymbolEntry) => {
    onChange(entry.symbol)
    setResults([])
    setOpen(false)
  }

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="e.g. AAPL, ES, BTC, EUR/USD"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="w-full rounded-2xl px-4 py-4 text-text text-base focus:outline-none"
        style={{
          backgroundColor: '#0D1520',
          border: `1.5px solid ${open ? 'rgba(245,184,0,0.5)' : '#1A2840'}`,
        }}
        autoCapitalize="characters"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        inputMode="text"
      />

      {open && results.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 z-50 mt-1 rounded-2xl overflow-hidden"
          style={{
            backgroundColor: '#131E2E',
            border: '1.5px solid #1A2840',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          }}
        >
          {results.map((entry, i) => {
            const style = TYPE_STYLE[entry.type]
            return (
              <button
                key={`${entry.symbol}-${entry.type}`}
                // onPointerDown fires before onBlur — prevents dropdown disappearing before click
                onPointerDown={(e) => {
                  e.preventDefault()
                  handleSelect(entry)
                }}
                className="w-full flex items-center justify-between px-4 py-3 active:opacity-60 transition-opacity text-left"
                style={{
                  borderBottom: i < results.length - 1 ? '1px solid #1A2840' : 'none',
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-text font-bold text-base shrink-0 w-16">
                    {entry.symbol}
                  </span>
                  <span className="text-text-muted text-sm truncate">{entry.name}</span>
                </div>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ml-2"
                  style={{ backgroundColor: style.bg, color: style.color }}
                >
                  {entry.type}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
