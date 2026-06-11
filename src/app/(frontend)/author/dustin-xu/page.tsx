import type { Metadata } from 'next'

import configPromise from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'

import { JsonLd } from '@/components/JsonLd'
import type { Blog } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { cn } from '@/utilities/ui'

const AUTHOR_PATH = '/author/dustin-xu'
const AUTHOR_NAME = 'Dustin Xu'
const AUTHOR_JOB_TITLE = 'Sales Director'
const AUTHOR_EMAIL = 'dustin@xiangleratchetstrap.com'
const AUTHOR_LINKEDIN = 'https://www.linkedin.com/in/dustin-xu-262256286/'
const AUTHOR_COMPANY = 'PioneerGears'
const AUTHOR_ARTICLES_PER_PAGE = 10

type AuthorBlog = Pick<Blog, 'id' | 'meta' | 'publishedAt' | 'slug' | 'title'>
type AuthorPageProps = {
  searchParams?: Promise<{
    page?: string | string[]
  }>
}

export const metadata: Metadata = {
  title: `${AUTHOR_NAME} | ${AUTHOR_JOB_TITLE} at ${AUTHOR_COMPANY}`,
  description:
    'Author profile for Dustin Xu, Sales Director at Pioneer Gears, covering cargo control, tie-down products, OEM / ODM manufacturing, and export sourcing guidance.',
  alternates: {
    canonical: AUTHOR_PATH,
  },
}

export default async function DustinXuAuthorPage({ searchParams }: AuthorPageProps) {
  const resolvedSearchParams = await searchParams
  const currentPage = getRequestedAuthorPage(resolvedSearchParams?.page)
  const articlesResult = await getDustinArticles(currentPage)
  const articles = articlesResult.docs
  const totalPages = Math.max(articlesResult.totalPages || 1, 1)
  const siteURL = getServerSideURL().replace(/\/+$/, '')

  return (
    <main className="bg-white pt-[68px] text-[#06120b] md:pt-24">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          '@id': `${siteURL}${AUTHOR_PATH}#profilepage`,
          url: `${siteURL}${AUTHOR_PATH}`,
          name: `${AUTHOR_NAME} - ${AUTHOR_JOB_TITLE}`,
          mainEntity: {
            '@type': 'Person',
            '@id': `${siteURL}${AUTHOR_PATH}#person`,
            name: AUTHOR_NAME,
            jobTitle: AUTHOR_JOB_TITLE,
            image: `${siteURL}/Dustin.png`,
            email: AUTHOR_EMAIL,
            worksFor: {
              '@type': 'Organization',
              '@id': `${siteURL}/#organization`,
              name: AUTHOR_COMPANY,
            },
            sameAs: [AUTHOR_LINKEDIN],
          },
        }}
      />

      <section
        className="bg-[#00A650] bg-repeat py-12 text-white md:py-16"
        style={{ backgroundImage: "url('/topography.svg')", backgroundSize: '1840px auto' }}
      >
        <div className="container grid gap-8 md:grid-cols-[14rem_minmax(0,1fr)] md:items-center">
          <div>
            <div className="relative size-36 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg md:size-44">
              <Image alt={AUTHOR_NAME} className="object-cover" fill priority src="/Dustin.png" />
            </div>

            <dl className="mt-5 space-y-3 text-sm leading-6 text-white/90">
              <div>
                <dt className="sr-only">Email</dt>
                <dd>
                  <a className="underline-offset-4 hover:underline" href={`mailto:${AUTHOR_EMAIL}`}>
                    {AUTHOR_EMAIL}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="sr-only">LinkedIn</dt>
                <dd>
                  <a
                    className="underline-offset-4 hover:underline"
                    href={AUTHOR_LINKEDIN}
                    rel="noreferrer"
                    target="_blank"
                  >
                    LinkedIn
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-6xl">
              {AUTHOR_NAME}
            </h1>
            <p className="mt-4 text-xl font-semibold text-white/90">{AUTHOR_JOB_TITLE}</p>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/85">
              An OEM/ODM cargo control specialist with 6+ years of experience in the tie-down and
              restraint products industry.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="max-w-5xl space-y-8">
          <section>
            <h2 className="font-display text-3xl font-semibold">Work Experience</h2>
            <p className="mt-4 text-base leading-8 text-slate-700">
              Dustin Xu has assisted over 1,000 customers worldwide in sourcing, developing, and
              launching private-label cargo securement products, including ratchet straps,
              retractable ratchet straps, cam buckle straps, bungee cords, motorcycle tie-down
              systems, marine tie-downs, cargo nets, and recovery straps.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl font-semibold">Industry Experience</h2>
            <p className="mt-4 text-base leading-8 text-slate-700">
              Dustin&apos;s expertise spans product development, material and hardware selection,
              packaging design, compliance support, manufacturing coordination, and international
              trade. He regularly works with importers, distributors, retailers, and brand owners to
              create customized solutions that meet specific application and market requirements.
              His industry insights are based on hands-on experience supporting OEM and ODM projects
              from concept through mass production and global delivery.
            </p>
          </section>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-[#f7f7f6] py-12 md:py-16">
        <div className="container">
          <h2 className="font-display text-3xl font-semibold">Published Articles</h2>
          {articles.length > 0 ? (
            <div className="mt-8 grid gap-4">
              {articles.map((article) => (
                <article className="border border-slate-200 bg-white p-5" key={article.id}>
                  <Link
                    className="text-xl font-semibold text-[#06120b] underline-offset-4 hover:text-[#00A650] hover:underline"
                    href={`/blogs/${article.slug}`}
                  >
                    {article.title}
                  </Link>
                  {article.publishedAt ? (
                    <p className="mt-2 text-sm text-slate-500">
                      <time dateTime={article.publishedAt}>
                        {formatAuthorArticleDate(article.publishedAt)}
                      </time>
                    </p>
                  ) : null}
                  {article.meta?.description ? (
                    <p className="mt-3 text-sm leading-7 text-slate-700">
                      {article.meta.description}
                    </p>
                  ) : null}
                </article>
              ))}
              <AuthorArticlesPagination currentPage={currentPage} totalPages={totalPages} />
            </div>
          ) : (
            <p className="mt-6 text-base leading-8 text-slate-700">
              Published articles will appear here once posts are assigned to this author.
            </p>
          )}
        </div>
      </section>
    </main>
  )
}

