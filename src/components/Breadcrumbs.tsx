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
    <nav aria-label="Breadcrumb" className="container mb-8">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <React.Fragment key={`${item.label}-${index}`}>
              <li>
                {item.href && !isLast ? (
                  <Link className="transition-colors hover:text-foreground" href={item.href}>
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? 'text-foreground' : undefined}>{item.label}</span>
                )}
              </li>
              {!isLast && (
                <li aria-hidden="true" className="text-border">
                  /
                </li>
              )}
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
