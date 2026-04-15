'use client'

import React, { useRef } from 'react'

import type { CertificationsProofCardsBlock as CertificationsProofCardsBlockProps } from '@/payload-types'

import { certificationsPageContent } from '@/blocks/certifications/content'
import { useScrollScene } from '@/utilities/gsap'
import { cn } from '@/utilities/ui'
import { BadgeCheck, Download, PackageCheck, ScanSearch, ShieldCheck } from 'lucide-react'

const proofIcons = [BadgeCheck, ShieldCheck, ScanSearch, PackageCheck] as const

const statusClasses: Record<(typeof certificationsPageContent.proofCards)[number]['status'], string> = {
  Available: 'border-[#d7dfd5] bg-[#eef4ee] text-[#294133]',
  Documented: 'border-[#d4d9e5] bg-[#eef2fb] text-[#203454]',
  Prepared: 'border-[#e2dbc8] bg-[#f5f0e2] text-[#5a4720]',
}

export const CertificationsProofCardsBlock: React.FC<
  CertificationsProofCardsBlockProps & { disableInnerContainer?: boolean }
> = () => {
  const sectionRef = useRef<HTMLElement | null>(null)

  useScrollScene(sectionRef, ({ gsap, reduceMotion, scope }) => {
    if (reduceMotion) return

    gsap.from(scope.querySelectorAll('[data-proof-card]'), {
      duration: 0.7,
      ease: 'power2.out',
      opacity: 0,
      stagger: 0.1,
      scrollTrigger: {
        start: 'top 78%',
        toggleActions: 'play none none reverse',
        trigger: scope,
      },
      y: 22,
    })
  })

  return (
    <section className="container" ref={sectionRef}>
      <div className="max-w-3xl space-y-4">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#5e7264]">
          Certification proof cards
        </p>
        <h2 className="font-display text-3xl leading-tight text-[#162019] md:text-4xl">
          Document-style proof tiles that let technical buyers scan readiness quickly.
        </h2>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {certificationsPageContent.proofCards.map((item, index) => {
          const Icon = proofIcons[index]

          return (
            <article
              className="group flex h-full flex-col border border-[#d7dfd5] bg-[#fbfcfa] p-5 shadow-[0_16px_40px_rgba(22,32,25,0.06)] transition-[border-color,box-shadow] duration-200 hover:border-[#36513f] hover:shadow-[0_22px_44px_rgba(22,32,25,0.12)]"
              data-proof-card
              key={item.title}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-11 items-center justify-center border border-[#d7dfd5] bg-white text-[#36513f]">
                  <Icon className="size-5" />
                </span>
                <span
                  className={cn(
                    'border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em]',
                    statusClasses[item.status],
                  )}
                >
                  {item.status}
                </span>
              </div>

              <div className="mt-5 space-y-3">
                <h3 className="font-display text-2xl leading-tight text-[#162019]">{item.title}</h3>
                <p className="text-sm leading-6 text-[#526258]">{item.summary}</p>
              </div>

              <dl className="mt-6 space-y-4 border-t border-[#e1e6df] pt-5 text-sm">
                <div>
                  <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#7a887f]">
                    Issuer
                  </dt>
                  <dd className="mt-1 text-[#213126]">{item.issuer}</dd>
                </div>
                <div>
                  <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#7a887f]">
                    Scope
                  </dt>
                  <dd className="mt-1 text-[#435449]">{item.scope}</dd>
                </div>
              </dl>

              {item.assetHref ? (
                <a
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#36513f] transition-colors duration-200 hover:text-[#24382c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#36513f]/25"
                  download
                  href={item.assetHref}
                >
                  {item.assetLabel || 'Download file'}
                  <Download className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </a>
              ) : null}
            </article>
          )
        })}
      </div>
    </section>
  )
}
