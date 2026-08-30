import type {MetadataRoute} from 'next'

import {client} from '@/sanity/lib/client'
import {SITEMAP_ARTICLES_QUERY} from '@/sanity/lib/queries'

const siteUrl = 'https://www.incontriravvicinatimag.it'

type SitemapArticle = {
  slug: string
  _updatedAt: string
}

const staticPages: MetadataRoute.Sitemap = [
  {url: siteUrl, changeFrequency: 'weekly', priority: 1},
  {url: `${siteUrl}/articoli`, changeFrequency: 'weekly', priority: 0.9},
  {url: `${siteUrl}/chi-siamo`, changeFrequency: 'monthly', priority: 0.7},
  {url: `${siteUrl}/redazione`, changeFrequency: 'monthly', priority: 0.7},
  {url: `${siteUrl}/contatti`, changeFrequency: 'monthly', priority: 0.6},
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await client
    .withConfig({useCdn: false})
    .fetch<SitemapArticle[]>(SITEMAP_ARTICLES_QUERY)
    .catch(() => [])

  return [
    ...staticPages,
    ...articles.map(({slug, _updatedAt}) => ({
      url: `${siteUrl}/articoli/${encodeURIComponent(slug)}`,
      lastModified: _updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
