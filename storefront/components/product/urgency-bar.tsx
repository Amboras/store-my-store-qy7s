'use client'

import { useEffect, useState } from 'react'
import { Flame, Clock, Eye } from 'lucide-react'

interface UrgencyBarProps {
  inventoryQuantity?: number | null
  productId: string
}

// Deterministic pseudo-random based on product ID so the numbers are stable per
// product but different across products (not true random — stays stable on
// re-renders and refresh).
function hashString(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

export default function UrgencyBar({ inventoryQuantity, productId }: UrgencyBarProps) {
  const h = hashString(productId)
  const viewersBase = 14 + (h % 22) // 14–35 viewers
  const soldToday = 6 + (h % 18) // 6–23 sold today

  const [viewers, setViewers] = useState(viewersBase)

  // Sale countdown — ends at midnight local time
  const [timeLeft, setTimeLeft] = useState<{ h: number; m: number; s: number }>({
    h: 0,
    m: 0,
    s: 0,
  })

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const end = new Date()
      end.setHours(23, 59, 59, 999)
      const diff = Math.max(0, end.getTime() - now.getTime())
      setTimeLeft({
        h: Math.floor(diff / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Live-viewer drift — fluctuates ±3 every 8 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setViewers((v) => {
        const delta = Math.floor(Math.random() * 7) - 3
        const next = v + delta
        return Math.max(viewersBase - 5, Math.min(viewersBase + 8, next))
      })
    }, 8000)
    return () => clearInterval(id)
  }, [viewersBase])

  const isLowStock =
    typeof inventoryQuantity === 'number' && inventoryQuantity > 0 && inventoryQuantity < 10

  const pad = (n: number) => n.toString().padStart(2, '0')

  return (
    <div className="space-y-2.5">
      {/* Sale countdown */}
      <div className="flex items-center gap-2 rounded-sm border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-sm">
        <Flame className="h-4 w-4 text-destructive flex-shrink-0" strokeWidth={2} />
        <span className="font-semibold text-destructive">Launch Sale ends in</span>
        <span className="ml-auto tabular-nums font-bold text-destructive">
          {pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}
        </span>
      </div>

      {/* Social proof row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <Eye className="h-3.5 w-3.5" />
          <span>
            <strong className="text-foreground">{viewers}</strong> people viewing now
          </span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          <span>
            <strong className="text-foreground">{soldToday}</strong> sold in the last 24 hrs
          </span>
        </span>
      </div>

      {/* Low stock */}
      {isLowStock && (
        <div className="rounded-sm bg-foreground text-background px-3 py-2 text-xs font-semibold flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          Only {inventoryQuantity} left in stock — order soon
        </div>
      )}
    </div>
  )
}
