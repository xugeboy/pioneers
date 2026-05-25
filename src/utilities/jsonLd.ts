import type { Blog, Media, Page, Product, ProductCategory, Video } from '@/payload-types'

import { getServerSideURL } from '@/utilities/getURL'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import {
  getProductCategoryHref,
  getProductCategoryHrefFromPath,
  getProductCategoryPath,
  type ProductCategorySummary,
} from '@/utilities/productCategories'

export type JsonLdNode = Record<string, unknown>

type VideoSource =
  | {
      type: 'upload'
      file?: number | Video | null
    }
  | {
      type: 'url'
      url?: string | null
    }

const SITE_NAME = 'PioneersGears'
const SITE_DESCRIPTION =
  'Application-driven cargo control and mobility restraint solutions for OEM and ODM programs.'

const removeEmpty = <T extends JsonLdNode>(input: T): T => {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => {
      if (value === undefined || value === null || value === '') return false
      if (Array.isArray(value) && value.length === 0) return false
      return true
    }),
  ) as T
}

export const compactJsonLd = (nodes: Array<JsonLdNode | null | undefined>): JsonLdNode[] =>
  nodes.filter((node): node is JsonLdNode => Boolean(node))

export const toAbsoluteURL = (path = '/'): string => {
  if (path.startsWith('http://') || path.startsWith('https://')) return path

  const baseURL = getServerSideURL().replace(/\/+$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `${baseURL}${normalizedPath}`
}

const getMediaURL = (image?: Media | number | null): string | undefined => {
  if (!image || typeof image !== 'object') return undefined

  const url = image.frontendURL || image.sizes?.og?.url || image.sizes?.large?.url || image.url
  const mediaURL = getMediaUrl(url, image.updatedAt)

  return mediaURL ? toAbsoluteURL(mediaURL) : undefined
}

const getUploadedVideoURL = (file?: Video | number | null): string | undefined => {
  if (!file || typeof file !== 'object') return undefined

  const videoURL = getMediaUrl(file.url, file.updatedAt)

  return videoURL ? toAbsoluteURL(videoURL) : undefined
}

const getUploadedVideoThumbnailURL = (file?: Video | number | null): string | undefined => {
  if (!file || typeof file !== 'object' || !file.thumbnailURL) return undefined

  const thumbnailURL = getMediaUrl(file.thumbnailURL, file.updatedAt)

  return thumbnailURL ? toAbsoluteURL(thumbnailURL) : undefined
}

const getAbsoluteVideoURL = (url?: string | null): string | undefined => {
  const trimmedURL = url?.trim()

  return trimmedURL ? toAbsoluteURL(trimmedURL) : undefined
}

const parseYouTubeStartSeconds = (value?: string | null): number => {
  if (!value) return 0

  if (/^\d+$/.test(value)) {
    return Number(value)
  }

  const match = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/)
  if (!match) return 0

  const hours = Number(match[1] || 0)
  const minutes = Number(match[2] || 0)
  const seconds = Number(match[3] || 0)

  return hours * 3600 + minutes * 60 + seconds
}

const getYouTubeVideoData = (
  url?: string | null,
): { embedURL: string; thumbnailURL: string } | null => {
  if (!url) return null

  try {
    const parsedURL = new URL(url.replace(/&amp;/g, '&'))
    const hostname = parsedURL.hostname.replace(/^www\./, '').toLowerCase()
    const pathSegments = parsedURL.pathname.split('/').filter(Boolean)
    let videoID = ''

    if (hostname === 'youtu.be') {
      videoID = pathSegments[0] || ''
    } else if (hostname === 'youtube.com' || hostname.endsWith('.youtube.com')) {
      if (parsedURL.pathname === '/watch') {
        videoID = parsedURL.searchParams.get('v') || ''
      } else {
        const videoIDPrefixIndex = pathSegments.findIndex((segment) =>
          ['embed', 'live', 'shorts', 'v'].includes(segment),
        )

        if (videoIDPrefixIndex >= 0) {
          videoID = pathSegments[videoIDPrefixIndex + 1] || ''
        }
      }
    }

    if (!videoID) return null

    const startSeconds = parseYouTubeStartSeconds(
      parsedURL.searchParams.get('start') || parsedURL.searchParams.get('t'),
    )
    const embedURL = new URL(`https://www.youtube-nocookie.com/embed/${videoID}`)
    embedURL.searchParams.set('rel', '0')

    if (startSeconds > 0) {
      embedURL.searchParams.set('start', String(startSeconds))
    }

    return {
      embedURL: embedURL.toString(),
      thumbnailURL: `https://img.youtube.com/vi/${videoID}/hqdefault.jpg`,
    }
  } catch {
    return null
  }
}

