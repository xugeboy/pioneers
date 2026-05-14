'use client'

import React from 'react'

import type { File as PayloadFile, Video as PayloadVideo } from '@/payload-types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

type VideoPreviewProps = {
  file?: PayloadFile | PayloadVideo | number | null
  title: string
  url?: string | null
}

const getUploadedFileURL = (file?: PayloadFile | PayloadVideo | number | null) => {
  if (!file || typeof file === 'number') return ''
  return getMediaUrl(file.url, file.updatedAt)
}

const parseYouTubeStartSeconds = (value?: string | null) => {
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

const getYouTubeEmbedURL = (url: string) => {
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

    if (!videoID) return ''

    const startSeconds = parseYouTubeStartSeconds(
      parsedURL.searchParams.get('start') || parsedURL.searchParams.get('t'),
    )
    const embedURL = new URL(`https://www.youtube-nocookie.com/embed/${videoID}`)
    embedURL.searchParams.set('rel', '0')

    if (startSeconds > 0) {
      embedURL.searchParams.set('start', String(startSeconds))
    }

    return embedURL.toString()
  } catch {
    return ''
  }
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ file, title, url }) => {
  if (url) {
    const youtubeEmbedURL = getYouTubeEmbedURL(url)

    if (youtubeEmbedURL) {
      return (
        <div className="aspect-video w-full overflow-hidden bg-[#101914]">
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="size-full"
            referrerPolicy="strict-origin-when-cross-origin"
            src={youtubeEmbedURL}
            title={title}
          />
        </div>
      )
    }

    return <video className="w-full" controls src={url} />
  }

  const uploadedURL = getUploadedFileURL(file)
  if (!uploadedURL || !file || typeof file === 'number') return null

  const isVideo = file.mimeType?.startsWith('video/')

  if (isVideo) {
    return <video className="w-full" controls src={uploadedURL} />
  }

  return (
    <a
      className="text-sm text-primary underline"
      href={uploadedURL}
      rel="noreferrer"
      target="_blank"
    >
      {file.filename || 'View file'}
    </a>
  )
}
