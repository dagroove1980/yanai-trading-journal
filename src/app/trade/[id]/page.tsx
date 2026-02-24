'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getTradeById, saveTrade, deleteTrade, calculatePnL, setTrades as persistTrades } from '@/lib/storage'
import { Trade, EMOTION_OPTIONS, TradeEmotion, TradeRating } from '@/lib/types'
import { ArrowLeft, Edit2, Trash2, Check, X, Sparkles, Brain } from 'lucide-react'
import { EMOTION_ICON_MAP } from '@/components/Icons'
import { syncUpsert, syncDelete, fetchTradesFromSheet } from '@/lib/sync'

function Stars({
  rating,
  editable,
  onChange,
}: {
  rating: number
  editable?: boolean
  onChange?: (r: TradeRating) => void
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          onClick={() => editable && onChange && onChange(s as TradeRating)}
          disabled={!editable}
          className="text-2xl transition-transform active:scale-90"
          style={{ color: s <= rating ? '#F5B800' : '#1E3050' }}
        >
          ★
        </button>
      ))}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/50">
      <span className="text-text-muted text-sm">{label}</span>
      <span className="text-text text-sm font-semibold tabular">{value}</span>
    </div>
  )
}

export default function TradeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [trade, setTrade] = useState<Trade | null>(null)
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<Trade>>({})
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [enhancing, setEnhancing] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const loadTrade = () => {
      setTrade(getTradeById(id))
    }
    const t0 = getTradeById(id)
    if (t0) {
      setTrade(t0)
      return
    }
    fetchTradesFromSheet().then(({ trades: sheetTrades, skipped }) => {
      if (!skipped && sheetTrades.length > 0) {
        persistTrades(sheetTrades)
        const found = sheetTrades.find((x) => x.id === id) ?? null
        setTrade(found)
      } else {
        loadTrade()
      }
    })
  }, [id])

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

  if (!trade) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-5 text-center">
        <p className="text-5xl mb-4 text-text-muted">?</p>
        <p className="text-text font-bold text-xl mb-2">Trade not found</p>
        <button
          onClick={() => router.back()}
          className="text-gold text-sm font-semibold mt-4"
        >
          ← Go back
        </button>
      </div>
    )
  }

  const emotion = EMOTION_OPTIONS.find((e) => e.value === trade.emotion)
  const pnlAbs = Math.abs(trade.pnl)
  const pnlPctAbs = Math.abs(trade.pnlPercent)

  const handleEdit = () => {
    setEditData({ ...trade })
    setEditing(true)
  }

  const handleCancel = () => {
    setEditData({})
    setEditing(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const updated: Trade = {
      ...trade,
      ...editData,
      // Recalculate P&L if prices changed
      ...calculatePnL(
        (editData.direction ?? trade.direction),
        Number(editData.entryPrice ?? trade.entryPrice),
        Number(editData.exitPrice ?? trade.exitPrice),
        Number(editData.quantity ?? trade.quantity)
      ),
    }
    saveTrade(updated)
    syncUpsert(updated) // fire-and-forget to Google Sheets
    setTrade(updated)
    setEditing(false)
    setSaving(false)
  }

  const handleDelete = () => {
    deleteTrade(trade.id)
    syncDelete(trade.id) // fire-and-forget to Google Sheets
    router.push('/')
  }

  const handleEnhance = async (field: 'whyEntered' | 'whatHappened' | 'keyLesson') => {
    const content = String(editData[field] ?? '')
    if (content.length < 10) return
    setEnhancing(field)
    try {
      const res = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field,
          content,
          context: {
            symbol: editData.symbol ?? trade.symbol,
            direction: editData.direction ?? trade.direction,
            pnl: trade.pnl,
            isWin: trade.isWin,
          },
        }),
      })
      if (!res.ok) throw new Error(`API ${res.status}`)
      const data = await res.json()
      if (!data.enhanced) throw new Error('Empty response')
      setEditData((prev) => ({ ...prev, [field]: data.enhanced }))
    } catch (err) {
      console.error('Enhance failed:', err)
    } finally {
      setEnhancing(null)
    }
  }

  const field = (
    key: keyof Trade,
    label: string,
    type: 'textarea' | 'text' | 'number' = 'text'
  ) => {
    if (!editing) {
      return (
        <div className="mb-4">
          <p className="text-text-muted text-xs uppercase tracking-widest mb-1.5">{label}</p>
          <p className="text-text text-sm leading-relaxed">
            {String(trade[key] ?? '—')}
          </p>
        </div>
      )
    }

    const isEnhanceable =
      key === 'whyEntered' || key === 'whatHappened' || key === 'keyLesson'

    return (
      <div className="mb-4">
        <p className="text-text-muted text-xs uppercase tracking-widest mb-1.5">{label}</p>
        {type === 'textarea' ? (
          <>
            <textarea
              value={String(editData[key] ?? '')}
              onChange={(e) => setEditData((prev) => ({ ...prev, [key]: e.target.value }))}
              rows={3}
              className="w-full rounded-xl px-3 py-3 text-text text-sm resize-none focus:outline-none"
              style={{ backgroundColor: '#131E2E', border: '1px solid #1A2840' }}
            />
            {isEnhanceable && (
              <button
                onClick={() => handleEnhance(key as 'whyEntered' | 'whatHappened' | 'keyLesson')}
                disabled={!!enhancing || String(editData[key] ?? '').length < 10}
                className="flex items-center gap-1.5 text-xs font-semibold mt-1.5 disabled:opacity-30 transition-opacity"
                style={{ color: '#F5B800' }}
              >
                {enhancing === key ? (
                  <>
                    <div
                      className="w-3 h-3 rounded-full border border-t-transparent spinner"
                      style={{ borderColor: '#F5B800', borderTopColor: 'transparent' }}
                    />
                    Enhancing…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3" />
                    Polish with AI
                  </>
                )}
              </button>
            )}
          </>
        ) : (
          <input
            type={type}
            value={String(editData[key] ?? '')}
            onChange={(e) => setEditData((prev) => ({ ...prev, [key]: e.target.value }))}
            className="w-full rounded-xl px-3 py-3 text-text text-sm focus:outline-none"
            style={{ backgroundColor: '#131E2E', border: '1px solid #1A2840' }}
          />
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="px-5 pt-safe pb-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-transform"
            style={{ backgroundColor: '#0D1520' }}
          >
            <ArrowLeft className="w-5 h-5 text-text-muted" />
          </button>

          <div className="flex items-center gap-2">
            {editing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#0D1520' }}
                >
                  <X className="w-5 h-5" style={{ color: '#FF3D5A' }} />
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(0,200,150,0.15)' }}
                >
                  {saving ? (
                    <div
                      className="w-4 h-4 rounded-full border-2 border-t-transparent spinner"
                      style={{ borderColor: '#00C896', borderTopColor: 'transparent' }}
                    />
                  ) : (
                    <Check className="w-5 h-5" style={{ color: '#00C896' }} />
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEdit}
                  className="w-10 h-10 rounded-full flex items-center justify-center active:scale-90"
                  style={{ backgroundColor: '#0D1520' }}
                >
                  <Edit2 className="w-4 h-4 text-text-muted" />
                </button>
                {confirmDelete ? (
                  <>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="px-3 py-2 rounded-xl text-xs text-text-muted"
                      style={{ backgroundColor: '#0D1520' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-3 py-2 rounded-xl text-xs font-bold"
                      style={{ backgroundColor: 'rgba(255,61,90,0.2)', color: '#FF3D5A' }}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="w-10 h-10 rounded-full flex items-center justify-center active:scale-90"
                    style={{ backgroundColor: '#0D1520' }}
                  >
                    <Trash2 className="w-4 h-4" style={{ color: '#FF3D5A' }} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Symbol + result */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-4xl font-bold text-text">{trade.symbol}</h1>
              <span
                className="text-sm px-2.5 py-1 rounded-full font-semibold"
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
            <p className="text-text-muted text-sm">
              {new Date(trade.date + 'T12:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
          <div className="text-right">
            <p
              className="text-4xl font-bold tabular leading-none"
              style={{ color: trade.isWin ? '#00C896' : '#FF3D5A' }}
            >
              {trade.isWin ? '+' : '-'}${pnlAbs.toFixed(2)}
            </p>
            <p
              className="text-sm tabular mt-0.5"
              style={{ color: trade.isWin ? '#00C896' : '#FF3D5A' }}
            >
              {trade.isWin ? '+' : '-'}{pnlPctAbs.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 pb-12">
        {/* Trade details */}
        <div
          className="rounded-2xl p-4 mb-5"
          style={{ backgroundColor: '#0D1520', border: '1px solid #1A2840' }}
        >
          {editing ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-text-muted text-xs uppercase tracking-widest mb-1.5">Symbol</p>
                <input
                  type="text"
                  value={String(editData.symbol ?? '')}
                  onChange={(e) => setEditData((p) => ({ ...p, symbol: e.target.value.toUpperCase() }))}
                  className="w-full rounded-xl px-3 py-2.5 text-text text-sm focus:outline-none"
                  style={{ backgroundColor: '#131E2E', border: '1px solid #1A2840' }}
                />
              </div>
              <div>
                <p className="text-text-muted text-xs uppercase tracking-widest mb-1.5">Date</p>
                <input
                  type="date"
                  value={String(editData.date ?? '')}
                  onChange={(e) => setEditData((p) => ({ ...p, date: e.target.value }))}
                  className="w-full rounded-xl px-3 py-2.5 text-text text-sm focus:outline-none"
                  style={{ backgroundColor: '#131E2E', border: '1px solid #1A2840' }}
                />
              </div>
              <div>
                <p className="text-text-muted text-xs uppercase tracking-widest mb-1.5">Entry $</p>
                <input
                  type="number"
                  step="0.01"
                  value={String(editData.entryPrice ?? '')}
                  onChange={(e) => setEditData((p) => ({ ...p, entryPrice: parseFloat(e.target.value) }))}
                  className="w-full rounded-xl px-3 py-2.5 text-text text-sm focus:outline-none"
                  style={{ backgroundColor: '#131E2E', border: '1px solid #1A2840' }}
                />
              </div>
              <div>
                <p className="text-text-muted text-xs uppercase tracking-widest mb-1.5">Exit $</p>
                <input
                  type="number"
                  step="0.01"
                  value={String(editData.exitPrice ?? '')}
                  onChange={(e) => setEditData((p) => ({ ...p, exitPrice: parseFloat(e.target.value) }))}
                  className="w-full rounded-xl px-3 py-2.5 text-text text-sm focus:outline-none"
                  style={{ backgroundColor: '#131E2E', border: '1px solid #1A2840' }}
                />
              </div>
              <div className="col-span-2">
                <p className="text-text-muted text-xs uppercase tracking-widest mb-1.5">Quantity / Shares</p>
                <input
                  type="number"
                  step="any"
                  value={String(editData.quantity ?? '')}
                  onChange={(e) => setEditData((p) => ({ ...p, quantity: parseFloat(e.target.value) }))}
                  className="w-full rounded-xl px-3 py-2.5 text-text text-sm focus:outline-none"
                  style={{ backgroundColor: '#131E2E', border: '1px solid #1A2840' }}
                />
              </div>
            </div>
          ) : (
            <>
              <InfoRow label="Entry Price" value={`$${trade.entryPrice.toFixed(2)}`} />
              <InfoRow label="Exit Price" value={`$${trade.exitPrice.toFixed(2)}`} />
              <InfoRow label="Quantity" value={String(trade.quantity)} />
              <InfoRow
                label="P&L per share"
                value={`${trade.isWin ? '+' : '-'}$${Math.abs(trade.pnl / trade.quantity).toFixed(2)}`}
              />
            </>
          )}
        </div>

        {/* Journal entries */}
        <div
          className="rounded-2xl p-4 mb-5"
          style={{ backgroundColor: '#0D1520', border: '1px solid #1A2840' }}
        >
          <h2 className="text-text font-bold text-base mb-4">Journal</h2>
          {field('whyEntered', 'Why I entered', 'textarea')}
          {field('whatHappened', 'What happened', 'textarea')}
          {field('keyLesson', 'Key lesson', 'textarea')}
        </div>

        {/* Mood & Rating */}
        <div
          className="rounded-2xl p-4 mb-5"
          style={{ backgroundColor: '#0D1520', border: '1px solid #1A2840' }}
        >
          <h2 className="text-text font-bold text-base mb-4">Feelings</h2>
          <div className="mb-4">
            <p className="text-text-muted text-xs uppercase tracking-widest mb-3">Emotion</p>
            {editing ? (
              <div className="grid grid-cols-5 gap-2">
                {EMOTION_OPTIONS.map((e) => {
                  const Icon = EMOTION_ICON_MAP[e.value]
                  return (
                  <button
                    key={e.value}
                    onClick={() => setEditData((p) => ({ ...p, emotion: e.value }))}
                    className="flex flex-col items-center gap-1 py-2 rounded-xl transition-all"
                    style={{
                      backgroundColor:
                        (editData.emotion ?? trade.emotion) === e.value
                          ? 'rgba(245,184,0,0.15)'
                          : '#131E2E',
                      border:
                        (editData.emotion ?? trade.emotion) === e.value
                          ? '1px solid rgba(245,184,0,0.4)'
                          : '1px solid transparent',
                    }}
                  >
                    <Icon size={28} />
                    <span className="text-text-muted text-xs leading-none">{e.label}</span>
                  </button>
                  )
                })}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {emotion && (() => { const Icon = EMOTION_ICON_MAP[emotion.value]; return <Icon size={28} /> })()}
                <span className="text-text font-semibold">{emotion?.label}</span>
              </div>
            )}
          </div>

          <div>
            <p className="text-text-muted text-xs uppercase tracking-widest mb-2">Rating</p>
            <Stars
              rating={editing ? (editData.rating ?? trade.rating) : trade.rating}
              editable={editing}
              onChange={(r) => setEditData((p) => ({ ...p, rating: r }))}
            />
          </div>
        </div>

        {/* AI Mentor Insight */}
        {trade.aiInsight && (
          <div
            className="rounded-2xl p-4"
            style={{
              background: 'linear-gradient(135deg, rgba(245,184,0,0.08), rgba(245,184,0,0.03))',
              border: '1px solid rgba(245,184,0,0.2)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4" style={{ color: '#F5B800' }} />
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#F5B800' }}>
                AI Mentor Feedback
              </p>
            </div>
            <p className="text-text text-sm leading-relaxed">{trade.aiInsight}</p>
          </div>
        )}
      </div>
    </div>
  )
}