async function getDustinArticles(page: number): Promise<{
  docs: AuthorBlog[]
  totalPages: number | null | undefined
}> {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'blogs',
    depth: 0,
    draft: false,
    limit: AUTHOR_ARTICLES_PER_PAGE,
    overrideAccess: false,
    page,
    select: {
      id: true,
      meta: {
        description: true,
      },
      publishedAt: true,
      slug: true,
      title: true,
    },
    sort: '-publishedAt',
    where: {
      and: [
        {
          _status: {
            equals: 'published',
          },
        },
        {
          authors: {
            exists: true,
          },
        },
      ],
    },
  })

  return {
    docs: result.docs as AuthorBlog[],
    totalPages: result.totalPages,
  }
}

function formatAuthorArticleDate(timestamp: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(timestamp))
}

function AuthorArticlesPagination({
  currentPage,
  totalPages,
}: {
  currentPage: number
  totalPages: number
}) {
  if (totalPages <= 1) {
    return null
  }

  const pages = getVisibleAuthorPages(currentPage, totalPages)

  return (
    <nav
      aria-label="Published articles pagination"
      className="mt-8 flex flex-wrap items-center gap-2"
    >
      <Link
        aria-disabled={currentPage <= 1}
        className={cn(
          'border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-[#06120b] transition hover:border-[#00A650] hover:text-[#00A650]',
          currentPage <= 1 && 'pointer-events-none opacity-40',
        )}
        href={getAuthorPageHref(Math.max(1, currentPage - 1))}
      >
        Previous
      </Link>

      {pages.map((page) => (
        <Link
          aria-current={page === currentPage ? 'page' : undefined}
          className={cn(
            'min-w-10 border border-slate-300 px-4 py-2 text-center text-sm font-semibold transition hover:border-[#00A650] hover:text-[#00A650]',
            page === currentPage
              ? 'border-[#00A650] bg-[#00A650] text-white'
              : 'bg-white text-[#06120b]',
          )}
          href={getAuthorPageHref(page)}
          key={page}
        >
          {page}
        </Link>
      ))}

      <Link
        aria-disabled={currentPage >= totalPages}
        className={cn(
          'border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-[#06120b] transition hover:border-[#00A650] hover:text-[#00A650]',
          currentPage >= totalPages && 'pointer-events-none opacity-40',
        )}
        href={getAuthorPageHref(Math.min(totalPages, currentPage + 1))}
      >
        Next
      </Link>
    </nav>
  )
}

function getRequestedAuthorPage(page: string | string[] | undefined): number {
  const rawPage = Array.isArray(page) ? page[0] : page
  const parsedPage = Number(rawPage)

  if (!Number.isFinite(parsedPage) || parsedPage < 1) {
    return 1
  }

  return Math.floor(parsedPage)
}

function getVisibleAuthorPages(currentPage: number, totalPages: number): number[] {
  const visibleCount = Math.min(5, totalPages)
  const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - visibleCount + 1))

  return Array.from({ length: visibleCount }, (_, index) => startPage + index)
}

function getAuthorPageHref(page: number): string {
  return page <= 1 ? AUTHOR_PATH : `${AUTHOR_PATH}?page=${page}`
}
