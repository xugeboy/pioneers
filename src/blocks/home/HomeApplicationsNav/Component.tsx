import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import type { HomeApplicationsNavBlock as HomeApplicationsNavBlockProps } from '@/payload-types'

const applications = [
  {
    title: 'Off-Road',
    description: 'Secure your gear through every terrain.',
    href: '/product-categories/overlanding-and-off-road',
    imageSrc: 'https://cdn.pioneersgears.com/images/application-offroad.webp',
  },
  {
    title: 'Camping',
    description: 'Lightweight. Strong. Built for the outdoors.',
    href: '/product-categories/camping-and-outdoor',
    imageSrc: 'https://cdn.pioneersgears.com/images/application-camping.webp',
  },
  {
    title: 'Marine',
    description: 'Built to resist water and corrosion.',
    href: '/product-categories/marine-and-water-sports',
    imageSrc: 'https://cdn.pioneersgears.com/images/application-marine.webp',
  },
] as const

export const HomeApplicationsNavBlock: React.FC<
  HomeApplicationsNavBlockProps & { disableInnerContainer?: boolean }
> = () => {
  return (
    <section className="bg-[#f7f7f6]">
      <div className="container py-16 md:py-24">
        {/* Header section */}
        <div className="mb-12 flex flex-col items-center text-center">
          <p className="text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-[#555]">
            Built For
          </p>
          <h2 className="mt-2 font-industrial text-4xl uppercase leading-[0.9] tracking-tight text-[#1a1a18] md:text-6xl">
            Every Adventure
          </h2>
          {/* Brush stroke underline */}
          <div className="mt-4 flex justify-center text-[#00A650]">
            <svg
              width="180"
              height="14"
              viewBox="0 0 144 12"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2.5 7C22.5 3.5 54 -0.5 82 2.5C110 5.5 136 5.5 141.5 5C141.5 5 142.5 8 138.5 8.5C134.5 9 108 12.5 80 10.5C52 8.5 18 10 3.5 9C1 8.5 2.5 7 2.5 7Z" />
            </svg>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid gap-4 md:grid-cols-3">
          {applications.map((item) => (
            <Link
              className="group relative flex min-h-[400px] cursor-pointer flex-col justify-between overflow-hidden rounded-xl bg-[#1e2329] p-8 shadow-lg transition-transform duration-300 hover:-translate-y-1 md:min-h-[450px]"
              href={item.href}
              key={item.title}
            >
              {/* Background Image - handles fallback automatically via CSS bg property */}
              <div
                className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${item.imageSrc})` }}
              />
              {/* Overlays for readability */}
              <div className="absolute inset-0 z-10 bg-linear-to-t from-black/48 via-black/14 to-black/20 transition-opacity group-hover:from-black/42 group-hover:via-black/10 group-hover:to-black/16" />

              <div className="relative z-20">
                <h3 className="font-industrial text-3xl font-bold uppercase tracking-wide text-white md:text-4xl">
                  {item.title}
                </h3>
              </div>

              <div className="relative z-20 mt-8">
                <div className="inline-flex items-center gap-3 border border-white/40 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-white group-hover:text-[#1a1a18]">
                  View Products
                  <ArrowRight className="size-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
