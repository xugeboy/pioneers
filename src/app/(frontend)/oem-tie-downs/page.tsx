import type { Metadata } from 'next'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {
  ArrowRight,
  Check,
  Factory,
  Layers3,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  ShieldCheck,
} from 'lucide-react'
import { getPayload } from 'payload'

import configPromise from '@payload-config'
import { manufacturingMedia } from '@/blocks/manufacturing/content'
import { CertificateCarousel } from '@/components/CertificateCarousel'
import { Logo } from '@/components/Logo/Logo'
import { Media } from '@/components/Media'
import { OemTieDownLeadForm } from '@/components/OemTieDownLeadForm'
import type { Form as PayloadForm, Product } from '@/payload-types'
import {
  getAllProductCategories,
  getDescendantProductCategoryIDs,
  getProductCategoryHref,
  getProductCategoryPath,
  getProductCategoryProductsWhere,
  productCardSelect,
} from '@/utilities/productCategories'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'OEM Tie-Down Straps Manufacturer | PioneersGears',
  description:
    'Custom OEM and ODM tie-down straps, bungee cords, and cargo restraint manufacturing for brands, distributors, and private-label buyers.',
  alternates: {
    canonical: '/oem-tie-downs',
  },
  openGraph: {
    description:
      'Custom OEM and ODM tie-down straps, bungee cords, and cargo restraint manufacturing for brands, distributors, and private-label buyers.',
    title: 'OEM Tie-Down Straps Manufacturer | PioneersGears',
    url: '/oem-tie-downs',
  },
  robots: {
    follow: false,
    googleBot: {
      follow: false,
      index: false,
    },
    index: false,
  },
}

const trustItems = [
  {
    icon: Factory,
    label: 'Direct factory team',
    text: 'Work with a production partner built around custom restraint programs.',
  },
  {
    icon: Layers3,
    label: 'Custom builds',
    text: 'Webbing, hooks, labels, colorways, packaging, and use-case details.',
  },
  {
    icon: ShieldCheck,
    label: 'QC mindset',
    text: 'Sampling, production checks, and load-focused validation support.',
  },
  {
    icon: PackageCheck,
    label: 'Fast & Reliable Delivery',
    text: 'Stable supply chain with large-scale warehouse center.',
  },
] as const

const heroProofItems = [
  'Custom webbing, hardware, labels, colors, and packaging',
  'Sampling and QC review before bulk production',
  'Support for outdoor, marine, overlanding, and motorcycle programs',
] as const

const productGroupTargets = [
  {
    intro:
      'Vehicle transport, recovery, and utility tie-down products for rugged outdoor supply programs.',
    slug: 'overlanding-and-off-road',
  },
  {
    intro:
      'Camping, outdoor, and general gear restraint products for retail and private-label buyers.',
    slug: 'camping-and-outdoor',
  },
  {
    intro: 'Marine-focused tie-down products for kayak, canoe, trailer, and watersports programs.',
    slug: 'marine-and-water-sports',
  },
] as const

type LandingProduct = Pick<Product, 'id' | 'primaryImage' | 'slug' | 'specs' | 'summary' | 'title'>

type ProductGroup = {
  href: string
  id: number
  intro: string
  products: LandingProduct[]
  title: string
}

