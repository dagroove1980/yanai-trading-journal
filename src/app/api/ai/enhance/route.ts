import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const FIELD_LABELS: Record<string, string> = {
  whyEntered: 'why they entered the trade (their pre-trade thesis and reasoning)',
  whatHappened: 'what happened during the trade (the story of the trade)',
  keyLesson: 'the key lesson they learned from this trade',
}

export async function POST(req: NextRequest) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  try {
    const { field, content, context } = (await req.json()) as {
      field: string
      content: string
      context: { symbol: string; direction: string; pnl: number; isWin: boolean }
    }

    if (!content?.trim() || content.length < 5) {
      return NextResponse.json({ error: 'Content too short' }, { status: 400 })
    }

    const result = context.isWin
      ? `won $${Math.abs(context.pnl).toFixed(2)}`
      : `lost $${Math.abs(context.pnl).toFixed(2)}`

    const prompt = `You're helping a young trader lightly polish a single field in their trading journal. Your job is minimal editing only — NOT rewriting.

They wrote about ${FIELD_LABELS[field] || field}:
"${content}"

Trade context: ${context.symbol} ${context.direction} — they ${result}.

Rules:
- Keep at least 85% of their exact words and phrasing
- Fix grammar, punctuation, or awkward phrasing only
- Do NOT add any new ideas, insights, or details they didn't write
- Keep their first-person voice exactly as-is
- If their text is already clear, barely change it

Return ONLY the lightly polished text — no quotes, no explanation, no preamble.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 160,
      temperature: 0.7,
    })

    const enhanced = response.choices[0].message.content?.trim()
    return NextResponse.json({ enhanced })
  } catch (error) {
    console.error('AI enhance error:', error)
    return NextResponse.json({ error: 'Failed to enhance text' }, { status: 500 })
  }
}
