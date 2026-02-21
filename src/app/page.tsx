'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getTrades, getStats } from '@/lib/storage'
import { Trade } from '@/lib/types'
import TradeCard from '@/components/TradeCard'
import Navigation from '@/components/Navigation'
import { Flame, TrendingUp, Target, BarChart2 } from 'lucide-react'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Morning'
  if (h < 17) return 'Afternoon'
  return 'Evening'
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string
  value: string
  sub?: string
  color?: string
}) {
  return (
    <div className="bg-surface rounded-2xl p-4">
      <p className="text-text-muted text-xs uppercase tracking-widest mb-2">{label}</p>
      <p
        className="text-2xl font-bold tabular leading-none"
        style={{ color: color ?? '#E8EEFF' }}
      >
        {value}
      </p>
      {sub && <p className="text-text-muted text-xs mt-1">{sub}</p>}
    </div>
  )
}

export default function Dashboard() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTrades(getTrades())
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent spinner"
          style={{ borderColor: '#F5B800', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  const stats = getStats(trades)
  const recent = trades.slice(0, 3)
  const isEmpty = trades.length === 0

  // Simple consecutive-day streak
  const streak = (() => {
    if (!trades.length) return 0
    let count = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const days = new Set(trades.map((t) => t.date))
    for (let i = 0; i < 365; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      if (days.has(key)) count++
      else if (i > 0) break
    }
    return count
  })()

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="px-5 pt-safe pb-2">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-text-muted text-sm mb-0.5">{getGreeting()},</p>
            <h1 className="text-4xl font-bold text-text leading-tight">
              Yanai{' '}
              <span className="inline-block" style={{ color: '#F5B800' }}>
                📈
              </span>
            </h1>
          </div>

          {streak > 0 && (
            <div
              className="flex flex-col items-center rounded-2xl px-3.5 py-2.5"
              style={{ backgroundColor: 'rgba(245,184,0,0.1)', border: '1px solid rgba(245,184,0,0.2)' }}
            >
              <Flame className="w-5 h-5 mb-0.5" style={{ color: '#F59E0B' }} />
              <span className="text-text font-bold text-xl leading-none">{streak}</span>
              <span className="text-text-muted text-xs mt-0.5">day streak</span>
            </div>
          )}
        </div>
      </div>

      {isEmpty ? (
        /* ─── Empty state ─── */
        <div className="px-5 flex flex-col items-center text-center py-12 fade-in">
          <div className="text-7xl mb-5">📊</div>
          <h2 className="text-text text-2xl font-bold mb-3">Start Your Journal</h2>
          <p className="text-text-muted text-sm leading-relaxed mb-8 max-w-xs">
            Log your first trade and get personalized AI mentor feedback to accelerate your
            growth as a trader.
          </p>
          <Link
            href="/new-trade"
            className="bg-gold text-bg font-bold text-lg px-10 py-4 rounded-2xl gold-glow active:scale-95 transition-transform"
          >
            Log First Trade
          </Link>
        </div>
      ) : (
        <div className="px-5">
          {/* ─── Total P&L hero card ─── */}
          <div
            className="rounded-2xl p-5 mb-4"
            style={{
              background:
                stats.totalPnl >= 0
                  ? 'linear-gradient(135deg, rgba(0,200,150,0.15), rgba(0,200,150,0.04))'
                  : 'linear-gradient(135deg, rgba(255,61,90,0.15), rgba(255,61,90,0.04))',
              border: `1px solid ${stats.totalPnl >= 0 ? 'rgba(0,200,150,0.25)' : 'rgba(255,61,90,0.25)'}`,
            }}
          >
            <p className="text-text-muted text-xs uppercase tracking-widest mb-2">Total P&amp;L</p>
            <p
              className="text-5xl font-bold tabular leading-none"
              style={{ color: stats.totalPnl >= 0 ? '#00C896' : '#FF3D5A' }}
            >
              {stats.totalPnl >= 0 ? '+' : '-'}${Math.abs(stats.totalPnl).toFixed(2)}
            </p>
            <p className="text-text-muted text-sm mt-2">
              {stats.total} {stats.total === 1 ? 'trade' : 'trades'} •{' '}
              {stats.wins}W {stats.losses}L
            </p>
          </div>

          {/* ─── Stats row ─── */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <StatCard
              label="Win Rate"
              value={`${stats.winRate.toFixed(0)}%`}
              sub={`${stats.wins} wins / ${stats.losses} losses`}
              color={stats.winRate >= 50 ? '#00C896' : '#FF3D5A'}
            />
            <StatCard
              label="This Week"
              value={`${stats.weekPnl >= 0 ? '+' : '-'}$${Math.abs(stats.weekPnl).toFixed(2)}`}
              sub={`${stats.weekTrades} trades`}
              color={stats.weekPnl >= 0 ? '#00C896' : '#FF3D5A'}
            />
          </div>

          {/* ─── Recent trades ─── */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-text font-bold text-lg">Recent Trades</h2>
              {trades.length > 3 && (
                <Link
                  href="/journal"
                  className="text-sm font-semibold"
                  style={{ color: '#F5B800' }}
                >
                  See all →
                </Link>
              )}
            </div>
            {recent.map((trade) => (
              <TradeCard key={trade.id} trade={trade} />
            ))}
          </div>
        </div>
      )}

      <Navigation />
      <div className="h-28" />
    </div>
  )
}
