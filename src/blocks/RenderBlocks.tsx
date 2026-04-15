import React, { Fragment } from 'react'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FullscreenHeroBlock } from '@/blocks/FullscreenHero/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { FAQAccordionBlock } from '@/blocks/FAQAccordion/Component'
import { LatestBlogsBlock } from '@/blocks/LatestBlogs/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { AboutClientsBlock } from '@/blocks/aboutus/AboutClients/Component'
import { AboutClosingCtaBlock } from '@/blocks/aboutus/AboutClosingCta/Component'
import { AboutDifferentiatorsBlock } from '@/blocks/aboutus/AboutDifferentiators/Component'
import { AboutHeroBlock } from '@/blocks/aboutus/AboutHero/Component'
import { CompanyTimelineBlock } from '@/blocks/aboutus/CompanyTimeline/Component'
import { CertificationsClosingCtaBlock } from '@/blocks/certifications/CertificationsClosingCta/Component'
import { CertificationsDownloadHubBlock } from '@/blocks/certifications/CertificationsDownloadHub/Component'
import { CertificationsHeroBlock } from '@/blocks/certifications/CertificationsHero/Component'
import { CertificationsProofCardsBlock } from '@/blocks/certifications/CertificationsProofCards/Component'
import { CertificationsQualityCommitmentBlock } from '@/blocks/certifications/CertificationsQualityCommitment/Component'
import { CertificationsStandardsMatrixBlock } from '@/blocks/certifications/CertificationsStandardsMatrix/Component'
import { CertificationsTestingProcessBlock } from '@/blocks/certifications/CertificationsTestingProcess/Component'
import { HomeApplicationsNavBlock } from '@/blocks/home/HomeApplicationsNav/Component'
import { HomeClosingCtaBlock } from '@/blocks/home/HomeClosingCta/Component'
import { HomeProductFamiliesBlock } from '@/blocks/home/HomeProductFamilies/Component'
import { HomeStrengthsBlock } from '@/blocks/home/HomeStrengths/Component'
import { HomeTrustSignalsBlock } from '@/blocks/home/HomeTrustSignals/Component'
import { CapacityCapabilityBlock } from '@/blocks/manufacturing/CapacityCapability/Component'
import { EquipmentVisualsBlock } from '@/blocks/manufacturing/EquipmentVisuals/Component'
import { FactoryGalleryBlock } from '@/blocks/manufacturing/FactoryGallery/Component'
import { ManufacturingInquiryBlock } from '@/blocks/manufacturing/ManufacturingInquiry/Component'
import { ManufacturingOverviewBlock } from '@/blocks/manufacturing/ManufacturingOverview/Component'
import { OemOdmCapabilityBlock } from '@/blocks/manufacturing/OemOdmCapability/Component'
import { ProductionProcessBlock } from '@/blocks/manufacturing/ProductionProcess/Component'
import { QualityControlBlock } from '@/blocks/manufacturing/QualityControl/Component'

const blockComponents = {
  aboutClients: AboutClientsBlock,
  aboutClosingCta: AboutClosingCtaBlock,
  aboutDifferentiators: AboutDifferentiatorsBlock,
  aboutHero: AboutHeroBlock,
  archive: ArchiveBlock,
  certificationsClosingCta: CertificationsClosingCtaBlock,
  certificationsDownloadHub: CertificationsDownloadHubBlock,
  certificationsHero: CertificationsHeroBlock,
  certificationsProofCards: CertificationsProofCardsBlock,
  certificationsQualityCommitment: CertificationsQualityCommitmentBlock,
  certificationsStandardsMatrix: CertificationsStandardsMatrixBlock,
  certificationsTestingProcess: CertificationsTestingProcessBlock,
  companyTimeline: CompanyTimelineBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  faqAccordion: FAQAccordionBlock,
  fullscreenHero: FullscreenHeroBlock,
  formBlock: FormBlock,
  homeApplicationsNav: HomeApplicationsNavBlock,
  homeClosingCta: HomeClosingCtaBlock,
  homeProductFamilies: HomeProductFamiliesBlock,
  homeStrengths: HomeStrengthsBlock,
  homeTrustSignals: HomeTrustSignalsBlock,
  capacityCapability: CapacityCapabilityBlock,
  equipmentVisuals: EquipmentVisualsBlock,
  factoryGallery: FactoryGalleryBlock,
  latestBlogs: LatestBlogsBlock,
  mediaBlock: MediaBlock,
  manufacturingInquiry: ManufacturingInquiryBlock,
  manufacturingOverview: ManufacturingOverviewBlock,
  oemOdmCapability: OemOdmCapabilityBlock,
  productionProcess: ProductionProcessBlock,
  qualityControl: QualityControlBlock,
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
          const spacingClass =
            blockType === 'fullscreenHero' ||
            blockType === 'aboutHero' ||
            blockType === 'aboutDifferentiators' ||
            blockType === 'aboutClients' ||
            blockType === 'companyTimeline' ||
            blockType === 'aboutClosingCta' ||
            blockType === 'certificationsHero' ||
            blockType === 'certificationsProofCards' ||
            blockType === 'certificationsTestingProcess' ||
            blockType === 'certificationsStandardsMatrix' ||
            blockType === 'certificationsQualityCommitment' ||
            blockType === 'certificationsDownloadHub' ||
            blockType === 'certificationsClosingCta' ||
            blockType === 'manufacturingOverview' ||
            blockType === 'productionProcess' ||
            blockType === 'equipmentVisuals' ||
            blockType === 'qualityControl' ||
            blockType === 'capacityCapability' ||
            blockType === 'oemOdmCapability' ||
            blockType === 'factoryGallery' ||
            blockType === 'manufacturingInquiry' ||
            blockType === 'homeApplicationsNav' ||
            blockType === 'homeProductFamilies' ||
            blockType === 'homeStrengths' ||
            blockType === 'homeTrustSignals' ||
            blockType === 'homeClosingCta'
              ? 'my-0'
              : 'my-16'

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
