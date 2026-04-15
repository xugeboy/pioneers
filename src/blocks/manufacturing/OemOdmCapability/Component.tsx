'use client'

import Link from 'next/link'
import React, { useRef } from 'react'

import type { OemOdmCapabilityBlock as OemOdmCapabilityBlockProps } from '@/payload-types'

import { manufacturingOemOdmContent } from '@/blocks/manufacturing/content'
import { Button } from '@/components/ui/button'
import { useScrollScene } from '@/utilities/gsap'

export const OemOdmCapabilityBlock: React.FC<
  OemOdmCapabilityBlockProps & { disableInnerContainer?: boolean }
> = () => {
  const sectionRef = useRef<HTMLElement | null>(null)

  useScrollScene(sectionRef, ({ gsap, reduceMotion, scope }) => {
    if (reduceMotion) return

    gsap.from(scope.querySelectorAll('[data-oemodm-reveal]'), {
      duration: 0.8,
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
            {manufacturingOemOdmContent.eyebrow}
          </p>
          <h2 className="mt-4 font-industrial text-4xl uppercase leading-[0.92] tracking-[-0.04em] text-[#10203a] md:text-6xl">
            {manufacturingOemOdmContent.title}
          </h2>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-stretch">
          <article className="border border-slate-200 bg-[#f5f7fb] p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] md:p-7" data-oemodm-reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#10203a]">OEM</p>
            <h3 className="mt-4 text-2xl font-semibold uppercase tracking-[-0.03em] text-[#10203a]">
              {manufacturingOemOdmContent.oem.title}
            </h3>
            <ul className="mt-5 grid gap-3 text-sm leading-7 text-slate-600">
              {manufacturingOemOdmContent.oem.points.map((point) => (
                <li className="border-l-2 border-[#00a650] pl-4" key={point}>
                  {point}
                </li>
              ))}
            </ul>
          </article>

          <div className="flex flex-col items-center justify-center gap-3 px-2" data-oemodm-reveal>
            {manufacturingOemOdmContent.shared.map((item) => (
              <span
                className="whitespace-nowrap border border-[#10203a]/12 bg-[#ece7df] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#10203a]"
                key={item}
              >
                {item}
              </span>
            ))}
          </div>

          <article className="border border-slate-200 bg-[#10203a] p-6 text-white shadow-[0_14px_36px_rgba(15,23,42,0.12)] md:p-7" data-oemodm-reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white">ODM</p>
            <h3 className="mt-4 text-2xl font-semibold uppercase tracking-[-0.03em] text-white">
              {manufacturingOemOdmContent.odm.title}
            </h3>
            <ul className="mt-5 grid gap-3 text-sm leading-7 text-slate-200">
              {manufacturingOemOdmContent.odm.points.map((point) => (
                <li className="border-l-2 border-[#00a650] pl-4" key={point}>
                  {point}
                </li>
              ))}
            </ul>
          </article>
        </div>

        <div className="mt-8 flex justify-start" data-oemodm-reveal>
          <Button
            asChild
            className="h-12 rounded-none border border-[#00a650] bg-[#00a650] px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white hover:border-[#119d52] hover:bg-[#119d52]"
            size="clear"
          >
            <Link href={manufacturingOemOdmContent.ctaHref}>{manufacturingOemOdmContent.ctaLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
