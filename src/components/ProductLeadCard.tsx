import Link from 'next/link'
import React from 'react'
import { ArrowRight, Truck, Waves, Wrench } from 'lucide-react'

import type { Product } from '@/payload-types'

import { Media } from '@/components/Media'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'

export type ProductLeadCardData = Pick<
  Product,
  | 'id'
  | 'title'
  | 'model'
  | 'summary'
  | 'primaryImage'
  | 'secondaryImage'
  | 'isFeatured'
  | 'specs'
  | 'slug'
  | 'primaryCategory'
  | 'additionalCategories'
>

type ApplicationTag = {
  icon: React.ComponentType<{ className?: string }>
  label: string
}

const additionalInfo = [
  { label: 'Customization', value: 'OEM / private label support' },
  { label: 'MOQ', value: 'Flexible by strap spec' },
  { label: 'Lead Time', value: 'Shared with quotation' },
] as const

const specMatchers = {
  application: ['application', 'use', 'use case', 'scenario', 'fitment', 'industry'],
  breakStrength: ['break', 'strength', 'load', 'capacity', 'working load'],
  length: ['length', 'strap', 'size', 'extension'],
} as const

const fallbackSpecs = {
  application: 'Pickup, powersports, marine rigs',
  breakStrength: 'Engineered for demanding cargo loads',
  length: 'Multiple lengths and end fittings',
} as const

function findSpecValue(
  specs: ProductLeadCardData['specs'],
  matchers: readonly string[],
): string | undefined {
  const match = specs?.find((spec) => {
    const label = spec.label.toLowerCase()

    return matchers.some((matcher) => label.includes(matcher))
  })

  return match?.value
}

function getApplicationTags(product: ProductLeadCardData): ApplicationTag[] {
  const source = `${findSpecValue(product.specs, specMatchers.application) || ''} ${product.summary || ''}`.toLowerCase()

  const tags: ApplicationTag[] = []

  if (source.includes('pickup') || source.includes('trailer') || source.includes('cargo')) {
    tags.push({ icon: Truck, label: 'Pickup / Trailer' })
  }

  if (
    source.includes('motorcycle') ||
    source.includes('powersport') ||
    source.includes('off-road') ||
    source.includes('camp')
  ) {
    tags.push({ icon: Wrench, label: 'Off-Road / Moto' })
  }

  if (source.includes('marine') || source.includes('boat') || source.includes('water')) {
    tags.push({ icon: Waves, label: 'Marine' })
  }

  if (tags.length === 0) {
    return [
      { icon: Truck, label: 'Pickup / Trailer' },
      { icon: Wrench, label: 'Outdoor Equipment' },
      { icon: Waves, label: 'Marine' },
    ]
  }

  return tags.slice(0, 3)
}

