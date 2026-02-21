import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(req: NextRequest) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
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

    const prompt = `You are a direct, experienced trading mentor reviewing a young trader's journal entry. Be brief and specific.

Trade:
- ${trade.symbol} ${trade.direction} | ${resultStr}
- Why entered: "${trade.whyEntered}"
- What happened: "${trade.whatHappened}"
- Key lesson: "${trade.keyLesson}"
- Felt: ${trade.emotion} | Self-rated: ${trade.rating}/5

Write 2-3 sentences ONLY. Pick one specific thing from what they actually wrote — a strength or something to refine. End with one short reflection question for next time (not a tip — a genuine question that makes them think). Do NOT recap the trade numbers. Sound like a real person, not an AI coach.`

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
