'use client'

import { Button, toast, useBulkUpload, useModal } from '@payloadcms/ui'
import { UploadCloud } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

import './index.scss'

const baseClass = 'media-bulk-upload'

export const MediaBulkUpload: React.FC = () => {
  const router = useRouter()
  const { drawerSlug, setCollectionSlug, setOnSuccess } = useBulkUpload()
  const { openModal } = useModal()

  const openBulkUpload = () => {
    setCollectionSlug('media')
    setOnSuccess((uploadedForms, errorCount) => {
      router.refresh()

      if (uploadedForms.length > 0) {
        toast.success(
          `Uploaded ${uploadedForms.length} media item${uploadedForms.length === 1 ? '' : 's'}.`,
        )
      }

      if (errorCount > 0) {
        toast.error(`${errorCount} upload${errorCount === 1 ? '' : 's'} failed.`)
      }
    })
    openModal(drawerSlug)
  }

  return (
    <div className={baseClass}>
      <div>
        <h2>Bulk upload media</h2>
        <p>
          Add multiple images in one batch. Each file will be created as its own Media document.
        </p>
      </div>
      <Button
        buttonStyle="primary"
        icon={<UploadCloud aria-hidden="true" size={16} />}
        iconPosition="left"
        onClick={openBulkUpload}
        size="small"
        type="button"
      >
        Bulk upload
      </Button>
    </div>
  )
}

export default MediaBulkUpload
