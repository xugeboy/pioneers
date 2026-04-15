'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useRef } from 'react'

import type { EquipmentVisualsBlock as EquipmentVisualsBlockProps } from '@/payload-types'

import { manufacturingEquipmentContent } from '@/blocks/manufacturing/content'
import { useScrollScene } from '@/utilities/gsap'

const cardSpans = [
  'lg:col-span-7 lg:row-span-2',
  'lg:col-span-5',
  'lg:col-span-5',
  'lg:col-span-7',
  'lg:col-span-12',
] as const

export const EquipmentVisualsBlock: React.FC<
  EquipmentVisualsBlockProps & { disableInnerContainer?: boolean }
> = () => {
  const sectionRef = useRef<HTMLElement | null>(null)

  useScrollScene(sectionRef, ({ gsap, reduceMotion, scope }) => {
    if (reduceMotion) return

    gsap.from(scope.querySelectorAll('[data-equipment-card]'), {
      duration: 0.85,
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
    <section className="bg-white" ref={sectionRef}>
      <div className="container py-[4.5rem] md:py-24">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#00a650]">
            {manufacturingEquipmentContent.eyebrow}
          </p>
          <h2 className="mt-4 font-industrial text-4xl uppercase leading-[0.92] tracking-[-0.04em] text-[#10203a] md:text-6xl">
            {manufacturingEquipmentContent.title}
          </h2>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          {manufacturingEquipmentContent.items.map((item, index) => (
            <article
              className={`${cardSpans[index]} group overflow-hidden border border-slate-200 bg-[#f8fafc] shadow-[0_14px_36px_rgba(15,23,42,0.05)]`}
              data-equipment-card
              key={item.title}
            >
              <div className="relative">
                <div className={index === 0 ? 'aspect-[4/5]' : 'aspect-[16/10]'}>
                  <img
                    alt={item.image.alt}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                    src={item.image.url}
                    style={{ objectPosition: item.image.position }}
                  />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,32,58,0.06)_0%,rgba(16,32,58,0.7)_100%)] opacity-85 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#90ebb1]">
                    Equipment visual
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold uppercase tracking-[-0.03em] text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-200">{item.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
