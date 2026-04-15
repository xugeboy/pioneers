import Link from 'next/link'
import React from 'react'

import type { HomeProductFamiliesBlock as HomeProductFamiliesBlockProps } from '@/payload-types'

const families = [
  {
    description:
      'Heavy-duty restraint systems for trailers, transport programs, and dependable cargo securement.',
    title: 'Ratchet Tie-Down Straps',
  },
  {
    description:
      'Fast-adjust restraint options for lighter loads, outdoor gear, and flexible everyday transport needs.',
    title: 'Cam Buckle Straps',
  },
  {
    description:
      'Ready-to-spec combinations built for buyers who need complete restraint packages instead of single components.',
    title: 'Assemblies & Kits',
  },
  {
    description:
      'Hooks, fittings, and supporting hardware for application-specific cargo control systems.',
    title: 'Hooks, Fittings & Accessories',
  },
] as const

export const HomeProductFamiliesBlock: React.FC<
  HomeProductFamiliesBlockProps & { disableInnerContainer?: boolean }
> = () => {
  return (
    <section className="bg-[#f5f7fb]">
      <div className="container py-16 md:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#00a650]">
            Product families overview
          </p>
          <h2 className="mt-4 font-industrial text-3xl uppercase leading-[0.92] tracking-[-0.05em] text-[#10203a] md:text-5xl">
            Product families built to support cargo control programs across demanding transport applications.
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {families.map((item) => (
            <Link
              className="group flex min-h-56 cursor-pointer flex-col justify-between border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,23,42,0.10)]"
              href="/products"
              key={item.title}
            >
              <div className="h-24 w-full bg-[linear-gradient(145deg,#e7edf3_0%,#d1dbe5_100%)]" />
              <div className="mt-6">
                <h3 className="font-industrial text-2xl uppercase leading-[0.95] tracking-[-0.04em] text-[#10203a]">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-8 text-slate-600">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
