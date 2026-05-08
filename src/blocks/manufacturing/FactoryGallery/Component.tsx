'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useRef } from 'react'

import type { FactoryGalleryBlock as FactoryGalleryBlockProps } from '@/payload-types'

import { manufacturingMedia } from '@/blocks/manufacturing/content'
import { useScrollScene } from '@/utilities/gsap'

const galleryItems = [
  {
    image: manufacturingMedia.weaving,
    title: 'Webbing Weaving',
  },
  {
    image: manufacturingMedia.sewing,
    title: 'Sewing & Assembly',
  },
  {
    image: manufacturingMedia.testing,
    title: 'Load Testing',
  },
  {
    image: manufacturingMedia.package,
    title: 'Packaging & Warehouse',
  },
] as const

export const FactoryGalleryBlock: React.FC<
  FactoryGalleryBlockProps & { disableInnerContainer?: boolean }
> = () => {
  const sectionRef = useRef<HTMLElement | null>(null)

  useScrollScene(sectionRef, ({ gsap, reduceMotion, scope }) => {
    if (reduceMotion) return

    gsap.from(scope.querySelectorAll('[data-gallery-reveal]'), {
      duration: 0.8,
      ease: 'power2.out',
      opacity: 0,
      stagger: 0.08,
      scrollTrigger: {
        start: 'top 80%',
        toggleActions: 'play none none reverse',
        trigger: scope,
      },
      y: 22,
    })
  })

  return (
    <section className="bg-[#f7f7f4] text-[#171c24]" ref={sectionRef}>
      <div className="container py-16 md:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(20rem,33rem)_1fr] lg:items-start xl:gap-16">
          <div className="pt-2" data-gallery-reveal>
            <h2 className="mt-9 max-w-[34rem] text-4xl font-semibold leading-[1.15] tracking-[-0.04em] md:text-5xl">
              Built in real environments. Backed by real capability.
            </h2>
            <p className="mt-8 max-w-[25rem] text-lg leading-8 text-[#737985]">
              A glimpse into our workspace, teams, and the precision behind every product.
            </p>
          </div>

          <figure
            className="group relative min-h-[18rem] overflow-hidden bg-[#d9d9d4] md:min-h-[26rem]"
            data-gallery-reveal
          >
            <img
              alt={manufacturingMedia.team.alt}
              className="h-full min-h-[18rem] w-full object-cover object-[64%_center] grayscale-[0.25] transition-transform duration-500 group-hover:scale-[1.02] md:min-h-[26rem]"
              loading="lazy"
              src={manufacturingMedia.team.url}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,15,18,0)_45%,rgba(11,15,18,0.72)_100%)]" />
            <figcaption className="absolute bottom-7 left-7">
              <span className="block h-0.5 w-7 bg-[#18a966]" />
              <span className="mt-4 block text-sm font-bold uppercase tracking-[-0.02em] text-white md:text-base">
                Production Floor
              </span>
            </figcaption>
          </figure>
        </div>

        <div
          className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4"
          data-gallery-reveal
          id="factory-gallery-grid"
        >
          {galleryItems.map((item) => (
            <figure
              className="group relative min-h-[17rem] overflow-hidden bg-[#d9d9d4]"
              key={item.title}
            >
              <img
                alt={item.image.alt}
                className="h-full min-h-[17rem] w-full object-cover grayscale-[0.3] transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
                src={item.image.url}
                style={{ objectPosition: item.image.position }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,15,18,0.02)_20%,rgba(11,15,18,0.78)_100%)]" />
              <figcaption className="absolute bottom-6 left-6 right-5">
                <span className="block h-0.5 w-7 bg-[#18a966]" />
                <span className="mt-4 block text-sm font-bold uppercase leading-tight text-white md:text-base">
                  {item.title}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
