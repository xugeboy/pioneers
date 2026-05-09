'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useRef } from 'react'

import type { AboutHeroBlock as AboutHeroBlockProps } from '@/payload-types'

import { aboutHeroContent } from '@/blocks/aboutus/content'
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
    if (reduceMotion) return

    gsap.from(scope.querySelectorAll('[data-about-hero-reveal]'), {
      duration: 0.85,
      ease: 'power2.out',
      opacity: 0,
      stagger: 0.1,
      y: 28,
    })

    const image = scope.querySelector<HTMLElement>('[data-about-hero-image]')
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
          alt={aboutHeroContent.image.alt}
          className="absolute inset-x-0 -inset-y-[6%] h-[112%] w-full object-cover object-[64%_center]"
          data-about-hero-image
          fetchPriority="high"
          src={aboutHeroContent.image.url}
        />
        <div className="absolute inset-0 bg-black/18" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1530]/96 via-[#161a3d]/68 to-transparent" />
      </div>

      <div className="container relative flex min-h-[32rem] items-center py-24 md:min-h-[34rem] md:py-28 lg:min-h-[36rem]">
        <div className="grid w-full gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.85fr)] md:items-center lg:gap-14">
          <div>
            <h1
              className="mt-5 font-industrial text-4xl font-bold uppercase leading-[1.05] tracking-wide sm:text-5xl md:text-6xl lg:text-[4.75rem]"
              data-about-hero-reveal
            >
              <span className="block text-white">{aboutHeroContent.titleLineOne}</span>
              <span className="block text-[#00A650]">{aboutHeroContent.titleLineTwo}</span>
            </h1>
          </div>

          <p
            className="max-w-xl text-sm font-semibold leading-6 text-white/92 md:mt-12 md:text-base md:leading-7"
            data-about-hero-reveal
          >
            {aboutHeroContent.summary}
          </p>
        </div>
      </div>
    </section>
  )
}
