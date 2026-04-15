'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useRef, useState } from 'react'

import type { AboutDifferentiatorsBlock as AboutDifferentiatorsBlockProps } from '@/payload-types'

import { aboutDifferentiatorsContent, aboutMedia } from '@/blocks/aboutus/content'
import { cn } from '@/utilities/ui'
import { useScrollScene } from '@/utilities/gsap'

export const AboutDifferentiatorsBlock: React.FC<
  AboutDifferentiatorsBlockProps & { disableInnerContainer?: boolean }
> = () => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useScrollScene(sectionRef, ({ ScrollTrigger, gsap, isDesktop, reduceMotion, scope }) => {
    const cards = scope.querySelectorAll<HTMLElement>('[data-diff-card]')
    const image = scope.querySelector<HTMLElement>('[data-diff-image]')

    if (!reduceMotion && image) {
      gsap.fromTo(
        image,
        { scale: 1.04 },
        {
          duration: 1.1,
          ease: 'power2.out',
          scale: 1,
          scrollTrigger: {
            start: 'top 78%',
            toggleActions: 'play none none reverse',
            trigger: scope,
          },
        },
      )
    }

    cards.forEach((card, index) => {
      ScrollTrigger.create({
        onEnter: () => {
          setActiveIndex(index)
        },
        onEnterBack: () => {
          setActiveIndex(index)
        },
        start: isDesktop ? 'top center' : 'top 78%',
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
        x: index % 2 === 0 ? -24 : 24,
        y: 24,
      })
    })
  })

  return (
    <section className="bg-white" ref={sectionRef}>
      <div className="container py-18 md:py-24">
        <div className="max-w-3xl">
          <h2 className="max-w-5xl font-industrial text-4xl uppercase leading-[0.9] tracking-[-0.05em] text-[#10203a] md:text-6xl lg:text-[4.75rem]">
            {aboutDifferentiatorsContent.eyebrow}
          </h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative overflow-hidden bg-[#ece7df] shadow-[0_22px_60px_rgba(15,23,42,0.14)]">
              <div className="aspect-4/5 overflow-hidden">
                <img
                  alt={aboutMedia.differentiators.alt}
                  className="h-full w-full object-cover object-[60%_center]"
                  data-diff-image
                  loading="lazy"
                  src={aboutMedia.differentiators.url}
                />
              </div>

              <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(16,32,58,0)_0%,rgba(16,32,58,0.82)_100%)] p-6 text-white md:p-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-2xl font-semibold uppercase leading-none tracking-[0.14em] md:text-3xl">
                      {aboutDifferentiatorsContent.items[activeIndex]?.metric}
                    </p>
                    <p className="mt-3 max-w-sm text-sm leading-7 text-slate-200">
                      {aboutDifferentiatorsContent.items[activeIndex]?.title}
                    </p>
                  </div>

                  <div className="hidden text-right text-sm uppercase tracking-[0.18em] text-white/70 md:block">
                    <div>{activeIndex + 1}</div>
                    <div>/ {aboutDifferentiatorsContent.items.length}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {aboutDifferentiatorsContent.items.map((item, index) => {
              const isActive = activeIndex === index

              return (
                <article
                  className={cn(
                    'border p-6 transition-[transform,border-color,box-shadow,background-color] duration-300 md:p-7',
                    isActive
                      ? 'border-[#10203a] bg-[#10203a] text-white shadow-[0_20px_48px_rgba(15,23,42,0.18)]'
                      : 'border-slate-200 bg-[#f8fafc] text-[#10203a] shadow-[0_10px_28px_rgba(15,23,42,0.05)]',
                  )}
                  data-diff-card
                  key={item.title}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="max-w-2xl">
                      <h3 className="text-2xl font-semibold uppercase tracking-[-0.03em]">
                        {item.title}
                      </h3>
                      <p
                        className={cn(
                          'mt-3 text-base leading-8',
                          isActive ? 'text-slate-200' : 'text-slate-600',
                        )}
                      >
                        {item.body}
                      </p>
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
