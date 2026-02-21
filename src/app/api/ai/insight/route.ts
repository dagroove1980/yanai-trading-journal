import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { trade } = (await req.json()) as {
      trade: {
        symbol: string
        direction: string
        entryPrice: number
        exitPrice: number
        quantity: number
        pnl: number
        pnlPercent: number
        isWin: boolean
        whyEntered: string
        whatHappened: string
        keyLesson: string
        emotion: string
        rating: number
      }
    }

    const resultStr = trade.isWin
      ? `✅ WIN: +$${Math.abs(trade.pnl).toFixed(2)} (+${Math.abs(trade.pnlPercent).toFixed(1)}%)`
      : `❌ LOSS: -$${Math.abs(trade.pnl).toFixed(2)} (-${Math.abs(trade.pnlPercent).toFixed(1)}%)`

    const prompt = `You are an experienced trading mentor reviewing a young, dedicated trader's journal entry. Be honest, specific, and genuinely encouraging — not generic.

Trade Details:
- Asset: ${trade.symbol} (${trade.direction} position)
- Entry: $${trade.entryPrice} → Exit: $${trade.exitPrice} | Qty: ${trade.quantity}
- Result: ${resultStr}
- Why I entered: "${trade.whyEntered}"
- What happened: "${trade.whatHappened}"
- Key lesson: "${trade.keyLesson}"
- Emotional state during trade: ${trade.emotion}
- Self-rating: ${trade.rating}/5

Write a mentor response (3-4 sentences) that:
1. Picks out ONE specific strength or insight from their entry and names it directly
2. Flags ONE concrete pattern or behavior to refine (be honest, even if the trade was a win)
3. Ends with one actionable tip or question to think about before their next trade

Sound like a real trading mentor — direct, warm, and specific. Not generic AI coach language.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 220,
      temperature: 0.85,
    })

    const insight = response.choices[0].message.content?.trim()
    return NextResponse.json({ insight })
  } catch (error) {
    console.error('AI insight error:', error)
    return NextResponse.json({
      insight:
        "Good self-awareness in this entry — that discipline of journaling is what separates improving traders from stagnant ones. Focus on your process rather than the outcome, and review this entry before your next similar setup.",
    })
  }
}
