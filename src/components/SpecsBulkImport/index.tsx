'use client'

import type { ArrayFieldClientComponent, FieldState, FormState } from 'payload'

import { Button, toast, useField, useForm, useFormFields } from '@payloadcms/ui'
import { ChevronDown, ChevronRight, ClipboardList, Plus, RotateCcw, Trash2, Wand2 } from 'lucide-react'
import React, { useMemo, useState } from 'react'

import './index.scss'

type SpecRow = {
  id?: string
  label: string
  value: string
}

type ParseResult = {
  errors: string[]
  rows: SpecRow[]
}

const baseClass = 'specs-table-field'

const sampleJSON = `{
  "Width": "2 in",
  "Length": "27 ft",
  "Webbing Material": "Polyester",
  "Country of Origin": "China"
}`

const createRowID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = crypto.getRandomValues(new Uint8Array(12))
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  }

  return Math.random().toString(16).slice(2).padEnd(24, '0').slice(0, 24)
}

const normalizeValue = (value: unknown): string => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)

  return JSON.stringify(value)
}

const normalizeRows = (rows: SpecRow[], includeEmptyValues: boolean): SpecRow[] => {
  return rows
    .map((row) => ({
      id: row.id,
      label: row.label.trim(),
      value: row.value.trim(),
    }))
    .filter((row) => row.label && (includeEmptyValues || row.value))
}

const parseArray = (value: unknown[]): SpecRow[] => {
  return value
    .map((item) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return null

      const record = item as Record<string, unknown>
      const label = normalizeValue(record.label ?? record.name ?? record.key ?? record.title)
      const specValue = normalizeValue(record.value ?? record.val ?? record.text)

      if (!label) return null

      return {
        label,
        value: specValue,
      }
    })
    .filter((row): row is SpecRow => Boolean(row))
}

const parseDelimitedLines = (input: string): SpecRow[] => {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const tabParts = line.split('\t')

      if (tabParts.length >= 2) {
        return {
          label: tabParts[0],
          value: tabParts.slice(1).join(' ').trim(),
        }
      }

      const separatorMatch = line.match(/\s*(.+?)\s*(?:[:=|,])\s*(.*)\s*$/)

      if (!separatorMatch) {
        return {
          label: line,
          value: '',
        }
      }

      return {
        label: separatorMatch[1],
        value: separatorMatch[2],
      }
    })
}

const parseSpecs = (input: string, includeEmptyValues: boolean): ParseResult => {
  const trimmedInput = input.trim()

  if (!trimmedInput) {
    return {
      errors: ['Paste JSON, two-column spreadsheet data, or Label: Value lines first.'],
      rows: [],
    }
  }

  try {
    const parsed = JSON.parse(trimmedInput) as unknown

    if (Array.isArray(parsed)) {
      const rows = normalizeRows(parseArray(parsed), includeEmptyValues)

      return {
        errors: rows.length ? [] : ['No usable spec rows found in the JSON array.'],
        rows,
      }
    }

    if (parsed && typeof parsed === 'object') {
      const rows = normalizeRows(
        Object.entries(parsed as Record<string, unknown>).map(([label, value]) => ({
          label,
          value: normalizeValue(value),
        })),
        includeEmptyValues,
      )

      return {
        errors: rows.length ? [] : ['No usable spec rows found in the JSON object.'],
        rows,
      }
    }

    return {
      errors: ['JSON must be an object or an array of label/value rows.'],
      rows: [],
    }
  } catch {
    const rows = normalizeRows(parseDelimitedLines(trimmedInput), includeEmptyValues)

    return {
      errors: rows.length ? [] : ['No usable spec rows found. Use Label: Value on each line.'],
      rows,
    }
  }
}

const createFieldState = (value: string): FieldState => ({
  initialValue: undefined,
  passesCondition: true,
  valid: Boolean(value.trim()),
  value,
})

const buildSpecsFormState = (currentState: FormState, path: string, rows: SpecRow[]): FormState => {
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
    nextState[`${path}.${index}.label`] = createFieldState(row.label)
    nextState[`${path}.${index}.value`] = createFieldState(row.value)
  })

  return nextState
}

