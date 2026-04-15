'use client'

import type { Form as PayloadForm } from '@/payload-types'

import React, { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import { fields } from '@/blocks/Form/fields'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import { getClientSideURL } from '@/utilities/getURL'
import { cn } from '@/utilities/ui'

type ProductInquiryFormProps = {
  className?: string
  form: PayloadForm
  product: {
    model?: string | null
    slug?: string | null
    title: string
  }
}

type SubmissionValue = boolean | number | string

const resolveProductURL = (slug?: string | null): string => {
  if (typeof window !== 'undefined') {
    const currentURL = new URL(window.location.href)
    currentURL.search = ''
    currentURL.hash = ''
    return currentURL.toString()
  }

  const baseURL = getClientSideURL()
  return slug ? `${baseURL}/products/${slug}` : `${baseURL}/products`
}

export const ProductInquiryForm: React.FC<ProductInquiryFormProps> = ({
  className,
  form,
  product,
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
  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const formID = form?.id ?? 0
  const formHTMLID = `product-inquiry-${String(formID || 'form')}`
  const confirmationMessage = form?.confirmationMessage as
    | DefaultTypedEditorState
    | null
    | undefined
  const confirmationType = form?.confirmationType
  const redirect = form?.redirect
  const submitButtonLabel = form?.submitButtonLabel || 'Submit'

  const defaultValues = useMemo(
    () =>
      (form?.fields || []).reduce<Record<string, SubmissionValue>>((acc, field) => {
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
    reset(defaultValues)
  }, [defaultValues, reset])

  const onSubmit = useCallback(
    (data: Record<string, unknown>) => {
      let loadingTimerID: ReturnType<typeof setTimeout>

      const submitForm = async () => {
        setError(undefined)

        const dataToSend = [
          ...Object.entries(data).map(([name, value]) => ({
            field: name,
            value,
          })),
          {
            field: 'productTitle',
            value: product.title,
          },
          {
            field: 'productModel',
            value: product.model || '',
          },
          {
            field: 'productSlug',
            value: product.slug || '',
          },
          {
            field: 'productURL',
            value: resolveProductURL(product.slug),
          },
        ]

        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

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

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect?.url) {
            router.push(redirect.url)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [confirmationType, formID, product.model, product.slug, product.title, redirect, router],
  )

  return (
    <section className={cn(className)} id="product-inquiry-form">
      <div className="mb-5 space-y-2">
        <p className="text-sm font-medium uppercase">Have Questions?</p>
        <h2 className="font-display text-[1rem] font-semibold leading-tight text-[#101914] md:text-[1.25rem]">
          Fill out the form below
        </h2>
      </div>

      <FormProvider {...formMethods}>
        {!isLoading && hasSubmitted && confirmationType === 'message' && confirmationMessage ? (
          <RichText
            className="prose-p:text-[#445248] prose-headings:text-[#101914]"
            data={confirmationMessage}
            enableGutter={false}
          />
        ) : null}

        {isLoading && !hasSubmitted ? (
          <p className="text-sm text-[#526258]">Loading, please wait...</p>
        ) : null}

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {`${error.status || '500'}: ${error.message || ''}`}
          </div>
        ) : null}

        {!hasSubmitted ? (
          <form id={formHTMLID} onSubmit={handleSubmit(onSubmit)}>
            <div
              className="mb-6 grid gap-y-4"
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
                      rows={field.blockType === 'textarea' ? 6 : undefined}
                    />
                  </React.Fragment>
                )
              })}
            </div>

            <Button
              className="h-11 rounded-full bg-[#00A650] px-6 text-sm font-semibold uppercase tracking-[0.16em] text-white hover:bg-[#ea580c]"
              form={formHTMLID}
              type="submit"
            >
              {submitButtonLabel}
            </Button>
          </form>
        ) : null}
      </FormProvider>
    </section>
  )
}