const getVideoSourceURL = (source: VideoSource): string | undefined => {
  if (source.type === 'upload') return getUploadedVideoURL(source.file)

  return getAbsoluteVideoURL(source.url)
}

const getProductVideoSource = (product: Product): VideoSource | null => {
  if (product.video?.type === 'upload' && product.video.file) {
    return {
      type: 'upload',
      file: product.video.file,
    }
  }

  if ((!product.video?.type || product.video.type === 'url') && product.video?.url) {
    return {
      type: 'url',
      url: product.video.url,
    }
  }

  return findMediaBlockVideoSource(product.customLayout)
}

const getMediaBlockVideoSource = (value: unknown): VideoSource | null => {
  if (!value || typeof value !== 'object') return null

  const block = value as {
    blockType?: unknown
    mediaType?: unknown
    videoFile?: unknown
    videoURL?: unknown
  }

  if (block.blockType !== 'mediaBlock') return null

  if (block.mediaType === 'uploadVideo' && block.videoFile) {
    return {
      type: 'upload',
      file: block.videoFile as Video | number,
    }
  }

  if (block.mediaType === 'youtube' && typeof block.videoURL === 'string' && block.videoURL) {
    return {
      type: 'url',
      url: block.videoURL,
    }
  }

  return null
}

const findMediaBlockVideoSource = (value: unknown): VideoSource | null => {
  if (!value) return null

  if (Array.isArray(value)) {
    for (const item of value) {
      const source = findMediaBlockVideoSource(item)
      if (source) return source
    }

    return null
  }

  if (typeof value !== 'object') return null

  const directSource = getMediaBlockVideoSource(value)
  if (directSource) return directSource

  const record = value as Record<string, unknown>
  const fieldsSource = getMediaBlockVideoSource(record.fields)
  if (fieldsSource) return fieldsSource

  return (
    findMediaBlockVideoSource(record.children) ||
    findMediaBlockVideoSource(record.root) ||
    findMediaBlockVideoSource(record.fields)
  )
}

const getVideoObjectJsonLd = (args: {
  description?: string | null
  fallbackThumbnailURL?: string
  name?: string | null
  path: string
  source: VideoSource | null
  uploadDate?: string | null
}): JsonLdNode | null => {
  if (!args.source) return null

  const videoURL = getVideoSourceURL(args.source)
  if (!videoURL) return null

  const youtubeData = args.source.type === 'url' ? getYouTubeVideoData(args.source.url) : null
  const thumbnails = [
    args.source.type === 'upload' ? getUploadedVideoThumbnailURL(args.source.file) : undefined,
    youtubeData?.thumbnailURL,
    args.fallbackThumbnailURL,
  ].filter((thumbnail): thumbnail is string => Boolean(thumbnail))

  if (!thumbnails.length) return null

  return removeEmpty({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    '@id': `${toAbsoluteURL(args.path)}#video`,
    name: args.name,
    description: args.description,
    thumbnailUrl: thumbnails,
    uploadDate: args.uploadDate,
    contentUrl: videoURL,
    embedUrl: youtubeData?.embedURL || toAbsoluteURL(args.path),
  })
}

const getOrganizationNode = (): JsonLdNode =>
  removeEmpty({
    '@type': 'Organization',
    '@id': toAbsoluteURL('/#organization'),
    name: SITE_NAME,
    url: toAbsoluteURL('/'),
    logo: toAbsoluteURL('/pioneers-logo.png'),
  })

