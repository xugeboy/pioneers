'use client'

import { BadgeCheck, Leaf, ShieldCheck } from 'lucide-react'
import React, { useRef } from 'react'

import type { QualityControlBlock as QualityControlBlockProps } from '@/payload-types'

import { useScrollScene } from '@/utilities/gsap'

const qualityPoints = [
  {
    body: 'Selected for strength and long-term reliability.',
    icon: Leaf,
    title: 'Consistent Materials',
  },
  {
    body: 'Standardized processes ensure stable quality.',
    icon: ShieldCheck,
    title: 'Controlled Production',
  },
  {
    body: 'Tested to perform under real-world conditions.',
    icon: BadgeCheck,
    title: 'Verified Performance',
  },
] as const

export const QualityControlBlock: React.FC<
  QualityControlBlockProps & { disableInnerContainer?: boolean }
> = () => {
  const sectionRef = useRef<HTMLElement | null>(null)

  useScrollScene(sectionRef, ({ gsap, reduceMotion, scope }) => {
    if (reduceMotion) return

    gsap.from(scope.querySelectorAll('[data-qc-reveal]'), {
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
    <section className="relative isolate overflow-hidden bg-[#f8f8f4]">
      <div className="absolute inset-0" />

      <div className="container relative py-16 md:py-20 lg:py-24">
        <div className="mx-auto w-full text-center">
          <div className="mx-auto max-w-3xl">
            <h2
              className="text-4xl font-semibold leading-[1.12] tracking-[-0.04em] text-[#15191a] md:text-5xl"
              data-qc-reveal
            >
              Quality is built into every step.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3" data-qc-reveal>
            {qualityPoints.map((point) => {
              const Icon = point.icon

              return (
                <article
                  className="bg-white/55 px-6 py-7 text-center shadow-[0_16px_42px_rgba(21,25,26,0.04)]"
                  key={point.title}
                >
                  <div className="mx-auto flex size-14 items-center justify-center bg-[#829064]/10 text-[#76845c]">
                    <Icon className="size-8" strokeWidth={1.8} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold leading-7 text-[#15191a]">
                    {point.title}
                  </h3>
                  <p className="mx-auto mt-3 max-w-[15rem] text-sm leading-7 text-[#4d5252]">
                    {point.body}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
