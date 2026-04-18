'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import {
  ArrowRight,
  Truck,
  Shield,
  RotateCcw,
  Headphones,
  Gamepad2,
  Zap,
  BatteryFull,
  Waves,
  Cpu,
  CheckCircle2,
} from 'lucide-react'
import CollectionSection from '@/components/marketing/collection-section'
import { useCollections } from '@/hooks/use-collections'
import { trackMetaEvent } from '@/lib/meta-pixel'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80'
const LIFESTYLE_IMAGE =
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80'
const GAMING_IMAGE =
  'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1600&q=80'
const AUDIO_IMAGE =
  'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1600&q=80'

export default function HomePage() {
  const { data: collections, isLoading } = useCollections()
  const [newsletterEmail, setNewsletterEmail] = useState('')

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail.trim()) return
    trackMetaEvent('Lead', {
      content_name: 'newsletter_signup',
      status: 'submitted',
    })
  }

  return (
    <>
      {/* Hero Section — Dark, tech-forward */}
      <section className="relative overflow-hidden bg-foreground text-background">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-40 -right-20 h-96 w-96 rounded-full bg-accent blur-[120px]" />
          <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-accent/60 blur-[120px]" />
        </div>

        <div className="container-custom relative grid lg:grid-cols-2 gap-10 items-center py-20 lg:py-32">
          <div className="space-y-7 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-background/20 bg-background/5 px-3 py-1.5 text-xs uppercase tracking-[0.2em] backdrop-blur">
              <Zap className="h-3 w-3 text-accent" strokeWidth={2.5} />
              New Season · Up to 25% Off
            </div>
            <h1 className="text-display font-heading font-bold text-balance">
              Sound & Control,
              <br />
              <span className="text-accent">Engineered</span> for You.
            </h1>
            <p className="text-lg text-background/70 max-w-md leading-relaxed">
              Studio-grade headphones, tournament-grade controllers, and featherlight earbuds —
              designed for everyone, built to last.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
                prefetch={true}
              >
                Shop the Collection
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products/volta-aero-pro-wireless-headphones"
                className="inline-flex items-center gap-2 border border-background/30 px-8 py-4 text-sm font-bold uppercase tracking-wide hover:bg-background hover:text-foreground transition-colors"
                prefetch={true}
              >
                Meet Aero Pro
              </Link>
            </div>

            {/* Hero stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-background/10 max-w-md">
              <div>
                <p className="text-2xl font-heading font-bold text-accent">40h</p>
                <p className="text-xs text-background/60 uppercase tracking-wider mt-1">Battery</p>
              </div>
              <div>
                <p className="text-2xl font-heading font-bold text-accent">Hi-Res</p>
                <p className="text-xs text-background/60 uppercase tracking-wider mt-1">Audio</p>
              </div>
              <div>
                <p className="text-2xl font-heading font-bold text-accent">2-Yr</p>
                <p className="text-xs text-background/60 uppercase tracking-wider mt-1">Warranty</p>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/5] lg:aspect-square rounded-sm overflow-hidden animate-fade-in">
            <Image
              src={HERO_IMAGE}
              alt="VOLTA Aero Pro Headphones"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-foreground/60 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* Category Split */}
      <section className="py-section">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">
              Shop by Category
            </p>
            <h2 className="mt-3 text-h2 font-heading font-semibold">Pick Your Playground</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/collections/audio"
              className="group relative aspect-[4/3] overflow-hidden rounded-sm bg-muted"
              prefetch={true}
            >
              <Image
                src={AUDIO_IMAGE}
                alt="Audio collection"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-background">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
                  <Headphones className="h-4 w-4" />
                  Audio
                </div>
                <h3 className="mt-2 text-h3 font-heading font-semibold">Immerse Yourself</h3>
                <p className="mt-1 text-sm text-background/80">
                  Headphones & earbuds with studio-grade sound
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                  Shop Audio
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>

            <Link
              href="/collections/gaming"
              className="group relative aspect-[4/3] overflow-hidden rounded-sm bg-muted"
              prefetch={true}
            >
              <Image
                src={GAMING_IMAGE}
                alt="Gaming collection"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-background">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
                  <Gamepad2 className="h-4 w-4" />
                  Gaming
                </div>
                <h3 className="mt-2 text-h3 font-heading font-semibold">Take Control</h3>
                <p className="mt-1 text-sm text-background/80">
                  Tournament-grade controllers & accessories
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                  Shop Gaming
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Collections from Medusa */}
      {isLoading ? (
        <section className="py-section-sm">
          <div className="container-custom">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[3/4] bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        </section>
      ) : collections && collections.length > 0 ? (
        <>
          {collections.map(
            (
              collection: {
                id: string
                handle: string
                title: string
                metadata?: Record<string, unknown>
              },
              index: number,
            ) => (
              <CollectionSection
                key={collection.id}
                collection={collection}
                alternate={index % 2 === 1}
              />
            ),
          )}
        </>
      ) : null}

      {/* Feature Grid — Why VOLTA */}
      <section className="py-section bg-muted/40">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">
              Engineered for Everyone
            </p>
            <h2 className="mt-3 text-h2 font-heading font-semibold">
              Features that matter.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every VOLTA product is built on four pillars — sound, control, battery, and comfort.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Waves,
                title: 'Hi-Res Audio',
                desc: 'LDAC-certified drivers that reveal every detail in your library.',
              },
              {
                icon: Cpu,
                title: 'Hall-Effect Precision',
                desc: 'Drift-free analog sticks rated for 10M+ cycles.',
              },
              {
                icon: BatteryFull,
                title: 'Marathon Battery',
                desc: 'Up to 40 hours per charge with 10-min fast charging.',
              },
              {
                icon: Shield,
                title: '2-Year Warranty',
                desc: 'Hassle-free replacements. We stand by what we build.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-background p-6 rounded-sm border hover:border-accent transition-colors group"
              >
                <feature.icon
                  className="h-8 w-8 text-accent mb-4"
                  strokeWidth={1.5}
                />
                <h3 className="font-heading font-semibold text-lg">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial / Brand Story */}
      <section className="py-section">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="aspect-[4/5] bg-muted rounded-sm overflow-hidden relative order-2 lg:order-1">
              <Image
                src={LIFESTYLE_IMAGE}
                alt="VOLTA lifestyle"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-6 lg:max-w-md order-1 lg:order-2">
              <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">
                Our Philosophy
              </p>
              <h2 className="text-h2 font-heading font-semibold">
                Built for every hand. Tuned for every ear.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We design electronics that don't compromise. From morning commutes to
                late-night ranked matches, every VOLTA product is tested by a diverse team
                to fit every head, every hand, and every lifestyle.
              </p>
              <ul className="space-y-3">
                {[
                  'Universal-fit ergonomics, tested on 300+ people',
                  'Premium materials — recycled aluminum & vegan leather',
                  'Carbon-neutral shipping on every order',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <CheckCircle2
                      className="h-5 w-5 text-accent flex-shrink-0 mt-0.5"
                      strokeWidth={1.5}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide link-underline pb-0.5"
                prefetch={true}
              >
                Our Story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-section-sm border-y bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            <div className="flex items-center gap-4 justify-center text-center md:text-left md:justify-start">
              <Truck className="h-6 w-6 flex-shrink-0 text-accent" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders over $75</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <RotateCcw className="h-6 w-6 flex-shrink-0 text-accent" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold">30-Day Returns</p>
                <p className="text-xs text-muted-foreground">No-questions-asked policy</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-end text-center md:text-right">
              <Shield className="h-6 w-6 flex-shrink-0 text-accent" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold">2-Year Warranty</p>
                <p className="text-xs text-muted-foreground">Included on every product</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter — Dark CTA */}
      <section className="py-section bg-foreground text-background">
        <div className="container-custom max-w-2xl text-center">
          <Zap className="h-8 w-8 text-accent mx-auto mb-4" strokeWidth={2} />
          <h2 className="text-h2 font-heading font-semibold">Get 10% off your first order</h2>
          <p className="mt-3 text-background/70">
            Join the VOLTA list for product drops, early access, and member-only deals.
          </p>
          <form
            className="mt-8 flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
            onSubmit={handleNewsletterSubmit}
          >
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 border border-background/30 bg-transparent px-4 py-3 text-sm placeholder:text-background/50 focus:border-accent focus:outline-none transition-colors"
              required
            />
            <button
              type="submit"
              className="bg-accent text-accent-foreground px-6 py-3 text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Get 10% Off
            </button>
          </form>
          <p className="mt-4 text-xs text-background/50">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </>
  )
}