export const getGlobalJsonLd = (): JsonLdNode[] => [
  {
    '@context': 'https://schema.org',
    ...getOrganizationNode(),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': toAbsoluteURL('/#website'),
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: toAbsoluteURL('/'),
    publisher: {
      '@id': toAbsoluteURL('/#organization'),
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${toAbsoluteURL('/search')}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },
]

export const getWebPageJsonLd = (
  doc: Partial<Page> | Partial<Blog> | null,
  path: string,
): JsonLdNode =>
  removeEmpty({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${toAbsoluteURL(path)}#webpage`,
    url: toAbsoluteURL(path),
    name: doc?.meta?.title || doc?.title || SITE_NAME,
    description: doc?.meta?.description,
    isPartOf: {
      '@id': toAbsoluteURL('/#website'),
    },
    publisher: {
      '@id': toAbsoluteURL('/#organization'),
    },
  })

export const getBlogPostingJsonLd = (blog: Blog): JsonLdNode => {
  const path = `/blogs/${blog.slug}`
  const image = getMediaURL(blog.meta?.image || blog.heroImage)
  const authors =
    blog.populatedAuthors
      ?.map((author) =>
        author.name
          ? {
              '@type': 'Person',
              name: author.name,
            }
          : null,
      )
      .filter(Boolean) || []

  return removeEmpty({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${toAbsoluteURL(path)}#blogposting`,
    headline: blog.meta?.title || blog.title,
    description: blog.meta?.description,
    image,
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt,
    author: authors.length ? authors : getOrganizationNode(),
    publisher: {
      '@id': toAbsoluteURL('/#organization'),
    },
    mainEntityOfPage: {
      '@id': `${toAbsoluteURL(path)}#webpage`,
    },
    url: toAbsoluteURL(path),
  })
}

export const getBlogVideoJsonLd = (blog: Blog): JsonLdNode | null => {
  const path = `/blogs/${blog.slug}`

  return getVideoObjectJsonLd({
    description: blog.meta?.description,
    fallbackThumbnailURL: getMediaURL(blog.meta?.image || blog.heroImage),
    name: blog.meta?.title || blog.title,
    path,
    source: findMediaBlockVideoSource(blog.content),
    uploadDate: blog.publishedAt || blog.createdAt,
  })
}

export const getProductJsonLd = (product: Product): JsonLdNode => {
  const path = `/products/${product.slug}`
  const category =
    typeof product.primaryCategory === 'object' && product.primaryCategory
      ? product.primaryCategory.title
      : undefined

  return removeEmpty({
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${toAbsoluteURL(path)}#product`,
    name: product.title,
    model: product.model,
    description: product.summary,
    image: getMediaURL(product.primaryImage),
    category,
    url: toAbsoluteURL(path),
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    manufacturer: {
      '@id': toAbsoluteURL('/#organization'),
    },
    additionalProperty: product.specs?.map((spec) => ({
      '@type': 'PropertyValue',
      name: spec.label,
      value: spec.value,
    })),
  })
}

export const getProductVideoJsonLd = (product: Product): JsonLdNode | null => {
  const path = `/products/${product.slug}`

  return getVideoObjectJsonLd({
    description: product.summary,
    fallbackThumbnailURL: getMediaURL(product.primaryImage),
    name: product.title,
    path,
    source: getProductVideoSource(product),
    uploadDate:
      product.video?.type === 'upload' &&
      product.video.file &&
      typeof product.video.file === 'object'
        ? product.video.file.createdAt
        : product.publishedAt || product.createdAt,
  })
}

export const getCollectionPageJsonLd = (args: {
  description?: string | null
  items?: { name: string; url: string }[]
  name: string
  path: string
}): JsonLdNode =>
  removeEmpty({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${toAbsoluteURL(args.path)}#collectionpage`,
    url: toAbsoluteURL(args.path),
    name: args.name,
    description: args.description,
    isPartOf: {
      '@id': toAbsoluteURL('/#website'),
    },
    mainEntity: args.items?.length
      ? {
          '@type': 'ItemList',
          itemListElement: args.items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            url: toAbsoluteURL(item.url),
          })),
        }
      : undefined,
  })

export const getProductCategoryJsonLd = (
  category: ProductCategorySummary | ProductCategory,
  products: Pick<Product, 'slug' | 'title'>[],
): JsonLdNode => {
  const categoryPath = getProductCategoryPath(category)
  const path = getProductCategoryHref(category)

  return getCollectionPageJsonLd({
    description: category.description,
    items: products.map((product) => ({
      name: product.title,
      url: `/products/${product.slug}`,
    })),
    name: category.title,
    path: categoryPath ? getProductCategoryHrefFromPath(categoryPath) : path,
  })
}

export const getBreadcrumbJsonLd = (
  items: { label: string; href?: string }[],
  currentPath: string,
): JsonLdNode => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    item: toAbsoluteURL(item.href || currentPath),
  })),
})
