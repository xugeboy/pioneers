'use client'

import React, { useEffect, useState } from 'react'

import { cn } from '@/utilities/ui'

const BLOG_CTA_CAROUSEL_IMAGES = [
  {
    alt: 'Webbing Sewing',
    src: 'https://cdn.pioneersgears.com/images/sewing.webp',
  },
  {
    alt: 'Webbing Weaving',
    src: 'https://cdn.pioneersgears.com/images/webbing weaving.webp',
  },
  {
    alt: 'PioneersGears factory slide 3',
    src: 'https://cdn.pioneersgears.com/images/load testing.webp',
  },
]

export function BlogArticleImageCarousel({ className }: { className?: string }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (BLOG_CTA_CAROUSEL_IMAGES.length <= 1) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % BLOG_CTA_CAROUSEL_IMAGES.length)
    }, 3500)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <div
      aria-label="PioneersGears manufacturing image carousel"
      className={cn('relative aspect-[1.7] w-full overflow-hidden bg-slate-100', className)}
    >
      {BLOG_CTA_CAROUSEL_IMAGES.map((image, index) => (
        <div
          aria-hidden={index !== activeIndex}
          aria-label={index === activeIndex ? image.alt : undefined}
          className={cn(
            'absolute inset-0 bg-cover bg-center transition-opacity duration-700',
            index === activeIndex ? 'opacity-100' : 'opacity-0',
          )}
          key={image.src}
          role={index === activeIndex ? 'img' : undefined}
          style={{ backgroundImage: `url("${image.src}")` }}
        />
      ))}
    </div>
  )
}
