type CMSLinkLike = {
  type?: 'reference' | 'custom' | null
  url?: string | null
  reference?: {
    relationTo: 'pages' | 'posts' | 'products'
    value: { slug?: string | null } | string | number
  } | null
}

export const resolveCMSLinkHref = (link?: CMSLinkLike | null) => {
  if (!link) return null

  if (link.type === 'reference' && link.reference && typeof link.reference.value === 'object') {
    const value = link.reference.value

    if ('slug' in value && value.slug) {
      return `${link.reference.relationTo !== 'pages' ? `/${link.reference.relationTo}` : ''}/${value.slug}`
    }
  }

  return link.url || null
}
