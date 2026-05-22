'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'

type Props = {
  autoScroll?: boolean
  autoScrollInterval?: number
  children: React.ReactNode
  className?: string
  itemSelector: string
  title: string
}

const SCROLL_RESET_THRESHOLD = 2

export const ContentCarousel: React.FC<Props> = ({
  autoScroll = false,
  autoScrollInterval = 3200,
  children,
  className,
  itemSelector,
  title,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const autoScrollTimerRef = useRef<number | null>(null)
  const isPausedRef = useRef(false)
  const [canScroll, setCanScroll] = useState(false)
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

  useEffect(() => {
    const container = scrollRef.current
    if (!container || typeof window === 'undefined') return

    const syncCanScroll = () => {
      setCanScroll(container.scrollWidth > container.clientWidth + SCROLL_RESET_THRESHOLD)
    }

    syncCanScroll()

    const resizeObserver = new ResizeObserver(syncCanScroll)
    resizeObserver.observe(container)

    window.addEventListener('resize', syncCanScroll)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', syncCanScroll)
    }
  }, [children])

  const stepCarousel = (direction: 'next' | 'prev') => {
    const container = scrollRef.current
    if (!container || !canScroll) return

    const card = container.querySelector<HTMLElement>(itemSelector)
    const stepWidth = card ? card.offsetWidth + 28 : 320
    const maxScrollLeft = container.scrollWidth - container.clientWidth
    const currentOffset = container.scrollLeft
    const targetOffset =
      direction === 'next'
        ? currentOffset >= maxScrollLeft - SCROLL_RESET_THRESHOLD
          ? 0
          : Math.min(currentOffset + stepWidth, maxScrollLeft)
        : currentOffset <= SCROLL_RESET_THRESHOLD
          ? maxScrollLeft
          : Math.max(currentOffset - stepWidth, 0)

    container.scrollTo({
      behavior: 'smooth',
      left: targetOffset,
    })
  }

  useEffect(() => {
    if (!autoScroll || !canScroll || prefersReducedMotion || typeof window === 'undefined') return

    autoScrollTimerRef.current = window.setInterval(() => {
      if (!isPausedRef.current) {
        stepCarousel('next')
      }
    }, autoScrollInterval)

    return () => {
      if (autoScrollTimerRef.current) {
        window.clearInterval(autoScrollTimerRef.current)
      }
    }
  }, [autoScroll, autoScrollInterval, canScroll, prefersReducedMotion])

  return (
    <section className={cn('relative py-16 md:py-20', className)}>
      <div className="container">
        <div className="mb-9 flex flex-col items-center text-center">
          <h2 className="font-industrial text-4xl font-bold uppercase leading-none text-[#101914] md:text-6xl">
            {title}
          </h2>
          <svg
            aria-hidden="true"
            className="mt-4 h-4 w-44 max-w-[55vw] text-[#00A650]"
            fill="currentColor"
            viewBox="0 0 144 12"
          >
            <path d="M2.5 7C22.5 3.5 54 -0.5 82 2.5C110 5.5 136 5.5 141.5 5C141.5 5 142.5 8 138.5 8.5C134.5 9 108 12.5 80 10.5C52 8.5 18 10 3.5 9C1 8.5 2.5 7 2.5 7Z" />
          </svg>
        </div>

        <div className="relative">
          {canScroll ? (
            <>
              <CarouselButton
                className="absolute left-0 top-[38%] z-20 -translate-x-1/2"
                direction="prev"
                onClick={() => stepCarousel('prev')}
              />
              <CarouselButton
                className="absolute right-0 top-[38%] z-20 translate-x-1/2"
                direction="next"
                onClick={() => stepCarousel('next')}
              />
            </>
          ) : null}

          <div
            className="flex snap-x snap-mandatory gap-7 overflow-x-auto scroll-smooth px-1 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onBlur={() => {
              isPausedRef.current = false
            }}
            onFocus={() => {
              isPausedRef.current = true
            }}
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
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}

const CarouselButton: React.FC<{
  className?: string
  direction: 'next' | 'prev'
  onClick: () => void
}> = ({ className, direction, onClick }) => {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight

  return (
    <button
      aria-label={direction === 'prev' ? 'Previous items' : 'Next items'}
      className={cn(
        'hidden size-10 items-center justify-center rounded-md bg-[#00A650] text-white shadow-[0_10px_24px_rgba(16,25,20,0.14)] transition-colors hover:bg-[#008f45] md:inline-flex',
        className,
      )}
      onClick={onClick}
      type="button"
    >
      <Icon className="size-5" />
    </button>
  )
}
