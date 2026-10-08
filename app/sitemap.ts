import type {MetadataRoute} from 'next'

import {sanityFetch} from '@/sanity/lib/live'
import {SITEMAP_CONTENT_QUERY} from '@/sanity/lib/archive'
import {sections} from '@/app/lib/sections'
import {siteUrl} from '@/app/lib/site-url'
import {pageUrl} from '@/app/lib/pagination'

export const revalidate = 60

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
  const {data: {articles, authors, rubriche}} = await sanityFetch<{
    articles: SitemapArticle[]; authors: (SitemapArticle & {_id: string})[]; rubriche: SitemapArticle[]
  }>({query: SITEMAP_CONTENT_QUERY})

  return [
    ...staticPages,
    ...sections.map(section => ({url: siteUrl + pageUrl('/articoli', {type: section.slug}), changeFrequency: 'weekly' as const, priority: 0.7})),
    ...authors.map(author => ({url: siteUrl + pageUrl('/articoli', {author: author.slug || author._id}), lastModified: author._updatedAt, changeFrequency: 'weekly' as const, priority: 0.5})),
    ...rubriche.map(column => ({url: `${siteUrl}/rubrica/${encodeURIComponent(column.slug)}`, lastModified: column._updatedAt, changeFrequency: 'weekly' as const, priority: 0.6})),
    ...articles.map(({slug, _updatedAt}) => ({
      url: `${siteUrl}/articoli/${encodeURIComponent(slug)}`,
      lastModified: _updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
