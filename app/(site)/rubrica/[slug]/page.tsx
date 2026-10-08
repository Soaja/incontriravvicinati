import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {ArticleList, type ArticleListItem} from '@/app/components/ArticleList'
import {sanityFetch} from '@/sanity/lib/live'
import {ARTICLES_PAGE_QUERY, RUBRICA_QUERY} from '@/sanity/lib/queries'

type Props = {params: Promise<{slug: string}>}
type Column = {title: string; slug: string; description: string | null}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const {data} = await sanityFetch({query: RUBRICA_QUERY, params: {slug}, stega: false})
  const rubrica = data as Column | null
  return {title: rubrica ? `${rubrica.title} | Incontri Ravvicinati` : 'Rubrica non trovata', description: rubrica?.description ?? undefined}
}

export default async function RubricaPage({params}: Props) {
  const {slug} = await params
  const [columnResult, articlesResult] = await Promise.all([
    sanityFetch({query: RUBRICA_QUERY, params: {slug}}),
    sanityFetch({query: ARTICLES_PAGE_QUERY, params: {articleType: '', authorSlug: '', rubricaSlug: slug}}),
  ])
  const rubrica = columnResult.data as Column | null
  if (!rubrica) notFound()
  return <main id="main-content" className="site-container articles-page">
    <header className="articles-page__hero">
      <p className="articles-page__label type-meta">Rubrica</p>
      <h1>{rubrica.title}</h1>
      {rubrica.description ? <p className="articles-page__intro">{rubrica.description}</p> : null}
    </header>
    <ArticleList articles={articlesResult.data as ArticleListItem[]} heading="Gli articoli della rubrica" />
  </main>
}
