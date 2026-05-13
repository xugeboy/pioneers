import type { Metadata } from 'next'

import type { Blog, Config, Media, Page } from '../payload-types'
import type { CollectionSlug } from 'payload'

import { getMediaUrl } from './getMediaUrl'
import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? getMediaUrl(ogUrl, image.updatedAt) : getMediaUrl(image.url, image.updatedAt)
  }

  return url
}

export const generateMeta = async (args: {
  collection?: CollectionSlug
  doc: Partial<Page> | Partial<Blog> | null
}): Promise<Metadata> => {
  const { collection, doc } = args

  const ogImage = getImageURL(doc?.meta?.image)

  const title = doc?.meta?.title
    ? doc?.meta?.title + ' | China 16+ years OEM Factory'
    : 'China 16+ years OEM Factory'

  const slug = Array.isArray(doc?.slug) ? doc.slug.join('/') : doc?.slug
  const path = !slug ? '/' : collection === 'blogs' ? `/blogs/${slug}` : `/${slug}`

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: path,
    }),
    title,
  }
}
