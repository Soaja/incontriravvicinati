import type {Metadata} from 'next'
import {notFound, permanentRedirect} from 'next/navigation'
import {Pagination} from '@/app/components/Pagination'
import {SearchResults, type SearchHit} from '@/app/components/SearchResults'
import {ARTICLES_PER_PAGE, firstValue, pageNumber, pageUrl, type QueryValue} from '@/app/lib/pagination'
import {searchParameters} from '@/app/lib/search'
import {siteUrl} from '@/app/lib/site-url'
import {SEARCH_COUNT_QUERY, searchPageQuery} from '@/sanity/lib/archive'
import {sanityFetch} from '@/sanity/lib/live'

type Props = {searchParams: Promise<{q?: QueryValue; pagina?: QueryValue}>}
export async function generateMetadata({searchParams}: Props): Promise<Metadata> {
  const params = await searchParams
  const {query} = searchParameters(firstValue(params.q) ?? '')
  const page = pageNumber(params.pagina) ?? 1
  return {title: `Ricerca${query ? `: ${query}` : ''}${page > 1 ? ` · Pagina ${page}` : ''} | Incontri Ravvicinati`,
    robots: {index: false, follow: true}, alternates: {canonical: siteUrl + pageUrl('/cerca', {q: query}, page)}}
}

export default async function CercaPage({searchParams}: Props) {
  const params = await searchParams
  const search = searchParameters(firstValue(params.q) ?? '')
  const page = pageNumber(params.pagina)
  if (!page || page > Math.floor(Number.MAX_SAFE_INTEGER / ARTICLES_PER_PAGE)) notFound()
  if (params.pagina !== undefined && page === 1) permanentRedirect(pageUrl('/cerca', {q: search.query}))
  const {data} = search.searchable ? await sanityFetch<{total: number; articles: SearchHit[]}>({
    query: `{"total": ${SEARCH_COUNT_QUERY}, "articles": ${searchPageQuery(page)}}`, params: {terms: search.terms, sectionKeys: search.sectionKeys},
  }) : {data: {total: 0, articles: []}}
  if (page > Math.max(1, Math.ceil(data.total / ARTICLES_PER_PAGE))) notFound()
  return <main id="main-content" className="site-container articles-page search-page">
    <header className="articles-page__hero"><p className="articles-page__label type-meta">Archivio editoriale</p><h1>Cerca</h1></header>
    <form className="search-form" role="search" action="/cerca">
      <label className="sr-only" htmlFor="page-search">Cerca un film, un autore, una rubrica</label>
      <input id="page-search" name="q" type="search" defaultValue={search.query} placeholder="Cerca un film, un autore, una rubrica…" maxLength={120} minLength={2} />
      <button className="type-meta search-submit" type="submit">Cerca →</button>
    </form>
    <section id="lista-articoli" aria-label="Risultati della ricerca">
      <p className="search-status type-meta">{!search.searchable ? 'Scrivi almeno 2 caratteri.' : data.total ? `${data.total} ${data.total === 1 ? 'risultato' : 'risultati'} per «${search.query}»` : `Nessun risultato per «${search.query}»`}</p>
      <SearchResults articles={data.articles} />
    </section>
    <Pagination page={page} total={data.total} path="/cerca" params={{q: search.query}} />
  </main>
}
