import type {Metadata} from 'next'
import {notFound, permanentRedirect} from 'next/navigation'
import {Pagination} from '@/app/components/Pagination'
import {ARTICLES_PER_PAGE, pageNumber, pageUrl, type QueryValue} from '@/app/lib/pagination'
import {siteUrl} from '@/app/lib/site-url'
import {ARCHIVE_COUNT_QUERY, archivePageQuery} from '@/sanity/lib/archive'
import {ArticleList, type ArticleListItem} from '@/app/components/ArticleList'
import {sanityFetch} from '@/sanity/lib/live'
import {RUBRICA_QUERY} from '@/sanity/lib/queries'

type Props = {params: Promise<{slug: string}>; searchParams: Promise<{pagina?: QueryValue}>}
type Column = {title: string; slug: string; description: string | null}

export async function generateMetadata({params, searchParams}: Props): Promise<Metadata> {
  const {slug} = await params
  const {data} = await sanityFetch({query: RUBRICA_QUERY, params: {slug}, stega: false})
  const rubrica = data as Column | null
  const page = pageNumber((await searchParams).pagina) ?? 1
  return {title: rubrica ? `${rubrica.title}${page > 1 ? ` · Pagina ${page}` : ''} | Incontri Ravvicinati` : 'Rubrica non trovata', description: rubrica?.description ?? undefined,
    alternates: {canonical: siteUrl + pageUrl(`/rubrica/${encodeURIComponent(slug)}`, {}, page)}}
}

export default async function RubricaPage({params, searchParams}: Props) {
  const {slug} = await params
  const query = await searchParams
  const page = pageNumber(query.pagina)
  if (!page || page > Math.floor(Number.MAX_SAFE_INTEGER / ARTICLES_PER_PAGE)) notFound()
  const path = `/rubrica/${encodeURIComponent(slug)}`
  if (query.pagina !== undefined && page === 1) permanentRedirect(path)
  const [columnResult, articlesResult] = await Promise.all([
    sanityFetch({query: RUBRICA_QUERY, params: {slug}}),
    sanityFetch<{total: number; articles: ArticleListItem[]}>({query: `{"total": ${ARCHIVE_COUNT_QUERY}, "articles": ${archivePageQuery(page)}}`, params: {articleType: '', authorSlug: '', rubricaSlug: slug}}),
  ])
  const rubrica = columnResult.data as Column | null
  if (!rubrica) notFound()
  const {total, articles} = articlesResult.data
  if (page > Math.max(1, Math.ceil(total / ARTICLES_PER_PAGE))) notFound()
  return <main id="main-content" className="site-container articles-page">
    <header className="articles-page__hero">
      <p className="articles-page__label type-meta">Rubrica</p>
      <h1>{rubrica.title}</h1>
      {rubrica.description ? <p className="articles-page__intro">{rubrica.description}</p> : null}
    </header>
    <ArticleList articles={articles} total={total} offset={(page - 1) * ARTICLES_PER_PAGE} heading="Gli articoli della rubrica" />
    <Pagination page={page} total={total} path={path} />
  </main>
}
