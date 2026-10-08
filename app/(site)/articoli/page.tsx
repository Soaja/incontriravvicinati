import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound, permanentRedirect} from 'next/navigation'
import {Pagination} from '@/app/components/Pagination'
import {ARTICLES_PER_PAGE, pageNumber, pageUrl, type QueryValue} from '@/app/lib/pagination'
import {siteUrl} from '@/app/lib/site-url'
import {ARCHIVE_COUNT_QUERY, archivePageQuery} from '@/sanity/lib/archive'
import {ArticleFilters} from '@/app/components/ArticleFilters'
import {ArticleList, type ArticleListItem} from '@/app/components/ArticleList'
import {AuthorPhoto} from '@/app/components/AuthorPhoto'
import type {Author} from '@/app/components/AuthorLinks'
import {orderedSections, sections} from '@/app/lib/sections'
import {sanityFetch} from '@/sanity/lib/live'
import {AUTHOR_QUERY, SECTION_ORDER_QUERY} from '@/sanity/lib/queries'

export async function generateMetadata({searchParams}: Props): Promise<Metadata> {
  const params = await searchParams
  const type = first(params.type) ?? ''
  const authorSlug = first(params.author)?.trim() ?? ''
  const page = pageNumber(params.pagina) ?? 1
  const section = sections.find(section => section.slug === type)
  const author = authorSlug ? (await sanityFetch<Author | null>({query: AUTHOR_QUERY, params: {slug: authorSlug}})).data : null
  const title = author?.name?.trim() ?? section?.label ?? 'Articoli'
  return {title: `${title}${page > 1 ? ` · Pagina ${page}` : ''} | Incontri Ravvicinati`,
    description: 'Articoli, recensioni e approfondimenti di Incontri Ravvicinati.',
    alternates: {canonical: siteUrl + pageUrl('/articoli', {type: section?.slug ?? '', author: authorSlug}, page)}}
}

type Props = {searchParams: Promise<{type?: QueryValue; author?: QueryValue; pagina?: QueryValue}>}
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value

export default async function ArticoliPage({searchParams}: Props) {
  const params = await searchParams
  const requestedType = first(params.type) ?? ''
  const authorSlug = first(params.author)?.trim() ?? ''
  const page = pageNumber(params.pagina)
  if (!page || page > Math.floor(Number.MAX_SAFE_INTEGER / ARTICLES_PER_PAGE)) notFound()
  if (requestedType === 'selezione' || requestedType === 'altri-articoli') {
    const query = new URLSearchParams({type: 'editoriali'})
    if (authorSlug) query.set('author', authorSlug)
    if (page > 1) query.set('pagina', String(page))
    permanentRedirect('/articoli?' + query.toString())
  }
  const section = sections.find(section => section.slug === requestedType)
  if (requestedType && !section) notFound()
  const urlParams = {type: section?.slug ?? '', author: authorSlug}
  if (params.pagina !== undefined && page === 1) permanentRedirect(pageUrl('/articoli', urlParams))
  const queryParams = {articleType: section?.value ?? '', authorSlug, rubricaSlug: ''}
  const [articlesResult, orderResult, authorResult] = await Promise.all([
    sanityFetch<{total: number; articles: ArticleListItem[]}>({query: `{"total": ${ARCHIVE_COUNT_QUERY}, "articles": ${archivePageQuery(page)}}`, params: queryParams}),
    sanityFetch({query: SECTION_ORDER_QUERY}),
    authorSlug ? sanityFetch({query: AUTHOR_QUERY, params: {slug: authorSlug}}) : Promise.resolve({data: null}),
  ])
  const order = orderResult.data as {order?: string[] | null} | null
  const author = authorResult.data as Author | null
  if (authorSlug && !author) notFound()
  const {total, articles} = articlesResult.data
  if (page > Math.max(1, Math.ceil(total / ARTICLES_PER_PAGE))) notFound()
  const options = [{value: '', label: 'Tutti'}, ...orderedSections(order?.order).map(({slug, label}) => ({value: slug, label}))]
  return (
    <main id="main-content" className="site-container articles-page">
      <header className="articles-page__hero">
        <div className="articles-page__label">
          <p className="type-meta">Archivio editoriale</p>
          <span aria-hidden="true">02</span>
        </div>
        <h1>Articoli</h1>
        <p className="articles-page__intro">
          Analisi, interviste, approfondimenti, news e tanti altri contenuti, che
          affiancheranno la nostra rivista (a cadenza trimestrale), per raccontare con
          puntualità le dinamiche del mondo cinematografico, dentro e fuori dai set.
        </p>
      </header>
      {author ? <section className="author-profile" aria-label="Profilo autore">
        <AuthorPhoto author={author} size={160} />
        <div><p className="type-meta">Autore</p><h2>{author.name?.trim()}</h2>
          {author.role ? <p className="type-meta">{author.role}</p> : null}
          {author.bio ? <p className="type-body">{author.bio}</p> : null}
        </div>
      </section> : null}
      <ArticleFilters options={options} activeValue={section?.slug ?? ''} authorSlug={authorSlug} />
      {authorSlug ? <div className="articles-page__active-filter">
        <p className="type-meta">Articoli di {author?.name?.trim() ?? authorSlug.replaceAll('-', ' ')}</p>
        <Link className="type-meta" href="/articoli">Rimuovi filtro ×</Link>
      </div> : null}
      <ArticleList articles={articles} total={total} offset={(page - 1) * ARTICLES_PER_PAGE} heading={section?.label ?? (author ? 'Gli articoli dell’autore' : 'Tutte le storie')} />
      <Pagination page={page} total={total} path="/articoli" params={urlParams} />
    </main>
  )
}
