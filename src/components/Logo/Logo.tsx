import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  src?: string
}

export const Logo = (props: Props) => {
  const { className, loading: loadingFromProps, priority: priorityFromProps, src } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="Pioneers Logo"
      width={400}
      height={200}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx(className)}
      src={src || '/pioneers-logo.png'}
    />
  )
}
