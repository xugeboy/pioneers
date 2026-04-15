'use client'

import React, { useRef } from 'react'

import type { AboutClientsBlock as AboutClientsBlockProps } from '@/payload-types'

import { aboutClientsContent } from '@/blocks/aboutus/content'
import { useScrollScene } from '@/utilities/gsap'

export const AboutClientsBlock: React.FC<
  AboutClientsBlockProps & { disableInnerContainer?: boolean }
> = () => {
  const sectionRef = useRef<HTMLElement | null>(null)

  useScrollScene(sectionRef, ({ gsap, reduceMotion, scope }) => {
    const cards = scope.querySelectorAll<HTMLElement>('[data-client-card]')

    if (reduceMotion) return

    gsap.from(scope.querySelectorAll<HTMLElement>('[data-client-copy]'), {
      duration: 0.7,
      ease: 'power2.out',
      opacity: 0,
      stagger: 0.06,
      scrollTrigger: {
        start: 'top 82%',
        toggleActions: 'play none none reverse',
        trigger: scope,
      },
      y: 20,
    })

    gsap.from(cards, {
      delay: 0.12,
      duration: 0.8,
      ease: 'power2.out',
      opacity: 0,
      stagger: 0.1,
      scrollTrigger: {
        start: 'top 78%',
        toggleActions: 'play none none reverse',
        trigger: scope,
      },
      y: 26,
    })
  })

  return (
    <section className="bg-[#e8e1d6]" ref={sectionRef}>
      <div className="container py-18 md:py-24">
        <div className="max-w-3xl">
          <h2 className="mt-4 max-w-5xl font-industrial text-4xl uppercase leading-[0.9] tracking-[-0.05em] text-[#10203a] md:text-6xl lg:text-[4.75rem]">
            {aboutClientsContent.eyebrow}
          </h2>
          <p
            className="mt-5 max-w-2xl text-lg leading-8 text-[#10203a] md:text-xl md:leading-9"
            data-client-copy
          >
            {aboutClientsContent.title}
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {aboutClientsContent.items.map((item) => (
            <article
              className="group flex min-h-52 flex-col justify-between border border-[#10203a]/10 bg-[#f8f6f1] p-6 transition-[border-color,background-color,transform] duration-200 hover:-translate-y-1 hover:border-[#10203a]/18"
              data-client-card
              key={item.kicker}
            >
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#00a650]">
                {item.kicker}
              </div>

              <div className="mt-10">
                <p className="font-industrial text-[3.4rem] uppercase leading-none tracking-[-0.05em] text-[#10203a] md:text-[4rem]">
                  {item.metric}
                </p>
                <p className="mt-4 max-w-[18ch] text-base leading-7 text-[#10203a]">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
