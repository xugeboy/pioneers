'use client'
/* eslint-disable @next/next/no-img-element */

import Link from 'next/link'
import React, { useRef } from 'react'

import type { AboutClosingCtaBlock as AboutClosingCtaBlockProps } from '@/payload-types'

import { aboutClosingContent, aboutMedia } from '@/blocks/aboutus/content'
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
          alt={aboutMedia.closing.alt}
          className="h-full w-full object-cover object-center"
          loading="lazy"
          src={aboutMedia.closing.url}
        />
        <div className="absolute inset-0 bg-black/58" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0.72)_50%,rgba(0,0,0,0.3)_100%)]" />
      </div>

      <div className="container relative flex min-h-[18rem] items-center justify-center py-12 md:min-h-[22rem] md:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            className="font-industrial text-3xl font-bold uppercase leading-none tracking-wide text-white md:text-4xl"
            data-cta-reveal
          >
            Contact Us Today
          </h2>

          <p
            className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-white md:text-base"
            data-cta-reveal
          >
            View our product catalog and use our quick quote builder to expedite your free estimate,
            or contact us today to speak with one of our product specialists.
          </p>

          <div className="mt-7 flex justify-center" data-cta-reveal>
            <Button
              asChild
              className="h-11 rounded-none border border-[#00A650] bg-[#00A650] px-7 text-xs font-bold uppercase tracking-[0.08em] text-white hover:border-[#00A650] hover:bg-[#00A650]"
              size="clear"
            >
              <Link href={aboutClosingContent.primaryHref}>Contact A Specialist</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
