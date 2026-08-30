import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}

export function hasValidImageReference(
  source: SanityImageSource | null | undefined,
): source is SanityImageSource {
  if (!source || typeof source !== 'object' || !('asset' in source)) {
    return false
  }

  const asset = source.asset

  if (typeof asset === 'string') {
    return asset.trim().length > 0
  }

  if (!asset || typeof asset !== 'object') {
    return false
  }

  if ('_ref' in asset) {
    return typeof asset._ref === 'string' && asset._ref.trim().length > 0
  }

  return true
}

export function getSanityImageUrl(
  source: SanityImageSource | null | undefined,
  buildUrl: (image: ReturnType<typeof urlFor>) => string,
) {
  if (!hasValidImageReference(source)) {
    return null
  }

  try {
    return buildUrl(urlFor(source))
  } catch {
    return null
  }
}
