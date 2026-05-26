'use client'

import React, { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type CertificateImage = {
  alt: string
  src: string
}

type CertificateCarouselProps = {
  certificates: readonly CertificateImage[]
}

export const CertificateCarousel: React.FC<CertificateCarouselProps> = ({ certificates }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const scroll = (direction: 'next' | 'previous') => {
    const container = scrollRef.current

    if (!container) return

    const distance = container.clientWidth * 0.82
    container.scrollBy({
      behavior: 'smooth',
      left: direction === 'next' ? distance : -distance,
    })
  }

  return (
    <div className="relative mt-12">
      <button
        aria-label="Previous certificate"
        className="absolute left-2 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#123d63] shadow-[0_12px_30px_rgba(10,22,14,0.16)] ring-1 ring-[#dce5dc] transition-colors hover:bg-[#f3f6f3] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#00A650]/25 md:left-4"
        onClick={() => scroll('previous')}
        type="button"
      >
        <ChevronLeft className="size-5" />
      </button>

      <div
        className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-3 [scrollbar-width:none] md:-mx-8 md:px-8 [&::-webkit-scrollbar]:hidden"
        ref={scrollRef}
      >
        {certificates.map((certificate) => (
          <article
            className="relative aspect-[0.72] w-[84vw] max-w-[320px] shrink-0 snap-center overflow-hidden rounded-lg bg-[#f6f7f5] shadow-[0_16px_45px_rgba(10,22,14,0.12)] ring-1 ring-[#dce5dc] sm:w-[42vw] lg:w-[24vw]"
            key={certificate.src}
          >
            <img
              alt={certificate.alt}
              className="h-full w-full object-cover"
              loading="lazy"
              src={certificate.src}
            />
          </article>
        ))}
      </div>

      <button
        aria-label="Next certificate"
        className="absolute right-2 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#123d63] shadow-[0_12px_30px_rgba(10,22,14,0.16)] ring-1 ring-[#dce5dc] transition-colors hover:bg-[#f3f6f3] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#00A650]/25 md:right-4"
        onClick={() => scroll('next')}
        type="button"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  )
}
