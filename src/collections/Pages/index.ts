import type { CollectionConfig } from 'payload'

import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { isAdmin } from '../../access/isAdmin'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { BlogCarousel } from '../../blocks/BlogCarousel/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FeaturedProductsCarousel } from '../../blocks/FeaturedProductsCarousel/config'
import { FAQAccordion } from '../../blocks/FAQAccordion/config'
import { FullscreenHero } from '../../blocks/FullscreenHero/config'
import { FormBlock } from '../../blocks/Form/config'
import { GalleryMasonry } from '../../blocks/GalleryMasonry/config'
import { GoogleMapLocation } from '../../blocks/GoogleMapLocation/config'
import { LatestBlogs } from '../../blocks/LatestBlogs/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { AboutAdvantage } from '../../blocks/aboutus/AboutAdvantage/config'
import { AboutClosingCta } from '../../blocks/aboutus/AboutClosingCta/config'
import { AboutCompanyProfile } from '../../blocks/aboutus/AboutCompanyProfile/config'
import { AboutHero } from '../../blocks/aboutus/AboutHero/config'
import { CertificationsLibrary } from '../../blocks/certifications/CertificationsLibrary/config'
import { FactoryGallery } from '../../blocks/manufacturing/FactoryGallery/config'
import { ManufacturingInquiry } from '../../blocks/manufacturing/ManufacturingInquiry/config'
import { ManufacturingOverview } from '../../blocks/manufacturing/ManufacturingOverview/config'
import { OemOdmCapability } from '../../blocks/manufacturing/OemOdmCapability/config'
import { QualityControl } from '../../blocks/manufacturing/QualityControl/config'
import { HomeApplicationsNav } from '../../blocks/home/HomeApplicationsNav/config'
import { HomeClosingCta } from '../../blocks/home/HomeClosingCta/config'
import { HomeTrustSignals } from '../../blocks/home/HomeTrustSignals/config'
import { hero } from '@/heros/config'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: authenticatedOrPublished,
    update: isAdmin,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                FullscreenHero,
                AboutHero,
                AboutCompanyProfile,
                AboutAdvantage,
                AboutClosingCta,
                CertificationsLibrary,
                ManufacturingOverview,
                QualityControl,
                OemOdmCapability,
                FactoryGallery,
                GalleryMasonry,
                ManufacturingInquiry,
                HomeApplicationsNav,
                HomeTrustSignals,
                HomeClosingCta,
                FeaturedProductsCarousel,
                BlogCarousel,
                CallToAction,
                FAQAccordion,
                Content,
                MediaBlock,
                Archive,
                LatestBlogs,
                FormBlock,
                GoogleMapLocation,
              ],
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
