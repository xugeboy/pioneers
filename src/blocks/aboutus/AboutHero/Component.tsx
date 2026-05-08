'use client'
/* eslint-disable @next/next/no-img-element */

import { ArrowRight } from 'lucide-react'
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
          alt={aboutMedia.hero.alt}
          className="absolute inset-x-0 -inset-y-[8%] h-[116%] w-full object-cover object-[64%_center]"
          data-about-hero-image
          fetchPriority="high"
          src={aboutMedia.hero.url}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      <div className="container relative flex min-h-[42rem] items-center py-32 md:min-h-[48rem] md:py-40 lg:min-h-[54rem] lg:py-48">
        <div className="max-w-3xl">
          <h1
            className="mt-6 font-industrial text-5xl font-bold uppercase leading-[1.1] tracking-wide sm:text-6xl md:text-[4.75rem] lg:text-[5.5rem]"
            data-about-hero-reveal
          >
            <span className="block text-white">RUGGED BY PURPOSE,</span>
            <span className="block text-[#00A650]">CLEAR BY DESIGN.</span>
          </h1>
        </div>
      </div>
    </section>
  )
}
