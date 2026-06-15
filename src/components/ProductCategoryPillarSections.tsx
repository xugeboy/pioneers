import type { Blog, Media as PayloadMedia } from '@/payload-types'
import type { ProductCategorySummary } from '@/utilities/productCategories'

import Link from 'next/link'
import React from 'react'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'

type CategoryGroup = ProductCategorySummary['oemCapabilities']
type FeatureGroup =
  | ProductCategorySummary['oemCapabilities']
  | ProductCategorySummary['qualityHighlights']
type CategoryGroupItem = {
  description?: string | null
  id?: string | null
  title: string
}
type CategoryFAQItem = NonNullable<ProductCategorySummary['faqItems']>[number]
type OEMCapabilitiesGroup = NonNullable<ProductCategorySummary['oemCapabilities']>

type Props = {
  category: ProductCategorySummary
}

export const ProductCategoryPillarSections: React.FC<Props> = ({ category }) => {
  const pillarContent = hasRichTextContent(category.pillarContent) ? category.pillarContent : null
  const hasOEMCapabilities = hasGroupContent(category.oemCapabilities)
  const hasQualityHighlights = hasGroupContent(category.qualityHighlights)
  const relatedBlogs = getRelatedBlogs(category.relatedBlogs)
  const faqItems = getFAQItems(category.faqItems)

  if (
    !pillarContent &&
    !hasOEMCapabilities &&
    !hasQualityHighlights &&
    !relatedBlogs.length &&
    !faqItems.length
  ) {
    return null
  }

  return (
    <div className="container mt-14 md:mt-20">
      <div className="space-y-12 md:space-y-16">
        {pillarContent ? (
          <section>
            <RichText
              className="max-w-none prose-headings:font-display prose-headings:text-[#162019] prose-p:text-[#39483f] prose-p:leading-8 prose-li:text-[#39483f] prose-li:leading-7 prose-strong:text-[#162019] md:prose-lg"
              data={pillarContent}
              enableGutter={false}
            />
          </section>
        ) : null}

        {hasOEMCapabilities ? (
          <ProductCategoryFeatureGroup
            defaultHeading="OEM/ODM Capabilities for This Category"
            group={category.oemCapabilities}
            itemsHeading="OEM/ODM Capabilities"
          />
        ) : null}

        {hasQualityHighlights ? (
          <ProductCategoryFeatureGroup
            defaultHeading="Materials and Quality Focus"
            group={category.qualityHighlights}
          />
        ) : null}

        {relatedBlogs.length ? <RelatedGuides blogs={relatedBlogs} /> : null}

        {faqItems.length ? <ProductCategoryFAQ items={faqItems} /> : null}
      </div>
    </div>
  )
}

