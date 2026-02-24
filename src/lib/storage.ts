import { Trade, TradeDirection } from './types'

const STORAGE_KEY = 'yanai_trades_v1'

export function getTrades(): Trade[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Trade[]
  } catch {
    return []
  }
}

export function getTradeById(id: string): Trade | null {
  return getTrades().find(t => t.id === id) ?? null
}

export function saveTrade(trade: Trade): void {
  const trades = getTrades()
  const idx = trades.findIndex(t => t.id === trade.id)
  if (idx >= 0) {
    trades[idx] = { ...trade, createdAt: trades[idx].createdAt }
  } else {
    trades.unshift(trade)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trades))
}

export function deleteTrade(id: string): void {
  const trades = getTrades().filter(t => t.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trades))
}

/** Overwrites localStorage with trades (e.g. after fetching from sheet) */
export function setTrades(trades: Trade[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trades))
}

export function calculatePnL(
  direction: TradeDirection,
  entry: number,
  exit: number,
  quantity: number
): { pnl: number; pnlPercent: number; isWin: boolean } {
  const pnl =
    direction === 'long'
      ? (exit - entry) * quantity
      : (entry - exit) * quantity
  const pnlPercent =
    direction === 'long'
      ? ((exit - entry) / entry) * 100
      : ((entry - exit) / entry) * 100
  return { pnl, pnlPercent, isWin: pnl > 0 }
}

export interface TradeStats {
  total: number
  wins: number
  losses: number
  totalPnl: number
  winRate: number
  weekTrades: number
  weekPnl: number
  bestTrade: Trade | null
  worstTrade: Trade | null
}

export function getStats(trades: Trade[]): TradeStats {
  const total = trades.length
  const wins = trades.filter(t => t.isWin).length
  const losses = total - wins
  const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0)
  const winRate = total > 0 ? (wins / total) * 100 : 0

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const weekTrades = trades.filter(t => new Date(t.date) >= weekAgo)
  const weekPnl = weekTrades.reduce((sum, t) => sum + t.pnl, 0)

  const bestTrade = trades.length
    ? trades.reduce((best, t) => (t.pnl > best.pnl ? t : best), trades[0])
    : null
  const worstTrade = trades.length
    ? trades.reduce((worst, t) => (t.pnl < worst.pnl ? t : worst), trades[0])
    : null

  return {
    total,
    wins,
    losses,
    totalPnl,
    winRate,
    weekTrades: weekTrades.length,
    weekPnl,
    bestTrade,
    worstTrade,
  }
}

export function exportData(): void {
  const trades = getTrades()
  const json = JSON.stringify({ trades, exportedAt: new Date().toISOString() }, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `yanai-trades-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importData(json: string): boolean {
  try {
    const data = JSON.parse(json) as { trades: Trade[] }
    if (!Array.isArray(data.trades)) return false
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.trades))
    return true
  } catch {
    return false
  }
}
