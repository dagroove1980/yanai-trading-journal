import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#070B12',
}

export const metadata: Metadata = {
  title: "Yanai's Trading Journal",
  description: 'Personal AI-powered trading journal — log trades, get mentor feedback, track your growth.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TradingJournal',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  )
}
