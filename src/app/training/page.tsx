'use client'

import { useState, useMemo } from 'react'
import { Shuffle } from 'lucide-react'
import Navigation from '@/components/Navigation'

type Category = {
  id: string
  label: string
  color: string
  bg: string
}

const CATEGORIES: Category[] = [
  { id: 'mental',    label: '🧠 Mental Game',         color: '#A78BFA', bg: 'rgba(167,139,250,0.1)'  },
  { id: 'technical', label: '📐 Technical Analysis',  color: '#60A5FA', bg: 'rgba(96,165,250,0.1)'   },
  { id: 'risk',      label: '🛡️ Risk Management',     color: '#FF3D5A', bg: 'rgba(255,61,90,0.1)'    },
  { id: 'execution', label: '⚡ Trade Execution',      color: '#00C896', bg: 'rgba(0,200,150,0.1)'    },
  { id: 'habits',    label: '📓 Habits & Routine',    color: '#F5B800', bg: 'rgba(245,184,0,0.1)'    },
  { id: 'basics',    label: '📚 Trading Basics',      color: '#34D399', bg: 'rgba(52,211,153,0.1)'   },
  { id: 'strategies',label: '📈 Strategies',          color: '#F97316', bg: 'rgba(249,115,22,0.1)'   },
  { id: 'candles',   label: '🕯️ Candlesticks',        color: '#FB7185', bg: 'rgba(251,113,133,0.1)'  },
  { id: 'structure', label: '🏗️ Market Structure',    color: '#38BDF8', bg: 'rgba(56,189,248,0.1)'   },
  { id: 'concepts',  label: '💹 Key Concepts',        color: '#C084FC', bg: 'rgba(192,132,252,0.1)'  },
]

type Tip = { id: number; category: string; text: string }