// Replace these fixed URLs with the final certificate image URLs.
const certificateImages = [
  {
    alt: 'zero spin ratchet strap desgin patent CN - ZL2025302655172',
    src: 'https://cdn.pioneersgears.com/images/zero spin ratchet strap desgin patent CN - ZL2025302655172_Preview.webp',
  },
  {
    alt: 'swivel carabiner hook design patent CN - ZL2025303092998',
    src: 'https://cdn.pioneersgears.com/images/swivel carabiner hook design patent CN - ZL2025303092998_Preview.webp',
  },
  {
    alt: 'retractable ratchet strap design patent CN - ZL2025302655153',
    src: 'https://cdn.pioneersgears.com/images/retractable ratchet strap design patent CN - ZL2025302655153_Preview.webp',
  },
  {
    alt: 'retractable ratchet strap design patent CN - ZL 2024302184409',
    src: 'https://cdn.pioneersgears.com/images/retractable ratchet strap design patent CN - ZL 2024302184409_Preview.webp',
  },
  {
    alt: 'retractable ratchet strap design patent US - D1111741',
    src: 'https://cdn.pioneersgears.com/images/retractable ratchet strap design patent US - D1111741_Preview.webp',
  },
  {
    alt: 'retractable ratchet strap design patent UK - 6442745',
    src: 'https://cdn.pioneersgears.com/images/retractable ratchet strap design patent UK - 6442745_Preview.webp',
  },
  {
    alt: 'Ratchet Strap EN12195-2 TUV GS Certification EN',
    src: 'https://cdn.pioneersgears.com/images/Ratchet Strap EN12195-2 TUV GS Certification EN_Preview.webp',
  },
  {
    alt: 'Cam Buckle Strap EN12195-2 TUV GS Certification EN',
    src: 'https://cdn.pioneersgears.com/images/Cam Buckle Strap EN12195-2 TUV GS Certification EN_Preview.webp',
  },
  {
    alt: 'retractable ratchet strap design patent UK - 6442745',
    src: 'https://cdn.pioneersgears.com/images/retractable ratchet strap design patent UK - 6442745_Preview.webp',
  },
  {
    alt: 'retractable ratchet strap design patent CA - 240688',
    src: 'https://cdn.pioneersgears.com/images/retractable ratchet strap design patent CA - 240688_Preview.webp',
  },
] as const

const companyProfileImage = {
  alt: 'PioneersGears factory and production team',
  position: '64% center',
  url: 'https://cdn.pioneersgears.com/images/factory entrance.webp',
} as const

const companyStrengthStats = [
  {
    label: 'Factory experience',
    value: '16+',
  },
  {
    label: 'Daily Capacity',
    value: '10000+',
  },
  {
    label: 'Factory areas',
    value: '8000m²',
  },
  {
    label: 'Workshop Staff',
    value: '60+',
  },
] as const

const whyChooseItems = [
  {
    icon: ShieldCheck,
    label: 'QC-focused production',
    text: 'Sampling, production checks, and product review are planned around real restraint use cases.',
  },
  {
    icon: Layers3,
    label: 'Flexible OEM / ODM',
    text: 'Customize webbing, cord length, hooks, buckles, labels, colors, and packaging details.',
  },
  {
    icon: Factory,
    label: 'Factory-direct communication',
    text: 'Discuss application, materials, sample direction, and order details with a production team.',
  },
  {
    icon: PackageCheck,
    label: 'Export order support',
    text: 'Coordinate packaging and fulfillment details for brands, distributors, and private-label buyers.',
  },
] as const

const bottomContactItems = [
  {
    href: 'https://wa.me/8619952792557',
    icon: Phone,
    label: 'WhatsApp +86 199 5279 2557',
  },
  {
    href: 'mailto:inquiry@pioneersgears.com',
    icon: Mail,
    label: 'inquiry@pioneersgears.com',
  },
  {
    href: undefined,
    icon: MapPin,
    label: 'Export support for brands, distributors, and private-label buyers',
  },
] as const

const proofSteps = [
  {
    image: manufacturingMedia.weaving,
    label: 'Material and component review',
    text: 'Align the strap, cord, fitting, color, and packaging details before bulk production.',
  },
  {
    image: manufacturingMedia.sewing,
    label: 'Repeatable production process',
    text: 'Keep production details practical, documented, and easy to repeat across orders.',
  },
  {
    image: manufacturingMedia.testing,
    label: 'Inspection and load focus',
    text: 'Support product checks around real tie-down use cases and buyer requirements.',
  },
] as const

