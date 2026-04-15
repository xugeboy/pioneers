'use client'

import { CheckCheck, PackageCheck, ScanSearch, ShieldCheck } from 'lucide-react'
import React, { useRef } from 'react'

import type { QualityControlBlock as QualityControlBlockProps } from '@/payload-types'

import { manufacturingQualityContent } from '@/blocks/manufacturing/content'
import { useScrollScene } from '@/utilities/gsap'

const icons = [ShieldCheck, ScanSearch, CheckCheck, PackageCheck] as const

export const QualityControlBlock: React.FC<
  QualityControlBlockProps & { disableInnerContainer?: boolean }
> = () => {
  const sectionRef = useRef<HTMLElement | null>(null)

  useScrollScene(sectionRef, ({ gsap, reduceMotion, scope }) => {
    if (reduceMotion) return

    gsap.from(scope.querySelectorAll('[data-qc-card]'), {
      duration: 0.8,
      ease: 'power2.out',
      opacity: 0,
      stagger: 0.1,
      scrollTrigger: {
        start: 'top 80%',
        toggleActions: 'play none none reverse',
        trigger: scope,
      },
      y: 22,
    })
  })

  return (
    <section className="bg-[#10203a] text-white" ref={sectionRef}>
      <div className="container py-[4.5rem] md:py-24">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#90ebb1]">
            {manufacturingQualityContent.eyebrow}
          </p>
          <h2 className="mt-4 font-industrial text-4xl uppercase leading-[0.92] tracking-[-0.04em] text-white md:text-6xl">
            {manufacturingQualityContent.title}
          </h2>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {manufacturingQualityContent.items.map((item, index) => {
            const Icon = icons[index]

            return (
              <article
                className="border border-white/12 bg-white/5 p-6 shadow-[0_18px_44px_rgba(2,6,23,0.22)]"
                data-qc-card
                key={item.title}
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center border border-[#00a650]/40 bg-[#00a650]/10 text-[#90ebb1]">
                    <Icon className="size-5" />
                  </span>
                  <span className="h-1.5 w-12 bg-[#00a650]" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold uppercase tracking-[-0.03em] text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-8 text-slate-300">{item.body}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