const extractRows = (state: FormState, path: string): SpecRow[] => {
  const arrayField = state[path]
  const rowCount =
    Array.isArray(arrayField?.rows) && arrayField.rows.length
      ? arrayField.rows.length
      : typeof arrayField?.value === 'number'
        ? arrayField.value
        : 0

  return Array.from({ length: rowCount }, (_, index) => ({
    id: normalizeValue(state[`${path}.${index}.id`]?.value) || createRowID(),
    label: normalizeValue(state[`${path}.${index}.label`]?.value),
    value: normalizeValue(state[`${path}.${index}.value`]?.value),
  }))
}

export const SpecsBulkImport: ArrayFieldClientComponent = (props) => {
  const { field, path: pathFromProps } = props
  const { dispatchFields, getFields, setModified } = useForm()
  const { errorMessage, path, showError } = useField<number>({
    hasRows: true,
    potentiallyStalePath: pathFromProps,
  })
  const specsState = useFormFields(([fields]) => {
    return Object.entries(fields).reduce<FormState>((acc, [fieldPath, fieldState]) => {
      if (fieldPath === path || fieldPath.startsWith(`${path}.`)) {
        acc[fieldPath] = fieldState
      }

      return acc
    }, {})
  })
  const [input, setInput] = useState('')
  const [includeEmptyValues, setIncludeEmptyValues] = useState(false)
  const [isImporterOpen, setIsImporterOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const rows = useMemo(() => extractRows(specsState, path), [path, specsState])
  const parsed = useMemo(() => parseSpecs(input, includeEmptyValues), [includeEmptyValues, input])
  const hasParsedRows = parsed.rows.length > 0

  const replaceRows = (nextRows: SpecRow[]) => {
    dispatchFields({
      optimize: false,
      state: buildSpecsFormState(getFields(), path, nextRows),
      type: 'REPLACE_STATE',
    })
    setModified(true)
  }

  const updateCell = (rowIndex: number, key: 'label' | 'value', value: string) => {
    dispatchFields({
      path: `${path}.${rowIndex}.${key}`,
      type: 'UPDATE',
      valid: Boolean(value.trim()),
      value,
    })
    setModified(true)
  }

  const applyRows = () => {
    if (!hasParsedRows) {
      toast.error(parsed.errors[0] ?? 'No spec rows to import.')
      return
    }

    replaceRows(parsed.rows)
    setIsImporterOpen(false)
    setIsCollapsed(false)
    toast.success(`Imported ${parsed.rows.length} specs.`)
  }

  return (
    <div className={[baseClass, showError ? `${baseClass}--has-error` : ''].filter(Boolean).join(' ')}>
      <div className={`${baseClass}__header`}>
        <button
          aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} specification table`}
          aria-expanded={!isCollapsed}
          className={`${baseClass}__collapse-toggle`}
          onClick={() => setIsCollapsed((value) => !value)}
          type="button"
        >
          {isCollapsed ? (
            <ChevronRight aria-hidden="true" size={18} />
          ) : (
            <ChevronDown aria-hidden="true" size={18} />
          )}
          <span className={`${baseClass}__title`}>
            {typeof field.label === 'string' ? field.label : 'Specification Table'}
            {field.required ? <span aria-hidden="true">*</span> : null}
          </span>
          <span className={`${baseClass}__count`}>
            {rows.length} row{rows.length === 1 ? '' : 's'}
          </span>
        </button>
        <div className={`${baseClass}__header-actions`}>
          <Button
            buttonStyle="secondary"
            icon={<ClipboardList aria-hidden="true" size={16} />}
            iconPosition="left"
            onClick={() => {
              setIsCollapsed(false)
              setIsImporterOpen((value) => !value)
            }}
            size="small"
            type="button"
          >
            Bulk import
          </Button>
          <Button
            buttonStyle="secondary"
            icon={<Plus aria-hidden="true" size={16} />}
            iconPosition="left"
            onClick={() => {
              setIsCollapsed(false)
              replaceRows([...rows, { id: createRowID(), label: '', value: '' }])
            }}
            size="small"
            type="button"
          >
            Add row
          </Button>
        </div>
      </div>

      {isCollapsed ? (
        <div className={`${baseClass}__collapsed-summary`}>
          {rows.length
            ? `${rows.length} specification${rows.length === 1 ? '' : 's'} hidden`
            : 'No specifications yet'}
        </div>
      ) : null}

      {!isCollapsed && isImporterOpen ? (
        <div className={`${baseClass}__importer`}>
          <div className={`${baseClass}__importer-top`}>
            <p>Paste JSON object, label/value array, spreadsheet rows, or Label: Value lines.</p>
            <Button
              buttonStyle="subtle"
              icon={<ClipboardList aria-hidden="true" size={16} />}
              iconPosition="left"
              onClick={() => setInput(sampleJSON)}
              size="small"
              type="button"
            >
              Sample
            </Button>
          </div>
          <textarea
            aria-label="Bulk specification input"
            className={`${baseClass}__textarea`}
            onChange={(event) => setInput(event.target.value)}
            placeholder={sampleJSON}
            rows={7}
            value={input}
          />
          <div className={`${baseClass}__controls`}>
            <label className={`${baseClass}__checkbox`}>
              <input
                checked={includeEmptyValues}
                onChange={(event) => setIncludeEmptyValues(event.target.checked)}
                type="checkbox"
              />
              Include empty values
            </label>
            <div className={`${baseClass}__actions`}>
              <Button
                buttonStyle="subtle"
                icon={<RotateCcw aria-hidden="true" size={16} />}
                iconPosition="left"
                onClick={() => setInput('')}
                size="small"
                type="button"
              >
                Clear
              </Button>
              <Button
                buttonStyle="primary"
                disabled={!hasParsedRows}
                icon={<Wand2 aria-hidden="true" size={16} />}
                iconPosition="left"
                onClick={applyRows}
                size="small"
                type="button"
              >
                Apply {hasParsedRows ? `(${parsed.rows.length})` : ''}
              </Button>
            </div>
          </div>
          {parsed.errors.length > 0 && input.trim() ? (
            <p className={`${baseClass}__message ${baseClass}__message--error`}>{parsed.errors[0]}</p>
          ) : null}
        </div>
      ) : null}

      {!isCollapsed ? (
        <div className={`${baseClass}__table`} role="table">
          <div className={`${baseClass}__table-head`} role="row">
            <span role="columnheader">Label</span>
            <span role="columnheader">Value</span>
            <span role="columnheader">Actions</span>
          </div>
          <div className={`${baseClass}__table-body`}>
            {rows.length ? (
              rows.map((row, index) => (
                <div className={`${baseClass}__table-row`} key={row.id || index} role="row">
                  <input
                    aria-label={`Spec ${index + 1} label`}
                    onChange={(event) => updateCell(index, 'label', event.target.value)}
                    placeholder="Label"
                    type="text"
                    value={row.label}
                  />
                  <input
                    aria-label={`Spec ${index + 1} value`}
                    onChange={(event) => updateCell(index, 'value', event.target.value)}
                    placeholder="Value"
                    type="text"
                    value={row.value}
                  />
                  <button
                    aria-label={`Remove spec ${index + 1}`}
                    className={`${baseClass}__icon-button`}
                    onClick={() => replaceRows(rows.filter((_, rowIndex) => rowIndex !== index))}
                    type="button"
                  >
                    <Trash2 aria-hidden="true" size={16} />
                  </button>
                </div>
              ))
            ) : (
              <div className={`${baseClass}__empty`}>No specs yet. Add a row or bulk import JSON.</div>
            )}
          </div>
        </div>
      ) : null}

      {showError ? (
        <p className={`${baseClass}__message ${baseClass}__message--error`}>
          {errorMessage || 'At least one specification is required.'}
        </p>
      ) : null}
    </div>
  )
}

export default SpecsBulkImport
