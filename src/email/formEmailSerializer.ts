import type {
  BeforeEmail,
  FormattedEmail,
  SubmissionValue,
} from '@payloadcms/plugin-form-builder/types'

type LexicalNode = {
  children?: LexicalNode[]
  fields?: {
    doc?: {
      value?: {
        id?: number | string
        slug?: string
      }
    }
    linkType?: string
    newTab?: boolean
    url?: string
  }
  format?: number | string
  tag?: string
  text?: string
  type?: string
  url?: string
}

type LexicalMessage = {
  root?: {
    children?: LexicalNode[]
  }
}

type FormEmailConfig = {
  message?: LexicalMessage | unknown
}

const NodeFormat = {
  IS_BOLD: 1,
  IS_CODE: 1 << 4,
  IS_ITALIC: 1 << 1,
  IS_STRIKETHROUGH: 1 << 2,
  IS_SUBSCRIPT: 1 << 5,
  IS_SUPERSCRIPT: 1 << 6,
  IS_UNDERLINE: 1 << 3,
} as const

const escapeHTML = (value: unknown): string => {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const escapeAttribute = (value: unknown): string => escapeHTML(value)

const keyValuePairToHTMLTable = (variables: SubmissionValue[]): string => {
  const rows = variables
    .map(
      ({ field, value }) => `<tr><td>${escapeHTML(field)}</td><td>${escapeHTML(value)}</td></tr>`,
    )
    .join('')

  return `<table>${rows}</table>`
}

const replaceDoubleCurlys = (
  value: string,
  variables: SubmissionValue[],
  renderHTMLReplacement?: (html: string) => string,
): string => {
  return value.replace(/\{\{(.+?)\}\}/g, (_, variable: string) => {
    if (variable === '*') {
      const html = variables
        .map(({ field, value }) => `${escapeHTML(field)} : ${escapeHTML(value)}`)
        .join(' <br /> ')

      return renderHTMLReplacement ? renderHTMLReplacement(html) : html
    }

    if (variable === '*:table') {
      const html = keyValuePairToHTMLTable(variables)

      return renderHTMLReplacement ? renderHTMLReplacement(html) : html
    }

    const foundVariable = variables.find(({ field }) => field === variable)

    return foundVariable ? String(foundVariable.value ?? '') : variable
  })
}

const getChildrenHTML = (node: LexicalNode, variables: SubmissionValue[]): string => {
  return (node.children || []).map((child) => serializeNode(child, variables)).join('')
}

const getLinkHref = (
  node: LexicalNode,
  childrenHTML: string,
  variables: SubmissionValue[],
): string => {
  const configuredHref =
    node.fields?.linkType === 'custom'
      ? node.fields.url
      : node.fields?.url || node.url || node.fields?.doc?.value?.slug || ''

  const fallbackHref = childrenHTML.replace(/<[^>]+>/g, '').trim()
  const href = replaceDoubleCurlys(configuredHref || fallbackHref, variables)

  if (href.includes('@') && !href.startsWith('mailto:') && !href.includes('://')) {
    return `mailto:${href}`
  }

  return href
}

const serializeTextNode = (node: LexicalNode, variables: SubmissionValue[]): string => {
  const htmlReplacements = new Map<string, string>()
  const replacedText = replaceDoubleCurlys(node.text || '', variables, (html) => {
    const token = `__FORM_EMAIL_HTML_${htmlReplacements.size}__`

    htmlReplacements.set(token, html)

    return token
  })
  let text = escapeHTML(replacedText)

  htmlReplacements.forEach((html, token) => {
    text = text.replace(token, html)
  })
  const format = typeof node.format === 'number' ? node.format : 0

  if (format & NodeFormat.IS_BOLD) text = `<strong>${text}</strong>`
  if (format & NodeFormat.IS_ITALIC) text = `<em>${text}</em>`
  if (format & NodeFormat.IS_STRIKETHROUGH) {
    text = `<span style="text-decoration: line-through">${text}</span>`
  }
  if (format & NodeFormat.IS_UNDERLINE) {
    text = `<span style="text-decoration: underline">${text}</span>`
  }
  if (format & NodeFormat.IS_CODE) text = `<code>${text}</code>`
  if (format & NodeFormat.IS_SUBSCRIPT) text = `<sub>${text}</sub>`
  if (format & NodeFormat.IS_SUPERSCRIPT) text = `<sup>${text}</sup>`

  return text
}

const serializeNode = (node: LexicalNode, variables: SubmissionValue[]): string => {
  switch (node.type) {
    case 'text':
      return serializeTextNode(node, variables)

    case 'linebreak':
      return '<br />'

    case 'paragraph':
      return `<p>${getChildrenHTML(node, variables)}</p>`

    case 'heading': {
      const tag = node.tag && /^h[1-6]$/.test(node.tag) ? node.tag : 'h2'

      return `<${tag}>${getChildrenHTML(node, variables)}</${tag}>`
    }

    case 'link':
    case 'autolink': {
      const childrenHTML = getChildrenHTML(node, variables)
      const href = getLinkHref(node, childrenHTML, variables)
      const newTabAttributes = node.fields?.newTab
        ? ' rel="noopener noreferrer" target="_blank"'
        : ''

      return `<a href="${escapeAttribute(href)}"${newTabAttributes}>${childrenHTML}</a>`
    }

    case 'list':
      return `<ul>${getChildrenHTML(node, variables)}</ul>`

    case 'listitem':
      return `<li>${getChildrenHTML(node, variables)}</li>`

    case 'quote':
      return `<blockquote>${getChildrenHTML(node, variables)}</blockquote>`

    default:
      if (node.children?.length) return getChildrenHTML(node, variables)
      if (node.text) return serializeTextNode(node, variables)

      return ''
  }
}

const isLexicalMessage = (value: unknown): value is LexicalMessage => {
  return Boolean(value && typeof value === 'object' && 'root' in value)
}

const serializeLexicalMessage = (message: LexicalMessage, variables: SubmissionValue[]): string => {
  return (message.root?.children || []).map((node) => serializeNode(node, variables)).join('')
}

export const fixFormBuilderEmailHTML: BeforeEmail = async (emails, beforeChangeParams) => {
  const {
    data,
    req,
    req: { payload },
  } = beforeChangeParams
  const runtimeParams = beforeChangeParams as typeof beforeChangeParams & {
    doc?: {
      id?: number | string
    }
  }
  const formID = data?.form

  if (!formID) return emails

  const form = (await payload.findByID({
    collection: 'forms',
    depth: 0,
    id: formID,
    req,
  })) as {
    emails?: FormEmailConfig[]
  }

  const submissionData: SubmissionValue[] = [
    ...((data?.submissionData as SubmissionValue[] | undefined) || []),
    {
      field: 'formSubmissionID',
      value: String(runtimeParams.doc?.id || ''),
    },
  ]

  return emails.map<FormattedEmail>((email, index) => {
    const message = form.emails?.[index]?.message

    if (!isLexicalMessage(message)) return email

    return {
      ...email,
      html: `<div>${serializeLexicalMessage(message, submissionData)}</div>`,
    }
  })
}
