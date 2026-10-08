'use server'
import {revalidateTag} from 'next/cache'
import {SANITY_CACHE_TAG} from './cache'

// Keep the existing Live Content API refreshing published pages as well as ISR/webhooks.
export async function refreshPublishedContent() {
  revalidateTag(SANITY_CACHE_TAG, {expire: 0})
  return 'refresh' as const
}
