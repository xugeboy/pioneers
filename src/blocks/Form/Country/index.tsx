'use client'

import type { CountryField } from '@payloadcms/plugin-form-builder/types'
import type { Control, FieldErrorsImpl } from 'react-hook-form'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Controller } from 'react-hook-form'
import { ChevronDown } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/utilities/ui'

import { Error } from '../Error'
import { Width } from '../Width'
import { countryOptions } from './options'

const normalizeValue = (value: string) => value.trim().toLowerCase()

const CountryCombobox: React.FC<{
  inputId: string
  label?: string | null
  onBlur: () => void
  onChange: (value: string) => void
  value: string
}> = ({ inputId, label, onBlur, onChange, value }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const selectedOption = countryOptions.find((option) => option.value === value)
  const [query, setQuery] = useState(selectedOption?.label || '')

  useEffect(() => {
    setQuery(selectedOption?.label || '')
  }, [selectedOption?.label])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [])

  const filteredOptions = useMemo(() => {
    const normalizedQuery = normalizeValue(query)

    if (!normalizedQuery) return countryOptions

    return countryOptions.filter((option) => normalizeValue(option.label).includes(normalizedQuery))
  }, [query])

  const commitExactMatch = () => {
    const exactMatch = countryOptions.find(
      (option) => normalizeValue(option.label) === normalizeValue(query),
    )

    if (exactMatch) {
      onChange(exactMatch.value)
      setQuery(exactMatch.label)
      return
    }

    if (!query.trim()) {
      onChange('')
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <Input
          autoComplete="off"
          className="pr-10"
          id={inputId}
          onBlur={() => {
            onBlur()
            commitExactMatch()

            window.setTimeout(() => {
              setIsOpen(false)
            }, 100)
          }}
          onChange={(event) => {
            const nextQuery = event.target.value
            setQuery(nextQuery)
            setIsOpen(true)

            const exactMatch = countryOptions.find(
              (option) => normalizeValue(option.label) === normalizeValue(nextQuery),
            )

            onChange(exactMatch?.value || '')
          }}
          onFocus={() => {
            setIsOpen(true)
          }}
          placeholder={label || inputId}
          type="text"
          value={query}
        />

        <button
          aria-label={isOpen ? 'Close country list' : 'Open country list'}
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground"
          onMouseDown={(event) => {
            event.preventDefault()
            setIsOpen((currentValue) => !currentValue)
          }}
          type="button"
        >
          <ChevronDown
            className={cn('size-4 transition-transform duration-200', isOpen && 'rotate-180')}
          />
        </button>
      </div>

      {isOpen ? (
        <div className="absolute left-0 right-0 top-full z-50 -mt-px overflow-hidden rounded-b-md border border-input border-t-0 bg-background shadow-md">
          <div className="max-h-64 overflow-y-auto py-1">
            {filteredOptions.length ? (
              filteredOptions.map((option) => {
                const isSelected = option.value === value

                return (
                  <button
                    className={cn(
                      'block w-full px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                      isSelected && 'bg-accent text-accent-foreground',
                    )}
                    key={option.value}
                    onMouseDown={(event) => {
                      event.preventDefault()
                      onChange(option.value)
                      setQuery(option.label)
                      setIsOpen(false)
                    }}
                    type="button"
                  >
                    {option.label}
                  </button>
                )
              })
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground">No matches found</div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export const Country: React.FC<
  CountryField & {
    control: Control
    errors: Partial<FieldErrorsImpl>
  }
> = ({ name, control, errors, label, required, width }) => {
  return (
    <Width width={width}>
      <Label htmlFor={name}>
        {label}

        {required && (
          <span className="required">
            * <span className="sr-only">(required)</span>
          </span>
        )}
      </Label>

      <Controller
        control={control}
        defaultValue=""
        name={name}
        render={({ field: { onBlur, onChange, value } }) => (
          <CountryCombobox
            inputId={name}
            label={label}
            onBlur={onBlur}
            onChange={onChange}
            value={typeof value === 'string' ? value : ''}
          />
        )}
        rules={{ required }}
      />

      {errors[name] && <Error name={name} />}
    </Width>
  )
}