const TIPS: Tip[] = [

  // ── Mental Game ─────────────────────────────────────────────────────────────
  { id: 1,  category: 'mental', text: 'Fear and greed are your biggest enemies. Before you enter, ask yourself: am I trading the chart or trading my emotions?' },
  { id: 2,  category: 'mental', text: 'A loss is tuition, not failure. The best traders in the world lose constantly — they just lose small and move on.' },
  { id: 3,  category: 'mental', text: 'Never revenge trade. If you lose and feel the urge to "get it back" immediately — close your screen and walk away. Come back tomorrow.' },
  { id: 4,  category: 'mental', text: 'Your P&L does not define your worth. A bad trade does not make you a bad person. Separate the outcome from your identity.' },
  { id: 5,  category: 'mental', text: 'If you can\'t explain your trade idea in one sentence, don\'t take it. Clarity of thought = clarity of execution.' },
  { id: 6,  category: 'mental', text: 'After 3 losses in a row, cut your size in half. Protect your capital and your confidence — both matter.' },

  // ── Technical Analysis ───────────────────────────────────────────────────────
  { id: 7,  category: 'technical', text: 'The trend is your best friend. Trade with the trend, not against it. Fighting the tape is the fastest way to lose money.' },
  { id: 8,  category: 'technical', text: 'Support and resistance are zones, not exact lines. Give them room. A stock can briefly poke through a level and still be valid.' },
  { id: 9,  category: 'technical', text: 'Volume confirms price. A breakout above resistance with no volume is a fake-out. Wait for the candle to close with conviction.' },
  { id: 10, category: 'technical', text: 'The best setups require patience. On most days, the right trade is no trade. Discipline to wait is a skill.' },
  { id: 11, category: 'technical', text: 'Higher highs + higher lows = uptrend. Lower highs + lower lows = downtrend. Don\'t overcomplicate it.' },
  { id: 12, category: 'technical', text: 'Never catch a falling knife. Wait for a base to form and sellers to exhaust before buying into a downtrend.' },

  // ── Risk Management ──────────────────────────────────────────────────────────
  { id: 13, category: 'risk', text: 'Never risk more than 1–2% of your total account on a single trade. One bad trade should never threaten your ability to trade tomorrow.' },
  { id: 14, category: 'risk', text: 'Set your stop loss BEFORE you enter. If you wait until after, emotions will always make your stop too wide.' },
  { id: 15, category: 'risk', text: 'Only take trades with at least a 2:1 risk-to-reward ratio. Make more when you\'re right than you lose when you\'re wrong.' },
  { id: 16, category: 'risk', text: 'Sizing down during a losing streak is not weakness — it\'s one of the smartest things a trader can do. Live to fight another day.' },
  { id: 17, category: 'risk', text: 'A 50% loss requires a 100% gain just to break even. Guard your account aggressively. It\'s easier to keep money than to earn it back.' },
  { id: 18, category: 'risk', text: 'Set a daily max loss limit before the market opens. When you hit it, you\'re done for the day. No exceptions, ever.' },

  // ── Trade Execution ──────────────────────────────────────────────────────────
  { id: 19, category: 'execution', text: 'Let winners run, cut losers fast. Most traders do the exact opposite. Train yourself to be uncomfortable holding winners.' },
  { id: 20, category: 'execution', text: 'Take partial profits at your first target. Lock in real money, then let the rest ride with a trailing stop.' },
  { id: 21, category: 'execution', text: 'Once you\'re up 1R on a trade, move your stop to breakeven. Never let a winning trade become a losing one.' },
  { id: 22, category: 'execution', text: 'Never widen your stop loss once you\'re in a trade. That\'s how small losses become account-destroying losses.' },
  { id: 23, category: 'execution', text: 'Know your exit before your entry. Where will you take profits? Where will you cut the loss? Decide before emotions take over.' },
  { id: 24, category: 'execution', text: 'The exit is harder than the entry. Spend as much time practicing how to get out of trades as you do finding them.' },

  // ── Habits & Routine ─────────────────────────────────────────────────────────
  { id: 25, category: 'habits', text: 'Review your trades every single week. Not just the losses — the wins too. If you don\'t study your patterns, you\'ll repeat them forever.' },
  { id: 26, category: 'habits', text: 'Build a pre-market routine. Scan the market, mark key levels, know what you\'re watching before the open. Prep kills impulsiveness.' },
  { id: 27, category: 'habits', text: 'This journal is your real edge. Most traders skip journaling. That\'s why most traders don\'t last. You\'re already ahead by using it.' },
  { id: 28, category: 'habits', text: 'Study one market and master it before adding more. Trying to trade everything is the same as trading nothing.' },
  { id: 29, category: 'habits', text: 'The best traders are bored most of the time. If you feel the need to always be in a trade, that\'s a sign you\'re addicted to action, not profit.' },
  { id: 30, category: 'habits', text: 'Sleep, exercise, and eating well are trading performance tools. Your brain on bad sleep makes worse decisions. Take care of the machine.' },

  // ── Trading Basics ───────────────────────────────────────────────────────────
  { id: 31, category: 'basics', text: 'The stock market is where buyers and sellers meet to trade shares of publicly listed companies. Price is set by supply and demand — nothing more.' },
  { id: 32, category: 'basics', text: 'A bull market is a rising market. A bear market is a falling market. Knowing which environment you\'re in changes everything about how you should trade.' },
  { id: 33, category: 'basics', text: 'Market orders execute immediately at the best available price. Limit orders execute only at your specified price. Use limit orders when you can — they give you control.' },
  { id: 34, category: 'basics', text: 'Bid = highest price a buyer will pay. Ask = lowest price a seller will accept. The spread is the gap between them. Liquid stocks have tight spreads.' },
  { id: 35, category: 'basics', text: 'Pre-market (4–9:30 AM ET) and after-hours (4–8 PM ET) have lower volume and wider spreads. Prices can be deceptive. Be extra cautious in these sessions.' },
  { id: 36, category: 'basics', text: 'Earnings reports are quarterly. Stocks can move 10–30% in minutes around earnings. Know when a stock reports before you enter a position.' },
  { id: 37, category: 'basics', text: 'A stock\'s float = shares available for public trading. Low-float stocks are volatile and can move 30–100% in a day. High-float stocks are more stable and slower.' },
  { id: 38, category: 'basics', text: 'Liquidity = how easily you can buy or sell without moving the price. Trade liquid markets so you can always get in and out without slippage.' },
  { id: 39, category: 'basics', text: 'The S&P 500 (SPY), Nasdaq (QQQ), and Dow Jones (DIA) are the three main US market indices. They\'re the pulse of the market. Watch them every day.' },
  { id: 40, category: 'basics', text: 'The first 15–30 minutes after the 9:30 AM open are the most volatile of the day. Momentum traders love it. Beginners should watch, not trade, until they understand the rhythm.' },

  // ── Strategies ───────────────────────────────────────────────────────────────
  { id: 41, category: 'strategies', text: 'Momentum trading: buy stocks moving up strongly with volume and a catalyst. Ride the wave and sell when momentum stalls. Best in trending markets.' },
  { id: 42, category: 'strategies', text: 'Breakout trading: wait for a stock to break above a key resistance level with a strong candle and volume. Enter, and target the next resistance level as your exit.' },
  { id: 43, category: 'strategies', text: 'Pullback trading: in an uptrend, wait for the stock to pull back to a support level (like a moving average or previous resistance), then buy the dip.' },
  { id: 44, category: 'strategies', text: 'Gap-and-go: stocks that gap up at the open on news/volume often continue higher. Buy the first consolidation after the open, stop below the gap, target measured move.' },
  { id: 45, category: 'strategies', text: 'Opening Range Breakout (ORB): mark the high and low of the first 15 minutes. Trade breakouts above/below that range with a stop on the other side.' },
  { id: 46, category: 'strategies', text: 'VWAP strategy: VWAP = Volume Weighted Average Price. Institutional traders use it as a benchmark. Price reclaiming VWAP from below is a bullish signal. Rejecting it from above is bearish.' },
  { id: 47, category: 'strategies', text: 'Swing trading: hold trades for days to weeks, capturing one leg of a larger move. Less screen time, less stress, but requires holding through small pullbacks.' },
  { id: 48, category: 'strategies', text: 'Mean reversion: stocks that move extremely far from their average tend to snap back. Works in ranging markets, but is very dangerous in strong trends. Context is everything.' },
  { id: 49, category: 'strategies', text: 'Trend following: identify the direction of the trend on a higher timeframe, then only take trades in that direction on lower timeframes. Simple and powerful.' },
  { id: 50, category: 'strategies', text: 'Whatever strategy you choose, master ONE before adding more. A trader with one great strategy beats a trader who half-understands five.' },

  // ── Candlesticks ─────────────────────────────────────────────────────────────
  { id: 51, category: 'candles', text: 'Green candle: close higher than open (buyers won). Red candle: close lower than open (sellers won). The body size shows conviction — a large body = strong move.' },
  { id: 52, category: 'candles', text: 'A Doji has almost the same open and close — tiny body, wicks on both sides. It means indecision. After a big move, a Doji can signal a pause or reversal.' },
  { id: 53, category: 'candles', text: 'Hammer: small body at the top, long lower wick, at the bottom of a downtrend. Buyers rejected lower prices. Bullish reversal signal — especially at support.' },
  { id: 54, category: 'candles', text: 'Shooting Star: small body at the bottom, long upper wick, at the top of an uptrend. Sellers pushed price down from the highs. Bearish reversal signal.' },
  { id: 55, category: 'candles', text: 'Bullish Engulfing: a large green candle fully swallows the previous red candle. Strong reversal signal — buyers completely overwhelmed sellers.' },
  { id: 56, category: 'candles', text: 'Bearish Engulfing: a large red candle swallows the previous green candle. Sellers took control. Most powerful at the top of a rally or at resistance.' },
  { id: 57, category: 'candles', text: 'Long upper wick = sellers pushed price down from the highs (bearish pressure). Long lower wick = buyers pushed price up from the lows (bullish pressure). Wicks tell the story.' },
  { id: 58, category: 'candles', text: 'Three White Soldiers: three consecutive large green candles, each closing near the high. Strong bullish reversal signal after a downtrend.' },
  { id: 59, category: 'candles', text: 'A Pin Bar (long wick, tiny body) at a key level is one of the highest-probability single-candle signals. The wick shows exactly where price was rejected.' },
  { id: 60, category: 'candles', text: 'Context beats pattern every time. A bullish candle at resistance means less than a bullish candle bouncing off strong support. Always zoom out.' },

  // ── Market Structure ─────────────────────────────────────────────────────────
  { id: 61, category: 'structure', text: 'Market structure = the pattern of highs and lows. Uptrend: higher highs + higher lows. Downtrend: lower highs + lower lows. When this pattern breaks, the trend is shifting.' },
  { id: 62, category: 'structure', text: 'Consolidation (or range) = price moves sideways between a clear support and resistance. It\'s the market "catching its breath." The longer the consolidation, the bigger the eventual breakout.' },
  { id: 63, category: 'structure', text: 'When support breaks, it often becomes resistance. When resistance breaks, it often becomes support. This "role reversal" is one of the most reliable concepts in all of trading.' },
  { id: 64, category: 'structure', text: 'Moving averages show the trend direction and act as dynamic support/resistance. The 20 EMA is popular for short-term traders. The 200 SMA separates bull and bear markets.' },
  { id: 65, category: 'structure', text: 'Higher timeframes always dominate lower timeframes. If the daily chart is in a downtrend, your 5-minute long setups are swimming against a strong current.' },
  { id: 66, category: 'structure', text: 'Multi-timeframe confluence: when daily, hourly, and 15-minute charts all agree on direction, you have the highest-probability setup. Wait for all three to align.' },
  { id: 67, category: 'structure', text: 'A key level that holds 3+ times is very powerful. Every time price tests and respects a level, more traders notice it — and the move is bigger when it eventually breaks.' },
  { id: 68, category: 'structure', text: 'Volume spikes at turning points are significant. A high-volume red bar at the bottom = capitulation — sellers exhausting themselves. That\'s when buyers take control.' },
  { id: 69, category: 'structure', text: 'Markets move in waves: impulse moves (strong, directional) and corrective moves (pullbacks). The goal is to trade the impulse and sit out the correction.' },
  { id: 70, category: 'structure', text: 'The 52-week high and low are massive psychological levels. Breakouts above 52-week highs often lead to big moves — institutions notice, media covers it, buyers pile in.' },

  // ── Key Concepts ─────────────────────────────────────────────────────────────
  { id: 71, category: 'concepts', text: 'Leverage amplifies both gains AND losses. 2x leverage means a 5% loss in the asset = 10% loss in your account. Never use more leverage than you fully understand.' },
  { id: 72, category: 'concepts', text: 'Short selling = borrowing shares to sell them, hoping to buy back cheaper. Your max gain is 100% (stock goes to zero). Your max loss is unlimited (stock can go to infinity). Treat shorts with extreme respect.' },
  { id: 73, category: 'concepts', text: 'Slippage = the difference between the price you expected and the price you got. Happens in fast markets and illiquid stocks. Factor it into your risk calculations.' },
  { id: 74, category: 'concepts', text: 'Drawdown = the peak-to-trough decline in your account. A 25% drawdown needs a 33% gain to recover. A 50% drawdown needs 100%. Limit drawdowns relentlessly.' },
  { id: 75, category: 'concepts', text: 'Commissions and fees eat into profits. If you\'re targeting $0.10/share and paying $0.01/share in fees, that\'s 10% of your gain gone. Know your exact cost per trade.' },
  { id: 76, category: 'concepts', text: 'Paper trading = practicing with fake money. Great for testing strategies without real risk. But beware: real money adds emotions paper trading can\'t simulate.' },
  { id: 77, category: 'concepts', text: 'A catalyst = news or event that moves a stock (earnings, FDA approval, product launch, analyst upgrade). The best momentum trades have a clear catalyst behind them.' },
  { id: 78, category: 'concepts', text: 'R = your risk per trade (the dollar amount from entry to stop). A 2R winner means you made 2x your risk. Track all trades in R multiples to separate skill from luck.' },
  { id: 79, category: 'concepts', text: 'Expectancy = (Win Rate × Avg Win) − (Loss Rate × Avg Loss). A system with 40% win rate can be very profitable if average wins are 3x average losses. The math wins over time.' },
  { id: 80, category: 'concepts', text: 'Never average down on a loser unless it was your planned strategy from the start. "It can\'t go lower" has blown up more accounts than any other thought in trading.' },
]

