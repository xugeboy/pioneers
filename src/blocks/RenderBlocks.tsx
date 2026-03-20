import React, { Fragment } from 'react'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FullscreenHeroBlock } from '@/blocks/FullscreenHero/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { FAQAccordionBlock } from '@/blocks/FAQAccordion/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  faqAccordion: FAQAccordionBlock,
  fullscreenHero: FullscreenHeroBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
}

type BlockInput = {
  blockType?: keyof typeof blockComponents
}

export const RenderBlocks: React.FC<{
  blocks: BlockInput[]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block
          const spacingClass = blockType === 'fullscreenHero' ? 'my-0' : 'my-16'

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType] as React.ComponentType<Record<string, unknown>>

            if (Block) {
              return (
                <div className={spacingClass} key={index}>
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
