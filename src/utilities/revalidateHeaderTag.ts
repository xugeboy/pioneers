import { safeRevalidateTag } from '@/utilities/safeRevalidate'

export function revalidateHeaderTag(logger?: Parameters<typeof safeRevalidateTag>[1]): void {
  safeRevalidateTag('global_header', logger)
}
