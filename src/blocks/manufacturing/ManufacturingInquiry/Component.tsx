'use client'
/* eslint-disable @next/next/no-img-element */

import Link from 'next/link'
import React, { useRef } from 'react'

import type { ManufacturingInquiryBlock as ManufacturingInquiryBlockProps } from '@/payload-types'

import { manufacturingInquiryContent, manufacturingMedia } from '@/blocks/manufacturing/content'
import { Button } from '@/components/ui/button'
import { useScrollScene } from '@/utilities/gsap'

export const ManufacturingInquiryBlock: React.FC<
  ManufacturingInquiryBlockProps & { disableInnerContainer?: boolean }
> = () => {
  const sectionRef = useRef<HTMLElement | null>(null)

  useScrollScene(sectionRef, ({ gsap, reduceMotion, scope }) => {
    if (reduceMotion) return

    gsap.from(scope.querySelectorAll('[data-inquiry-reveal]'), {
      duration: 0.8,
      ease: 'power2.out',
      opacity: 0,
      stagger: 0.08,
      scrollTrigger: {
        start: 'top 82%',
        toggleActions: 'play none none reverse',
        trigger: scope,
      },
      y: 26,
    })
  })

  return (
    <section className="relative overflow-hidden bg-[#0f172a] text-white" ref={sectionRef}>
      <div className="absolute inset-0">
        <img
          alt={manufacturingMedia.contact.alt}
          className="h-full w-full object-cover object-center opacity-[0.22]"
          loading="lazy"
          src={manufacturingMedia.contact.url}
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,23,42,0.94)_0%,rgba(15,23,42,0.88)_52%,rgba(15,23,42,0.7)_100%)]" />
      </div>

      <div className="container relative py-[4.5rem] md:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p
            className="text-xs font-semibold uppercase tracking-[0.32em] text-[#90ebb1]"
            data-inquiry-reveal
          >
            Manufacturing inquiry
          </p>
          <h2
            className="mt-4 font-industrial text-4xl uppercase leading-[0.92] tracking-[-0.04em] text-white md:text-6xl"
            data-inquiry-reveal
          >
            {manufacturingInquiryContent.title}
          </h2>
          <p
            className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-200 md:text-lg md:leading-9"
            data-inquiry-reveal
          >
            {manufacturingInquiryContent.summary}
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3" data-inquiry-reveal>
            <Button
              asChild
              className="h-12 rounded-none border border-[#00a650] bg-[#00a650] px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white hover:border-[#119d52] hover:bg-[#119d52]"
              size="clear"
            >
              <Link href={manufacturingInquiryContent.primaryHref}>
                {manufacturingInquiryContent.primaryLabel}
              </Link>
            </Button>
            <Button
              asChild
              className="h-12 rounded-none border border-white/25 bg-white/10 px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white hover:border-white hover:bg-white hover:text-[#10203a]"
              size="clear"
              variant="outline"
            >
              <Link href={manufacturingInquiryContent.secondaryHref}>
                {manufacturingInquiryContent.secondaryLabel}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
