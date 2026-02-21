'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Plus, Lightbulb } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()

  if (pathname === '/new-trade') return null

  const active = (path: string) => pathname.startsWith(path) && path !== '/'
    ? '#F5B800'
    : pathname === path ? '#F5B800' : '#5A7DA0'

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div
        className="glass border-t border-border"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
      >
        {/* 5-column grid: left-tab | left-tab | + center | right-tab | right-tab */}
        <div
          className="max-w-md mx-auto items-center pt-3 pb-2"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 72px 1fr 1fr' }}
        >
          <Link href="/" className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
            <Home className="w-6 h-6" style={{ color: active('/') }} />
            <span className="text-xs font-medium" style={{ color: active('/') }}>Home</span>
          </Link>

          <Link href="/journal" className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
            <BookOpen className="w-6 h-6" style={{ color: active('/journal') }} />
            <span className="text-xs font-medium" style={{ color: active('/journal') }}>Journal</span>
          </Link>

          {/* New Trade — raised gold button in the exact center column */}
          <div className="flex justify-center">
            <Link
              href="/new-trade"
              className="relative -top-5 w-16 h-16 rounded-full flex items-center justify-center active:scale-95 transition-transform gold-glow"
              style={{ backgroundColor: '#F5B800' }}
            >
              <Plus className="w-8 h-8" style={{ color: '#070B12' }} />
            </Link>
          </div>

          <Link href="/training" className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
            <Lightbulb className="w-6 h-6" style={{ color: active('/training') }} />
            <span className="text-xs font-medium" style={{ color: active('/training') }}>Training</span>
          </Link>

          {/* Empty column — balances the layout symmetrically */}
          <div />
        </div>
      </div>
    </nav>
  )
}
