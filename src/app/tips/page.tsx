'use client'

import { useState, useMemo } from 'react'
import { Shuffle } from 'lucide-react'
import Navigation from '@/components/Navigation'

// ─── Tip data ───────────────────────────────────────────────────────────────

type Category = {
  id: string
  label: string
  color: string
  bg: string
  border: string
}

const CATEGORIES: Category[] = [
  { id: 'mental',    label: '🧠 Mental Game',         color: '#A78BFA', bg: 'rgba(167,139,250,0.1)',  border: 'rgba(167,139,250,0.25)' },
  { id: 'technical', label: '📐 Technical Analysis',  color: '#60A5FA', bg: 'rgba(96,165,250,0.1)',   border: 'rgba(96,165,250,0.25)'  },
  { id: 'risk',      label: '🛡️ Risk Management',     color: '#FF3D5A', bg: 'rgba(255,61,90,0.1)',    border: 'rgba(255,61,90,0.25)'   },
  { id: 'execution', label: '⚡ Trade Execution',      color: '#00C896', bg: 'rgba(0,200,150,0.1)',    border: 'rgba(0,200,150,0.25)'   },
  { id: 'habits',    label: '📓 Habits & Routine',    color: '#F5B800', bg: 'rgba(245,184,0,0.1)',    border: 'rgba(245,184,0,0.25)'   },
]

type Tip = { id: number; category: string; text: string }

const TIPS: Tip[] = [
  // Mental Game
  { id: 1,  category: 'mental', text: 'Fear and greed are your biggest enemies. Before you enter, ask yourself: am I trading the chart or trading my emotions?' },
  { id: 2,  category: 'mental', text: 'A loss is tuition, not failure. The best traders in the world lose constantly — they just lose small and move on.' },
  { id: 3,  category: 'mental', text: 'Never revenge trade. If you lose and feel the urge to "get it back" immediately — close your screen and walk away. Come back tomorrow.' },
  { id: 4,  category: 'mental', text: 'Your P&L does not define your worth. A bad trade does not make you a bad person. Separate the outcome from your identity.' },
  { id: 5,  category: 'mental', text: 'If you can\'t explain your trade idea in one sentence, don\'t take it. Clarity of thought = clarity of execution.' },
  { id: 6,  category: 'mental', text: 'After 3 losses in a row, cut your size in half. Protect your capital and your confidence — both matter.' },

  // Technical Analysis
  { id: 7,  category: 'technical', text: 'The trend is your best friend. Trade with the trend, not against it. Fighting the tape is the fastest way to lose money.' },
  { id: 8,  category: 'technical', text: 'Support and resistance are zones, not exact lines. Give them room. A stock can briefly poke through a level and still be valid.' },
  { id: 9,  category: 'technical', text: 'Volume confirms price. A breakout above resistance with no volume is a fake-out. Wait for the candle to close with conviction.' },
  { id: 10, category: 'technical', text: 'The best setups require patience. On most days, the right trade is no trade. Discipline to wait is a skill.' },
  { id: 11, category: 'technical', text: 'Higher highs + higher lows = uptrend. Lower highs + lower lows = downtrend. Don\'t overcomplicate it.' },
  { id: 12, category: 'technical', text: 'Never catch a falling knife. Wait for a base to form and sellers to exhaust before buying into a downtrend.' },

  // Risk Management
  { id: 13, category: 'risk', text: 'Never risk more than 1–2% of your total account on a single trade. One bad trade should never threaten your ability to trade tomorrow.' },
  { id: 14, category: 'risk', text: 'Set your stop loss BEFORE you enter. If you wait until after, emotions will always make your stop too wide.' },
  { id: 15, category: 'risk', text: 'Only take trades with at least a 2:1 risk-to-reward ratio. Make more when you\'re right than you lose when you\'re wrong.' },
  { id: 16, category: 'risk', text: 'Sizing down during a losing streak is not weakness — it\'s one of the smartest things a trader can do. Live to fight another day.' },
  { id: 17, category: 'risk', text: 'A 50% loss requires a 100% gain just to break even. Guard your account aggressively. It\'s easier to keep money than to earn it back.' },
  { id: 18, category: 'risk', text: 'Set a daily max loss limit before the market opens. When you hit it, you\'re done for the day. No exceptions, ever.' },

  // Trade Execution
  { id: 19, category: 'execution', text: 'Let winners run, cut losers fast. Most traders do the exact opposite. Train yourself to be uncomfortable holding winners.' },
  { id: 20, category: 'execution', text: 'Take partial profits at your first target. Lock in real money, then let the rest ride with a trailing stop.' },
  { id: 21, category: 'execution', text: 'Once you\'re up 1R on a trade, move your stop to breakeven. Never let a winning trade become a losing one.' },
  { id: 22, category: 'execution', text: 'Never widen your stop loss once you\'re in a trade. That\'s how small losses become account-destroying losses.' },
  { id: 23, category: 'execution', text: 'Know your exit before your entry. Where will you take profits? Where will you cut the loss? Decide before emotions take over.' },
  { id: 24, category: 'execution', text: 'The exit is harder than the entry. Spend as much time practicing how to get out of trades as you do finding them.' },

  // Habits & Routine
  { id: 25, category: 'habits', text: 'Review your trades every single week. Not just the losses — the wins too. If you don\'t study your patterns, you\'ll repeat them forever.' },
  { id: 26, category: 'habits', text: 'Build a pre-market routine. Scan the market, mark key levels, know what you\'re watching before the open. Prep kills impulsiveness.' },
  { id: 27, category: 'habits', text: 'This journal is your real edge. Most traders skip journaling. That\'s why most traders don\'t last. You\'re already ahead by using it.' },
  { id: 28, category: 'habits', text: 'Study one market and master it before adding more. Trying to trade everything is the same as trading nothing.' },
  { id: 29, category: 'habits', text: 'The best traders are bored most of the time. If you feel the need to always be in a trade, that\'s a sign you\'re addicted to action, not profit.' },
  { id: 30, category: 'habits', text: 'Sleep, exercise, and eating well are trading performance tools. Your brain on bad sleep makes worse decisions. Take care of the machine.' },
]

