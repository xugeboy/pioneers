'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useRef } from 'react'

import type { AboutAdvantageBlock as AboutAdvantageBlockProps } from '@/payload-types'

import { AboutTeamSection } from '@/blocks/aboutus/AboutTeam/Component'
import { aboutAdvantageContent } from '@/blocks/aboutus/content'
import { useScrollScene } from '@/utilities/gsap'

export const AboutAdvantageBlock: React.FC<
  AboutAdvantageBlockProps & { disableInnerContainer?: boolean }
> = () => {
  const sectionRef = useRef<HTMLElement | null>(null)

  useScrollScene(sectionRef, ({ gsap, reduceMotion, scope }) => {
    if (reduceMotion) return

    gsap.from(scope.querySelectorAll<HTMLElement>('[data-advantage-reveal]'), {
      duration: 0.75,
      ease: 'power2.out',
      opacity: 0,
      stagger: 0.08,
      scrollTrigger: {
        start: 'top 82%',
        toggleActions: 'play none none reverse',
        trigger: scope,
      },
      y: 24,
    })
  })

  return (
    <section className="bg-white text-[#202833]" ref={sectionRef}>
      <div className="py-10 md:py-12">
        <div className="container text-center" data-advantage-reveal>
          <h2 className="font-industrial text-2xl font-bold uppercase tracking-wide text-[#202833] md:text-3xl">
            {aboutAdvantageContent.summaryTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl leading-7 text-[#5f6670] md:text-lg">
            {aboutAdvantageContent.summary}
          </p>
        </div>

        <div className="mt-8 grid gap-4 px-4 xl:grid-cols-3 md:px-6 xl:px-8">
          {aboutAdvantageContent.cards.map((card) => (
            <article
              className="relative min-h-[14rem] overflow-hidden bg-[#1f2933] text-center text-white"
              data-advantage-reveal
              key={card.title}
            >
              <img
                alt={card.image.alt}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                src={card.image.url}
              />
              <div className="absolute inset-0 bg-black/48" />
              <div className="relative flex min-h-[22rem] flex-col items-center justify-center px-6 py-8">
                <h3 className="max-w-[22rem] font-industrial text-4xl font-bold uppercase leading-[0.95] tracking-wide text-white md:text-[2.5rem]">
                  {card.title}
                </h3>
                <ul className="mt-4 space-y-1 text-lg font-medium leading-5 text-white/92">
                  {card.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <AboutTeamSection />
      </div>
    </section>
  )
}
