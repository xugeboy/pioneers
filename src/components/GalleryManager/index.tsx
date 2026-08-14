'use client'

import type { ArrayFieldClientComponent, FieldState, FormState } from 'payload'

import {
  Button,
  toast,
  useBulkUpload,
  useField,
  useForm,
  useFormFields,
  useListDrawer,
  useModal,
  usePayloadAPI,
} from '@payloadcms/ui'
import { DraggableSortable } from '@payloadcms/ui/elements/DraggableSortable'
import { DraggableSortableItem } from '@payloadcms/ui/elements/DraggableSortable/DraggableSortableItem'
import {
  Eye,
  EyeOff,
  GripVertical,
  Images,
  Library,
  Search,
  Trash2,
  UploadCloud,
} from 'lucide-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import type { Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

import './index.scss'

type GalleryRow = {
  id: string
  image: number | string
  visible: boolean
}

type BulkUploadResult = {
  doc: {
    id?: number | string
  }
}

type MediaResponse = {
  docs?: Media[]
}

type ViewFilter = 'all' | 'hidden' | 'visible'

const baseClass = 'gallery-manager'

const createRowID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = crypto.getRandomValues(new Uint8Array(12))
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  }

  return Math.random().toString(16).slice(2).padEnd(24, '0').slice(0, 24)
}

const normalizeID = (value: unknown): number | string | null => {
  if (typeof value === 'number' || typeof value === 'string') return value

  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: unknown }).id
    if (typeof id === 'number' || typeof id === 'string') return id
  }

  return null
}

const createFieldState = (value: FieldState['value']): FieldState => ({
  initialValue: undefined,
  passesCondition: true,
  valid: true,
  value,
})

const extractRows = (state: FormState, path: string): GalleryRow[] => {
  const arrayField = state[path]
  const rowCount =
    Array.isArray(arrayField?.rows) && arrayField.rows.length
      ? arrayField.rows.length
      : typeof arrayField?.value === 'number'
        ? arrayField.value
        : 0

  return Array.from({ length: rowCount }, (_, index) => {
    const image = normalizeID(state[`${path}.${index}.image`]?.value)
    const id = normalizeID(state[`${path}.${index}.id`]?.value)
    const visibleValue = state[`${path}.${index}.visible`]?.value

    if (image === null) return null

    return {
      id: typeof id === 'string' ? id : createRowID(),
      image,
      visible: typeof visibleValue === 'boolean' ? visibleValue : true,
    }
  }).filter((row): row is GalleryRow => Boolean(row))
}

