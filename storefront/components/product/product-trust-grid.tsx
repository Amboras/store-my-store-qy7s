import { Truck, RotateCcw, Shield, Lock, BadgeCheck, Headphones } from 'lucide-react'

export default function ProductTrustGrid() {
  const items = [
    {
      icon: Truck,
      title: 'Free Shipping',
      desc: 'On orders $75+',
    },
    {
      icon: RotateCcw,
      title: '30-Day Returns',
      desc: 'No-questions-asked',
    },
    {
      icon: Shield,
      title: '2-Year Warranty',
      desc: 'Full coverage',
    },
    {
      icon: BadgeCheck,
      title: 'Authentic',
      desc: 'Direct from VOLTA',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-5 border-y">
      {items.map((item) => (
        <div key={item.title} className="text-center px-1">
          <item.icon className="h-5 w-5 mx-auto mb-1.5 text-accent" strokeWidth={1.75} />
          <p className="text-xs font-semibold">{item.title}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
        </div>
      ))}
    </div>
  )
}

export function SecureCheckoutBadges() {
  return (
    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
      <span className="inline-flex items-center gap-1.5">
        <Lock className="h-3.5 w-3.5" strokeWidth={2} />
        SSL Encrypted Checkout
      </span>
      <span className="h-3 w-px bg-border" />
      <span className="inline-flex items-center gap-1.5">
        <Headphones className="h-3.5 w-3.5" strokeWidth={2} />
        24/7 Support
      </span>
    </div>
  )
}
