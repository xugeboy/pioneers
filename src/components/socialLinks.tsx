import { siWhatsapp } from 'simple-icons'

export type SocialLink = {
  href: string
  label: string
  path: string
}

export const socialLinks: SocialLink[] = []

export const whatsappContact: SocialLink = {
  href: 'https://wa.me/8619952792557',
  label: 'WhatsApp +86 19952792557',
  path: siWhatsapp.path,
}

export const emailContact = {
  email: 'inquiry@pioneersgears.com',
  label: 'Email PioneersGears',
}
