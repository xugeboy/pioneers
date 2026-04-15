'use client'

import React, { useEffect, useRef } from 'react'

import type { CertificationsHeroBlock as CertificationsHeroBlockProps } from '@/payload-types'

import { certificationsPageContent } from '@/blocks/certifications/content'
import { Button } from '@/components/ui/button'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { useScrollScene } from '@/utilities/gsap'
import { ArrowDownToLine, ArrowRight, BadgeCheck } from 'lucide-react'
import Link from 'next/link'

export const CertificationsHeroBlock: React.FC<
  CertificationsHeroBlockProps & { disableInnerContainer?: boolean }
> = () => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  useScrollScene(sectionRef, ({ gsap, reduceMotion, scope }) => {
    if (reduceMotion) return

    gsap.from(scope.querySelectorAll('[data-hero-item]'), {
      duration: 0.8,
      ease: 'power2.out',
      opacity: 0,
      stagger: 0.08,
      y: 22,
    })
  })

  return (
    <section className="container" ref={sectionRef}>
      <div className="grid gap-8 overflow-hidden border border-[#d7dfd5] bg-[linear-gradient(180deg,#f8fbf7_0%,#eef4ed_100%)] px-6 py-8 shadow-[0_24px_60px_rgba(18,28,22,0.06)] md:px-10 md:py-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.52fr)] lg:items-start">
        <div className="max-w-4xl space-y-6">
          <p
            className="text-[0.74rem] font-semibold uppercase tracking-[0.28em] text-[#5e7264]"
            data-hero-item
          >
            Quality, testing and compliance
          </p>
          <div className="space-y-4">
            <h1
              className="max-w-4xl font-display text-4xl leading-tight text-[#162019] md:text-5xl"
              data-hero-item
            >
              {certificationsPageContent.hero.title}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-[#536258] md:text-lg" data-hero-item>
              {certificationsPageContent.hero.description}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row" data-hero-item>
            <Button
              asChild
              className="h-12 cursor-pointer rounded-none bg-[#36513f] px-6 text-white hover:bg-[#2b4032]"
              size="lg"
            >
              <a href={certificationsPageContent.hero.primaryHref}>
                {certificationsPageContent.hero.primaryLabel}
                <ArrowDownToLine className="size-4" />
              </a>
            </Button>

            <Button
              asChild
              className="h-12 cursor-pointer rounded-none border border-[#ced8cb] bg-white/80 px-6 text-[#162019] hover:bg-[#f6f8f4]"
              size="lg"
              variant="outline"
            >
              <Link href={certificationsPageContent.hero.secondaryHref}>
                {certificationsPageContent.hero.secondaryLabel}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap gap-3" data-hero-item>
            {certificationsPageContent.hero.trustBullets.map((bullet) => (
              <div
                className="inline-flex items-center gap-2 border border-[#d5ddd3] bg-white/80 px-3 py-2 text-sm font-medium text-[#294133]"
                key={bullet}
              >
                <BadgeCheck className="size-4 text-[#36513f]" />
                {bullet}
              </div>
            ))}
          </div>
        </div>

        <aside
          className="border border-[#d7dfd5] bg-white/78 p-5 shadow-[0_16px_36px_rgba(22,32,25,0.08)] backdrop-blur-sm"
          data-hero-item
        >
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#6c7d72]">
            Proof snapshot
          </p>
          <div className="mt-5 space-y-3">
            {certificationsPageContent.quickFacts.map((fact, index) => (
              <div
                className="flex items-start gap-3 border-b border-[#e1e6df] pb-3 last:border-b-0 last:pb-0"
                key={fact}
              >
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center border border-[#d7dfd5] bg-[#eff4ef] text-sm font-semibold text-[#294133]">
                  0{index + 1}
                </span>
                <p className="text-sm leading-6 text-[#4f6056]">{fact}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}

