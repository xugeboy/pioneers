import React, { Fragment } from 'react'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { BlogCarouselBlock } from '@/blocks/BlogCarousel/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FeaturedProductsCarouselBlock } from '@/blocks/FeaturedProductsCarousel/Component'
import { FullscreenHeroBlock } from '@/blocks/FullscreenHero/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { GoogleMapLocationBlock } from '@/blocks/GoogleMapLocation/Component'
import { FAQAccordionBlock } from '@/blocks/FAQAccordion/Component'
import { LatestBlogsBlock } from '@/blocks/LatestBlogs/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { AboutAdvantageBlock } from '@/blocks/aboutus/AboutAdvantage/Component'
import { AboutClosingCtaBlock } from '@/blocks/aboutus/AboutClosingCta/Component'
import { AboutCompanyProfileBlock } from '@/blocks/aboutus/AboutCompanyProfile/Component'
import { AboutHeroBlock } from '@/blocks/aboutus/AboutHero/Component'
import { CertificationsLibraryBlock } from '@/blocks/certifications/CertificationsLibrary/Component'
import { HomeApplicationsNavBlock } from '@/blocks/home/HomeApplicationsNav/Component'
import { HomeClosingCtaBlock } from '@/blocks/home/HomeClosingCta/Component'
import { HomeFAQSection } from '@/blocks/home/HomeFAQ/Component'
import { HomeTrustSignalsBlock } from '@/blocks/home/HomeTrustSignals/Component'
import { FactoryGalleryBlock } from '@/blocks/manufacturing/FactoryGallery/Component'
import { ManufacturingInquiryBlock } from '@/blocks/manufacturing/ManufacturingInquiry/Component'
import { ManufacturingOverviewBlock } from '@/blocks/manufacturing/ManufacturingOverview/Component'
import { OemOdmCapabilityBlock } from '@/blocks/manufacturing/OemOdmCapability/Component'
import { QualityControlBlock } from '@/blocks/manufacturing/QualityControl/Component'

const blockComponents = {
  aboutAdvantage: AboutAdvantageBlock,
  aboutClosingCta: AboutClosingCtaBlock,
  aboutCompanyProfile: AboutCompanyProfileBlock,
  aboutHero: AboutHeroBlock,
  archive: ArchiveBlock,
  blogCarousel: BlogCarouselBlock,
  certLibrary: CertificationsLibraryBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  faqAccordion: FAQAccordionBlock,
  featuredProductsCarousel: FeaturedProductsCarouselBlock,
  fullscreenHero: FullscreenHeroBlock,
  formBlock: FormBlock,
  googleMapLocation: GoogleMapLocationBlock,
  homeApplicationsNav: HomeApplicationsNavBlock,
  homeClosingCta: HomeClosingCtaBlock,
  homeTrustSignals: HomeTrustSignalsBlock,
  factoryGallery: FactoryGalleryBlock,
  latestBlogs: LatestBlogsBlock,
  mediaBlock: MediaBlock,
  manufacturingInquiry: ManufacturingInquiryBlock,
  manufacturingOverview: ManufacturingOverviewBlock,
  oemOdmCapability: OemOdmCapabilityBlock,
  qualityControl: QualityControlBlock,
}

type BlockInput = {
  blockType?: keyof typeof blockComponents
}

export const RenderBlocks: React.FC<{
  blocks: BlockInput[]
  insertHomeFAQAfterBlog?: boolean
}> = (props) => {
  const { blocks, insertHomeFAQAfterBlog } = props
  let hasInsertedHomeFAQ = false

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block
          const spacingClass =
            blockType === 'fullscreenHero' ||
            blockType === 'aboutHero' ||
            blockType === 'aboutCompanyProfile' ||
            blockType === 'aboutAdvantage' ||
            blockType === 'aboutClosingCta' ||
            blockType === 'certLibrary' ||
            blockType === 'manufacturingOverview' ||
            blockType === 'qualityControl' ||
            blockType === 'oemOdmCapability' ||
            blockType === 'factoryGallery' ||
            blockType === 'manufacturingInquiry' ||
            blockType === 'homeApplicationsNav' ||
            blockType === 'homeTrustSignals' ||
            blockType === 'homeClosingCta' ||
            blockType === 'featuredProductsCarousel' ||
            blockType === 'blogCarousel'
              ? 'my-0'
              : 'my-16'

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType] as React.ComponentType<Record<string, unknown>>

            if (Block) {
              const shouldInsertHomeFAQ =
                insertHomeFAQAfterBlog &&
                !hasInsertedHomeFAQ &&
                (blockType === 'blogCarousel' || blockType === 'latestBlogs')

              if (shouldInsertHomeFAQ) {
                hasInsertedHomeFAQ = true
              }

              return (
                <Fragment key={index}>
                  <div className={spacingClass}>
                    <Block {...block} disableInnerContainer />
                  </div>
                  {shouldInsertHomeFAQ ? <HomeFAQSection /> : null}
                </Fragment>
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
