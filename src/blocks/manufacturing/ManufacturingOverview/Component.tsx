'use client'
/* eslint-disable @next/next/no-img-element */

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'

import type { ManufacturingOverviewBlock as ManufacturingOverviewBlockProps } from '@/payload-types'

import { manufacturingMedia, manufacturingOverviewContent } from '@/blocks/manufacturing/content'
import { Button } from '@/components/ui/button'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { useScrollScene } from '@/utilities/gsap'

export const ManufacturingOverviewBlock: React.FC<
  ManufacturingOverviewBlockProps & { disableInnerContainer?: boolean }
> = () => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  useScrollScene(sectionRef, ({ gsap, reduceMotion, scope }) => {
    if (reduceMotion) return

    gsap.from(scope.querySelectorAll('[data-overview-reveal]'), {
      duration: 0.85,
      ease: 'power2.out',
      opacity: 0,
      stagger: 0.1,
      y: 28,
    })

    const image = scope.querySelector<HTMLElement>('[data-overview-image]')
    if (image) {
      gsap.fromTo(
        image,
        { scale: 1.05, yPercent: -4 },
        {
          ease: 'none',
          scale: 1,
          scrollTrigger: {
            end: 'bottom top',
            scrub: true,
            start: 'top top',
            trigger: scope,
          },
          yPercent: 6,
        },
      )
    }
  })

  return (
    <section
      className="relative overflow-hidden bg-[#0f172a] text-white"
      data-theme="dark"
      ref={sectionRef}
    >
      <div className="absolute inset-0">
        <img
          alt={manufacturingMedia.banner.alt}
          className="absolute inset-x-0 -inset-y-[8%] h-[116%] w-full object-cover object-[64%_center]"
          data-overview-image
          fetchPriority="high"
          src={manufacturingMedia.banner.url}
        />
        {/* Dark overlay to make text readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/30 to-black/60" />
      </div>

      <div className="container relative flex min-h-[42rem] items-center justify-end py-32 md:min-h-[48rem] md:py-40 lg:min-h-[54rem] lg:py-48">
        <div className="ml-auto max-w-3xl text-right">
          <h1
            className="mt-6 font-industrial text-5xl font-bold uppercase leading-[1.1] tracking-wide sm:text-6xl md:text-[4.75rem] lg:text-[5.5rem]"
            data-overview-reveal
          >
            <span className="text-white block whitespace-pre-wrap">
              {manufacturingOverviewContent.titlePart1}
            </span>
            <span className="text-[#00A650] block">{manufacturingOverviewContent.titlePart2}</span>
          </h1>

          <div className="mt-10 flex flex-wrap items-center justify-end gap-4" data-overview-reveal>
            <Button
              asChild
              className="h-12 rounded-none border border-[#00A650] bg-[#00A650] px-8 text-xs font-bold uppercase tracking-widest text-white hover:border-[#00A650] hover:bg-[#00A650]"
              size="clear"
            >
              <Link href="/request-quote" className="flex items-center gap-2">
                START YOUR PROJECT
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
