import { Facebook, Instagram, Twitter, Youtube, type LucideIcon } from 'lucide-react'

export type SocialLink = {
  href: string
  icon: LucideIcon
  label: string
}

export const socialLinks: SocialLink[] = [
  { href: '#', icon: Facebook, label: 'Facebook' },
  { href: '#', icon: Youtube, label: 'YouTube' },
  { href: '#', icon: Instagram, label: 'Instagram' },
  { href: '#', icon: Twitter, label: 'Twitter' },
]
