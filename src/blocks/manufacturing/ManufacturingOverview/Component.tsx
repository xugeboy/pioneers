'use client'
/* eslint-disable @next/next/no-img-element */

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
          alt={manufacturingMedia.team.alt}
          className="h-full w-full object-cover object-[64%_center]"
          data-overview-image
          fetchPriority="high"
          src={manufacturingMedia.team.url}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.9)_0%,rgba(15,23,42,0.82)_42%,rgba(15,23,42,0.38)_78%,rgba(15,23,42,0.08)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,166,80,0.18),transparent_24%)]" />
      </div>

      <div className="container relative py-[4.5rem] md:py-24 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end">
          <div className="max-w-4xl">
            <p
              className="text-xs font-semibold uppercase tracking-[0.34em] text-[#90ebb1]"
              data-overview-reveal
            >
              {manufacturingOverviewContent.eyebrow}
            </p>
            <h1
              className="mt-5 font-industrial text-5xl uppercase leading-[0.9] tracking-[-0.05em] sm:text-6xl md:text-[4.75rem] lg:text-[6rem]"
              data-overview-reveal
            >
              {manufacturingOverviewContent.title}
            </h1>
            <p
              className="mt-6 max-w-2xl text-base leading-8 text-slate-200 md:text-lg md:leading-9"
              data-overview-reveal
            >
              {manufacturingOverviewContent.summary}
            </p>

            <div className="mt-8 flex flex-wrap gap-3" data-overview-reveal>
              <Button
                asChild
                className="h-12 rounded-none border border-[#00a650] bg-[#00a650] px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white hover:border-[#119d52] hover:bg-[#119d52]"
                size="clear"
              >
                <Link href="/request-quote">Start an OEM / ODM inquiry</Link>
              </Button>
              <Button
                asChild
                className="h-12 rounded-none border border-white/25 bg-white/10 px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white hover:border-white hover:bg-white hover:text-[#10203a]"
                size="clear"
                variant="outline"
              >
                <Link href="/contact-us">Talk to manufacturing</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2" data-overview-reveal>
            {manufacturingOverviewContent.stats.map((item) => (
              <div
                className="border border-white/12 bg-white/[0.08] px-5 py-5 backdrop-blur-sm"
                key={item.label}
              >
                <p className="text-2xl font-semibold uppercase tracking-[0.12em] text-white">
                  {item.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-200">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
