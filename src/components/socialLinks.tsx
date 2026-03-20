import { siFacebook, siYoutube } from 'simple-icons'

export type SocialLink = {
  href: string
  label: string
  path: string
}

export const socialLinks: SocialLink[] = [
  { href: '#', label: 'Facebook', path: siFacebook.path },
  { href: '#', label: 'YouTube', path: siYoutube.path },
  {
    href: 'https://www.linkedin.com/company/pioneers-gears',
    label: 'LinkedIn',
    path: 'M20.447 20.452H16.89V14.87c0-1.331-.027-3.045-1.856-3.045-1.859 0-2.143 1.451-2.143 2.948v5.679H9.334V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
]
