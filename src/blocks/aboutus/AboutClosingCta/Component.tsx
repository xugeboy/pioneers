'use client'
/* eslint-disable @next/next/no-img-element */

import Link from 'next/link'
import React, { useRef } from 'react'

import type { AboutClosingCtaBlock as AboutClosingCtaBlockProps } from '@/payload-types'

import { aboutClosingContent, aboutMedia } from '@/blocks/aboutus/content'
import { Button } from '@/components/ui/button'
import { useScrollScene } from '@/utilities/gsap'
import { cn } from '@/utilities/ui'

export const AboutClosingCtaBlock: React.FC<
  AboutClosingCtaBlockProps & { disableInnerContainer?: boolean }
> = () => {
  const sectionRef = useRef<HTMLElement | null>(null)

  useScrollScene(sectionRef, ({ gsap, reduceMotion, scope }) => {
    if (reduceMotion) return

    gsap.from(scope.querySelectorAll('[data-cta-reveal]'), {
      duration: 0.8,
      ease: 'power2.out',
      opacity: 0,
      stagger: 0.1,
      scrollTrigger: {
        start: 'top 82%',
        toggleActions: 'play none none reverse',
        trigger: scope,
      },
      y: 28,
    })
  })

  return (
    <section className="relative overflow-hidden bg-[#0f172a] text-white" ref={sectionRef}>
      <div className="absolute inset-0">
        <img
          alt={aboutMedia.closing.alt}
          className="h-full w-full object-cover object-center opacity-[0.26]"
          loading="lazy"
          src={aboutMedia.closing.url}
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(11,19,36,0.92)_0%,rgba(11,19,36,0.84)_48%,rgba(11,19,36,0.68)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,166,80,0.2),transparent_26%)]" />
      </div>

      <div className="container relative py-[4.5rem] md:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <h2
            className="mt-4 font-industrial text-4xl uppercase leading-[0.9] tracking-[-0.05em] text-white md:text-6xl lg:text-[4.75rem]"
            data-cta-reveal
          >
            {aboutClosingContent.title}
          </h2>

          <p
            className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-200 md:text-lg md:leading-9"
            data-cta-reveal
          >
            {aboutClosingContent.summary}
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3" data-cta-reveal>
            <Button
              asChild
              className="h-12 rounded-none border border-[#00a650] bg-[#00a650] px-6 text-sm font-semibold uppercase tracking-[0.12em] text-white hover:border-[#119d52] hover:bg-[#119d52]"
              size="clear"
            >
              <Link href={aboutClosingContent.primaryHref}>{aboutClosingContent.primaryLabel}</Link>
            </Button>

            <Button
              asChild
              className={cn(
                'h-12 rounded-none border border-white/25 bg-white/10 px-6 text-sm font-semibold uppercase tracking-[0.12em] text-white hover:border-white hover:bg-white hover:text-[#10203a]',
              )}
              size="clear"
              variant="outline"
            >
              <Link href={aboutClosingContent.secondaryHref}>
                {aboutClosingContent.secondaryLabel}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