const ProductCategoryFeatureGroup: React.FC<{
  defaultHeading: string
  group: FeatureGroup
  itemsHeading?: string
}> = ({ defaultHeading, group, itemsHeading }) => {
  const items = getGroupItems(group)

  return (
    <section>
      <SectionHeading title={group?.heading || defaultHeading} />
      <SectionIntro intro={getGroupIntro(group)} />

      {items.length ? (
        <div className="mt-10">
          {itemsHeading ? <SectionHeading title={itemsHeading} /> : null}

          <div className="mt-9 grid gap-x-8 gap-y-6 md:grid-cols-2">
            {items.map((item) => (
              <article className="border-l border-[#b8c7b6] pl-5" key={item.id || item.title}>
                <h3 className="text-lg font-semibold leading-7 text-[#162019]">{item.title}</h3>
                {item.description ? (
                  <p className="mt-2 text-sm leading-7 text-[#55645a]">{item.description}</p>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

const RelatedGuides: React.FC<{
  blogs: Blog[]
}> = ({ blogs }) => {
  return (
    <section>
      <SectionHeading title="Related Guides & Insights" />

      <div className="mt-9 flex snap-x snap-mandatory gap-7 overflow-x-auto scroll-smooth px-1 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {blogs.map((blog) => {
          const image = getBlogImage(blog)
          const href = `/blogs/${blog.slug}`
          const date = blog.publishedAt || blog.updatedAt

          return (
            <article
              className="group flex w-[17rem] shrink-0 snap-start flex-col text-center sm:w-[18rem] lg:w-[19rem]"
              key={blog.id}
            >
              <Link className="relative block aspect-video overflow-hidden bg-white" href={href}>
                {image ? (
                  <Media fill imgClassName="h-full w-full object-contain" resource={image} />
                ) : null}
              </Link>

              <div className="flex flex-1 flex-col items-center">
                {date ? (
                  <time
                    className="mt-5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#6e7c72]"
                    dateTime={date}
                  >
                    {formatBlogDate(date)}
                  </time>
                ) : null}

                <h3 className="mt-3 line-clamp-3 min-h-[4.5rem] font-industrial text-xl font-bold uppercase leading-tight text-[#101914]">
                  <Link className="transition-colors hover:text-[#00A650]" href={href}>
                    {blog.title}
                  </Link>
                </h3>

                <Button
                  asChild
                  className="mt-5 h-12 rounded-md bg-[#00A650] px-9 font-industrial text-xl font-bold uppercase text-white hover:bg-[#008f45]"
                  size="clear"
                >
                  <Link href={href}>Read More</Link>
                </Button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

const ProductCategoryFAQ: React.FC<{
  items: CategoryFAQItem[]
}> = ({ items }) => {
  return (
    <section>
      <SectionHeading title="Sourcing Questions Answered" />

      <div className="mt-9 divide-y divide-[#dce5dc] border-y border-[#dce5dc]">
        {items.map((item, index) => (
          <details className="group" key={item.id || item.question} open={index === 0}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-lg font-semibold leading-7 text-[#162019] marker:hidden">
              {item.question}
              <span className="text-2xl leading-none text-[#36513f] transition-transform duration-200 group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="pb-6 pr-8">
              <RichText
                className="max-w-none prose-p:text-[#55645a] prose-p:leading-7 prose-li:text-[#55645a]"
                data={item.answer}
                enableGutter={false}
              />
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}

const SectionHeading: React.FC<{
  title: string
}> = ({ title }) => {
  return (
    <div className="text-center">
      <h2 className="font-display text-3xl font-semibold leading-tight text-[#162019] md:text-4xl">
        {title}
      </h2>
      <div className="mx-auto mt-4 h-1 w-[clamp(4rem,28%,12rem)] rounded-full bg-[#00A650]" />
    </div>
  )
}

const SectionIntro: React.FC<{
  intro?: unknown
}> = ({ intro }) => {
  if (typeof intro === 'string') {
    const trimmedIntro = intro.trim()

    return trimmedIntro ? (
      <p className="mx-auto mt-6 max-w-3xl text-center text-base leading-8 text-[#4f5f55]">
        {trimmedIntro}
      </p>
    ) : null
  }

  if (!hasRichTextContent(intro)) return null

  return (
    <RichText
      className="mt-7 max-w-none prose-headings:font-display prose-headings:text-[#162019] prose-p:text-[#39483f] prose-p:leading-7 prose-li:text-[#39483f] prose-li:leading-6 md:prose-lg md:prose-p:leading-7 md:prose-li:leading-6"
      data={intro}
      enableGutter={false}
    />
  )
}

function hasRichTextContent(
  value: unknown,
): value is NonNullable<ProductCategorySummary['pillarContent']> {
  return Boolean(getRichTextPlainText(value).trim())
}

function getGroupItems(group: FeatureGroup): CategoryGroupItem[] {
  return (group?.items || []).filter((item): item is CategoryGroupItem => Boolean(item?.title))
}

function hasGroupContent(group: FeatureGroup): boolean {
  return Boolean(
    group?.heading || hasIntroContent(getGroupIntro(group)) || getGroupItems(group).length,
  )
}

function hasIntroContent(value: unknown): boolean {
  if (typeof value === 'string') return Boolean(value.trim())

  return hasRichTextContent(value)
}

function getGroupIntro(group: FeatureGroup): unknown {
  if (!group) return null

  if (isOEMCapabilitiesGroup(group)) {
    return group.introRichText
  }

  return group.intro
}

function isOEMCapabilitiesGroup(group: FeatureGroup): group is OEMCapabilitiesGroup {
  return Boolean(group && 'introRichText' in group)
}

function getRelatedBlogs(value?: ProductCategorySummary['relatedBlogs']): Blog[] {
  return (value || []).filter((blog): blog is Blog =>
    Boolean(blog && typeof blog === 'object' && blog.slug && blog.title),
  )
}

function getFAQItems(value?: ProductCategorySummary['faqItems']): CategoryFAQItem[] {
  return (value || []).filter((item): item is CategoryFAQItem =>
    Boolean(item?.question && item.answer && getRichTextPlainText(item.answer).trim()),
  )
}

function getBlogImage(blog: Blog): PayloadMedia | null {
  const image = [blog.heroImage, blog.meta?.image].find(
    (item): item is PayloadMedia => typeof item === 'object' && item !== null,
  )

  return image || null
}

function getRichTextPlainText(value: unknown): string {
  if (!value || typeof value !== 'object') return ''

  if ('text' in value && typeof value.text === 'string') return value.text

  if ('children' in value && Array.isArray(value.children)) {
    return value.children.map(getRichTextPlainText).join(' ')
  }

  if ('root' in value) {
    return getRichTextPlainText(value.root)
  }

  return ''
}

function formatBlogDate(timestamp: string): string {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(timestamp))
}
