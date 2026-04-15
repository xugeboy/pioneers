'use client'

import Link from 'next/link'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import type { ProductLeadCardData } from '@/components/ProductLeadCard'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type Props = {
  products: ProductLeadCardData[]
}

const CARD_BASE_CLASSES =
  'w-[15rem] shrink-0 snap-start sm:w-[16rem] lg:w-[17rem] xl:w-[17.5rem]'

const AUTO_SCROLL_SPEED = 0.45

export const ProductInterestCarousel: React.FC<Props> = ({ products }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const isPausedRef = useRef(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches)
    }

    syncPreference()
    mediaQuery.addEventListener('change', syncPreference)

    return () => {
      mediaQuery.removeEventListener('change', syncPreference)
    }
  }, [])

  const trackProducts = useMemo(
    () => (products.length > 1 ? [...products, ...products] : products),
    [products],
  )

  useEffect(() => {
    const container = scrollRef.current
    if (!container || products.length <= 1 || prefersReducedMotion) return

    const animate = () => {
      if (!isPausedRef.current) {
        container.scrollLeft += AUTO_SCROLL_SPEED

        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0
        }
      }

      animationFrameRef.current = window.requestAnimationFrame(animate)
    }

    animationFrameRef.current = window.requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [prefersReducedMotion, products.length])

  if (!products.length) return null

  const stepCarousel = (direction: 'next' | 'prev') => {
    const container = scrollRef.current
    if (!container) return

    const card = container.querySelector<HTMLElement>('[data-interest-card="true"]')
    const stepWidth = card ? card.offsetWidth + 20 : 320
    const nextOffset = direction === 'next' ? stepWidth : -stepWidth

    container.scrollBy({
      left: nextOffset,
      behavior: 'smooth',
    })
  }

  return (
    <section className="mt-16 pb-2 md:mt-20">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#f97316]">
            You May Interested
          </p>
          <h2 className="font-display text-[1.9rem] font-semibold leading-tight text-[#101914] md:text-[2.4rem]">
            More products you may want to review
          </h2>
        </div>

        {products.length > 1 ? (
          <div className="hidden items-center gap-3 md:flex">
            <CarouselButton direction="prev" onClick={() => stepCarousel('prev')} />
            <CarouselButton direction="next" onClick={() => stepCarousel('next')} />
          </div>
        ) : null}
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-16 bg-gradient-to-r from-white via-white/80 to-transparent md:block" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-16 bg-gradient-to-l from-white via-white/80 to-transparent md:block" />

        <div
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onMouseEnter={() => {
            isPausedRef.current = true
          }}
          onMouseLeave={() => {
            isPausedRef.current = false
          }}
          onTouchEnd={() => {
            isPausedRef.current = false
          }}
          onTouchStart={() => {
            isPausedRef.current = true
          }}
          ref={scrollRef}
        >
          {trackProducts.map((product, index) => (
            <InterestCard
              key={`${product.id}-${index}`}
              product={product}
              showDuplicateBadge={index >= products.length}
            />
          ))}
        </div>

        {products.length > 1 ? (
          <div className="mt-4 flex items-center justify-center gap-3 md:hidden">
            <CarouselButton direction="prev" onClick={() => stepCarousel('prev')} />
            <CarouselButton direction="next" onClick={() => stepCarousel('next')} />
          </div>
        ) : null}
      </div>
    </section>
  )
}

const InterestCard: React.FC<{
  product: ProductLeadCardData
  showDuplicateBadge?: boolean
}> = ({ product, showDuplicateBadge = false }) => {
  const href = product.slug ? `/products/${product.slug}` : '/products'

  return (
    <Link
      className={cn(
        CARD_BASE_CLASSES,
        'group block rounded-[1.4rem] border border-[#d8ddd5] bg-white p-3 shadow-[0_20px_40px_-36px_rgba(16,25,20,0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-[#f97316] hover:shadow-[0_26px_60px_-36px_rgba(16,25,20,0.42)]',
      )}
      data-interest-card="true"
      href={href}
      prefetch={false}
    >
      <div className="relative overflow-hidden rounded-[1rem] bg-[#f5f7f2]">
        <div className="relative aspect-[5/4]">
          <Media
            fill
            imgClassName="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
            resource={product.primaryImage}
            size="(max-width: 768px) 70vw, 280px"
          />
        </div>

        {showDuplicateBadge ? <span className="sr-only">Looped item</span> : null}
      </div>

      <div className="space-y-2 px-1 pb-1 pt-4">
        <h3 className="line-clamp-2 font-display text-[1rem] font-semibold uppercase leading-6 tracking-[0.04em] text-[#1a241c]">
          {product.title}
        </h3>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6e7c72]">
          {product.model}
        </p>
      </div>
    </Link>
  )
}

const CarouselButton: React.FC<{
  direction: 'prev' | 'next'
  onClick: () => void
}> = ({ direction, onClick }) => {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight

  return (
    <button
      aria-label={direction === 'prev' ? 'Previous products' : 'Next products'}
      className="inline-flex size-11 items-center justify-center rounded-full bg-[#fbc044] text-[#101914] transition-colors duration-200 hover:bg-[#f7b328]"
      onClick={onClick}
      type="button"
    >
      <Icon className="size-5" />
    </button>
  )
}
