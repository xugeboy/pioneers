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
const AUTO_SCROLL_RESET_THRESHOLD = 2

const getProductKey = (product: ProductLeadCardData) => {
  if (product.slug) return `slug-${product.slug}`
  if (product.model) return `model-${product.model}`

  return `id-${product.id}`
}

export const ProductInterestCarousel: React.FC<Props> = ({ products }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const manualPauseTimeoutRef = useRef<number | null>(null)
  const isPausedRef = useRef(false)
  const [canScroll, setCanScroll] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const uniqueProducts = useMemo(() => {
    const seenKeys = new Set<string>()

    return products.filter((product) => {
      const key = getProductKey(product)
      if (seenKeys.has(key)) return false

      seenKeys.add(key)
      return true
    })
  }, [products])

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

  useEffect(() => {
    const container = scrollRef.current
    if (!container || typeof window === 'undefined') return

    const syncCanScroll = () => {
      setCanScroll(container.scrollWidth > container.clientWidth + AUTO_SCROLL_RESET_THRESHOLD)
    }

    syncCanScroll()

    const resizeObserver = new ResizeObserver(syncCanScroll)
    resizeObserver.observe(container)

    window.addEventListener('resize', syncCanScroll)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', syncCanScroll)
    }
  }, [uniqueProducts.length])

  useEffect(() => {
    const container = scrollRef.current
    if (!container || !canScroll || prefersReducedMotion) return

    const animate = () => {
      if (!isPausedRef.current) {
        const maxScrollLeft = container.scrollWidth - container.clientWidth

        container.scrollLeft += AUTO_SCROLL_SPEED

        if (container.scrollLeft >= maxScrollLeft - AUTO_SCROLL_RESET_THRESHOLD) {
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

      if (manualPauseTimeoutRef.current) {
        window.clearTimeout(manualPauseTimeoutRef.current)
      }
    }
  }, [canScroll, prefersReducedMotion])

  if (!uniqueProducts.length) return null

  const stepCarousel = (direction: 'next' | 'prev') => {
    const container = scrollRef.current
    if (!container || !canScroll) return

    const card = container.querySelector<HTMLElement>('[data-interest-card="true"]')
    const stepWidth = card ? card.offsetWidth + 20 : 320
    const maxScrollLeft = container.scrollWidth - container.clientWidth
    const currentOffset = container.scrollLeft
    const targetOffset =
      direction === 'next'
        ? currentOffset >= maxScrollLeft - AUTO_SCROLL_RESET_THRESHOLD
          ? 0
          : Math.min(currentOffset + stepWidth, maxScrollLeft)
        : currentOffset <= AUTO_SCROLL_RESET_THRESHOLD
          ? maxScrollLeft
          : Math.max(currentOffset - stepWidth, 0)

    isPausedRef.current = true

    if (manualPauseTimeoutRef.current) {
      window.clearTimeout(manualPauseTimeoutRef.current)
    }

    manualPauseTimeoutRef.current = window.setTimeout(() => {
      isPausedRef.current = false
    }, 1800)

    container.scrollTo({
      left: targetOffset,
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

        {canScroll ? (
          <div className="hidden items-center gap-3 md:flex">
            <CarouselButton direction="prev" onClick={() => stepCarousel('prev')} />
            <CarouselButton direction="next" onClick={() => stepCarousel('next')} />
          </div>
        ) : null}
      </div>

      <div className="relative">
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
          {uniqueProducts.map((product, index) => (
            <InterestCard
              key={`${getProductKey(product)}-${index}`}
              product={product}
            />
          ))}
        </div>

        {canScroll ? (
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
}> = ({ product }) => {
  const href = product.slug ? `/products/${product.slug}` : '/products'

  return (
    <Link
      className={cn(
        CARD_BASE_CLASSES,
        'group block bg-transparent transition-opacity duration-300 hover:opacity-85',
      )}
      data-interest-card="true"
      href={href}
      prefetch={false}
    >
      <div className="relative overflow-hidden bg-transparent">
        <div className="relative aspect-[5/4]">
          <Media
            fill
            imgClassName="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            resource={product.primaryImage}
            size="(max-width: 768px) 70vw, 280px"
          />
        </div>
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
      className="inline-flex size-11 items-center justify-center bg-transparent text-[#101914] transition-colors duration-200 hover:text-[#f97316]"
      onClick={onClick}
      type="button"
    >
      <Icon className="size-5" />
    </button>
  )
}
