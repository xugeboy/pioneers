'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useRef } from 'react'

import type { OemOdmCapabilityBlock as OemOdmCapabilityBlockProps } from '@/payload-types'

import { manufacturingMedia } from '@/blocks/manufacturing/content'
import { useScrollScene } from '@/utilities/gsap'

export const OemOdmCapabilityBlock: React.FC<
  OemOdmCapabilityBlockProps & { disableInnerContainer?: boolean }
> = () => {
  const sectionRef = useRef<HTMLElement | null>(null)

  useScrollScene(sectionRef, ({ gsap, reduceMotion, scope }) => {
    if (reduceMotion) return

    gsap.from(scope.querySelectorAll('[data-oemodm-reveal]'), {
      duration: 0.8,
      ease: 'power2.out',
      opacity: 0,
      stagger: 0.08,
      scrollTrigger: {
        start: 'top 80%',
        toggleActions: 'play none none reverse',
        trigger: scope,
      },
      y: 24,
    })
  })

  return (
    <section className="relative overflow-hidden bg-[#f8f8f4] text-[#17202a]" ref={sectionRef}>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[45%] opacity-[0.035] [background-image:radial-gradient(ellipse_at_18%_42%,transparent_0,transparent_28%,#17202a_29%,transparent_30%),radial-gradient(ellipse_at_17%_42%,transparent_0,transparent_42%,#17202a_43%,transparent_44%),radial-gradient(ellipse_at_18%_44%,transparent_0,transparent_56%,#17202a_57%,transparent_58%)]" />

      <div className="container relative py-16 md:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(20rem,33rem)_1fr] lg:items-start xl:gap-16">
          <div className="pt-2" data-gallery-reveal>
            <h2 className="mt-9 max-w-[34rem] text-4xl font-semibold leading-[1.15] tracking-[-0.04em] md:text-5xl">
              Built for your brand. From concept to confidence.{' '}
            </h2>
            <p className="mt-8 max-w-[25rem] text-lg leading-8 text-[#737985]">
              We support OEM and ODM programs with end-to-end capabilities, flexible customization,
              and reliable production-so you can focus on growing your brand.
            </p>
          </div>

          <figure
            className="group relative aspect-[4/3] w-full overflow-hidden bg-[#d9d9d4]"
            data-gallery-reveal
          >
            <img
              alt={manufacturingMedia.oem.alt}
              className="h-full w-full object-cover object-center"
              loading="lazy"
              src={manufacturingMedia.oem.url}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,15,18,0)_45%,rgba(11,15,18,0.72)_100%)]" />
          </figure>
        </div>
      </div>
    </section>
  )
}
