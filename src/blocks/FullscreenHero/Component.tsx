'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'

import type { FullscreenHeroBlock as FullscreenHeroBlockProps } from '@/payload-types'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { resolveCMSLinkHref } from '@/utilities/resolveCMSLinkHref'
import { cn } from '@/utilities/ui'

type HeroStat = {
  highlight?: boolean
  label: string
  suffix?: React.ReactNode
  value: string
}

const heroStats: HeroStat[] = [
  {
    value: '16+',
    label: 'Years Experience',
  },
  {
    value: '8,000,000+',
    label: 'Pieces Manufactured',
  },
  {
    value: '30+',
    label: 'Global Patent',
  },
  {
    value: '98%',
    label: 'On-time Delivery',
  },
]

export const FullscreenHeroBlock: React.FC<
  FullscreenHeroBlockProps & { disableInnerContainer?: boolean }
> = ({ backgroundImage, links }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  const primaryHref = resolveCMSLinkHref(links?.[0]?.link) || '/request-quote'
  const secondaryHref = resolveCMSLinkHref(links?.[1]?.link) || '/products'
  const imageResource =
    backgroundImage && typeof backgroundImage === 'object' ? backgroundImage : null
  const heroImageURL = imageResource
    ? getMediaUrl(imageResource.url, imageResource.updatedAt)
    : '/home-hero-products.png'

  return (
    <section className="relative isolate overflow-hidden bg-[#f7f7f6] pt-[68px] text-[#06120b] lg:pt-[96px]">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[68px] -z-10 h-[640px] bg-cover bg-center bg-no-repeat opacity-[0.58] lg:hidden"
        style={{ backgroundImage: `url('${heroImageURL}')` }}
      >
        <div className="absolute inset-x-0 bottom-0 h-28" />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-24 top-[96px] -z-10 hidden bg-no-repeat lg:block"
        style={{
          backgroundImage: `url('${heroImageURL}')`,
          backgroundPosition: 'right top',
          backgroundSize: 'auto 100%',
        }}
      />

      <div className="container">
        <div className="grid min-h-[560px] gap-8 lg:min-h-[590px] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
          <div className="max-w-2xl pb-8 pt-18 md:py-14 lg:pb-36 lg:pt-20">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#06120b] md:text-sm">
              From Prototyping to Production
            </p>

            <h1 className="mt-8 max-w-xl font-display text-4xl font-semibold leading-tight text-[#06120b] md:mt-8 md:text-5xl lg:text-6xl">
              Tailored Solutions
              <br />
              Easier, Faster
            </h1>

            <p className="mt-8 max-w-xl text-base leading-7 text-[#1f2a22] md:mt-7 md:leading-8">
              Your product idea, our factory execution. PioneersGears helps brands and distributors
              develop products with practical sampling, repeatable production, and export-ready
              support.
            </p>

            <div className="mt-8 flex flex-col gap-8 sm:flex-row md:mt-9">
              <Link
                className="inline-flex h-14 cursor-pointer items-center justify-center rounded-md bg-[#00A650] px-8 text-base font-semibold text-white transition-colors hover:bg-[#078944] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#00A650]/25 sm:min-w-60"
                href={primaryHref}
              >
                Get Instant Quote
              </Link>
              <Link
                className="inline-flex h-14 cursor-pointer items-center justify-center rounded-md bg-[#06120b] px-8 text-base font-semibold text-white transition-colors hover:bg-[#1f2a22] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#06120b]/20 sm:min-w-60"
                href={secondaryHref}
              >
                View Product Catalog
              </Link>
            </div>
          </div>

          <div className="hidden lg:block" />
        </div>

        <div className="relative z-10 mt-16 lg:-mt-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {heroStats.map((item) => (
              <div
                className={cn(
                  'group flex min-h-24 flex-col items-center justify-center rounded-lg border border-[#b8beb9] bg-white px-3 py-4 text-center text-[#06120b] shadow-[0_14px_34px_rgba(6,18,11,0.05)] transition-colors duration-200 hover:border-[#00A650] hover:bg-[#00A650] hover:text-white md:min-h-28 md:px-5 md:py-6',
                  'sm:col-span-1',
                )}
                key={item.label}
              >
                <div className="font-industrial text-2xl font-bold leading-none tracking-wide md:text-4xl">
                  {item.value}
                  {item.suffix ? (
                    <span className="ml-1 inline-flex items-start text-2xl md:text-3xl">
                      {item.suffix}
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-xs font-semibold leading-4 md:mt-4 md:text-sm md:leading-5">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
