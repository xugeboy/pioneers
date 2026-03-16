import { getClientSideURL } from '@/utilities/getURL'

const normalizeBaseURL = (value?: string | null): string => value?.replace(/\/+$/, '') || ''

const remapAssetPathForCDN = (url: string): string => {
  if (url.startsWith('/media/')) return url.replace('/media/', '/images/')
  if (url.startsWith('/files/')) return url.replace('/files/', '/documents/')
  return url
}

const getAssetBaseURL = (url: string): string => {
  const cdnURL = normalizeBaseURL(process.env.NEXT_PUBLIC_CDN_URL)

  if (
    cdnURL &&
    ['/media/', '/files/', '/images/', '/documents/'].some((prefix) => url.startsWith(prefix))
  ) {
    return cdnURL
  }

  return normalizeBaseURL(getClientSideURL())
}

/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  if (cacheTag && cacheTag !== '') {
    cacheTag = encodeURIComponent(cacheTag)
  }

  // Check if URL already has http/https protocol
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return cacheTag ? `${url}?${cacheTag}` : url
  }

  // Otherwise prepend the CDN base URL for public assets when configured.
  const baseUrl = getAssetBaseURL(url)
  const assetPath = process.env.NEXT_PUBLIC_CDN_URL ? remapAssetPathForCDN(url) : url
  return cacheTag ? `${baseUrl}${assetPath}?${cacheTag}` : `${baseUrl}${assetPath}`
}
