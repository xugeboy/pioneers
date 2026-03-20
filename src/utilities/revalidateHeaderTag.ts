import { revalidateTag } from 'next/cache'

export function revalidateHeaderTag(): void {
  revalidateTag('global_header')
}
