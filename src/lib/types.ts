export type TradeDirection = 'long' | 'short'
export type TradeEmotion = 'fearful' | 'neutral' | 'confident' | 'greedy' | 'excited'
export type TradeRating = 1 | 2 | 3 | 4 | 5

export interface Trade {
  id: string
  createdAt: string
  date: string
  symbol: string
  direction: TradeDirection
  entryPrice: number
  exitPrice: number
  quantity: number
  pnl: number
  pnlPercent: number
  isWin: boolean
  whyEntered: string
  whatHappened: string
  keyLesson: string
  emotion: TradeEmotion
  rating: TradeRating
  aiInsight?: string
}

export interface EmotionOption {
  value: TradeEmotion
  emoji: string
  label: string
  color: string
}

export const EMOTION_OPTIONS: EmotionOption[] = [
  { value: 'fearful',   emoji: '😨', label: 'Fearful',   color: '#8B5CF6' },
  { value: 'neutral',   emoji: '😐', label: 'Neutral',   color: '#5A7DA0' },
  { value: 'confident', emoji: '😌', label: 'Confident', color: '#00C896' },
  { value: 'greedy',    emoji: '🤑', label: 'Greedy',    color: '#F59E0B' },
  { value: 'excited',   emoji: '🚀', label: 'Excited',   color: '#F5B800' },
]

export const WIZARD_STEPS = [
  { id: 'basics',   title: 'Trade Info',    subtitle: 'What did you trade?' },
  { id: 'why',      title: 'Your Thesis',   subtitle: 'Why did you enter?' },
  { id: 'what',     title: 'The Trade',     subtitle: 'What happened?' },
  { id: 'lesson',   title: 'Key Lesson',    subtitle: 'What did you learn?' },
  { id: 'feelings', title: 'Your Feelings', subtitle: 'How did it feel?' },
  { id: 'mentor',   title: 'AI Mentor',     subtitle: 'Personalized feedback' },
]
