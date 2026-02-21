'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { saveTrade, calculatePnL } from '@/lib/storage'
import {
  Trade,
  TradeDirection,
  TradeEmotion,
  TradeRating,
  EMOTION_OPTIONS,
  WIZARD_STEPS,
} from '@/lib/types'
import SymbolSearch from '@/components/SymbolSearch'
import { EMOTION_ICON_MAP } from '@/components/Icons'
import {
  ArrowLeft,
  Sparkles,
  Brain,
  Check,
  X,
  TrendingUp,
  TrendingDown,
  ChevronRight,
} from 'lucide-react'

// ── Defined OUTSIDE main component so React doesn't remount them ──

function EnhanceButton({
  loading,
  disabled,
  failed,
  onClick,
}: {
  loading: boolean
  disabled: boolean
  failed: boolean
  onClick: () => void
}) {
  if (failed) {
    return (
      <span className="flex items-center gap-1.5 text-xs font-semibold mt-2" style={{ color: '#FF3D5A' }}>
        <X className="w-3.5 h-3.5" />
        Failed — try again
      </span>
    )
  }
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className="flex items-center gap-1.5 text-xs font-semibold mt-2 transition-opacity disabled:opacity-30"
      style={{ color: '#F5B800' }}
    >
      {loading ? (
        <>
          <div
            className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent spinner"
            style={{ borderColor: '#F5B800', borderTopColor: 'transparent' }}
          />
          <span className="pulse-gold">Enhancing…</span>
        </>
      ) : (
        <>
          <Sparkles className="w-3.5 h-3.5" />
          Polish with AI
        </>
      )}
    </button>
  )
}

