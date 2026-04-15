'use client'

import React, { useRef } from 'react'

import type { CapacityCapabilityBlock as CapacityCapabilityBlockProps } from '@/payload-types'

import { manufacturingCapacityContent } from '@/blocks/manufacturing/content'
import { useScrollScene } from '@/utilities/gsap'

export const CapacityCapabilityBlock: React.FC<
  CapacityCapabilityBlockProps & { disableInnerContainer?: boolean }
> = () => {
  const sectionRef = useRef<HTMLElement | null>(null)

  useScrollScene(sectionRef, ({ gsap, reduceMotion, scope }) => {
    if (reduceMotion) return

    gsap.from(scope.querySelectorAll('[data-capacity-card]'), {
      duration: 0.75,
      ease: 'power2.out',
      opacity: 0,
      stagger: 0.08,
      scrollTrigger: {
        start: 'top 80%',
        toggleActions: 'play none none reverse',
        trigger: scope,
      },
      y: 18,
    })
  })

  return (
    <section className="bg-[#ece7df]" ref={sectionRef}>
      <div className="container py-[4.5rem] md:py-24">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#00a650]">
            {manufacturingCapacityContent.eyebrow}
          </p>
          <h2 className="mt-4 font-industrial text-4xl uppercase leading-[0.92] tracking-[-0.04em] text-[#10203a] md:text-6xl">
            {manufacturingCapacityContent.title}
          </h2>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {manufacturingCapacityContent.items.map((item) => (
            <article
              className="border border-[#10203a]/12 bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)]"
              data-capacity-card
              key={item.label}
            >
              <p className="text-2xl font-semibold uppercase tracking-[0.12em] text-[#10203a]">
                {item.value}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
