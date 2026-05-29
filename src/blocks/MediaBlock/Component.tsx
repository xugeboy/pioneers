import type { StaticImageData } from 'next/image'

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { MediaBlock as MediaBlockProps } from '@/payload-types'

import { Media } from '../../components/Media'
import { VideoPreview } from '../../components/VideoPreview'

type Props = MediaBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

export const MediaBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    displayMode = 'fullScreen',
    enableGutter = true,
    imgClassName,
    media,
    mediaType = 'image',
    staticImage,
    disableInnerContainer,
    videoFile,
    videoURL,
  } = props

  let caption
  if (media && typeof media === 'object') caption = media.caption

  const shouldRenderImage = mediaType === 'image'
  const shouldRenderYouTube = mediaType === 'youtube' && videoURL
  const shouldRenderUploadedVideo = mediaType === 'uploadVideo' && videoFile
  const isTextWrap = displayMode === 'textWrap'

  return (
    <div
      className={cn(
        'not-prose',
        isTextWrap
          ? 'my-6 w-full md:float-left md:clear-left md:mb-4 md:mr-8 md:mt-2 md:w-[min(42%,24rem)]'
          : 'clear-both my-10 w-full',
        {
          container: enableGutter && !isTextWrap,
        },
        className,
      )}
    >
      {shouldRenderImage && (media || staticImage) && (
        <Media
          imgClassName={cn('border border-border rounded-[0.8rem]', imgClassName)}
          resource={media}
          src={staticImage}
        />
      )}
      {shouldRenderYouTube ? <VideoPreview title="Media video" url={videoURL} /> : null}
      {shouldRenderUploadedVideo ? <VideoPreview file={videoFile} title="Media video" /> : null}
      {caption && (
        <div
          className={cn(
            'mt-6',
            {
              container: !disableInnerContainer,
            },
            captionClassName,
          )}
        >
          <RichText data={caption} enableGutter={false} />
        </div>
      )}
    </div>
  )
}
