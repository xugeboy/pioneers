'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

import type { HomeClosingCtaBlock as HomeClosingCtaBlockProps } from '@/payload-types'

import { Button } from '@/components/ui/button'

export const HomeClosingCtaBlock: React.FC<
  HomeClosingCtaBlockProps & { disableInnerContainer?: boolean }
> = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const [backgroundPositionY, setBackgroundPositionY] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) {
      setBackgroundPositionY(50)
      return
    }

    let frame = 0

    const updateBackgroundPosition = () => {
      window.cancelAnimationFrame(frame)

      frame = window.requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect()
        const travel = window.innerHeight + rect.height
        const progress = Math.min(Math.max((window.innerHeight - rect.top) / travel, 0), 1)

        setBackgroundPositionY(Math.round(progress * 100))
      })
    }

    updateBackgroundPosition()
    window.addEventListener('scroll', updateBackgroundPosition, { passive: true })
    window.addEventListener('resize', updateBackgroundPosition)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateBackgroundPosition)
      window.removeEventListener('resize', updateBackgroundPosition)
    }
  }, [])

  return (
    <section
      className="relative flex min-h-[360px] items-center overflow-hidden bg-[#e6e7e8] py-20 md:min-h-[430px] lg:min-h-[500px]"
      ref={sectionRef}
    >
      {/* Background Image - Placeholder path */}
      <div
        className="absolute inset-0 z-0 bg-cover"
        style={{
          backgroundImage: `url('https://cdn.pioneersgears.com/images/clear sew machine.webp')`,
          backgroundPosition: `center ${backgroundPositionY}%`,
        }}
      />

      <div className="absolute inset-0 z-10 bg-black/32" />

      <div className="container relative z-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center text-white">
          <h2 className="font-industrial text-4xl font-bold uppercase leading-[0.95] md:text-6xl lg:text-7xl">
            Quality You Can Trust
          </h2>
          <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-white/90 md:text-base">
            Certified to international standards and ready to support reliable solutions for your
            business.
          </p>
          <div className="mt-7">
            <Button
              asChild
              className="h-12 rounded-none bg-[#00A650] px-8 text-xs font-bold uppercase tracking-[0.15em] text-white hover:bg-[#008f45]"
              size="clear"
            >
              <Link href="/request-quote" className="flex items-center gap-2">
                Contact Us Today
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
