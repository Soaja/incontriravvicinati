// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { defineLive } from "next-sanity/live";
import { client } from './client'
import type {QueryParams} from 'next-sanity'
import {SANITY_CACHE_TAG, SANITY_REVALIDATE_SECONDS} from './cache'
import {refreshPublishedContent} from './revalidate'
import {createElement} from 'react'

const live = defineLive({client, serverToken: false, browserToken: false})
export function SanityLive() {
  return createElement(live.SanityLive, {action: refreshPublishedContent})
}

// Public content only: time-based ISR also refreshes when no browser is listening.
export async function sanityFetch<T = unknown>({query, params = {}, stega = false}: {
  query: string; params?: QueryParams; stega?: boolean
}): Promise<{data: T}> {
  const data = await client.withConfig({useCdn: false, perspective: 'published'}).fetch<T>(query, params, {
    stega, next: {revalidate: SANITY_REVALIDATE_SECONDS, tags: [SANITY_CACHE_TAG]},
  })
  return {data}
}
