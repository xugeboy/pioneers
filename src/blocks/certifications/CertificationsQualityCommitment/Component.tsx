'use client'

import React, { useRef } from 'react'

import type { CertificationsQualityCommitmentBlock as CertificationsQualityCommitmentBlockProps } from '@/payload-types'

import { certificationsPageContent } from '@/blocks/certifications/content'
import { useScrollScene } from '@/utilities/gsap'
import { CheckCheck, FileText, ShieldCheck } from 'lucide-react'

const commitmentIcons = [CheckCheck, FileText, ShieldCheck] as const

export const CertificationsQualityCommitmentBlock: React.FC<
  CertificationsQualityCommitmentBlockProps & { disableInnerContainer?: boolean }
> = () => {
  const sectionRef = useRef<HTMLElement | null>(null)

  useScrollScene(sectionRef, ({ gsap, reduceMotion, scope }) => {
    if (reduceMotion) return

    gsap.from(scope.querySelectorAll('[data-commitment-card]'), {
      duration: 0.7,
      ease: 'power2.out',
      opacity: 0,
      stagger: 0.09,
      scrollTrigger: {
        start: 'top 80%',
        toggleActions: 'play none none reverse',
        trigger: scope,
      },
      y: 20,
    })
  })

  return (
    <section className="container" ref={sectionRef}>
      <div className="overflow-hidden border border-[#d8dfd6] bg-[linear-gradient(180deg,#f8fbf7_0%,#eff4ee_100%)] px-6 py-10 shadow-[0_18px_42px_rgba(22,32,25,0.06)] md:px-10 md:py-12">
        <div className="max-w-3xl">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#5e7264]">
            Quality commitment
          </p>
          <h2 className="mt-4 font-display text-3xl leading-tight text-[#162019] md:text-4xl">
            The operational habits behind the proof.
          </h2>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {certificationsPageContent.commitments.map((item, index) => {
            const Icon = commitmentIcons[index]

            return (
              <article
                className="border border-[#d6ddd4] bg-white/88 p-6 shadow-[0_14px_32px_rgba(22,32,25,0.06)] backdrop-blur-sm"
                data-commitment-card
                key={item.title}
              >
                <span className="flex size-12 items-center justify-center border border-[#d7dfd5] bg-[#eff4ef] text-[#36513f]">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-2xl text-[#162019]">{item.title}</h3>
                <p className="mt-3 text-base leading-7 text-[#526258]">{item.body}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

