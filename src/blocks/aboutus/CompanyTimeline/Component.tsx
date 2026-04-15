'use client'

import React, { useRef, useState } from 'react'

import type { CompanyTimelineBlock as CompanyTimelineBlockProps } from '@/payload-types'

import { aboutTimelineContent } from '@/blocks/aboutus/content'
import { useScrollScene } from '@/utilities/gsap'
import { cn } from '@/utilities/ui'

export const CompanyTimelineBlock: React.FC<
  CompanyTimelineBlockProps & { disableInnerContainer?: boolean }
> = () => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useScrollScene(sectionRef, ({ ScrollTrigger, gsap, reduceMotion, scope }) => {
    const cards = scope.querySelectorAll<HTMLElement>('[data-timeline-card]')

    cards.forEach((card, index) => {
      ScrollTrigger.create({
        onEnter: () => {
          setActiveIndex(index)
        },
        onEnterBack: () => {
          setActiveIndex(index)
        },
        start: 'top 70%',
        trigger: card,
      })

      if (reduceMotion) return

      gsap.from(card, {
        duration: 0.85,
        ease: 'power2.out',
        opacity: 0,
        scrollTrigger: {
          start: 'top 82%',
          toggleActions: 'play none none reverse',
          trigger: card,
        },
        x: index % 2 === 0 ? -30 : 30,
        y: 24,
      })
    })
  })

  return (
    <section className="bg-[#0f172a] text-white" ref={sectionRef}>
      <div className="container py-18 md:py-24">
        <div className="max-w-4xl">
          <h2 className="max-w-5xl font-industrial text-4xl uppercase leading-[0.9] tracking-[-0.05em] text-white md:text-6xl lg:text-[4.75rem]">
            {aboutTimelineContent.title}
          </h2>
        </div>

        <div className="relative mt-12">
          <div className="absolute bottom-0 left-[0.65rem] top-0 w-px bg-white/18 md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-8 md:space-y-10">
            {aboutTimelineContent.events.map((event, index) => {
              const isActive = activeIndex === index
              const isLeft = index % 2 === 0

              return (
                <article
                  className="relative grid pl-8 md:grid-cols-2 md:pl-0"
                  data-timeline-card
                  key={event.year}
                >
                  <span
                    className={cn(
                      'absolute left-[0.65rem] top-8 z-10 block size-3 -translate-x-1/2 rounded-full border-2 border-white transition-colors duration-200 md:left-1/2',
                      isActive ? 'bg-[#00a650]' : 'bg-white/30',
                    )}
                  />

                  <div
                    className={cn(
                      'md:px-10',
                      isLeft ? 'md:col-start-1 md:pr-14 md:text-right' : 'md:col-start-2 md:pl-14',
                    )}
                  >
                    <div
                      className={cn(
                        'border bg-white/5 p-6 shadow-[0_18px_44px_rgba(2,6,23,0.2)] transition-[border-color,transform,box-shadow,background-color] duration-200 md:p-7',
                        isActive ? 'border-[#00a650]/50 bg-white/8' : 'border-white/12 bg-white/3',
                      )}
                    >
                      <p
                        className={cn(
                          'text-2xl font-semibold uppercase leading-none tracking-[0.14em] transition-colors duration-200 md:text-3xl',
                          isActive ? 'text-[#90ebb1]' : 'text-white',
                        )}
                      >
                        {event.year}
                      </p>
                      <h3 className="mt-4 text-2xl font-semibold uppercase tracking-[-0.03em] text-white">
                        {event.title}
                      </h3>
                      <p className="mt-3 text-base leading-8 text-slate-300">{event.description}</p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
