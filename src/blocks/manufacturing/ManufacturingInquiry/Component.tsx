'use client'
/* eslint-disable @next/next/no-img-element */

import { ArrowRight, ClipboardCheck, Globe2, MessageCircleMore } from 'lucide-react'
import Link from 'next/link'
import React, { useRef } from 'react'

import type { ManufacturingInquiryBlock as ManufacturingInquiryBlockProps } from '@/payload-types'

import { manufacturingMedia } from '@/blocks/manufacturing/content'
import { Button } from '@/components/ui/button'
import { useScrollScene } from '@/utilities/gsap'

const trustItems = [
  {
    body: 'Replies within 24 hours',
    icon: MessageCircleMore,
    title: 'Quick Response',
  },
  {
    body: 'Serving 50+ countries worldwide',
    icon: Globe2,
    title: 'Global Experience',
  },
  {
    body: 'Consistent quality, on-time delivery',
    icon: ClipboardCheck,
    title: 'Reliable Partner',
  },
] as const

export const ManufacturingInquiryBlock: React.FC<
  ManufacturingInquiryBlockProps & { disableInnerContainer?: boolean }
> = () => {
  const sectionRef = useRef<HTMLElement | null>(null)

  useScrollScene(sectionRef, ({ gsap, reduceMotion, scope }) => {
    if (reduceMotion) return

    gsap.from(scope.querySelectorAll('[data-inquiry-reveal]'), {
      duration: 0.8,
      ease: 'power2.out',
      opacity: 0,
      stagger: 0.07,
      scrollTrigger: {
        start: 'top 84%',
        toggleActions: 'play none none reverse',
        trigger: scope,
      },
      y: 20,
    })
  })

  return (
    <section
      className="relative isolate overflow-hidden border-y border-white/12 bg-[#111a14] text-white"
      data-theme="dark"
      ref={sectionRef}
    >
      <div className="absolute inset-0">
        <img
          alt={manufacturingMedia.cta.alt}
          className="h-full w-full object-cover object-center opacity-55"
          loading="lazy"
          src={manufacturingMedia.cta.url}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,26,20,0.72)_0%,rgba(17,26,20,0.64)_43%,rgba(17,26,20,0.38)_68%,rgba(17,26,20,0.56)_100%)]" />
        <div className="absolute inset-0 bg-black/5" />
      </div>

      <div className="container relative py-16 md:py-20 lg:min-h-[26rem] lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,40rem)_1fr] xl:gap-16">
          <div>
            <h2
              className="mt-5 max-w-[38rem] text-3xl font-semibold leading-tight tracking-[-0.04em] text-white md:text-4xl"
              data-inquiry-reveal
            >
              Ready to build your next reliable product?
            </h2>
            <p className="mt-3 max-w-[35rem] text-base leading-7 text-white/76" data-inquiry-reveal>
              We&apos;re here to support your project from concept to delivery.
            </p>

            <div className="mt-7 flex flex-col gap-4 sm:flex-row" data-inquiry-reveal>
              <Button
                asChild
                className="h-14 min-w-[13rem] rounded-[3px] border border-[#00A650] bg-[#00A650] px-7 text-sm font-bold uppercase tracking-[0.08em] text-white hover:border-[#00A650] hover:bg-[#00A650]"
                size="clear"
              >
                <Link className="flex items-center justify-center gap-5" href="/request-quote">
                  TALK TO OUR TEAM
                  <ArrowRight className="size-4" />
                </Link>
              </Button>

              <Button
                asChild
                className="h-14 min-w-[17.5rem] rounded-[3px] border border-white/42 bg-transparent px-7 text-sm font-bold uppercase tracking-[0.08em] text-white hover:border-white hover:bg-white hover:text-[#111a14]"
                size="clear"
                variant="outline"
              >
                <Link className="flex items-center justify-center gap-5" href="/request-quote">
                  REQUEST FACTORY OVERVIEW
                  <ClipboardCheck className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div
            className="hidden gap-6 md:grid-cols-3 md:gap-0 2xl:grid 2xl:border-l 2xl:border-white/18"
            data-inquiry-reveal
          >
            {trustItems.map((item, index) => {
              const Icon = item.icon

              return (
                <article
                  className={`text-center md:px-6 ${index > 0 ? 'md:border-l md:border-white/18' : ''}`}
                  key={item.title}
                >
                  <Icon className="mx-auto size-10 text-white" strokeWidth={1.65} />
                  <h3 className="mt-4 text-base font-bold leading-6 text-white">{item.title}</h3>
                  <p className="mx-auto mt-3 max-w-[10rem] text-sm leading-7 text-white/76">
                    {item.body}
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
