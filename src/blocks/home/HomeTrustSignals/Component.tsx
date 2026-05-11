import {
  ArrowRight,
  Award,
  Clock,
  Factory,
  Globe,
  Package,
  PencilRuler,
  Settings,
} from 'lucide-react'
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

const stats = [
  {
    icon: Award,
    value: '10+',
    unit: 'Years',
    description: 'Experience in tie down solutions.',
  },
  {
    icon: Factory,
    value: '20,000+',
    unit: 'm²',
    description: 'Factory Area',
  },
  {
    icon: Globe,
    value: '50+',
    unit: 'Countries',
    description: 'Trusted by clients worldwide.',
  },
] as const

export const HomeTrustSignalsBlock: React.FC<
  HomeTrustSignalsBlockProps & { disableInnerContainer?: boolean }
> = () => {
  return (
    <section className="bg-[#FAF9F5] pb-16 md:pb-24">
      {/* Top Features Bar */}
      <div className="border-b border-[#e2dfd5] bg-[#f4f2eb] py-10 md:py-12">
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

          {/* Right Column - Image & Stats Card */}
          <div className="flex flex-col shadow-xl lg:col-span-8 lg:flex-row">
            {/* Factory Image Half */}
            <div
              className="relative min-h-[300px] w-full bg-cover bg-center lg:w-[65%]"
              style={{
                backgroundImage: `url('https://cdn.pioneersgears.com/images/factory entrance.webp')`,
              }}
            >
              {/* Fallback styling/overlay in case image is missing */}
              <div className="absolute inset-0 bg-black/10"></div>
            </div>

            {/* Stats Panel Half */}
            <div className="flex w-full flex-col justify-center bg-[#1c1c1a] p-8 lg:w-[35%]">
              {stats.map((stat, index) => (
                <div
                  key={stat.unit}
                  className={`flex items-start gap-6 ${
                    index !== stats.length - 1 ? 'mb-6 border-b border-white/10 pb-6' : ''
                  }`}
                >
                  <stat.icon className="mt-1 size-10 shrink-0 text-[#00A650]" strokeWidth={1.5} />
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="font-industrial text-3xl font-bold tracking-wider text-[#00A650] md:text-4xl">
                        {stat.value}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-widest text-[#00A650]">
                        {stat.unit}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-gray-300">{stat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