// ─── Component ──────────────────────────────────────────────────────────────

export default function TrainingPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [randomTip, setRandomTip] = useState<Tip | null>(null)
  const [randomKey, setRandomKey] = useState(0)

  const filtered = useMemo(
    () => activeCategory === 'all' ? TIPS : TIPS.filter(t => t.category === activeCategory),
    [activeCategory]
  )

  const catMap = Object.fromEntries(CATEGORIES.map(c => [c.id, c]))

  const handleRandom = () => {
    const pool = activeCategory === 'all' ? TIPS : filtered
    let pick = pool[Math.floor(Math.random() * pool.length)]
    // avoid repeating same tip
    if (randomTip && pool.length > 1) {
      while (pick.id === randomTip.id) {
        pick = pool[Math.floor(Math.random() * pool.length)]
      }
    }
    setRandomTip(pick)
    setRandomKey(k => k + 1)
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="px-5 pt-safe pb-4">
        <h1 className="text-3xl font-bold text-text mb-1">Training</h1>
        <p className="text-text-muted text-sm">80 lessons across 10 categories</p>
      </div>

      {/* Random tip button */}
      <div className="px-5 mb-5">
        <button
          onClick={handleRandom}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-base active:scale-95 transition-transform"
          style={{ backgroundColor: '#F5B800', color: '#070B12' }}
        >
          <Shuffle className="w-5 h-5" />
          Random Lesson
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
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: catMap[randomTip.category]?.color }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#F5B800' }}>
                {catMap[randomTip.category]?.label}
              </span>
            </div>
            <p className="text-text text-base leading-relaxed">{randomTip.text}</p>
          </div>
        </div>
      )}

      {/* Category filter — horizontal scroll */}
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
            All 80
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
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                    <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: cat.color }}>
                      {cat.label}
                    </h2>
                    <span className="text-xs" style={{ color: cat.color, opacity: 0.6 }}>
                      {catTips.length}
                    </span>
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
  const isLong = tip.text.length > 120

  return (
    <button
      onClick={() => isLong && setExpanded(e => !e)}
      className="w-full text-left rounded-2xl p-4 transition-all active:scale-[0.98]"
      style={{ backgroundColor: '#0D1520', border: '1px solid #1A2840' }}
    >
      <div className="flex gap-3 items-start">
        <div
          className="shrink-0 w-1 self-stretch rounded-full mt-0.5"
          style={{ backgroundColor: cat.color, minHeight: '16px' }}
        />
        <p
          className="text-text text-sm leading-relaxed"
          style={
            expanded
              ? undefined
              : { display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3, overflow: 'hidden' } as React.CSSProperties
          }
        >
          {tip.text}
        </p>
      </div>
      {isLong && (
        <p className="text-xs font-semibold mt-2 ml-4" style={{ color: cat.color, opacity: 0.8 }}>
          {expanded ? 'Show less ↑' : 'Read more ↓'}
        </p>
      )}
    </button>
  )
}
