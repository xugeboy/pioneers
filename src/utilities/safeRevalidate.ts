import { revalidatePath, revalidateTag } from 'next/cache'

type RevalidateLogger = {
  warn?: (message: string) => void
}

const isRenderRevalidateError = (error: unknown) =>
  error instanceof Error &&
  error.message.includes('during render') &&
  error.message.includes('revalidate')

const handleRevalidateError = (
  error: unknown,
  logger: RevalidateLogger | undefined,
  message: string,
) => {
  if (!isRenderRevalidateError(error)) {
    throw error
  }

  logger?.warn?.(message)
}

export const safeRevalidateTag = (tag: string, logger?: RevalidateLogger) => {
  try {
    revalidateTag(tag)
  } catch (error) {
    handleRevalidateError(
      error,
      logger,
      `Skipped revalidateTag("${tag}") because it was triggered during render.`,
    )
  }
}

export const safeRevalidatePath = (path: string, logger?: RevalidateLogger) => {
  try {
    revalidatePath(path)
  } catch (error) {
    handleRevalidateError(
      error,
      logger,
      `Skipped revalidatePath("${path}") because it was triggered during render.`,
    )
  }
}