const faqs = [
  {
    answer:
      'MOQ depends on the product type and customization level. For standard products, we can usually start from 100–300 pcs. For custom webbing, logo, packaging, or new configurations, MOQ is usually higher and will be confirmed after we review your request.',
    question: 'What MOQ should I expect?',
  },
  {
    answer:
      'Yes. We support private-label and OEM programs, including custom webbing colors, printed logos, labels, hooks, buckles, packaging, instruction cards, and product sets. For custom packaging, MOQ usually starts from 500 pcs, depending on the packaging style.',
    question: 'Can you make private-label products?',
  },
  {
    answer:
      'Send us your target product, size, use case, hardware requirements, packaging idea, and estimated order quantity. For existing products, samples can usually be prepared within 3–7 days. For customized samples, the sample time is normally 7–15 days, depending on material availability and complexity.',
    question: 'How does the sample process start?',
  },
  {
    answer:
      'For regular bulk orders, production usually takes 15–30 days after order confirmation and deposit. Simple repeat orders may be faster. Customized products, special packaging, or new tooling projects may require a longer lead time. Urgent orders can be reviewed for possible acceleration.',
    question: 'How long does production take?',
  },
  {
    answer:
      'Yes. We carry out production checks based on the product type, including material inspection, stitching checks, hardware inspection, assembly checks, and final packing review. For load-rated restraint products, testing or third-party reports can be arranged when required.',
    question: 'Do you support quality checks?',
  },
  {
    answer:
      'Yes. We regularly support export orders and can coordinate carton packaging, palletizing, shipping marks, and export documents. We can work with your forwarder or help arrange shipping by express, air, sea, or DDP service depending on the order and destination.',
    question: 'Can you ship export orders?',
  },
] as const

async function getInquiryForm(): Promise<PayloadForm | null> {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'forms',
    depth: 0,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: {
      title: {
        equals: 'Product Inquiry Form',
      },
    },
  })

  return (result.docs?.[0] as PayloadForm | undefined) || null
}

async function getLandingProductGroups(): Promise<ProductGroup[]> {
  const payload = await getPayload({ config: configPromise })
  const allCategories = await getAllProductCategories(payload)

  const groups: Array<ProductGroup | null> = await Promise.all(
    productGroupTargets.map(async (target) => {
      const category = allCategories.find((item) => item.slug === target.slug)
      const categoryPath = getProductCategoryPath(category)

      if (!category || !categoryPath) return null

      const descendantIDs = getDescendantProductCategoryIDs(allCategories, categoryPath)
      const products = await payload.find({
        collection: 'products',
        depth: 1,
        draft: false,
        limit: 3,
        overrideAccess: false,
        pagination: false,
        select: productCardSelect,
        sort: '-publishedAt',
        where: getProductCategoryProductsWhere(descendantIDs),
      })

      return {
        href: getProductCategoryHref(category),
        id: category.id,
        intro: target.intro as string,
        products: products.docs as LandingProduct[],
        title: category.title,
      }
    }),
  )

  return groups.filter((group): group is ProductGroup => Boolean(group?.products.length))
}

