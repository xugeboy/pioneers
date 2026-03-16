import { s3Storage } from '@payloadcms/storage-s3'
import type { Plugin } from 'payload'
import { Files } from '@/collections/Files'
import { Media } from '@/collections/Media'
import { Videos } from '@/collections/Videos'

const normalizeBaseURL = (value?: string | null): string => value?.replace(/\/+$/, '') || ''

const buildPublicObjectURL = (
  baseURL: string,
  doc: {
    filename?: string | null
    prefix?: string | null
  },
): string => {
  return [baseURL, doc.prefix, doc.filename].filter(Boolean).join('/')
}

const getR2Endpoint = (): string | null => {
  if (process.env.CLOUDFLARE_R2_ENDPOINT) {
    return process.env.CLOUDFLARE_R2_ENDPOINT
  }

  if (process.env.CLOUDFLARE_R2_ACCOUNT_ID) {
    return `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
  }

  return null
}

type StorageDoc = {
  filename?: string | null
  prefix?: string | null
}

export const storagePlugins = (): Plugin[] => {
  const endpoint = getR2Endpoint()
  const bucket = process.env.CLOUDFLARE_R2_BUCKET
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY

  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) {
    return []
  }

  const publicBaseURL = normalizeBaseURL(
    process.env.NEXT_PUBLIC_CDN_URL || process.env.NEXT_PUBLIC_SERVER_URL,
  )

  const sharedConfig = {
    bucket,
    config: {
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      endpoint,
      region: process.env.CLOUDFLARE_R2_REGION || 'auto',
    },
  }

  return [
    s3Storage({
      ...sharedConfig,
      clientCacheKey: 'r2-media',
      collections: {
        // Images stay on server-side uploads, but still resolve to public CDN URLs.
        [Media.slug]: {
          prefix: 'images',
          disablePayloadAccessControl: true,
          generateFileURL: publicBaseURL
            ? (doc: StorageDoc) => buildPublicObjectURL(publicBaseURL, doc)
            : undefined,
        },
      },
    }),
    s3Storage({
      ...sharedConfig,
      clientCacheKey: 'r2-assets',
      clientUploads: {
        access: ({ req }) => Boolean(req.user),
      },
      collections: {
        [Files.slug]: {
          prefix: 'documents',
          disablePayloadAccessControl: true,
          generateFileURL: publicBaseURL
            ? (doc: StorageDoc) => buildPublicObjectURL(publicBaseURL, doc)
            : undefined,
        },
        [Videos.slug]: {
          prefix: 'videos',
          disablePayloadAccessControl: true,
          generateFileURL: publicBaseURL
            ? (doc: StorageDoc) => buildPublicObjectURL(publicBaseURL, doc)
            : undefined,
        },
      },
    }),
  ]
}
