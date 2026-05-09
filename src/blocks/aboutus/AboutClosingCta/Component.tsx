'use client'
/* eslint-disable @next/next/no-img-element */

import Link from 'next/link'
import React, { useRef } from 'react'

import type { AboutClosingCtaBlock as AboutClosingCtaBlockProps } from '@/payload-types'

import { aboutClosingCtaContent } from '@/blocks/aboutus/content'
import { Button } from '@/components/ui/button'
import { useScrollScene } from '@/utilities/gsap'

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
    <section className="relative overflow-hidden bg-[#15191f] text-white" ref={sectionRef}>
      <div className="absolute inset-0">
        <img
          alt={aboutClosingCtaContent.image.alt}
          className="h-full w-full object-cover object-center"
          loading="lazy"
          src={aboutClosingCtaContent.image.url}
        />
        <div className="absolute inset-0 bg-black/18" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1530]/96 via-[#161a3d]/68 to-transparent" />
      </div>

      <div className="container relative flex min-h-[18rem] items-center justify-center py-12 md:min-h-[22rem] md:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            className="font-industrial text-3xl font-bold uppercase leading-none tracking-wide text-white md:text-4xl"
            data-cta-reveal
          >
            {aboutClosingCtaContent.title}
          </h2>

          <p
            className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-white md:text-base"
            data-cta-reveal
          >
            {aboutClosingCtaContent.body}
          </p>

          <div className="mt-7 flex justify-center" data-cta-reveal>
            <Button
              asChild
              className="h-11 rounded-none border border-[#00A650] bg-[#00A650] px-7 text-xs font-bold uppercase tracking-[0.08em] text-white hover:border-[#00A650] hover:bg-[#00A650]"
              size="clear"
            >
              <Link href={aboutClosingCtaContent.primaryHref}>
                {aboutClosingCtaContent.primaryLabel}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
