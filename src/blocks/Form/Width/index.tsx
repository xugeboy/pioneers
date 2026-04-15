import * as React from 'react'

export const Width: React.FC<{
  children: React.ReactNode
  className?: string
  width?: number | string
}> = ({ children, className, width }) => {
  const parsedWidth =
    typeof width === 'string' ? Number.parseInt(width.replace('%', ''), 10) : Number(width)
  const safeWidth = Number.isFinite(parsedWidth)
    ? Math.min(Math.max(Math.round(parsedWidth), 1), 100)
    : 100

  const style = {
    '--field-span': safeWidth,
  } as React.CSSProperties

  return (
    <div
      className={`min-w-0 w-full box-border [grid-column:span_100_/_span_100] md:px-1.5 odd:pl-0 md:[grid-column:span_var(--field-span)_/_span_var(--field-span)] ${className || ''}`.trim()}
      style={style}
    >
      {children}
    </div>
  )
}
