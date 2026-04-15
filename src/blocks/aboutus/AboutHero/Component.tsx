'use client'
/* eslint-disable @next/next/no-img-element */

import Link from 'next/link'
import React, { useEffect, useRef } from 'react'

import type { AboutHeroBlock as AboutHeroBlockProps } from '@/payload-types'

import { aboutMedia } from '@/blocks/aboutus/content'
import { Button } from '@/components/ui/button'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { useScrollScene } from '@/utilities/gsap'

export const AboutHeroBlock: React.FC<
  AboutHeroBlockProps & { disableInnerContainer?: boolean }
> = () => {
  const { setHeaderTheme } = useHeaderTheme()
  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  useScrollScene(sectionRef, ({ gsap, reduceMotion, scope }) => {
    const background = scope.querySelector<HTMLElement>('[data-hero-bg]')
    const copy = scope.querySelectorAll<HTMLElement>('[data-hero-copy]')
    const chips = scope.querySelectorAll<HTMLElement>('[data-hero-chip]')

    if (!reduceMotion && background) {
      gsap.fromTo(
        background,
        { scale: 1.08, yPercent: -3 },
        {
          ease: 'none',
          scale: 1,
          yPercent: 8,
          scrollTrigger: {
            end: 'bottom top',
            scrub: true,
            start: 'top top',
            trigger: scope,
          },
        },
      )
    }

    if (reduceMotion) return

    gsap.from(copy, {
      duration: 0.9,
      ease: 'power2.out',
      opacity: 0,
      stagger: 0.12,
      y: 36,
    })

    gsap.from(chips, {
      delay: 0.35,
      duration: 0.7,
      ease: 'power2.out',
      opacity: 0,
      stagger: 0.08,
      y: 18,
    })
  })

  return (
    <section
      className="relative min-h-[100svh] overflow-hidden bg-[#0b1324] text-white"
      data-theme="dark"
      ref={sectionRef}
    >
      <div className="absolute inset-0">
        <img
          alt={aboutMedia.hero.alt}
          className="h-full w-full object-cover object-[62%_center]"
          data-hero-bg
          fetchPriority="high"
          src={aboutMedia.hero.url}
        />
        <div className="absolute inset-0 bg-[linear-gradient(96deg,rgba(7,13,27,0.9)_0%,rgba(7,13,27,0.72)_34%,rgba(7,13,27,0.32)_66%,rgba(7,13,27,0.08)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,166,80,0.18),transparent_28%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(180deg,rgba(7,13,27,0)_0%,rgba(7,13,27,0.82)_100%)]" />
      </div>

      <div className="container relative flex min-h-[100svh] flex-col justify-center pt-[68px] pb-8 md:pt-24 md:pb-10 lg:pt-28 lg:pb-12">
        <div className="max-w-6xl -translate-y-6 md:-translate-y-8">
          <h1
            className="mt-5 max-w-6xl font-industrial text-6xl uppercase leading-[0.84] tracking-[-0.06em] text-white sm:text-7xl md:text-[6rem] lg:text-[8.2rem]"
            data-hero-copy
          >
            Rugged by purpose.
            <br />
            Clear by design.
          </h1>

          <p
            className="mt-6 max-w-2xl text-base leading-8 text-slate-200 md:text-xl md:leading-9"
            data-hero-copy
          >
            Purpose-built securing solutions for demanding outdoor use.
          </p>

          <div className="mt-10 flex flex-wrap gap-3" data-hero-copy>
            <Button
              asChild
              className="h-12 rounded-none border border-[#00a650] bg-[#00a650] px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white hover:border-[#119d52] hover:bg-[#119d52]"
              size="clear"
            >
              <Link href="/contact-us">Talk to our team</Link>
            </Button>

            <Button
              asChild
              className="h-12 rounded-none border border-white/18 bg-white/[0.06] px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white hover:border-white hover:bg-white hover:text-[#10203a]"
              size="clear"
              variant="outline"
            >
              <Link href="/products">Explore products</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
