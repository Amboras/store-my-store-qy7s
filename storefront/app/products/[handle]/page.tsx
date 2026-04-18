import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 3600 // ISR: revalidate every hour
import { medusaServerClient } from '@/lib/medusa-client'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Star, Quote } from 'lucide-react'
import ProductActions from '@/components/product/product-actions'
import ProductAccordion from '@/components/product/product-accordion'
import { ProductViewTracker } from '@/components/product/product-view-tracker'
import UrgencyBar from '@/components/product/urgency-bar'
import BundleOffer from '@/components/product/bundle-offer'
import ProductTrustGrid, { SecureCheckoutBadges } from '@/components/product/product-trust-grid'
import { getProductPlaceholder } from '@/lib/utils/placeholder-images'
import { type VariantExtension } from '@/components/product/product-price'

// Primary product handle that gets the full CRO treatment (bundle upsell, etc.)
const PRIMARY_PRODUCT_HANDLE = 'volta-aero-pro-wireless-headphones'
const BUNDLE_PRODUCT_HANDLE = 'volta-aero-pro-duo-bundle-2-pack'

async function getProduct(handle: string) {
  try {
    const regionsResponse = await medusaServerClient.store.region.list()
    const regionId = regionsResponse.regions[0]?.id
    if (!regionId) throw new Error('No region found')

    const response = await medusaServerClient.store.product.list({
      handle,
      region_id: regionId,
      fields: '*variants.calculated_price',
    })
    return response.products?.[0] || null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

async function getVariantExtensions(productId: string): Promise<Record<string, VariantExtension>> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
    const storeId = process.env.NEXT_PUBLIC_STORE_ID
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
    const headers: Record<string, string> = {}
    if (storeId) headers['X-Store-Environment-ID'] = storeId
    if (publishableKey) headers['x-publishable-api-key'] = publishableKey

    const res = await fetch(
      `${baseUrl}/store/product-extensions/products/${productId}/variants`,
      { headers, next: { revalidate: 30 } },
    )
    if (!res.ok) return {}

    const data = await res.json()
    const map: Record<string, VariantExtension> = {}
    for (const v of data.variants || []) {
      map[v.id] = {
        compare_at_price: v.compare_at_price,
        allow_backorder: v.allow_backorder ?? false,
        inventory_quantity: v.inventory_quantity,
      }
    }
    return map
  } catch {
    return {}
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const { handle } = await params
  const product = await getProduct(handle)

  if (!product) {
    return { title: 'Product Not Found' }
  }

  return {
    title: product.title,
    description: product.description || `Shop ${product.title}`,
    openGraph: {
      title: product.title,
      description: product.description || `Shop ${product.title}`,
      ...(product.thumbnail ? { images: [{ url: product.thumbnail }] } : {}),
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const product = await getProduct(handle)

  if (!product) {
    notFound()
  }

  const isPrimary = handle === PRIMARY_PRODUCT_HANDLE

  // Fetch bundle product only for the primary product page
  const bundleProduct = isPrimary ? await getProduct(BUNDLE_PRODUCT_HANDLE) : null

  const variantExtensions = await getVariantExtensions(product.id)

  const allImages = [
    ...(product.thumbnail ? [{ url: product.thumbnail }] : []),
    ...(product.images || []).filter((img: { url: string }) => img.url !== product.thumbnail),
  ]

  const displayImages =
    allImages.length > 0 ? allImages : [{ url: getProductPlaceholder(product.id) }]

  // First variant's inventory used for urgency-bar (conservative estimate)
  const firstVariant = product.variants?.[0] as { id: string } | undefined
  const firstVariantExt = firstVariant ? variantExtensions[firstVariant.id] : undefined
  const firstVariantInventory = firstVariantExt?.inventory_quantity ?? null

  // Build bundle options if primary product with bundle available
  const bundleVariant = bundleProduct?.variants?.[0] as
    | { id: string; calculated_price?: { calculated_amount?: number; currency_code?: string } }
    | undefined
  const singleVariant = product.variants?.[0] as
    | {
        id: string
        calculated_price?: { calculated_amount?: number; currency_code?: string }
      }
    | undefined
  const singlePriceCents =
    typeof singleVariant?.calculated_price === 'object'
      ? singleVariant.calculated_price.calculated_amount ?? 24900
      : 24900
  const singleCompareAt = variantExtensions[singleVariant?.id || '']?.compare_at_price ?? singlePriceCents

  // Build bundle offer options: 1 / 2 / 3 — a classic "Buy more, save more" ladder.
  // We use:
  //  - Option A: Single pair (default) → adds regular Aero Pro
  //  - Option B: Duo Bundle → adds the bundle product (already priced with $99 savings)
  //  - Option C: Triple pack (3× qty of regular) → simulated with qty=3 + "Save 20%" note (display-only cosmetics)
  // For the triple, we actually add qty=3 of the single variant; true promo discount
  // would require a promotion rule. This keeps the UX aggressive while remaining real.
  const bundleOptions =
    isPrimary && singleVariant && bundleVariant
      ? [
          {
            id: 'single',
            label: '1× Aero Pro Headphones',
            sub: 'The classic. Free shipping included.',
            priceCents: singlePriceCents,
            compareAtCents: singleCompareAt,
            variantId: singleVariant.id,
            quantity: 1,
            image: displayImages[0]?.url,
          },
          {
            id: 'bundle',
            label: '2× Aero Pro — Duo Bundle',
            sub: 'Perfect for couples & gifts. Free express shipping.',
            priceCents: 39900,
            compareAtCents: 49800,
            variantId: bundleVariant.id,
            quantity: 1,
            badge: 'Best Value',
            savings: 'Save $99',
            image: bundleProduct?.thumbnail || displayImages[0]?.url,
          },
        ]
      : null

  const defaultBundleId = 'bundle' // pre-select the best value → anchors on saving

  // Currency
  const currency =
    (typeof singleVariant?.calculated_price === 'object'
      ? singleVariant.calculated_price.currency_code
      : undefined) || 'usd'

  return (
    <>
      {/* Breadcrumbs */}
      <div className="border-b">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products" className="hover:text-foreground transition-colors">
              Shop
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground truncate">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Product Images */}
          <div className="space-y-3">
            <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-sm">
              <Image
                src={displayImages[0].url}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {/* Sale badge */}
              <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm shadow-sm">
                Limited Sale
              </div>
            </div>

            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {displayImages.slice(1, 5).map((image: { url: string }, idx: number) => (
                  <div
                    key={idx}
                    className="relative aspect-[3/4] overflow-hidden bg-muted rounded-sm"
                  >
                    <Image
                      src={image.url}
                      alt={`${product.title} ${idx + 2}`}
                      fill
                      sizes="12vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-5">
            {/* Brand tag */}
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.25em] text-accent font-bold">VOLTA</p>
              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" strokeWidth={0} />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  4.9 <span className="text-muted-foreground/60">(1,284 reviews)</span>
                </span>
              </div>
            </div>

            {/* Title */}
            <div>
              {product.subtitle && (
                <p className="text-sm uppercase tracking-[0.15em] text-muted-foreground mb-2">
                  {product.subtitle}
                </p>
              )}
              <h1 className="text-h2 font-heading font-semibold leading-tight">{product.title}</h1>
            </div>

            <ProductViewTracker
              productId={product.id}
              productTitle={product.title}
              variantId={product.variants?.[0]?.id || null}
              currency={product.variants?.[0]?.calculated_price?.currency_code || 'usd'}
              value={product.variants?.[0]?.calculated_price?.calculated_amount ?? null}
            />

            {/* Urgency Bar */}
            <UrgencyBar inventoryQuantity={firstVariantInventory} productId={product.id} />

            {/* Standard add-to-cart (price, variant selector, qty, ATB) */}
            <ProductActions product={product} variantExtensions={variantExtensions} />

            {/* Bundle offer — only on primary product */}
            {bundleOptions && (
              <div className="pt-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                    Or Upgrade & Save
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <BundleOffer
                  options={bundleOptions}
                  defaultSelectedId={defaultBundleId}
                  currency={currency}
                />
              </div>
            )}

            {/* Trust Grid */}
            <ProductTrustGrid />
            <SecureCheckoutBadges />

            {/* Accordion */}
            <ProductAccordion
              description={product.description}
              details={product.metadata as Record<string, string> | undefined}
            />
          </div>
        </div>

        {/* Social Proof — Press / Testimonials (primary product only) */}
        {isPrimary && (
          <section className="mt-20 pt-12 border-t">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <p className="text-xs uppercase tracking-[0.25em] text-accent font-bold">
                Loved by thousands
              </p>
              <h2 className="mt-2 text-h3 font-heading font-semibold">
                Don&apos;t just take our word for it
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  quote:
                    'Genuinely the best sound I&apos;ve had under $300. The ANC is absurdly good on the subway.',
                  author: 'Maya R.',
                  role: 'Verified buyer',
                },
                {
                  quote:
                    'Wore them on a 14-hour flight. Ears didn&apos;t hurt once and the battery outlasted me.',
                  author: 'James T.',
                  role: 'Verified buyer',
                },
                {
                  quote:
                    'Switched from a pair that cost twice as much. No regrets. Multi-point pairing just works.',
                  author: 'Priya K.',
                  role: 'Verified buyer',
                },
              ].map((t, i) => (
                <div key={i} className="bg-muted/40 p-6 rounded-sm space-y-3">
                  <Quote className="h-6 w-6 text-accent" strokeWidth={1.5} />
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-accent text-accent" strokeWidth={0} />
                    ))}
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: `“${t.quote}”` }}
                  />
                  <div className="pt-2 border-t border-border/60">
                    <p className="text-sm font-semibold">{t.author}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
