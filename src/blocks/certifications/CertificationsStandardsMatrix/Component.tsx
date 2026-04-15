'use client'

import React, { useRef } from 'react'

import type { CertificationsStandardsMatrixBlock as CertificationsStandardsMatrixBlockProps } from '@/payload-types'

import { certificationsPageContent } from '@/blocks/certifications/content'
import { useScrollScene } from '@/utilities/gsap'

export const CertificationsStandardsMatrixBlock: React.FC<
  CertificationsStandardsMatrixBlockProps & { disableInnerContainer?: boolean }
> = () => {
  const sectionRef = useRef<HTMLElement | null>(null)

  useScrollScene(sectionRef, ({ gsap, reduceMotion, scope }) => {
    if (reduceMotion) return

    gsap.from(scope.querySelectorAll('[data-standard-row]'), {
      duration: 0.66,
      ease: 'power2.out',
      opacity: 0,
      stagger: 0.05,
      scrollTrigger: {
        start: 'top 78%',
        toggleActions: 'play none none reverse',
        trigger: scope,
      },
      x: -18,
    })
  })

  return (
    <section className="container" ref={sectionRef}>
      <div className="max-w-3xl space-y-4">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#5e7264]">
          Standards and compliance matrix
        </p>
        <h2 className="font-display text-3xl leading-tight text-[#162019] md:text-4xl">
          Structured around the questions technical buyers usually ask before approval.
        </h2>
      </div>

      <div className="mt-8 space-y-6">
        {certificationsPageContent.standardsGroups.map((group) => (
          <section
            className="overflow-hidden border border-[#d7dfd5] bg-[#fbfcfa] shadow-[0_16px_36px_rgba(22,32,25,0.06)]"
            key={group.title}
          >
            <div className="grid lg:grid-cols-[18rem_minmax(0,1fr)]">
              <div className="border-b border-[#dfe5de] bg-[#f2f6f1] p-6 lg:border-b-0 lg:border-r">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#6c7b71]">
                  Group
                </p>
                <h3 className="mt-3 font-display text-2xl text-[#162019]">{group.title}</h3>
              </div>

              <div className="divide-y divide-[#e4e9e3]">
                {group.items.map((item) => (
                  <div
                    className="grid gap-4 p-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)_minmax(0,1fr)]"
                    data-standard-row
                    key={item.title}
                  >
                    <div className="flex gap-3">
                      <span className="mt-1 h-10 w-1 shrink-0 bg-[#36513f]" />
                      <div>
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#718178]">
                          Item
                        </p>
                        <h4 className="mt-2 text-lg font-semibold text-[#162019]">{item.title}</h4>
                      </div>
                    </div>

                    <div>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#718178]">
                        What it covers
                      </p>
                      <p className="mt-2 text-sm leading-7 text-[#526258]">{item.whatItCovers}</p>
                    </div>

                    <div>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#718178]">
                        How Pioneers addresses it
                      </p>
                      <p className="mt-2 text-sm leading-7 text-[#526258]">{item.response}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </section>
  )
}
