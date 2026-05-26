'use client'

import type { Form as PayloadForm } from '@/payload-types'

import React, { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'

import { fields } from '@/blocks/Form/fields'
import { Button } from '@/components/ui/button'
import { getClientSideURL } from '@/utilities/getURL'
import { cn } from '@/utilities/ui'

type OemTieDownLeadFormProps = {
  anchorID?: string
  className?: string
  description?: string
  form: PayloadForm
  heading?: string
  submitButtonLabel?: string
  trustText?: string
}

type SubmissionValue = boolean | number | string

type LeadTrackingPayload = {
  clickIds: Record<string, string>
  currentURL: string
  landingPage: string
  leadType: 'oem_tie_down'
  sourceParams: Record<string, string>
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

const trackedParamNames = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'gbraid',
  'wbraid',
] as const

const clickIDParamNames = new Set(['gclid', 'gbraid', 'wbraid'])

const resolveTrackingPayload = (): LeadTrackingPayload => {
  if (typeof window === 'undefined') {
    return {
      clickIds: {},
      currentURL: '',
      landingPage: '/oem-tie-downs',
      leadType: 'oem_tie_down',
      sourceParams: {},
    }
  }

  const url = new URL(window.location.href)
  const sourceParams: Record<string, string> = {}
  const clickIds: Record<string, string> = {}

  trackedParamNames.forEach((name) => {
    const value = url.searchParams.get(name)

    if (!value) return

    sourceParams[name] = value

    if (clickIDParamNames.has(name)) {
      clickIds[name] = value
    }
  })

  return {
    clickIds,
    currentURL: url.toString(),
    landingPage: url.pathname,
    leadType: 'oem_tie_down',
    sourceParams,
  }
}

const getTrackingSubmissionFields = (payload: LeadTrackingPayload) => [
  { field: 'leadType', value: payload.leadType },
  { field: 'landingPage', value: payload.landingPage },
  { field: 'currentURL', value: payload.currentURL },
  { field: 'utmParams', value: JSON.stringify(payload.sourceParams) },
  { field: 'clickIds', value: JSON.stringify(payload.clickIds) },
]

export const OemTieDownLeadForm: React.FC<OemTieDownLeadFormProps> = ({
  anchorID = 'quote-form',
  className,
  description = 'Share your target product, usage scenario, quantity, and branding needs. Our team will review your request and respond with next steps.',
  form,
  heading = 'Tell us what you need to build.',
  submitButtonLabel,
  trustText = 'Your details are used only to respond to this OEM/ODM inquiry. Typical first response: within 8 hours.',
}) => {
  const formMethods = useForm({
    defaultValues: {},
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = formMethods
  const router = useRouter()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const formID = form.id
  const formHTMLID = `oem-tie-down-lead-${anchorID}-${formID}`
  const resolvedSubmitButtonLabel = submitButtonLabel || form.submitButtonLabel || 'Get OEM Quote'

  const defaultValues = useMemo(
    () =>
      (form.fields || []).reduce<Record<string, SubmissionValue>>((acc, field) => {
        if ('name' in field && field.name) {
          const fieldValue =
            'defaultValue' in field ? ((field.defaultValue ?? '') as SubmissionValue) : ''

          acc[field.name] = fieldValue
        }

        return acc
      }, {}),
    [form],
  )

  React.useEffect(() => {
    setIsHydrated(true)
    reset(defaultValues)
  }, [defaultValues, reset])

  const onSubmit = useCallback(
    (data: Record<string, unknown>) => {
      let loadingTimerID: ReturnType<typeof setTimeout>

      const submitForm = async () => {
        setError(undefined)

        const trackingPayload = resolveTrackingPayload()
        const dataToSend = [
          ...Object.entries(data).map(([name, value]) => ({
            field: name,
            value,
          })),
          ...getTrackingSubmissionFields(trackingPayload),
        ]

        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 500)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)
            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })
            return
          }

          window.dataLayer = window.dataLayer || []
          window.dataLayer.push({
            event: 'lead_form_submit',
            formTitle: form.title,
            leadType: trackingPayload.leadType,
            pagePath: trackingPayload.landingPage,
            ...trackingPayload.sourceParams,
          })

          setIsLoading(false)
          setHasSubmitted(true)
          router.push('/thank-you')
        } catch (err) {
          console.warn(err)
          clearTimeout(loadingTimerID)
          setIsLoading(false)
          setError({
            message: 'Something went wrong. Please try again.',
          })
        }
      }

      void submitForm()
    },
    [form.title, formID, router],
  )

  return (
    <section
      className={cn(
        'rounded-xl border border-[#dce5dc] bg-white p-5 shadow-[0_24px_70px_rgba(10,22,14,0.12)] sm:p-6 lg:p-7',
        className,
      )}
      id={anchorID}
    >
      <div className="mb-5 space-y-2">
        <h2 className="font-display text-2xl font-semibold leading-tight text-[#162019]">
          {heading}
        </h2>
        <p className="text-sm leading-6 text-[#5f6f64]">{description}</p>
      </div>

      <FormProvider {...formMethods}>
        {isLoading && !hasSubmitted ? (
          <p className="mb-4 text-sm text-[#526258]">Sending your request...</p>
        ) : null}

        {error ? (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {`${error.status || '500'}: ${error.message || ''}`}
          </div>
        ) : null}

        {!hasSubmitted ? (
          <form id={formHTMLID} method="post" onSubmit={handleSubmit(onSubmit)}>
            <div
              className="mb-5 grid gap-y-4"
              style={{ gridTemplateColumns: 'repeat(100, minmax(0, 1fr))' }}
            >
              {form.fields?.map((field, index) => {
                const Field = fields?.[field.blockType as keyof typeof fields] as
                  | React.FC<Record<string, unknown>>
                  | undefined

                if (!Field) return null

                return (
                  <React.Fragment key={field.id || `${field.blockType}-${index}`}>
                    <Field
                      {...field}
                      control={control}
                      errors={errors}
                      form={form}
                      register={register}
                      rows={field.blockType === 'textarea' ? 5 : undefined}
                    />
                  </React.Fragment>
                )
              })}
            </div>

            <Button
              className="h-12 w-full cursor-pointer rounded-md bg-[#00A650] px-6 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_12px_28px_rgba(0,166,80,0.22)] hover:bg-[#078944]"
              disabled={!isHydrated || isLoading}
              form={formHTMLID}
              type="submit"
            >
              {isLoading ? 'Sending...' : resolvedSubmitButtonLabel}
            </Button>
          </form>
        ) : null}
      </FormProvider>

      <p className="mt-4 text-xs leading-5 text-[#708075]">{trustText}</p>
    </section>
  )
}
