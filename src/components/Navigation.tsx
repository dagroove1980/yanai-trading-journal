'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Plus, Settings } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()

  // Hide nav in wizard and settings pages
  if (pathname === '/new-trade' || pathname === '/settings') return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div
        className="glass border-t border-border"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
      >
        <div className="flex items-center justify-around px-4 pt-3 pb-2 max-w-md mx-auto">
          {/* Home */}
          <Link
            href="/"
            className="flex flex-col items-center gap-1 transition-all active:scale-90"
          >
            <Home
              className="w-6 h-6 transition-colors"
              style={{ color: pathname === '/' ? '#F5B800' : '#5A7DA0' }}
            />
            <span
              className="text-xs font-medium transition-colors"
              style={{ color: pathname === '/' ? '#F5B800' : '#5A7DA0' }}
            >
              Home
            </span>
          </Link>

          {/* New Trade — center raised button */}
          <Link
            href="/new-trade"
            className="relative -top-5 w-16 h-16 rounded-full flex items-center justify-center active:scale-95 transition-transform gold-glow"
            style={{ backgroundColor: '#F5B800' }}
          >
            <Plus className="w-8 h-8" style={{ color: '#070B12' }} />
          </Link>

          {/* Journal */}
          <Link
            href="/journal"
            className="flex flex-col items-center gap-1 transition-all active:scale-90"
          >
            <BookOpen
              className="w-6 h-6 transition-colors"
              style={{ color: pathname === '/journal' ? '#F5B800' : '#5A7DA0' }}
            />
            <span
              className="text-xs font-medium transition-colors"
              style={{ color: pathname === '/journal' ? '#F5B800' : '#5A7DA0' }}
            >
              Journal
            </span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