function StarSelector({
  value,
  onChange,
}: {
  value: number
  onChange: (v: TradeRating) => void
}) {
  return (
    <div className="flex gap-3 justify-center mt-2">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          onClick={() => onChange(s as TradeRating)}
          className="text-4xl transition-transform active:scale-110"
          style={{ color: s <= value ? '#F5B800' : '#1E3050' }}
        >
          ★
        </button>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Main Wizard
// ─────────────────────────────────────────────────────────────────
export default function NewTradePage() {
  const router = useRouter()
  const contentRef = useRef<HTMLDivElement>(null)

  const [step, setStep] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const [slideDir, setSlideDir] = useState<'forward' | 'back'>('forward')

  // Step 0
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [symbol, setSymbol] = useState('')
  const [direction, setDirection] = useState<TradeDirection>('long')
  const [entryPrice, setEntryPrice] = useState('')
  const [exitPrice, setExitPrice] = useState('')
  const [quantity, setQuantity] = useState('')

  // Steps 1–3
  const [whyEntered, setWhyEntered] = useState('')
  const [whatHappened, setWhatHappened] = useState('')
  const [keyLesson, setKeyLesson] = useState('')

  // Step 4
  const [emotion, setEmotion] = useState<TradeEmotion>('neutral')
  const [rating, setRating] = useState<TradeRating>(3)

  // Step 5
  const [aiInsight, setAiInsight] = useState<string | null>(null)
  const [generatingInsight, setGeneratingInsight] = useState(false)

  // AI enhance
  const [enhancing, setEnhancing] = useState<string | null>(null)

  const [saved, setSaved] = useState(false)
  const [enhanceFailed, setEnhanceFailed] = useState<string | null>(null)

  // ── Computed P&L ──
  const pnlData = (() => {
    const entry = parseFloat(entryPrice)
    const exit = parseFloat(exitPrice)
    const qty = parseFloat(quantity)
    if (!entry || !exit || !qty || isNaN(entry) || isNaN(exit) || isNaN(qty)) return null
    return calculatePnL(direction, entry, exit, qty)
  })()

  const goStep = (next: number, dir: 'forward' | 'back') => {
    setSlideDir(dir)
    setAnimKey((k) => k + 1)
    setStep(next)
    contentRef.current?.scrollTo({ top: 0 })
  }

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return !!(symbol.trim() && entryPrice && exitPrice && quantity)
      case 1: return whyEntered.trim().length >= 10
      case 2: return whatHappened.trim().length >= 10
      case 3: return keyLesson.trim().length >= 5
      case 4: return true
      case 5: return !!aiInsight
      default: return false
    }
  }

  const handleEnhance = async (field: 'whyEntered' | 'whatHappened' | 'keyLesson') => {
    const content = field === 'whyEntered' ? whyEntered : field === 'whatHappened' ? whatHappened : keyLesson
    if (content.trim().length < 10) return
    setEnhancing(field)
    setEnhanceFailed(null)
    try {
      const res = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field,
          content,
          context: { symbol: symbol.toUpperCase(), direction, pnl: pnlData?.pnl ?? 0, isWin: pnlData?.isWin ?? false },
        }),
      })
      if (!res.ok) throw new Error(`API ${res.status}`)
      const data = await res.json()
      if (!data.enhanced) throw new Error('Empty response')
      if (field === 'whyEntered') setWhyEntered(data.enhanced)
      else if (field === 'whatHappened') setWhatHappened(data.enhanced)
      else setKeyLesson(data.enhanced)
    } catch (err) {
      console.error('Enhance failed:', err)
      setEnhanceFailed(field)
      setTimeout(() => setEnhanceFailed(null), 3000)
    } finally {
      setEnhancing(null)
    }
  }

  const fetchInsight = async () => {
    setGeneratingInsight(true)
    const entry = parseFloat(entryPrice)
    const exit = parseFloat(exitPrice)
    const qty = parseFloat(quantity)
    const pnl = calculatePnL(direction, entry, exit, qty)
    try {
      const res = await fetch('/api/ai/insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trade: { symbol: symbol.toUpperCase(), direction, entryPrice: entry, exitPrice: exit, quantity: qty, ...pnl, whyEntered, whatHappened, keyLesson, emotion, rating },
        }),
      })
      const data = await res.json()
      setAiInsight(data.insight)
    } catch {
      setAiInsight("Real traders journal their trades — you're already ahead. Focus on your process, stay disciplined, and let the results follow.")
    } finally {
      setGeneratingInsight(false)
    }
  }

  const handleNext = () => {
    if (step === 4) {
      goStep(5, 'forward')
      fetchInsight()
    } else if (step < 5) {
      goStep(step + 1, 'forward')
    }
  }

  const handleSave = () => {
    const entry = parseFloat(entryPrice)
    const exit = parseFloat(exitPrice)
    const qty = parseFloat(quantity)
    const pnl = calculatePnL(direction, entry, exit, qty)
    const trade: Trade = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      date,
      symbol: symbol.toUpperCase(),
      direction,
      entryPrice: entry,
      exitPrice: exit,
      quantity: qty,
      ...pnl,
      whyEntered,
      whatHappened,
      keyLesson,
      emotion,
      rating,
      aiInsight: aiInsight ?? undefined,
    }
    saveTrade(trade)
    setSaved(true)
    setTimeout(() => router.push('/'), 800)
  }

  // Shared input style
  const inputBase = 'w-full rounded-2xl px-4 py-4 text-text text-base focus:outline-none transition-colors'
  const inputStyle = { backgroundColor: '#0D1520', border: '1.5px solid #1A2840' }
  const inputFocusStyle = { backgroundColor: '#0D1520', border: '1.5px solid rgba(245,184,0,0.5)' }

  // Mini trade context bar (shown on steps 1–4)
  const contextBar = pnlData && (
    <div
      className="rounded-2xl p-3 mb-5 flex items-center justify-between"
      style={{
        backgroundColor: '#0D1520',
        border: `1px solid ${pnlData.isWin ? 'rgba(0,200,150,0.2)' : 'rgba(255,61,90,0.2)'}`,
      }}
    >
      <span className="text-text-muted text-sm font-medium">
        {symbol.toUpperCase()} · {direction === 'long' ? '↑ Long' : '↓ Short'}
      </span>
      <span className="font-bold tabular text-sm" style={{ color: pnlData.isWin ? '#00C896' : '#FF3D5A' }}>
        {pnlData.isWin ? '+' : '-'}${Math.abs(pnlData.pnl).toFixed(2)}
      </span>
    </div>
  )

  const progress = ((step + 1) / WIZARD_STEPS.length) * 100
  const currentStep = WIZARD_STEPS[step]

  return (
    <div className="min-h-screen bg-bg flex flex-col" style={{ maxHeight: '100dvh', overflow: 'hidden' }}>
      {/* ── Top bar ── */}
      <div className="flex-shrink-0 px-5 pt-safe pb-3">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => step === 0 ? router.push('/') : goStep(step - 1, 'back')}
            className="w-11 h-11 rounded-full flex items-center justify-center active:scale-90 transition-transform"
            style={{ backgroundColor: '#0D1520' }}
          >
            <ArrowLeft className="w-5 h-5 text-text-muted" />
          </button>
          <div className="flex-1">
            <p className="text-text-muted text-xs uppercase tracking-widest">Step {step + 1} of {WIZARD_STEPS.length}</p>
            <h1 className="text-text font-bold text-xl leading-tight">{currentStep.title}</h1>
          </div>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#1A2840' }}>
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%`, backgroundColor: '#F5B800' }}
          />
        </div>
        <p className="text-text-muted text-sm mt-2">{currentStep.subtitle}</p>
      </div>

      {/* ── Scrollable content ── */}
      <div ref={contentRef} className="flex-1 overflow-y-auto px-5 pb-4" style={{ overscrollBehavior: 'contain' }}>
        <div key={animKey} className={slideDir === 'forward' ? 'slide-in' : 'slide-in-back'}>

          {/* ── Step 0: Trade Info ── */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <p className="text-text-muted text-xs uppercase tracking-widest mb-2">Symbol / Asset</p>
                <SymbolSearch value={symbol} onChange={setSymbol} />
              </div>

              <div>
                <p className="text-text-muted text-xs uppercase tracking-widest mb-2">Direction</p>
                <div className="flex rounded-2xl p-1" style={{ backgroundColor: '#0D1520', border: '1.5px solid #1A2840' }}>
                  {(['long', 'short'] as TradeDirection[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDirection(d)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-base transition-all active:scale-95"
                      style={{
                        backgroundColor: direction === d
                          ? d === 'long' ? 'rgba(0,200,150,0.2)' : 'rgba(255,61,90,0.2)'
                          : 'transparent',
                        color: direction === d
                          ? d === 'long' ? '#00C896' : '#FF3D5A'
                          : '#5A7DA0',
                      }}
                    >
                      {d === 'long' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                      {d === 'long' ? 'Long ↑' : 'Short ↓'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-widest mb-2">Entry Price $</p>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(e.target.value)}
                    className={inputBase}
                    style={inputStyle}
                    inputMode="decimal"
                  />
                </div>
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-widest mb-2">Exit Price $</p>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={exitPrice}
                    onChange={(e) => setExitPrice(e.target.value)}
                    className={inputBase}
                    style={inputStyle}
                    inputMode="decimal"
                  />
                </div>
              </div>

              <div>
                <p className="text-text-muted text-xs uppercase tracking-widest mb-2">Quantity / Shares</p>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 10"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className={inputBase}
                  style={inputStyle}
                  inputMode="decimal"
                />
              </div>

              <div>
                <p className="text-text-muted text-xs uppercase tracking-widest mb-2">Trade Date</p>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={inputBase}
                  style={inputStyle}
                />
              </div>

              {pnlData && (
                <div
                  className="rounded-2xl p-4 text-center fade-in"
                  style={{
                    background: pnlData.isWin
                      ? 'linear-gradient(135deg, rgba(0,200,150,0.15), rgba(0,200,150,0.05))'
                      : 'linear-gradient(135deg, rgba(255,61,90,0.15), rgba(255,61,90,0.05))',
                    border: `1.5px solid ${pnlData.isWin ? 'rgba(0,200,150,0.3)' : 'rgba(255,61,90,0.3)'}`,
                  }}
                >
                  <p className="text-text-muted text-xs uppercase tracking-widest mb-1">P&amp;L Preview</p>
                  <p className="text-3xl font-bold tabular" style={{ color: pnlData.isWin ? '#00C896' : '#FF3D5A' }}>
                    {pnlData.isWin ? '+' : '-'}${Math.abs(pnlData.pnl).toFixed(2)}
                  </p>
                  <p className="text-sm tabular mt-0.5" style={{ color: pnlData.isWin ? '#00C896' : '#FF3D5A' }}>
                    {pnlData.pnlPercent.toFixed(1)}%
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Step 1: Why entered ── */}
          {step === 1 && (
            <div>
              {contextBar}
              <p className="text-text-muted text-xs mb-3">What setup did you see? What was your plan? What made you pull the trigger?</p>
              <textarea
                rows={5}
                placeholder="I entered because I saw a strong breakout above resistance with volume confirming…"
                value={whyEntered}
                onChange={(e) => setWhyEntered(e.target.value)}
                className="w-full rounded-2xl px-4 py-4 text-text text-base resize-none focus:outline-none leading-relaxed"
                style={{
                  backgroundColor: '#0D1520',
                  border: `1.5px solid ${whyEntered.length >= 10 ? 'rgba(245,184,0,0.3)' : '#1A2840'}`,
                }}
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-text-dim text-xs">{whyEntered.length} chars (min 10)</p>
                <EnhanceButton
                  loading={enhancing === 'whyEntered'}
                  disabled={whyEntered.trim().length < 10}
                  failed={enhanceFailed === 'whyEntered'}
                  onClick={() => handleEnhance('whyEntered')}
                />
              </div>
            </div>
          )}

          {/* ── Step 2: What happened ── */}
          {step === 2 && (
            <div>
              {contextBar}
              <p className="text-text-muted text-xs mb-3">Walk through the trade. What surprised you? How did you manage it?</p>
              <textarea
                rows={5}
                placeholder="The trade moved in my favor initially, but then reversed when…"
                value={whatHappened}
                onChange={(e) => setWhatHappened(e.target.value)}
                className="w-full rounded-2xl px-4 py-4 text-text text-base resize-none focus:outline-none leading-relaxed"
                style={{
                  backgroundColor: '#0D1520',
                  border: `1.5px solid ${whatHappened.length >= 10 ? 'rgba(245,184,0,0.3)' : '#1A2840'}`,
                }}
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-text-dim text-xs">{whatHappened.length} chars (min 10)</p>
                <EnhanceButton
                  loading={enhancing === 'whatHappened'}
                  disabled={whatHappened.trim().length < 10}
                  failed={enhanceFailed === 'whatHappened'}
                  onClick={() => handleEnhance('whatHappened')}
                />
              </div>
            </div>
          )}

          {/* ── Step 3: Key lesson ── */}
          {step === 3 && (
            <div>
              {contextBar}
              <p className="text-text-muted text-xs mb-3">What will you do differently next time? What did this trade confirm?</p>
              <textarea
                rows={5}
                placeholder="My #1 takeaway is that I should wait for confirmation before…"
                value={keyLesson}
                onChange={(e) => setKeyLesson(e.target.value)}
                className="w-full rounded-2xl px-4 py-4 text-text text-base resize-none focus:outline-none leading-relaxed"
                style={{
                  backgroundColor: '#0D1520',
                  border: `1.5px solid ${keyLesson.length >= 5 ? 'rgba(245,184,0,0.3)' : '#1A2840'}`,
                }}
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-text-dim text-xs">{keyLesson.length} chars (min 5)</p>
                <EnhanceButton
                  loading={enhancing === 'keyLesson'}
                  disabled={keyLesson.trim().length < 5}
                  failed={enhanceFailed === 'keyLesson'}
                  onClick={() => handleEnhance('keyLesson')}
                />
              </div>
            </div>
          )}

          {/* ── Step 4: Feelings ── */}
          {step === 4 && (
            <div>
              {contextBar}
              <p className="text-text-muted text-xs uppercase tracking-widest mb-3">How did you feel during this trade?</p>
              <div className="grid grid-cols-5 gap-2 mb-7">
                {EMOTION_OPTIONS.map((e) => {
                  const Icon = EMOTION_ICON_MAP[e.value]
                  return (
                  <button
                    key={e.value}
                    onClick={() => setEmotion(e.value)}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all active:scale-95"
                    style={{
                      backgroundColor: emotion === e.value ? 'rgba(245,184,0,0.15)' : '#0D1520',
                      border: emotion === e.value ? '1.5px solid rgba(245,184,0,0.4)' : '1.5px solid #1A2840',
                    }}
                  >
                    <Icon size={36} />
                    <span className="text-xs font-medium leading-none" style={{ color: emotion === e.value ? '#E8EEFF' : '#5A7DA0' }}>
                      {e.label}
                    </span>
                  </button>
                  )
                })}
              </div>

              <p className="text-text-muted text-xs uppercase tracking-widest mb-1 text-center">How would you rate this trade?</p>
              <p className="text-text-dim text-xs text-center mb-3">1 = poor decisions · 5 = executed perfectly</p>
              <StarSelector value={rating} onChange={setRating} />
              <p className="text-center text-sm font-semibold mt-3" style={{ color: '#F5B800' }}>
                {['', 'Poor', 'Below Average', 'Average', 'Good', 'Excellent'][rating]}
              </p>
            </div>
          )}

          {/* ── Step 5: AI Mentor ── */}
          {step === 5 && (
            <div className="text-center">
              {generatingInsight ? (
                <div className="py-12 fade-in">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, rgba(245,184,0,0.2), rgba(245,184,0,0.05))',
                        border: '2px solid rgba(245,184,0,0.3)',
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="w-8 h-8 pulse-gold" style={{ color: '#F5B800' }} />
                    </div>
                  </div>
                  <p className="text-text font-bold text-lg mb-2">Analyzing your trade…</p>
                  <p className="text-text-muted text-sm">Your AI mentor is reviewing your journal</p>
                </div>
              ) : aiInsight ? (
                <div className="fade-in">
                  <div
                    className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 mb-6"
                    style={{
                      background: pnlData?.isWin ? 'rgba(0,200,150,0.15)' : 'rgba(255,61,90,0.15)',
                      border: `1px solid ${pnlData?.isWin ? 'rgba(0,200,150,0.3)' : 'rgba(255,61,90,0.3)'}`,
                    }}
                  >
                    {pnlData?.isWin
                    ? <TrendingUp className="w-6 h-6" style={{ color: '#00C896' }} />
                    : <TrendingDown className="w-6 h-6" style={{ color: '#FF3D5A' }} />
                  }
                    <span className="font-bold tabular text-xl" style={{ color: pnlData?.isWin ? '#00C896' : '#FF3D5A' }}>
                      {pnlData?.isWin ? '+' : '-'}${pnlData ? Math.abs(pnlData.pnl).toFixed(2) : '0.00'}
                    </span>
                  </div>

                  <div
                    className="rounded-2xl p-5 text-left mb-4"
                    style={{
                      background: 'linear-gradient(135deg, rgba(245,184,0,0.08), rgba(245,184,0,0.03))',
                      border: '1px solid rgba(245,184,0,0.2)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="w-4 h-4" style={{ color: '#F5B800' }} />
                      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#F5B800' }}>
                        Mentor Feedback
                      </p>
                    </div>
                    <p className="text-text text-sm leading-relaxed">{aiInsight}</p>
                  </div>

                  <p className="text-text-muted text-xs">Tap &ldquo;Save Trade&rdquo; to add this to your journal</p>
                </div>
              ) : null}
            </div>
          )}

        </div>
      </div>

      {/* ── CTA ── */}
      <div className="flex-shrink-0 px-5 pt-3 pb-safe">
        {step === 5 ? (
          <button
            onClick={handleSave}
            disabled={!aiInsight || saved}
            className="w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40"
            style={{ backgroundColor: '#F5B800', color: '#070B12' }}
          >
            {saved ? <><Check className="w-5 h-5" /> Saved!</> : 'Save Trade ✓'}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-30"
            style={{
              backgroundColor: canProceed() ? '#F5B800' : '#1A2840',
              color: canProceed() ? '#070B12' : '#5A7DA0',
            }}
          >
            {step === 4
              ? <><span>Get AI Feedback</span><Brain className="w-5 h-5" /></>
              : <><span>Continue</span><ChevronRight className="w-5 h-5" /></>
            }
          </button>
        )}
      </div>
    </div>
  )
}
