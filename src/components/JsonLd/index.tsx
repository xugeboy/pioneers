type JsonLdData = Record<string, unknown> | Record<string, unknown>[]

type Props = {
  data?: JsonLdData | null
}

const serializeJsonLd = (data: JsonLdData): string => JSON.stringify(data).replace(/</g, '\\u003c')

export function JsonLd({ data }: Props) {
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return null
  }

  return (
    <script
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
      type="application/ld+json"
    />
  )
}