export const ProductLeadCard: React.FC<{ className?: string; product: ProductLeadCardData }> = ({
  className,
  product,
}) => {
  const { isFeatured, model, primaryCategory, primaryImage, secondaryImage, slug, summary, title } =
    product
  const href = slug ? `/products/${slug}` : '/products'
  const quoteHref = `${href}?intent=quote`

  const breakStrength =
    findSpecValue(product.specs, specMatchers.breakStrength) || fallbackSpecs.breakStrength
  const lengthOptions = findSpecValue(product.specs, specMatchers.length) || fallbackSpecs.length
  const application =
    findSpecValue(product.specs, specMatchers.application) || fallbackSpecs.application
  const primaryCategoryLabel =
    typeof primaryCategory === 'object' && primaryCategory !== null ? primaryCategory.title : null
  const valueProp = [
    model ? `${model} System` : 'Auto Retractable System',
    breakStrength,
  ].join(' | ')
  const applicationTags = getApplicationTags(product)

  return (
    <article
      className={cn(
        'group grid h-full overflow-hidden rounded-[1.75rem] border border-[var(--product-card-border)] bg-[var(--product-card-surface)] text-[var(--product-card-ink)] shadow-[0_18px_48px_rgba(10,18,12,0.08)] transition-[border-color,box-shadow] duration-300 hover:border-[var(--product-card-accent)] hover:shadow-[0_24px_60px_rgba(10,18,12,0.14)] focus-within:border-[var(--product-card-accent)] focus-within:shadow-[0_24px_60px_rgba(10,18,12,0.14)] [--product-card-accent:#36513f] [--product-card-border:#d2dbd0] [--product-card-ink:#101914] [--product-card-surface:#f4f6f1]',
        className,
      )}
    >
      <Link
        aria-label={`View details for ${title}`}
        className="relative block aspect-[4/3] overflow-hidden bg-[linear-gradient(180deg,#f8faf6_0%,#e8ede6_100%)]"
        href={href}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(54,81,63,0.18),_transparent_55%)]" />

        {isFeatured ? (
          <span className="absolute left-4 top-4 z-10 rounded-full border border-white/25 bg-[#24372c] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white">
            Hot
          </span>
        ) : null}

        <div className="absolute inset-x-4 bottom-4 z-10 flex flex-wrap gap-2">
          {applicationTags.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-black/35 px-2.5 py-1 text-[0.68rem] font-medium text-white backdrop-blur-sm"
            >
              <Icon className="size-3.5" />
              <span>{label}</span>
            </span>
          ))}
        </div>

        <div className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0 group-focus-within:opacity-0">
          <Media fill imgClassName="object-contain p-8 md:p-10" resource={primaryImage} />
        </div>

        {secondaryImage ? (
          <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
            <Media fill imgClassName="object-contain p-8 md:p-10" resource={secondaryImage} />
          </div>
        ) : null}
      </Link>

      <div className="grid flex-1 gap-5 p-5 md:p-6">
        <div className="space-y-3">
          <div className="space-y-2">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#5f7265]">
              {primaryCategoryLabel || 'Industrial Cargo Control'}
            </p>
            <div className="space-y-1.5">
              <h2 className="font-display text-[1.35rem] font-semibold leading-tight md:text-[1.5rem]">
                <Link
                  className="rounded-sm transition-colors hover:text-[var(--product-card-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#36513f]/30"
                  href={href}
                >
                  {title}
                </Link>
              </h2>
              <p className="truncate text-sm font-medium text-[#36513f]">{valueProp}</p>
            </div>

            {summary ? (
              <p className="text-sm leading-6 text-[#4f5d54]">{summary}</p>
            ) : (
              <p className="text-sm leading-6 text-[#4f5d54]">
                Built for pioneers who push industries forward with reliable securement in
                demanding outdoor environments.
              </p>
            )}
          </div>

          <ul className="grid gap-2.5 rounded-[1.15rem] border border-[#d6ddd4] bg-white/70 p-4">
            <SpecItem label="Break Strength" value={breakStrength} />
            <SpecItem label="Length Options" value={lengthOptions} />
            <SpecItem label="Application" value={application} />
          </ul>
        </div>

        <div className="overflow-hidden rounded-[1.15rem] border border-[#d6ddd4] bg-[#ebf0ea] md:max-h-0 md:opacity-0 md:transition-[max-height,opacity] md:duration-300 md:group-hover:max-h-40 md:group-hover:opacity-100 md:group-focus-within:max-h-40 md:group-focus-within:opacity-100">
          <div className="grid gap-3 p-4">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#5f7265]">
              Quote Support
            </p>
            <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
              {additionalInfo.map((item) => (
                <div key={item.label} className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5f7265]">
                    {item.label}
                  </p>
                  <p className="text-sm text-[#223129]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            asChild
            className="h-11 rounded-full bg-[#24372c] px-5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(36,55,44,0.18)] hover:bg-[#1b2b21]"
            size="clear"
          >
            <Link href={quoteHref}>
              Request Quote
              <ArrowRight className="size-4" />
            </Link>
          </Button>

          <Button
            asChild
            className="h-11 rounded-full border border-[#c7d2c5] bg-white/80 px-5 text-sm font-semibold text-[#162019] hover:bg-white"
            size="clear"
            variant="outline"
          >
            <Link href={href}>View Details</Link>
          </Button>
        </div>
      </div>
    </article>
  )
}

const SpecItem: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <li className="grid grid-cols-[auto_1fr] items-start gap-3">
      <span className="mt-2 size-2 rounded-full bg-[#36513f]" />
      <div className="grid gap-0.5">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#5f7265]">
          {label}
        </p>
        <p className="text-sm leading-6 text-[#1e2b22]">{value}</p>
      </div>
    </li>
  )
}