// ─── Component ──────────────────────────────────────────────────────────────

export default function TipsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [randomTip, setRandomTip] = useState<Tip | null>(null)
  const [randomKey, setRandomKey] = useState(0)

  const filtered = useMemo(
    () => activeCategory === 'all' ? TIPS : TIPS.filter(t => t.category === activeCategory),
    [activeCategory]
  )

  const handleRandom = () => {
    const pool = activeCategory === 'all' ? TIPS : filtered
    const pick = pool[Math.floor(Math.random() * pool.length)]
    setRandomTip(pick)
    setRandomKey(k => k + 1)
  }

  const catMap = Object.fromEntries(CATEGORIES.map(c => [c.id, c]))

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="px-5 pt-safe pb-4">
        <h1 className="text-3xl font-bold text-text mb-1">Trader Tips</h1>
        <p className="text-text-muted text-sm">30 lessons to sharpen your edge</p>
      </div>

      {/* Random tip button */}
      <div className="px-5 mb-5">
        <button
          onClick={handleRandom}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-base active:scale-95 transition-transform"
          style={{ backgroundColor: '#F5B800', color: '#070B12' }}
        >
          <Shuffle className="w-5 h-5" />
          Show Random Tip
        </button>
      </div>

      {/* Random tip card */}
      {randomTip && (
        <div className="px-5 mb-6" key={randomKey}>
          <div
            className="rounded-2xl p-5 fade-in"
            style={{
              background: 'linear-gradient(135deg, rgba(245,184,0,0.12), rgba(245,184,0,0.04))',
              border: '1.5px solid rgba(245,184,0,0.3)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: catMap[randomTip.category]?.color }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#F5B800' }}>
                Random Tip · {catMap[randomTip.category]?.label}
              </span>
            </div>
            <p className="text-text text-base leading-relaxed">{randomTip.text}</p>
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className="px-5 mb-5">
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          <button
            onClick={() => setActiveCategory('all')}
            className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all active:scale-95"
            style={{
              backgroundColor: activeCategory === 'all' ? '#F5B800' : '#0D1520',
              color: activeCategory === 'all' ? '#070B12' : '#5A7DA0',
              border: activeCategory === 'all' ? 'none' : '1px solid #1A2840',
            }}
          >
            All 30
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all active:scale-95"
              style={{
                backgroundColor: activeCategory === cat.id ? cat.color : '#0D1520',
                color: activeCategory === cat.id ? '#070B12' : '#5A7DA0',
                border: activeCategory === cat.id ? 'none' : '1px solid #1A2840',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tips list */}
      <div className="px-5">
        {activeCategory === 'all'
          ? CATEGORIES.map(cat => {
              const catTips = TIPS.filter(t => t.category === cat.id)
              return (
                <div key={cat.id} className="mb-7">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: cat.color }}>
                      {cat.label}
                    </h2>
                  </div>
                  <div className="space-y-2.5">
                    {catTips.map(tip => (
                      <TipCard key={tip.id} tip={tip} cat={cat} />
                    ))}
                  </div>
                </div>
              )
            })
          : (
            <div className="space-y-2.5 mb-6">
              {filtered.map(tip => (
                <TipCard key={tip.id} tip={tip} cat={catMap[tip.category]} />
              ))}
            </div>
          )
        }
      </div>

      <Navigation />
      <div className="h-28" />
    </div>
  )
}

function TipCard({ tip, cat }: { tip: Tip; cat: Category }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = tip.text.length > 100

  return (
    <button
      onClick={() => isLong && setExpanded(e => !e)}
      className="w-full text-left rounded-2xl p-4 transition-all active:scale-[0.98]"
      style={{ backgroundColor: '#0D1520', border: `1px solid #1A2840` }}
    >
      <div className="flex gap-3 items-start">
        <div
          className="shrink-0 w-1 self-stretch rounded-full mt-0.5"
          style={{ backgroundColor: cat.color, minHeight: '16px' }}
        />
        <p
          className="text-text text-sm leading-relaxed"
          style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: expanded ? 'unset' : 3, overflow: expanded ? 'visible' : 'hidden' } as React.CSSProperties}
        >
          {tip.text}
        </p>
      </div>
      {isLong && (
        <p className="text-xs font-semibold mt-2 ml-4" style={{ color: cat.color }}>
          {expanded ? 'Show less' : 'Read more'}
        </p>
      )}
    </button>
  )
}
