'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useRef, useState } from 'react'

import type { FactoryGalleryBlock as FactoryGalleryBlockProps } from '@/payload-types'

import { manufacturingGalleryContent } from '@/blocks/manufacturing/content'
import { useScrollScene } from '@/utilities/gsap'
import { cn } from '@/utilities/ui'

export const FactoryGalleryBlock: React.FC<
  FactoryGalleryBlockProps & { disableInnerContainer?: boolean }
> = () => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  useEffect(() => {
    document.body.style.overflow = selectedIndex !== null ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedIndex])

  useScrollScene(sectionRef, ({ gsap, reduceMotion, scope }) => {
    if (reduceMotion) return

    gsap.from(scope.querySelectorAll('[data-gallery-card]'), {
      duration: 0.8,
      ease: 'power2.out',
      opacity: 0,
      stagger: 0.08,
      scrollTrigger: {
        start: 'top 80%',
        toggleActions: 'play none none reverse',
        trigger: scope,
      },
      y: 20,
    })
  })

  const selectedItem =
    selectedIndex !== null ? manufacturingGalleryContent.items[selectedIndex] : null

  return (
    <section className="bg-[#f5f7fb]" ref={sectionRef}>
      <div className="container py-[4.5rem] md:py-24">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#00a650]">
            {manufacturingGalleryContent.eyebrow}
          </p>
          <h2 className="mt-4 font-industrial text-4xl uppercase leading-[0.92] tracking-[-0.04em] text-[#10203a] md:text-6xl">
            {manufacturingGalleryContent.title}
          </h2>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-12">
          {manufacturingGalleryContent.items.map((item, index) => (
            <button
              className={cn(
                'group overflow-hidden border border-slate-200 bg-white text-left shadow-[0_14px_36px_rgba(15,23,42,0.05)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(15,23,42,0.1)]',
                index % 3 === 0 ? 'xl:col-span-5' : index % 3 === 1 ? 'xl:col-span-3' : 'xl:col-span-4',
              )}
              data-gallery-card
              key={`${item.title}-${index}`}
              onClick={() => setSelectedIndex(index)}
              type="button"
            >
              <div className={item.ratio}>
                <img
                  alt={item.image.alt}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                  src={item.image.url}
                  style={{ objectPosition: item.image.position }}
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold uppercase tracking-[-0.03em] text-[#10203a]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.caption}</p>
              </div>
            </button>
          ))}
        </div>

        {selectedItem ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/90 p-4 md:p-8">
            <button
              aria-label="Close gallery image"
              className="absolute right-4 top-4 border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-white hover:text-[#10203a] md:right-8 md:top-8"
              onClick={() => setSelectedIndex(null)}
              type="button"
            >
              Close
            </button>
            <div className="mx-auto w-full max-w-5xl overflow-hidden bg-white">
              <div className="max-h-[72vh] overflow-hidden bg-[#0f172a]">
                <img
                  alt={selectedItem.image.alt}
                  className="h-full max-h-[72vh] w-full object-contain"
                  src={selectedItem.image.url}
                />
              </div>
              <div className="p-5 md:p-6">
                <h3 className="text-2xl font-semibold uppercase tracking-[-0.03em] text-[#10203a]">
                  {selectedItem.title}
                </h3>
                <p className="mt-3 text-base leading-8 text-slate-600">{selectedItem.caption}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
