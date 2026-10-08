import type {Metadata} from 'next'
import Link from 'next/link'
import {permanentRedirect} from 'next/navigation'
import {ArticleFilters} from '@/app/components/ArticleFilters'
import {ArticleList, type ArticleListItem} from '@/app/components/ArticleList'
import {AuthorPhoto} from '@/app/components/AuthorPhoto'
import type {Author} from '@/app/components/AuthorLinks'
import {orderedSections, sections} from '@/app/lib/sections'
import {sanityFetch} from '@/sanity/lib/live'
import {ARTICLES_PAGE_QUERY, AUTHOR_QUERY, SECTION_ORDER_QUERY} from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Articoli', description: 'Articoli, recensioni e approfondimenti di Incontri Ravvicinati.',
}

type Props = {searchParams: Promise<{type?: string | string[]; author?: string | string[]}>}
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value

export default async function ArticoliPage({searchParams}: Props) {
  const params = await searchParams
  const requestedType = first(params.type) ?? ''
  const authorSlug = first(params.author)?.trim() ?? ''
  if (requestedType === 'selezione' || requestedType === 'altri-articoli') {
    const query = new URLSearchParams({type: 'editoriali'})
    if (authorSlug) query.set('author', authorSlug)
    permanentRedirect('/articoli?' + query.toString())
  }
  const section = sections.find(section => section.slug === requestedType)
  const [articlesResult, orderResult, authorResult] = await Promise.all([
    sanityFetch({query: ARTICLES_PAGE_QUERY, params: {articleType: section?.value ?? '', authorSlug, rubricaSlug: ''}}),
    sanityFetch({query: SECTION_ORDER_QUERY}),
    authorSlug ? sanityFetch({query: AUTHOR_QUERY, params: {slug: authorSlug}}) : Promise.resolve({data: null}),
  ])
  const order = orderResult.data as {order?: string[] | null} | null
  const author = authorResult.data as Author | null
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
      <ArticleList articles={articlesResult.data as ArticleListItem[]} heading={section?.label ?? (author ? 'Gli articoli dell’autore' : 'Tutte le storie')} />
    </main>
  )
}
