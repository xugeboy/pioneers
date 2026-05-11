import type { EmailAdapter, SendEmailOptions } from 'payload'

import { APIError } from 'payload'

type ResendAttachment = {
  content: Buffer | string
  filename: string
}

type ResendEmailPayload = {
  attachments?: ResendAttachment[]
  bcc?: string | string[]
  cc?: string | string[]
  from: string
  html?: string
  reply_to?: string | string[]
  subject: string
  text?: string
  to: string | string[]
}

type ResendResponse =
  | {
      id: string
    }
  | {
      message: string
      name: string
      statusCode: number
    }

type ResendAdapterArgs = {
  apiKey: string
  defaultFromAddress: string
  defaultFromName: string
}

const htmlToPlainText = (html: string): string => {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const mapFromAddress = (
  address: SendEmailOptions['from'],
  defaultFromName: string,
  defaultFromAddress: string,
): string => {
  if (!address) {
    return `${defaultFromName} <${defaultFromAddress}>`
  }

  if (typeof address === 'string') {
    return address
  }

  return `${address.name} <${address.address}>`
}

const mapAddresses = (
  addresses:
    | SendEmailOptions['bcc']
    | SendEmailOptions['cc']
    | SendEmailOptions['replyTo']
    | SendEmailOptions['to'],
): string | string[] | undefined => {
  if (!addresses) return undefined

  if (typeof addresses === 'string') {
    return addresses || undefined
  }

  if (Array.isArray(addresses)) {
    return addresses.map((address) => (typeof address === 'string' ? address : address.address))
  }

  return addresses.address
}

const mapAttachments = (attachments: SendEmailOptions['attachments']): ResendAttachment[] => {
  if (!attachments) return []

  return attachments.map((attachment: NonNullable<SendEmailOptions['attachments']>[number]) => {
    if (!attachment.filename || !attachment.content) {
      throw new APIError('Attachment is missing filename or content', 400)
    }

    if (typeof attachment.content === 'string' || attachment.content instanceof Buffer) {
      return {
        content: attachment.content,
        filename: attachment.filename,
      }
    }

    throw new APIError('Attachment content must be a string or a buffer', 400)
  })
}

const mapPayloadEmailToResendEmail = (
  message: SendEmailOptions,
  defaultFromAddress: string,
  defaultFromName: string,
): ResendEmailPayload => {
  const html = message.html?.toString() || ''
  const text = message.text?.toString() || htmlToPlainText(html)

  return {
    attachments: mapAttachments(message.attachments),
    bcc: mapAddresses(message.bcc),
    cc: mapAddresses(message.cc),
    from: mapFromAddress(message.from, defaultFromName, defaultFromAddress),
    html,
    reply_to: mapAddresses(message.replyTo),
    subject: message.subject ?? '',
    text,
    to: mapAddresses(message.to) || '',
  }
}

export const resendAdapter = ({
  apiKey,
  defaultFromAddress,
  defaultFromName,
}: ResendAdapterArgs): EmailAdapter<ResendResponse> => {
  return () => ({
    defaultFromAddress,
    defaultFromName,
    name: 'resend-rest',
    sendEmail: async (message) => {
      const payload = mapPayloadEmailToResendEmail(message, defaultFromAddress, defaultFromName)

      const res = await fetch('https://api.resend.com/emails', {
        body: JSON.stringify(payload),
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const data = (await res.json()) as ResendResponse

      if ('id' in data) {
        return data
      }

      const statusCode = data.statusCode || res.status
      let formattedError = `Error sending email: ${statusCode}`

      if (data.name && data.message) {
        formattedError += ` ${data.name} - ${data.message}`
      }

      throw new APIError(formattedError, statusCode)
    },
  })
}