const buildGalleryFormState = (
  currentState: FormState,
  path: string,
  rows: GalleryRow[],
): FormState => {
  const nextState: FormState = {}
  const rowMetadata = rows.map((row) => ({
    collapsed: true,
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
    valid: true,
    value: rows.length,
  }

  rows.forEach((row, index) => {
    const id = rowMetadata[index]?.id ?? createRowID()

    nextState[`${path}.${index}.id`] = createFieldState(id)
    nextState[`${path}.${index}.image`] = createFieldState(row.image)
    nextState[`${path}.${index}.visible`] = createFieldState(row.visible)
  })

  return nextState
}

const getThumbnailURL = (media?: Media): string => {
  const thumbnailURL = media?.sizes?.thumbnail?.url
  return getMediaUrl(thumbnailURL || media?.url)
}

export const GalleryManager: ArrayFieldClientComponent = (props) => {
  const { field, path: pathFromProps, readOnly } = props
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { dispatchFields, getFields, moveFieldRow, removeFieldRow, setModified } = useForm()
  const { errorMessage, path, showError } = useField<number>({
    hasRows: true,
    potentiallyStalePath: pathFromProps,
  })
  const galleryState = useFormFields(([fields]) => {
    return Object.entries(fields).reduce<FormState>((acc, [fieldPath, fieldState]) => {
      if (fieldPath === path || fieldPath.startsWith(`${path}.`)) {
        acc[fieldPath] = fieldState
      }

      return acc
    }, {})
  })
  const { drawerSlug, setCollectionSlug, setInitialFiles, setOnCancel, setOnSuccess } =
    useBulkUpload()
  const { openModal } = useModal()
  const [ListDrawer, , { closeDrawer: closeListDrawer, openDrawer: openListDrawer }] =
    useListDrawer({
      collectionSlugs: ['media'],
      selectedCollection: 'media',
      uploads: true,
    })
  const [filter, setFilter] = useState<ViewFilter>('all')
  const [query, setQuery] = useState('')

  const rows = useMemo(() => extractRows(galleryState, path), [galleryState, path])
  const imageIDs = useMemo(() => rows.map((row) => row.image), [rows])
  const [{ data, isError, isLoading }, { setParams }] = usePayloadAPI(
    imageIDs.length ? '/api/media' : '',
  )

  useEffect(() => {
    if (!imageIDs.length) return

    setParams({
      depth: 0,
      limit: Math.max(imageIDs.length, 1),
      pagination: false,
      where: {
        id: {
          in: imageIDs,
        },
      },
    })
  }, [imageIDs, setParams])

  const mediaByID = useMemo(() => {
    const docs = (data as MediaResponse)?.docs ?? []
    return new Map(docs.map((doc) => [String(doc.id), doc]))
  }, [data])

  const normalizedQuery = query.trim().toLocaleLowerCase()
  const displayedRows = useMemo(() => {
    return rows
      .map((row, originalIndex) => ({ originalIndex, row }))
      .filter(({ row }) => {
        if (filter !== 'all' && row.visible !== (filter === 'visible')) return false
        if (!normalizedQuery) return true

        const media = mediaByID.get(String(row.image))
        const searchableText = [media?.alt, media?.filename, row.image].filter(Boolean).join(' ')
        return searchableText.toLocaleLowerCase().includes(normalizedQuery)
      })
  }, [filter, mediaByID, normalizedQuery, rows])

  const visibleCount = rows.filter((row) => row.visible).length
  const isFiltered = filter !== 'all' || Boolean(normalizedQuery)

  const replaceRows = (nextRows: GalleryRow[]) => {
    dispatchFields({
      optimize: false,
      state: buildGalleryFormState(getFields(), path, nextRows),
      type: 'REPLACE_STATE',
    })
    setModified(true)
  }

  const appendRows = (mediaIDs: Array<number | string>) => {
    const currentRows = extractRows(getFields(), path)
    const existingImages = new Set(currentRows.map((row) => String(row.image)))
    const availableSlots =
      typeof field.maxRows === 'number' ? Math.max(field.maxRows - currentRows.length, 0) : Infinity
    const candidates = mediaIDs
      .filter((id) => !existingImages.has(String(id)))
      .map((image) => ({ id: createRowID(), image, visible: true }))
    const newRows = candidates.slice(0, availableSlots)

    if (!newRows.length) {
      toast.info(
        availableSlots === 0
          ? `This gallery has reached its ${field.maxRows}-image limit.`
          : 'The selected images are already in this gallery.',
      )
      return
    }

    replaceRows([...currentRows, ...newRows])
    toast.success(`Added ${newRows.length} image${newRows.length === 1 ? '' : 's'} to gallery.`)

    if (newRows.length < candidates.length) {
      toast.info(
        `${candidates.length - newRows.length} image(s) were skipped because the gallery is full.`,
      )
    }
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

      if (mediaIDs.length) appendRows(mediaIDs)
      if (errorCount > 0) {
        toast.error(`${errorCount} upload${errorCount === 1 ? '' : 's'} failed.`)
      }
      if (inputRef.current) inputRef.current.value = ''
    })
    openModal(drawerSlug)
  }

  const toggleVisibility = (rowIndex: number, visible: boolean) => {
    dispatchFields({
      path: `${path}.${rowIndex}.visible`,
      type: 'UPDATE',
      valid: true,
      value: visible,
    })
    setModified(true)
  }

  return (
    <section
      className={[baseClass, showError ? `${baseClass}--has-error` : ''].filter(Boolean).join(' ')}
    >
      <div className={`${baseClass}__heading`}>
        <div>
          <div className={`${baseClass}__title-row`}>
            <Images aria-hidden="true" size={20} />
            <h3>{typeof field.label === 'string' ? field.label : 'Gallery images'}</h3>
            <span className={`${baseClass}__count`}>{rows.length}</span>
          </div>
          <p>
            Manage images as a compact grid. Drag to reorder, and switch individual images on or
            off.
          </p>
        </div>

        {!readOnly ? (
          <div className={`${baseClass}__primary-actions`}>
            <Button
              buttonStyle="secondary"
              icon={<Library aria-hidden="true" size={16} />}
              iconPosition="left"
              onClick={openListDrawer}
              size="small"
              type="button"
            >
              Choose existing
            </Button>
            <input
              accept="image/*"
              className={`${baseClass}__file-input`}
              multiple
              onChange={handleFilesChange}
              ref={inputRef}
              type="file"
            />
            <Button
              buttonStyle="primary"
              icon={<UploadCloud aria-hidden="true" size={16} />}
              iconPosition="left"
              onClick={() => inputRef.current?.click()}
              size="small"
              type="button"
            >
              Bulk upload
            </Button>
          </div>
        ) : null}
      </div>

      <div className={`${baseClass}__toolbar`}>
        <div aria-label="Filter gallery images" className={`${baseClass}__filters`} role="group">
          {(
            [
              ['all', `All ${rows.length}`],
              ['visible', `Visible ${visibleCount}`],
              ['hidden', `Hidden ${rows.length - visibleCount}`],
            ] as const
          ).map(([value, label]) => (
            <button
              aria-pressed={filter === value}
              className={filter === value ? `${baseClass}__filter--active` : undefined}
              key={value}
              onClick={() => setFilter(value)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
        <label className={`${baseClass}__search`}>
          <Search aria-hidden="true" size={16} />
          <span className={`${baseClass}__sr-only`}>Search gallery images</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search filename or alt text"
            type="search"
            value={query}
          />
        </label>
      </div>

      {isFiltered && displayedRows.length > 1 ? (
        <p className={`${baseClass}__reorder-note`}>Clear filters to reorder images.</p>
      ) : null}

      {rows.length ? (
        displayedRows.length ? (
          <DraggableSortable
            className={`${baseClass}__grid`}
            ids={displayedRows.map(({ row }) => row.id)}
            onDragEnd={({ moveFromIndex, moveToIndex }) => {
              if (isFiltered) return
              moveFieldRow({ moveFromIndex, moveToIndex, path })
            }}
          >
            {displayedRows.map(({ originalIndex, row }) => {
              const media = mediaByID.get(String(row.image))
              const thumbnailURL = getThumbnailURL(media)
              const label = media?.alt || media?.filename || `Image ${originalIndex + 1}`

              return (
                <DraggableSortableItem
                  disabled={Boolean(readOnly) || isFiltered}
                  id={row.id}
                  key={row.id}
                >
                  {({ attributes, isDragging, listeners, setNodeRef, transform, transition }) => (
                    <article
                      className={[
                        `${baseClass}__card`,
                        row.visible ? '' : `${baseClass}__card--hidden`,
                        isDragging ? `${baseClass}__card--dragging` : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      ref={setNodeRef}
                      style={{ transform, transition }}
                    >
                      <div className={`${baseClass}__preview`}>
                        {thumbnailURL ? (
                          // Payload admin thumbnails can use runtime CDN URLs that are not known to next/image.
                          // eslint-disable-next-line @next/next/no-img-element
                          <img alt={media?.alt || ''} loading="lazy" src={thumbnailURL} />
                        ) : (
                          <div className={`${baseClass}__placeholder`}>
                            {isLoading
                              ? 'Loading…'
                              : isError
                                ? 'Preview unavailable'
                                : 'No preview'}
                          </div>
                        )}
                        <span className={`${baseClass}__position`}>{originalIndex + 1}</span>
                        {!row.visible ? (
                          <span className={`${baseClass}__hidden-badge`}>
                            <EyeOff aria-hidden="true" size={13} /> Hidden
                          </span>
                        ) : null}
                        {!readOnly ? (
                          <button
                            {...attributes}
                            {...listeners}
                            aria-label={`Reorder ${label}`}
                            className={`${baseClass}__drag-handle`}
                            disabled={isFiltered}
                            title={isFiltered ? 'Clear filters to reorder' : 'Drag to reorder'}
                            type="button"
                          >
                            <GripVertical aria-hidden="true" size={18} />
                          </button>
                        ) : null}
                      </div>
                      <div className={`${baseClass}__card-footer`}>
                        <div className={`${baseClass}__meta`}>
                          <strong title={label}>{label}</strong>
                          <span>{media?.filename || `Media #${row.image}`}</span>
                        </div>
                        {!readOnly ? (
                          <div className={`${baseClass}__card-actions`}>
                            <button
                              aria-label={`${row.visible ? 'Hide' : 'Show'} ${label}`}
                              className={`${baseClass}__icon-button`}
                              onClick={() => toggleVisibility(originalIndex, !row.visible)}
                              title={
                                row.visible ? 'Hide from Gallery page' : 'Show on Gallery page'
                              }
                              type="button"
                            >
                              {row.visible ? (
                                <Eye aria-hidden="true" size={16} />
                              ) : (
                                <EyeOff aria-hidden="true" size={16} />
                              )}
                            </button>
                            <button
                              aria-label={`Remove ${label} from gallery`}
                              className={`${baseClass}__icon-button ${baseClass}__icon-button--danger`}
                              onClick={() => removeFieldRow({ path, rowIndex: originalIndex })}
                              title="Remove from gallery"
                              type="button"
                            >
                              <Trash2 aria-hidden="true" size={16} />
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </article>
                  )}
                </DraggableSortableItem>
              )
            })}
          </DraggableSortable>
        ) : (
          <div className={`${baseClass}__empty`}>No images match the current filter.</div>
        )
      ) : (
        <div className={`${baseClass}__empty`}>
          <Images aria-hidden="true" size={28} />
          <strong>No gallery images yet</strong>
          <span>Choose images from the Media Library or upload a batch to get started.</span>
        </div>
      )}

      {showError ? (
        <p className={`${baseClass}__error`}>
          {errorMessage || 'Please review the gallery images.'}
        </p>
      ) : null}

      <ListDrawer
        allowCreate
        enableRowSelections
        onBulkSelect={(selected) => {
          const selectedIDs = Array.from(selected.entries())
            .filter(([, isSelected]) => isSelected)
            .map(([id]) => id)

          if (!selectedIDs.length) {
            toast.info('Select at least one image.')
            return
          }

          appendRows(selectedIDs)
          closeListDrawer()
        }}
        onSelect={({ doc }) => {
          const id = normalizeID(doc.id)
          if (id !== null) appendRows([id])
          closeListDrawer()
        }}
        selectedCollection="media"
      />
    </section>
  )
}

export default GalleryManager
