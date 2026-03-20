import Link from 'next/link'
import React from 'react'

type BreadcrumbItem = {
  href?: string
  label: string
}

export const Breadcrumbs: React.FC<{
  items: BreadcrumbItem[]
}> = ({ items }) => {
  if (!items.length) return null

  return (
    <nav aria-label="Breadcrumb" className="container mb-8 mt-5 md:mb-10 md:mt-7">
      <ol className="inline-flex min-h-11 flex-wrap items-center gap-2 py-2.5 text-sm text-muted-foreground backdrop-blur-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <React.Fragment key={`${item.label}-${index}`}>
              <li>
                {item.href && !isLast ? (
                  <Link
                    className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? 'font-medium text-foreground' : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
              {!isLast && (
                <li aria-hidden="true" className="text-muted-foreground/50">
                  <span className="block text-xs">/</span>
                </li>
              )}
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}

export type { BreadcrumbItem }
