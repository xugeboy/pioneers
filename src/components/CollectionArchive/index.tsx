import { cn } from '@/utilities/ui'
import React from 'react'

import { Card, CardBlogData } from '@/components/Card'

export type Props = {
  blogs: CardBlogData[]
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { blogs } = props

  return (
    <div className={cn('container')}>
      <div>
        <div className="grid gap-x-6 gap-y-8 md:grid-cols-2 xl:grid-cols-3 lg:gap-x-8">
          {blogs?.map((result, index) => {
            if (typeof result === 'object' && result !== null) {
              return (
                <div key={index}>
                  <Card className="h-full" doc={result} relationTo="blogs" showCategories />
                </div>
              )
            }

            return null
          })}
        </div>
      </div>
    </div>
  )
}
