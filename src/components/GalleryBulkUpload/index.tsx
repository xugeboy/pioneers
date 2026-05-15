'use client'

import type { FieldState, FormState } from 'payload'

import { Button, toast, useBulkUpload, useField, useForm, useModal } from '@payloadcms/ui'
import { Images, UploadCloud } from 'lucide-react'
import React, { useRef } from 'react'

import './index.scss'

type GalleryRow = {
  id?: string
  image: number | string
}

type BulkUploadResult = {
  doc: {
    id?: number | string
  }
}

type Props = {
  path?: string
}

const baseClass = 'gallery-bulk-upload'

const createRowID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = crypto.getRandomValues(new Uint8Array(12))
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  }

  return Math.random().toString(16).slice(2).padEnd(24, '0').slice(0, 24)
}

const createFieldState = (value: number | string, valid = Boolean(value)): FieldState => ({
  initialValue: undefined,
  passesCondition: true,
  valid,
  value,
})

const normalizeID = (value: unknown): number | string | null => {
  if (typeof value === 'number' || typeof value === 'string') return value

  return null
}

const extractRows = (state: FormState, path: string): GalleryRow[] => {
  const arrayField = state[path]
  const rowCount =
    Array.isArray(arrayField?.rows) && arrayField.rows.length
      ? arrayField.rows.length
      : typeof arrayField?.value === 'number'
        ? arrayField.value
        : 0

  const rows: Array<GalleryRow | null> = Array.from({ length: rowCount }, (_, index) => {
    const image = normalizeID(state[`${path}.${index}.image`]?.value)
    const id = normalizeID(state[`${path}.${index}.id`]?.value)

    if (!image) return null

    return {
      id: typeof id === 'string' ? id : createRowID(),
      image,
    }
  })

  return rows.filter((row): row is GalleryRow => Boolean(row))
}

const buildGalleryFormState = (
  currentState: FormState,
  path: string,
  rows: GalleryRow[],
): FormState => {
  const nextState: FormState = {}
  const rowMetadata = rows.map((row) => ({
    collapsed: false,
    id: row.id || createRowID(),
  }))

  Object.entries(currentState).forEach(([fieldPath, field]) => {
    if (fieldPath === path || fieldPath.startsWith(`${path}.`)) return
    nextState[fieldPath] = field
  })

  nextState[path] = {
    ...currentState[path],
    disableFormData: true,
    errorPaths: undefined,
    passesCondition: true,
    rows: rowMetadata,
    valid: rows.length > 0,
    value: rows.length,
  }

  rows.forEach((row, index) => {
    const id = rowMetadata[index]?.id ?? createRowID()

    nextState[`${path}.${index}.id`] = {
      ...createFieldState(id),
      valid: true,
    }
    nextState[`${path}.${index}.image`] = createFieldState(row.image)
  })

  return nextState
}

export const GalleryBulkUpload: React.FC<Props> = ({ path: pathFromProps }) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { dispatchFields, getFields, setModified } = useForm()
  const { drawerSlug, setCollectionSlug, setInitialFiles, setOnCancel, setOnSuccess } =
    useBulkUpload()
  const { openModal } = useModal()
  const { path } = useField<number>({
    hasRows: true,
    potentiallyStalePath: pathFromProps,
  })

  const appendRows = (mediaIDs: Array<number | string>) => {
    const currentState = getFields()
    const currentRows = extractRows(currentState, path)
    const existingImages = new Set(currentRows.map((row) => String(row.image)))
    const newRows = mediaIDs
      .filter((id) => !existingImages.has(String(id)))
      .map((id) => ({
        id: createRowID(),
        image: id,
      }))

    if (!newRows.length) {
      toast.info('Selected images are already in this gallery.')
      return
    }

    dispatchFields({
      optimize: false,
      state: buildGalleryFormState(currentState, path, [...currentRows, ...newRows]),
      type: 'REPLACE_STATE',
    })
    setModified(true)
    toast.success(`Added ${newRows.length} image${newRows.length === 1 ? '' : 's'} to gallery.`)
  }

  const openFilePicker = () => {
    inputRef.current?.click()
  }

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (!files?.length) return

    setCollectionSlug('media')
    setInitialFiles(files)
    setOnCancel(() => {
      if (inputRef.current) inputRef.current.value = ''
    })
    setOnSuccess((uploadedForms: BulkUploadResult[], errorCount) => {
      const mediaIDs = uploadedForms
        .map((item) => item.doc?.id)
        .filter((id): id is number | string => typeof id === 'number' || typeof id === 'string')

      if (mediaIDs.length > 0) {
        appendRows(mediaIDs)
      }

      if (errorCount > 0) {
        toast.error(`${errorCount} upload${errorCount === 1 ? '' : 's'} failed.`)
      }

      if (inputRef.current) inputRef.current.value = ''
    })
    openModal(drawerSlug)
  }

  return (
    <div className={baseClass}>
      <div className={`${baseClass}__copy`}>
        <Images aria-hidden="true" size={18} />
        <span>Upload multiple images and append them to this gallery.</span>
      </div>
      <input
        accept="image/*"
        className={`${baseClass}__input`}
        multiple
        onChange={handleFilesChange}
        ref={inputRef}
        type="file"
      />
      <Button
        buttonStyle="secondary"
        icon={<UploadCloud aria-hidden="true" size={16} />}
        iconPosition="left"
        onClick={openFilePicker}
        size="small"
        type="button"
      >
        Bulk upload to gallery
      </Button>
    </div>
  )
}

export default GalleryBulkUpload