export default async function OemTieDownLandingPage() {
  const [inquiryForm, productGroups] = await Promise.all([
    getInquiryForm(),
    getLandingProductGroups(),
  ])

  return (
    <main className="bg-[#f7faf6] text-[#162019]">
      <LandingTopBar />

      <section className="relative isolate overflow-hidden bg-[#101a13] pt-24 text-white md:pt-28">
        <div className="absolute inset-0 -z-10">
          <Image
            fill
            alt={manufacturingMedia.banner.alt}
            className="object-cover"
            priority
            sizes="100vw"
            src={manufacturingMedia.banner.url}
            style={{ objectPosition: manufacturingMedia.banner.position }}
          />
        </div>

        <div className="container grid gap-10 pb-16 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.58fr)] lg:items-center lg:pb-20 lg:pt-16">
          <div className="max-w-3xl rounded-xl bg-white/82 px-5 py-7 text-center text-[#08120c] shadow-[0_22px_70px_rgba(0,0,0,0.22)] ring-1 ring-white/70 backdrop-blur-md sm:px-8 md:py-9 lg:px-10">
            <p className="font-industrial text-3xl font-bold uppercase leading-tight tracking-[0.12em] text-[#06120b] md:text-4xl">
              PioneersGears Tie-Down Solutions
            </p>
            <p className="mx-auto mt-4 max-w-xl text-sm font-semibold leading-6 text-[#111b14] md:text-base">
              16+ Years Experience <span className="px-1 text-[#e87412]">|</span> OEM/ODM
              Manufacturing <span className="px-1 text-[#e87412]">|</span> Factory-Direct Support
            </p>

            <h1 className="mt-7 font-display text-4xl font-semibold leading-tight text-[#06120b] md:text-5xl">
              Professional <span className="text-[#e87412]">Cargo Control Solutions</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base font-semibold leading-8 text-[#162019]">
              Source manufacturer for tie-down straps, bungee cords, motorcycle restraints, and
              marine securing products for brands and distributors.
            </p>

            <ul className="mx-auto mt-7 grid max-w-xl gap-3 text-left">
              {heroProofItems.map((item) => (
                <li
                  className="flex gap-3 text-sm font-semibold leading-6 text-[#162019]"
                  key={item}
                >
                  <Check className="mt-1 size-5 shrink-0 text-[#e87412]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {inquiryForm ? (
            <OemTieDownLeadForm form={inquiryForm} />
          ) : (
            <div className="rounded-lg border border-white/18 bg-white p-6 text-[#162019]">
              <h2 className="text-xl font-semibold">Quote form unavailable</h2>
              <p className="mt-3 text-sm leading-6 text-[#657369]">
                Please email inquiry@pioneersgears.com with your product details.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="border-y border-[#dce5dc] bg-white">
        <div className="container grid gap-5 py-7 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => {
            const Icon = item.icon

            return (
              <article className="flex gap-4" key={item.label}>
                <span className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-md bg-[#e8f6ed] text-[#00A650]">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#162019]">
                    {item.label}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#657369]">{item.text}</p>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="container py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,1.45fr)] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <h2 className="font-display text-3xl font-semibold leading-tight text-[#162019] md:text-4xl">
              Explore actual products from our core category range.
            </h2>
            <p className="mt-5 text-base leading-7 text-[#657369]">
              Each group below pulls real products from the catalog. Use them as a starting point
              for your OEM brief, then tell us what needs to change for your market.
            </p>
          </div>

          <div className="space-y-8">
            {productGroups.map((group) => (
              <section
                aria-labelledby={`product-group-${group.id}`}
                className="rounded-xl border border-[#dce5dc] bg-white p-4 shadow-[0_14px_38px_rgba(10,22,14,0.04)] md:p-5"
                key={group.id}
              >
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h3
                      className="font-display text-2xl font-semibold leading-tight text-[#162019]"
                      id={`product-group-${group.id}`}
                    >
                      {group.title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#657369]">{group.intro}</p>
                  </div>
                  <Link
                    className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#00A650] transition-colors hover:text-[#078944]"
                    href={group.href}
                  >
                    View category
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {group.products.map((product) => (
                    <LandingProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="container">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl font-semibold leading-tight text-[#162019] md:text-4xl">
              Built around consistent production, not just good-looking samples.
            </h2>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {proofSteps.map((item) => (
              <article className="overflow-hidden rounded-lg bg-[#f7faf6]" key={item.label}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    fill
                    alt={item.image.alt}
                    className="object-cover"
                    sizes="(min-width: 768px) 33vw, 100vw"
                    src={item.image.url}
                    style={{ objectPosition: item.image.position }}
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-[#162019]">{item.label}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#657369]">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-white py-14 md:py-20">
        <div className="container">
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold leading-tight text-[#123d63] md:text-4xl">
              Certificate Of Honor
            </h2>
            <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-[#e87412]" />
          </div>

          <CertificateCarousel certificates={certificateImages} />
        </div>
      </section>

      <section className="bg-[#f3f6f3] py-14 md:py-20">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] lg:items-center">
            <div className="rounded-lg bg-white p-3 shadow-[0_18px_48px_rgba(10,22,14,0.08)]">
              <div className="relative min-h-[320px] overflow-hidden rounded-md bg-[#dce5dc] md:min-h-[430px]">
                <Image
                  fill
                  alt={companyProfileImage.alt}
                  className="object-cover"
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  src={companyProfileImage.url}
                  style={{ objectPosition: companyProfileImage.position }}
                />
              </div>
            </div>

            <div>
              <div className="mb-7 h-1 w-16 rounded-full bg-[#e87412]" />
              <h2 className="font-industrial text-4xl font-bold uppercase leading-none tracking-[0.16em] text-[#123d63] md:text-5xl">
                Enterprise
              </h2>
              <h3 className="mt-5 font-display text-3xl font-semibold leading-tight text-[#e87412] md:text-4xl">
                Profile
              </h3>
              <div className="mt-6 space-y-5 text-base leading-8 text-[#39483f]">
                <p>
                  PioneersGears supports OEM and ODM buyers with tie-down straps, bungee cords,
                  motorcycle restraint products, kayak and canoe tie-downs, and related cargo
                  control programs for outdoor, marine, overlanding, and utility markets.
                </p>
                <p>
                  Our team helps buyers move from product brief to sample review and repeatable
                  production. Projects can be aligned around material selection, hardware,
                  dimensions, color, label, packaging, inspection needs, and export fulfillment
                  details.
                </p>
                <p>
                  The goal is simple: make custom restraint products easier to specify, easier to
                  launch, and easier to reorder with consistent communication from quotation through
                  delivery.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-14">
            <h2 className="text-center font-display text-3xl font-semibold leading-tight text-[#123d63] md:text-4xl">
              Our Strengths
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {companyStrengthStats.map((stat) => (
                <article
                  className="rounded-lg bg-white p-7 text-center shadow-[0_14px_38px_rgba(10,22,14,0.06)]"
                  key={stat.label}
                >
                  <div className="font-industrial text-5xl font-bold leading-none tracking-normal text-[#e87412]">
                    {stat.value}
                  </div>
                  <p className="mt-5 text-sm font-semibold leading-6 text-[#526258]">
                    {stat.label}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <h2 className="font-display text-3xl font-semibold leading-tight text-[#123d63] md:text-4xl">
              Why Choose <span className="text-[#e87412]">PioneersGears?</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#657369]">
              Direct factory support for custom tie-down programs, practical product review,
              flexible branding, and export-ready order coordination.
            </p>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {whyChooseItems.map((item) => {
              const Icon = item.icon

              return (
                <article
                  className="rounded-lg border border-[#dce5dc] bg-white p-6 text-center shadow-[0_14px_38px_rgba(10,22,14,0.05)]"
                  key={item.label}
                >
                  <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#123d63] text-white">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-[#162019]">{item.label}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#657369]">{item.text}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#12365b] py-14 text-white md:py-20">
        <div className="container grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.62fr)] lg:items-center">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl font-semibold leading-tight text-white md:text-4xl">
              Ready to <span className="text-[#f47a1f]">Source Direct?</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/82">
              Contact our factory team for OEM/ODM tie-down pricing, product review, and sample next
              steps. Share your quantity, target market, packaging needs, and preferred product
              configuration.
            </p>

            <div className="mt-8 grid gap-4">
              {bottomContactItems.map((item) => {
                const Icon = item.icon
                const content = (
                  <>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#f47a1f]">
                      <Icon className="size-5" />
                    </span>
                    <span className="text-sm font-semibold leading-6 text-white md:text-base">
                      {item.label}
                    </span>
                  </>
                )

                return item.href ? (
                  <a
                    className="flex items-center gap-4 transition-colors hover:text-[#f47a1f]"
                    href={item.href}
                    key={item.label}
                  >
                    {content}
                  </a>
                ) : (
                  <div className="flex items-center gap-4" key={item.label}>
                    {content}
                  </div>
                )
              })}
            </div>
          </div>

          {inquiryForm ? (
            <OemTieDownLeadForm
              anchorID="bottom-quote-form"
              className="shadow-[0_24px_70px_rgba(0,0,0,0.18)]"
              description="Tell us your requirements and our team will review the product details."
              form={inquiryForm}
              heading="Get a Free Quote"
              submitButtonLabel="Send inquiry now"
              trustText="Your information is used only for this inquiry."
            />
          ) : (
            <div className="rounded-xl bg-white p-6 text-[#162019]">
              <h2 className="text-xl font-semibold">Quote form unavailable</h2>
              <p className="mt-3 text-sm leading-6 text-[#657369]">
                Please email inquiry@pioneersgears.com with your product details.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="container py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1fr)]">
          <div>
            <h2 className="font-display text-3xl font-semibold leading-tight text-[#162019] md:text-4xl">
              Common OEM questions.
            </h2>
          </div>

          <div className="divide-y divide-[#dce5dc] border-y border-[#dce5dc]">
            {faqs.map((item) => (
              <article className="py-6" key={item.question}>
                <h3 className="text-lg font-semibold text-[#162019]">{item.question}</h3>
                <p className="mt-3 text-sm leading-6 text-[#657369]">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <LandingFooter />
    </main>
  )
}

const LandingTopBar = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#dce5dc] bg-white/94 backdrop-blur">
      <div className="container flex h-[72px] min-h-16 items-center justify-between gap-4 py-3">
        <Link className="shrink-0" href="/" aria-label="PioneersGears home">
          <Logo className="h-auto w-[96px] md:w-[132px]" loading="eager" priority="high" />
        </Link>

        <nav aria-label="Landing page actions" className="flex items-center gap-2 sm:gap-3">
          <a
            className="hidden h-10 cursor-pointer items-center gap-2 px-3 text-sm font-medium text-[#39483f] transition-colors hover:text-[#00A650] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#00A650]/20 sm:inline-flex"
            href="mailto:inquiry@pioneersgears.com"
          >
            <Mail className="size-4" />
            Contact
          </a>
          <Link
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md bg-[#00A650] px-4 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#078944] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#00A650]/25 sm:px-5"
            href="#quote-form"
          >
            Inquiry
          </Link>
        </nav>
      </div>
    </header>
  )
}

const LandingProductCard: React.FC<{ product: LandingProduct }> = ({ product }) => {
  const href = product.slug ? `/products/${product.slug}` : '/products'
  const specs = product.specs?.slice(0, 5) || []

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-[#dce5dc] bg-[#f7faf6] transition-colors hover:border-[#00A650]">
      <Link className="relative block aspect-[4/3] bg-white" href={href}>
        <Media
          fill
          htmlElement={null}
          imgClassName="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
          resource={product.primaryImage}
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <h4 className="font-display text-base font-semibold leading-snug text-[#162019]">
          <Link className="transition-colors hover:text-[#00A650]" href={href}>
            {product.title}
          </Link>
        </h4>

        {specs.length ? (
          <dl className="mt-4 grid gap-2">
            {specs.map((spec) => (
              <div className="grid gap-1 text-xs leading-5" key={spec.id || spec.label}>
                <dt className="font-semibold text-[#526258]">{spec.label}</dt>
                <dd className="text-[#6b7a70]">{spec.value}</dd>
              </div>
            ))}
          </dl>
        ) : product.summary ? (
          <p className="mt-4 line-clamp-4 text-xs leading-5 text-[#6b7a70]">{product.summary}</p>
        ) : null}
      </div>
    </article>
  )
}

const LandingFooter = () => {
  return (
    <footer className="border-t border-[#dce5dc] bg-white">
      <div className="container flex flex-col gap-4 py-7 text-sm text-[#657369] md:flex-row md:items-center md:justify-between">
        <div>
          <div className="font-semibold text-[#162019]">PioneersGears</div>
          <div className="mt-1">OEM/ODM custom tie-down and restraint manufacturing.</div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <a
            className="transition-colors hover:text-[#00A650]"
            href="mailto:inquiry@pioneersgears.com"
          >
            inquiry@pioneersgears.com
          </a>
          <Link className="transition-colors hover:text-[#00A650]" href="/privacy-policy">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}
