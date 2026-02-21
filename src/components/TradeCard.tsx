'use client'

import Link from 'next/link'
import { Trade, EMOTION_OPTIONS } from '@/lib/types'
import { TrendingUp, TrendingDown } from 'lucide-react'

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          style={{
            fontSize: '11px',
            color: s <= rating ? '#F5B800' : '#1E3050',
          }}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default function TradeCard({ trade }: { trade: Trade }) {
  const emotion = EMOTION_OPTIONS.find((e) => e.value === trade.emotion)
  const pnlAbs = Math.abs(trade.pnl)
  const pnlPctAbs = Math.abs(trade.pnlPercent)

  return (
    <Link href={`/trade/${trade.id}`}>
      <div
        className={`rounded-2xl p-4 mb-3 active:scale-[0.98] transition-transform cursor-pointer ${
          trade.isWin ? 'profit-card' : 'loss-card'
        }`}
      >
        {/* Top row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-text text-xl tracking-tight">
                {trade.symbol}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor:
                    trade.direction === 'long'
                      ? 'rgba(0,200,150,0.15)'
                      : 'rgba(255,61,90,0.15)',
                  color: trade.direction === 'long' ? '#00C896' : '#FF3D5A',
                }}
              >
                {trade.direction === 'long' ? '↑ Long' : '↓ Short'}
              </span>
            </div>
            <p className="text-text-muted text-xs">
              {new Date(trade.date + 'T12:00:00').toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* P&L */}
          <div className="text-right">
            <div
              className="font-bold text-2xl tabular leading-none"
              style={{ color: trade.isWin ? '#00C896' : '#FF3D5A' }}
            >
              {trade.isWin ? '+' : '-'}${pnlAbs.toFixed(2)}
            </div>
            <div
              className="text-sm tabular mt-0.5"
              style={{ color: trade.isWin ? '#00C896' : '#FF3D5A' }}
            >
              {trade.isWin ? '+' : '-'}{pnlPctAbs.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Stars rating={trade.rating} />
            <div className="flex items-center gap-1.5">
              <span className="text-base leading-none">{emotion?.emoji}</span>
              <span className="text-text-muted text-xs">{emotion?.label}</span>
            </div>
          </div>
          {trade.isWin ? (
            <TrendingUp className="w-4 h-4" style={{ color: '#00C896' }} />
          ) : (
            <TrendingDown className="w-4 h-4" style={{ color: '#FF3D5A' }} />
          )}
        </div>

        {/* Key lesson snippet */}
        {trade.keyLesson && (
          <p className="text-text-muted text-xs mt-2.5 leading-relaxed line-clamp-2 italic border-t border-border/50 pt-2.5">
            &ldquo;{trade.keyLesson}&rdquo;
          </p>
        )}
      </div>
    </Link>
  )
}
