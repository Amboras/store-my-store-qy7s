'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Check, Loader2, Gift, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { useCart } from '@/hooks/use-cart'
import { trackAddToCart } from '@/lib/analytics'
import { trackMetaEvent } from '@/lib/meta-pixel'

interface BundleOption {
  id: string
  label: string
  sub: string
  priceCents: number
  compareAtCents: number
  variantId: string
  quantity: number
  badge?: string
  savings?: string
  image?: string
}

interface BundleOfferProps {
  options: BundleOption[]
  defaultSelectedId: string
  currency?: string
}

function formatPrice(cents: number, currency = 'usd') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(cents / 100)
}

export default function BundleOffer({
  options,
  defaultSelectedId,
  currency = 'usd',
}: BundleOfferProps) {
  const [selectedId, setSelectedId] = useState(defaultSelectedId)
  const [justAdded, setJustAdded] = useState(false)
  const { addItem, isAddingItem } = useCart()

  const selected = options.find((o) => o.id === selectedId) || options[0]

  const handleAddToCart = () => {
    if (!selected?.variantId) return
    addItem(
      { variantId: selected.variantId, quantity: selected.quantity },
      {
        onSuccess: () => {
          setJustAdded(true)
          toast.success(`${selected.label} added to bag`)
          trackAddToCart(selected.variantId, selected.variantId, selected.quantity, selected.priceCents)
          trackMetaEvent('AddToCart', {
            content_ids: [selected.variantId],
            content_type: 'product',
            content_name: selected.label,
            value: selected.priceCents / 100,
            currency,
            num_items: selected.quantity,
          })
          setTimeout(() => setJustAdded(false), 2000)
        },
        onError: (err: Error) => {
          toast.error(err.message || 'Failed to add to bag')
        },
      },
    )
  }

  return (
    <div className="rounded-sm border-2 border-accent/30 bg-accent/5 p-5 space-y-4 relative overflow-hidden">
      <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-accent/10 blur-2xl" />

      <div className="flex items-center gap-2 relative">
        <Gift className="h-4 w-4 text-accent" strokeWidth={2} />
        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-accent">
          Exclusive Bundle Deal
        </h3>
      </div>

      <p className="text-sm text-muted-foreground relative">
        Upgrade your order and save. Pick an option below:
      </p>

      <div className="space-y-2.5 relative">
        {options.map((opt) => {
          const isSelected = opt.id === selectedId
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedId(opt.id)}
              className={`w-full text-left p-3 rounded-sm border-2 transition-all flex items-center gap-3 ${
                isSelected
                  ? 'border-accent bg-background shadow-sm'
                  : 'border-border bg-background/60 hover:border-foreground/40'
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 flex-shrink-0 ${
                  isSelected ? 'border-accent bg-accent' : 'border-border'
                }`}
              >
                {isSelected && <Check className="h-3 w-3 text-accent-foreground" strokeWidth={3} />}
              </span>

              {opt.image && (
                <div className="relative h-12 w-12 flex-shrink-0 rounded overflow-hidden bg-muted">
                  <Image src={opt.image} alt={opt.label} fill sizes="48px" className="object-cover" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold">{opt.label}</p>
                  {opt.badge && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider">
                      <Sparkles className="h-2.5 w-2.5" strokeWidth={2.5} />
                      {opt.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{opt.sub}</p>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold">{formatPrice(opt.priceCents, currency)}</p>
                {opt.compareAtCents > opt.priceCents && (
                  <p className="text-xs text-muted-foreground line-through">
                    {formatPrice(opt.compareAtCents, currency)}
                  </p>
                )}
                {opt.savings && (
                  <p className="text-[10px] font-bold text-accent uppercase mt-0.5">{opt.savings}</p>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isAddingItem}
        className={`relative w-full py-3.5 text-sm font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
          justAdded
            ? 'bg-green-700 text-white'
            : 'bg-accent text-accent-foreground hover:opacity-90'
        }`}
      >
        {isAddingItem ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : justAdded ? (
          <>
            <Check className="h-4 w-4" />
            Added to Bag
          </>
        ) : (
          <>Claim This Deal — {formatPrice(selected.priceCents, currency)}</>
        )}
      </button>
    </div>
  )
}
