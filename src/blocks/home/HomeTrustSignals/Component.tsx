import { ArrowRight, Clock, Package, PencilRuler, Settings } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import type { HomeTrustSignalsBlock as HomeTrustSignalsBlockProps } from '@/payload-types'

import { Button } from '@/components/ui/button'

const features = [
  {
    icon: PencilRuler,
    title: 'In-House Design',
    description: 'Independent R&D and design for innovative solutions.',
  },
  {
    icon: Package,
    title: 'Custom Packaging',
    description: 'Branded packaging to elevate your products.',
  },
  {
    icon: Settings,
    title: 'Flexible MOQ',
    description: 'Small batch customization to support your business.',
  },
  {
    icon: Clock,
    title: 'On-Time Delivery',
    description: 'Efficient production and stable lead time you can count on.',
  },
] as const

type GlobalStat = {
  label: string
  suffix?: React.ReactNode
  value: string
}

const globalStats: GlobalStat[] = [
  {
    value: '10,000+',
    label: 'Customers Worldwide',
  },
  {
    value: '120+',
    label: 'Countries & Regions Served',
  },
  {
    value: '20,000',
    suffix: (
      <>
        m<sup className="text-xl md:text-2xl">2</sup>
      </>
    ),
    label: 'Factory Area',
  },
  {
    value: '60+',
    label: 'Workshop Staff',
  },
]

export const HomeTrustSignalsBlock: React.FC<
  HomeTrustSignalsBlockProps & { disableInnerContainer?: boolean }
> = () => {
  return (
    <section className="bg-[#f7f7f6] pb-16 md:pb-24">
      {/* Top Features Bar */}
      <div className="border-b border-[#e2dfd5] bg-[#f7f7f6] py-10 md:py-12">
        <div className="container">
          <div className="grid grid-cols-1 gap-y-8 md:grid-cols-2 md:gap-x-8 lg:grid-cols-4 lg:gap-x-0 lg:divide-x lg:divide-[#dcd9ce]">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`flex items-start gap-4 ${index !== 0 ? 'lg:pl-8' : 'lg:pr-8'} ${
                  index !== 0 && index !== features.length - 1 ? 'lg:pr-8' : ''
                }`}
              >
                <feature.icon className="mt-0.5 size-9 shrink-0 text-[#00A650]" strokeWidth={1.5} />
                <div>
                  <h4 className="font-industrial text-base font-bold uppercase tracking-wide text-[#1a1a18]">
                    {feature.title}
                  </h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Trust Signals Content */}
      <div className="container mt-16 md:mt-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column - Text Content */}
          <div className="lg:col-span-4">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Why Choose Pioneers
            </p>
            <h2 className="mt-4 font-industrial text-4xl font-bold uppercase tracking-wide text-[#1a1a18] md:text-5xl lg:text-6xl">
              Your Reliable
              <br />
              <span className="text-[#00A650]">Partner</span>
            </h2>
            {/* Brush stroke underline */}
            <div className="mt-2 text-[#00A650]">
              <svg
                width="140"
                height="12"
                viewBox="0 0 144 12"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2.5 7C22.5 3.5 54 -0.5 82 2.5C110 5.5 136 5.5 141.5 5C141.5 5 142.5 8 138.5 8.5C134.5 9 108 12.5 80 10.5C52 8.5 18 10 3.5 9C1 8.5 2.5 7 2.5 7Z" />
              </svg>
            </div>

            <p className="mt-8 max-w-sm text-sm leading-relaxed text-slate-600 md:text-base">
              We combine quality, innovation, and service to help your brand grow.
            </p>

            <div className="mt-10">
              <Button
                asChild
                className="h-12 rounded-none bg-[#00A650] px-8 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#7a7e58]"
                size="clear"
              >
                <Link href="/about-us" className="flex items-center gap-2">
                  Learn More About Us
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column - Factory Image */}
          <div className="shadow-xl lg:col-span-8">
            <div
              className="relative min-h-[300px] w-full bg-cover bg-center md:min-h-[420px] lg:min-h-[500px]"
              style={{
                backgroundImage: `url('https://cdn.pioneersgears.com/images/factory entrance.webp')`,
              }}
            >
              {/* Fallback styling/overlay in case image is missing */}
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 bg-[#f7f7f6] py-12 md:mt-24 md:py-20 lg:py-24">
        <div className="container">
          <div className="relative isolate overflow-hidden px-3 py-8 md:px-6 md:py-12 lg:px-10 lg:py-14">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-32 -z-10 h-[390px] scale-100 bg-contain bg-center bg-no-repeat md:inset-0 md:h-auto"
              style={{ backgroundImage: "url('/world-map-pioneers.webp')" }}
            />

            <div className="max-w-3xl">
              <h2 className="max-w-xl font-display text-3xl font-semibold leading-[1.25] text-[#06120b] md:text-4xl md:leading-tight">
                Your Trusted Manufacturing Partner in China. Global Shipping
              </h2>
              <p className="mt-6 max-w-3xl text-sm leading-7 text-[#1f2a22] md:text-base md:leading-8">
                Based in China, PioneersGears combines in-house production with export-ready service
                for cargo control and mobility restraint programs. We support brands, distributors,
                and private-label buyers across time zones to keep development, production, and
                delivery running smoothly.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-9 text-center sm:gap-x-10 lg:mt-16 lg:grid-cols-4 lg:text-left">
              {globalStats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-industrial text-4xl font-bold leading-none tracking-wide text-[#00A650] md:text-5xl">
                    {stat.value}
                    {stat.suffix ? (
                      <span className="ml-1 inline-flex items-start text-3xl md:text-4xl">
                        {stat.suffix}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-4 text-sm leading-5 text-[#06120b] md:text-base md:leading-6">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
