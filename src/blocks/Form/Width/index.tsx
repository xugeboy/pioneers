import * as React from 'react'

export const Width: React.FC<{
  children: React.ReactNode
  className?: string
  width?: number | string
}> = ({ children, className, width }) => {
  const parsedWidth =
    typeof width === 'string' ? Number.parseInt(width.replace('%', ''), 10) : Number(width)
  const safeWidth = Number.isFinite(parsedWidth) ? Math.min(Math.max(Math.round(parsedWidth), 1), 100) : 100

  const style = {
    gridColumn: `span ${safeWidth} / span ${safeWidth}`,
  } as React.CSSProperties

  return (
    <div className={`min-w-0 w-full box-border md:px-3 ${className || ''}`.trim()} style={style}>
      {children}
    </div>
  )
}
