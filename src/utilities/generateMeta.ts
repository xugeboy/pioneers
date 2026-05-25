import type { Metadata } from 'next'

import type { Blog, Config, Media, Page, Product, ProductCategory } from '../payload-types'
import type { CollectionSlug } from 'payload'

import { getMediaUrl } from './getMediaUrl'
import { mergeOpenGraph } from './mergeOpenGraph'

type MetaDoc = Partial<Page> | Partial<Blog> | Partial<Product> | Partial<ProductCategory>
type MediaResource = Media | Config['db']['defaultIDType'] | null | undefined
type GenerateMetaArgs = {
  collection?: CollectionSlug
  description?: string | null
  doc: MetaDoc | null
  image?: MediaResource
  path?: string
  title?: string | null
}

const SITE_TITLE = 'China 16+ years OEM Factory'
const TITLE_SUFFIX = ` | ${SITE_TITLE}`
const COLLECTION_PATH_PREFIXES: Partial<Record<CollectionSlug, string>> = {
  blogs: '/blogs',
  products: '/products',
  'product-categories': '/product-categories',
}

const isResolvedMedia = (image?: MediaResource): image is Media =>
  Boolean(image && typeof image === 'object' && 'url' in image)

const getResolvedMedia = (...candidates: MediaResource[]): Media | undefined => {
  return candidates.find(isResolvedMedia)
}

const getDocMeta = (doc?: MetaDoc | null) => {
  return doc && 'meta' in doc ? doc.meta : undefined
}

const getDocHeroImage = (doc?: MetaDoc | null): MediaResource => {
  return doc && 'heroImage' in doc ? doc.heroImage : undefined
}

const getDocPrimaryImage = (doc?: MetaDoc | null): MediaResource => {
  return doc && 'primaryImage' in doc ? doc.primaryImage : undefined
}

const getDocTitle = (doc?: MetaDoc | null) => {
  return doc && 'title' in doc ? doc.title : undefined
}

const resolveMetaImage = (
  doc?: MetaDoc | null,
  fallbackImage?: MediaResource,
): Media | undefined => {
  const meta = getDocMeta(doc)

  return getResolvedMedia(meta?.image, getDocHeroImage(doc), getDocPrimaryImage(doc), fallbackImage)
}

export const getImageURL = (image?: MediaResource) => {
  if (!isResolvedMedia(image)) return undefined

  const url = image.sizes?.og?.url || image.url

  return getMediaUrl(url, image.updatedAt) || undefined
}

const getDocPath = (collection: CollectionSlug | undefined, slug?: string | string[] | null) => {
  const normalizedSlug = Array.isArray(slug) ? slug.join('/') : slug

  if (!normalizedSlug) return '/'
  if (collection === 'pages' && normalizedSlug === 'home') return '/'

  const prefix = collection ? COLLECTION_PATH_PREFIXES[collection] : undefined

  return `${prefix || ''}/${normalizedSlug}`
}

const getMetaTitle = (doc: MetaDoc | null, title?: string | null) => {
  const metaTitle = getDocMeta(doc)?.title
  const docTitle = getDocTitle(doc)

  if (title) return title
  if (metaTitle) return `${metaTitle}${TITLE_SUFFIX}`
  if (docTitle) return `${docTitle}${TITLE_SUFFIX}`

  return SITE_TITLE
}

export const generateMeta = (args: GenerateMetaArgs): Metadata => {
  const { collection, description: descriptionOverride, doc, image, path: pathOverride } = args

  const meta = getDocMeta(doc)
  const title = getMetaTitle(doc, args.title)
  const description = descriptionOverride ?? meta?.description
  const path = pathOverride ?? getDocPath(collection, doc?.slug)
  const imageURL = getImageURL(resolveMetaImage(doc, image))

  return {
    alternates: {
      canonical: path,
    },
    description: description || undefined,
    openGraph: mergeOpenGraph({
      description: description || '',
      images: imageURL
        ? [
            {
              url: imageURL,
            },
          ]
        : undefined,
      title,
      url: path,
    }),
    title,
  }
}
