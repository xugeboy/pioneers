'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useRef } from 'react'

import type { AboutCompanyProfileBlock as AboutCompanyProfileBlockProps } from '@/payload-types'

import { aboutCompanyProfileContent } from '@/blocks/aboutus/content'
import { useScrollScene } from '@/utilities/gsap'

export const AboutCompanyProfileBlock: React.FC<
  AboutCompanyProfileBlockProps & { disableInnerContainer?: boolean }
> = () => {
  const sectionRef = useRef<HTMLElement | null>(null)

  useScrollScene(sectionRef, ({ gsap, reduceMotion, scope }) => {
    if (reduceMotion) return

    gsap.from(scope.querySelectorAll('[data-about-company-reveal]'), {
      duration: 0.85,
      ease: 'power2.out',
      opacity: 0,
      stagger: 0.1,
      scrollTrigger: {
        start: 'top 78%',
        toggleActions: 'play none none reverse',
        trigger: scope,
      },
      y: 24,
    })
  })

  return (
    <section className="bg-white text-[#1b2430]" ref={sectionRef}>
      <div className="container py-16 md:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,42rem)_minmax(0,38rem)] lg:items-center lg:gap-16">
          <div className="overflow-hidden bg-[#e7e8e3]" data-about-company-reveal>
            <div className="aspect-[16/9] lg:aspect-[4/3]">
              <img
                alt={aboutCompanyProfileContent.image.alt}
                className="h-full w-full object-cover object-[64%_center]"
                loading="lazy"
                src={aboutCompanyProfileContent.image.url}
              />
            </div>
          </div>

          <div data-about-company-reveal>
            <h2 className="font-industrial text-4xl font-bold uppercase leading-none tracking-wide text-[#1b2430] md:text-5xl">
              {aboutCompanyProfileContent.title}
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-[#5f6670] md:text-lg md:leading-9">
              {aboutCompanyProfileContent.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
