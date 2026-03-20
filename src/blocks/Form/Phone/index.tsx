import type { Control, FieldErrorsImpl } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import { Controller } from 'react-hook-form'

import type { PhoneField } from '../types'

import { Error } from '../Error'
import { Width } from '../Width'

const normalizePhoneNumber = (value: string) => {
  const cleaned = value.replace(/[^\d\s+-]/g, '').replace(/\s{2,}/g, ' ')
  const hasLeadingPlus = cleaned.trimStart().startsWith('+')
  const withoutExtraPlus = cleaned.replace(/\+/g, '')

  return hasLeadingPlus ? `+${withoutExtraPlus}` : withoutExtraPlus
}

export const Phone: React.FC<
  PhoneField & {
    control: Control
    errors: Partial<FieldErrorsImpl>
  }
> = ({ control, defaultValue, errors, label, name, placeholder, required, width }) => {
  return (
    <Width width={width ?? undefined}>
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
        defaultValue={defaultValue || ''}
        name={name}
        render={({ field: { onBlur, onChange, value } }) => (
          <Input
            autoComplete="tel"
            id={name}
            inputMode="tel"
            onBlur={onBlur}
            onChange={(event) => onChange(normalizePhoneNumber(event.target.value))}
            onKeyDown={(event) => {
              if (
                event.key.length === 1 &&
                !/[\d\s+-]/.test(event.key) &&
                !event.ctrlKey &&
                !event.metaKey
              ) {
                event.preventDefault()
              }
            }}
            placeholder={placeholder || 'Full phone number'}
            type="tel"
            value={typeof value === 'string' ? normalizePhoneNumber(value) : ''}
          />
        )}
        rules={{
          required: required ? 'This field is required' : false,
          validate: (value) => {
            if (!value) {
              return required ? 'This field is required' : true
            }

            const stringValue = String(value)

            if (!/^\+?[\d\s-]+$/.test(stringValue)) {
              return 'Use only numbers, spaces, hyphens, and an optional leading +'
            }

            const digitsOnly = stringValue.replace(/\D/g, '')

            return digitsOnly.length >= 6 || 'Enter a valid phone number'
          },
        }}
      />

      {errors[name] && <Error name={name} />}
    </Width>
  )
}
