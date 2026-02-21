'use client'

import { useEffect, useState } from 'react'
import { getTrades, getStats } from '@/lib/storage'
import { Trade } from '@/lib/types'
import TradeCard from '@/components/TradeCard'
import Navigation from '@/components/Navigation'
import Link from 'next/link'

type Filter = 'all' | 'wins' | 'losses'

export default function JournalPage() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
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

  const filtered = trades
    .filter((t) => {
      if (filter === 'wins') return t.isWin
      if (filter === 'losses') return !t.isWin
      return true
    })
    .filter((t) =>
      search ? t.symbol.toLowerCase().includes(search.toLowerCase()) : true
    )

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="px-5 pt-safe pb-4">
        <h1 className="text-3xl font-bold text-text mb-1">Journal</h1>
        {trades.length > 0 && (
          <p className="text-text-muted text-sm">
            {stats.total} trades · {stats.wins}W {stats.losses}L ·{' '}
            <span style={{ color: stats.totalPnl >= 0 ? '#00C896' : '#FF3D5A' }}>
              {stats.totalPnl >= 0 ? '+' : '-'}${Math.abs(stats.totalPnl).toFixed(2)}
            </span>
          </p>
        )}
      </div>

      {trades.length === 0 ? (
        <div className="px-5 text-center py-20">
          <p className="text-5xl mb-4">📓</p>
          <p className="text-text font-bold text-lg mb-2">No trades yet</p>
          <p className="text-text-muted text-sm mb-6">
            Log your first trade to start building your journal.
          </p>
          <Link
            href="/new-trade"
            className="bg-gold text-bg font-bold px-8 py-3 rounded-xl"
          >
            Log a Trade
          </Link>
        </div>
      ) : (
        <div className="px-5">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by symbol…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-text text-sm focus:outline-none mb-3"
            style={{
              backgroundColor: '#0D1520',
              border: `1px solid ${search ? '#F5B800' : '#1A2840'}`,
            }}
          />

          {/* Filter tabs */}
          <div className="flex gap-2 mb-5">
            {(['all', 'wins', 'losses'] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all active:scale-95"
                style={{
                  backgroundColor: filter === f ? '#F5B800' : '#0D1520',
                  color: filter === f ? '#070B12' : '#5A7DA0',
                  border: filter === f ? 'none' : '1px solid #1A2840',
                }}
              >
                {f}
                {f === 'wins' && trades.length > 0 && (
                  <span className="ml-1.5 opacity-70">{stats.wins}</span>
                )}
                {f === 'losses' && trades.length > 0 && (
                  <span className="ml-1.5 opacity-70">{stats.losses}</span>
                )}
              </button>
            ))}
          </div>

          {/* Trade list */}
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-text-muted">No trades match your filter</p>
            </div>
          ) : (
            filtered.map((trade) => <TradeCard key={trade.id} trade={trade} />)
          )}
        </div>
      )}

      <Navigation />
      <div className="h-28" />
    </div>
  )
}
