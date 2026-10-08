import {ARTICLES_PER_PAGE} from '@/app/lib/pagination'
import {articleSummaryFields} from './queries'

export const publishedFilter = `_type == "article" && defined(slug.current) && defined(publishedAt) && publishedAt <= now() && !(_id in path("drafts.**")) && !(_id in path("versions.**"))`
const archiveFilter = `${publishedFilter} &&
  ($articleType == "" || articleType == $articleType) &&
  ($authorSlug == "" || author->slug.current == $authorSlug || author._ref == $authorSlug || count(authors[@._ref == $authorSlug || @->slug.current == $authorSlug]) > 0) &&
  ($rubricaSlug == "" || rubrica->slug.current == $rubricaSlug)`
const summary = `${articleSummaryFields}, excerpt, coverImage{asset, crop, hotspot, alt}`
export const ARCHIVE_COUNT_QUERY = `count(*[${archiveFilter}])`

export function archivePageQuery(page: number) {
  if (!Number.isSafeInteger(page) || page < 1 || page > Math.floor(Number.MAX_SAFE_INTEGER / ARTICLES_PER_PAGE)) throw new Error('Invalid page')
  const start = (page - 1) * ARTICLES_PER_PAGE
  return `*[${archiveFilter}] | order(publishedAt desc, _id asc)[${start}...${start + ARTICLES_PER_PAGE}]{${summary}}`
}

const searchFilter = `${publishedFilter} && (
  title match $terms || excerpt match $terms || pt::text(body) match $terms ||
  author->name match $terms || authors[]->name match $terms ||
  rubrica->title match $terms || articleType in $sectionKeys
)`
export const SEARCH_COUNT_QUERY = `count(*[${searchFilter}])`
export function searchPageQuery(page: number, limit = ARTICLES_PER_PAGE) {
  if (!Number.isSafeInteger(page) || page < 1 || page > Math.floor(Number.MAX_SAFE_INTEGER / ARTICLES_PER_PAGE) || ![6, ARTICLES_PER_PAGE].includes(limit)) throw new Error('Invalid search page')
  const start = (page - 1) * ARTICLES_PER_PAGE
  return `*[${searchFilter}]{_id, title, "slug": slug.current, articleType, publishedAt,
    "titleMatch": title match $terms,
    author->{_id, name, "slug": slug.current},
    "authors": authors[]->{_id, name, "slug": slug.current},
    rubrica->{title, "slug": slug.current}, coverImage{asset, crop, hotspot, alt}
  } | order(titleMatch desc, publishedAt desc, _id asc)[${start}...${start + limit}]`
}

export const SITEMAP_CONTENT_QUERY = `{
  "articles": *[${publishedFilter}]{"slug": slug.current, _updatedAt},
  "authors": *[_type == "author" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]{_id, "slug": slug.current, _updatedAt},
  "rubriche": *[_type == "rubrica" && defined(slug.current) && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]{"slug": slug.current, _updatedAt}
}`
