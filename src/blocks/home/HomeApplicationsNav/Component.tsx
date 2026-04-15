import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import type { HomeApplicationsNavBlock as HomeApplicationsNavBlockProps } from '@/payload-types'

const applications = [
  {
    description:
      'Tie-down and securing solutions for boats, PWCs, trailers, and watersports transport.',
    href: '/product-categories',
    title: 'Marine & Water Sports',
  },
  {
    description:
      'Cargo-control products for camping gear, utility hauling, racks, and outdoor equipment transport.',
    href: '/product-categories',
    title: 'Camping & Outdoor',
  },
  {
    description:
      'Rugged restraint solutions for recovery gear, rooftop loads, powersports, and off-road setups.',
    href: '/product-categories',
    title: 'Overlanding & Off-Road',
  },
] as const

export const HomeApplicationsNavBlock: React.FC<
  HomeApplicationsNavBlockProps & { disableInnerContainer?: boolean }
> = () => {
  return (
    <section className="bg-white">
      <div className="container py-16 md:py-20">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#00a650]">
              Application-based navigation
            </p>
            <h2 className="mt-4 font-industrial text-3xl uppercase leading-[0.92] tracking-[-0.05em] text-[#10203a] md:text-5xl">
              Start with the environment your cargo control system needs to serve.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-600 md:text-base">
            Choose the application closest to your buying context, then move into the right
            category families and product directions.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {applications.map((item) => (
            <Link
              className="group flex min-h-72 cursor-pointer flex-col justify-between overflow-hidden border border-slate-200 bg-[linear-gradient(145deg,#eff4f8_0%,#dbe4ed_100%)] p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-[#00a650]/30 hover:shadow-[0_22px_48px_rgba(15,23,42,0.10)]"
              href={item.href}
              key={item.title}
            >
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#00a650]">
                  Explore application
                </p>
                <h3 className="mt-4 max-w-[14ch] font-industrial text-2xl uppercase leading-[0.95] tracking-[-0.04em] text-[#10203a] md:text-[2rem]">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-[32ch] text-sm leading-7 text-slate-600 md:text-base">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#10203a] transition-colors duration-200 group-hover:text-[#00a650]">
                View category paths
                <ArrowRight className="size-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
