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

  return ('_id' in asset && typeof asset._id === 'string' && asset._id.startsWith('image-')) ||
    ('url' in asset && typeof asset.url === 'string' && asset.url.startsWith('https://cdn.sanity.io/images/'))
}

export function imageDimensions(source: SanityImageSource & {asset?: {metadata?: {dimensions?: {width?: number; height?: number}}}}) {
  const asset = source.asset
  const dimensions = typeof asset === 'object' ? asset?.metadata?.dimensions : undefined
  const id = typeof asset === 'object' && asset ? ('_ref' in asset ? asset._ref : '_id' in asset ? asset._id : '') : ''
  const match = typeof id === 'string' ? id.match(/-(\d+)x(\d+)-/) : null
  const width = dimensions?.width ?? (match ? Number(match[1]) : 1200)
  const height = dimensions?.height ?? (match ? Number(match[2]) : 800)
  const crop = 'crop' in source ? source.crop as {left?: number; right?: number; top?: number; bottom?: number} | undefined : undefined
  return {
    width: Math.max(1, Math.round(width * (1 - (crop?.left ?? 0) - (crop?.right ?? 0)))),
    height: Math.max(1, Math.round(height * (1 - (crop?.top ?? 0) - (crop?.bottom ?? 0)))),
  }
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
