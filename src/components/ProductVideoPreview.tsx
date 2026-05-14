'use client'

import React from 'react'

import type { Product as PayloadProduct } from '@/payload-types'

import { VideoPreview } from '@/components/VideoPreview'

type ProductVideoPreviewProps = {
  title: string
  video?: PayloadProduct['video']
}

export const ProductVideoPreview: React.FC<ProductVideoPreviewProps> = ({ title, video }) => {
  if (!video || (!video.url && !video.file)) return null

  const isUploadedVideo = video.type === 'upload'

  return (
    <section>
      <div className="mt-5">
        <VideoPreview
          file={isUploadedVideo ? video.file : null}
          title={title || 'Product video'}
          url={!isUploadedVideo ? video.url : null}
        />
      </div>
    </section>
  )
}
