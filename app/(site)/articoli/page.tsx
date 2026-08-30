import type {SanityImageSource} from '@sanity/image-url'
import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'

import {urlFor} from '@/sanity/lib/image'
import {sanityFetch} from '@/sanity/lib/live'
import {ARTICLES_PAGE_QUERY} from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Articoli',
  description: 'Articoli, recensioni e approfondimenti di Incontri Ravvicinati.',
}

const articleTypes = [
  {value: '', label: 'Tutti'},
  {value: 'recensione', label: 'Recensioni'},
  {value: 'intervista', label: 'Interviste'},
  {value: 'approfondimento', label: 'Approfondimenti'},
  {value: 'retrospettiva', label: 'Retrospettive'},
  {value: 'news', label: 'News'},
  {value: 'reportage', label: 'Reportage'},
  {value: 'selezione', label: 'Selezioni'},
] as const

const allowedArticleTypes = new Set<string>(articleTypes.map(({value}) => value))

type ArticleArchiveItem = {
  _id: string
  title: string | null
  slug: string | null
  excerpt: string | null
  articleType: string | null
  publishedAt: string | null
  readingTime: number | null
  author: {name: string | null; slug: string | null} | null
  coverImage: (SanityImageSource & {alt?: string | null}) | null
}

type ArticoliPageProps = {
  searchParams: Promise<{
    type?: string | string[]
    author?: string | string[]
  }>
}

const dateFormatter = new Intl.DateTimeFormat('it-IT', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function formatDate(value: string | null) {
  return value ? dateFormatter.format(new Date(value)) : 'Data non disponibile'
}

function typeLabel(value: string | null) {
  return articleTypes.find((type) => type.value === value)?.label ?? 'Articolo'
}

export default async function ArticoliPage({searchParams}: ArticoliPageProps) {
  const params = await searchParams
  const requestedType = firstParam(params.type) ?? ''
  const articleType = allowedArticleTypes.has(requestedType) ? requestedType : ''
  const authorSlug = firstParam(params.author)?.trim() ?? ''
  const {data} = await sanityFetch({
    query: ARTICLES_PAGE_QUERY,
    params: {articleType, authorSlug},
  })
  const articles = data as ArticleArchiveItem[]

  return (
    <main id="main-content" className="site-container articles-page">
      <header className="articles-page__hero">
        <div className="articles-page__label">
          <p className="type-meta">Archivio editoriale</p>
          <span aria-hidden="true">02</span>
        </div>
        <h1>Articoli</h1>
        <p className="articles-page__intro">
          Recensioni, interviste, reportage e percorsi nella cultura cinematografica
          contemporanea.
        </p>
      </header>

      <nav className="article-filters" aria-label="Filtra gli articoli per tipologia">
        <p className="type-meta">Esplora per tipologia</p>
        <ul>
          {articleTypes.map((type) => {
            const href = type.value ? `/articoli?type=${type.value}` : '/articoli'
            const isActive = type.value === articleType && !authorSlug

            return (
              <li key={type.value || 'all'}>
                <Link href={href} aria-current={isActive ? 'page' : undefined}>
                  {type.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {authorSlug ? (
        <div className="articles-page__active-filter">
          <p className="type-meta">Filtro autore: {authorSlug.replaceAll('-', ' ')}</p>
          <Link className="type-meta" href="/articoli">
            Rimuovi filtro ×
          </Link>
        </div>
      ) : null}

      <section className="article-archive" aria-labelledby="article-archive-heading">
        <header className="article-archive__header">
          <h2 id="article-archive-heading">
            {articleType ? typeLabel(articleType) : 'Tutte le storie'}
          </h2>
          <p className="type-meta">
            {articles.length} {articles.length === 1 ? 'articolo' : 'articoli'}
          </p>
        </header>

        {articles.length > 0 ? (
          <div className="article-archive__grid">
            {articles.map((article, index) => {
              const title = article.title ?? 'Titolo non disponibile'
              const href = article.slug ? `/articoli/${article.slug}` : null

              return (
                <article
                  key={article._id}
                  className={`article-archive-card${
                    article.coverImage ? '' : ' article-archive-card--no-image'
                  }`}
                >
                  <div className="article-archive-card__label">
                    <p className="type-meta">{typeLabel(article.articleType)}</p>
                    <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  </div>

                  {article.coverImage ? (
                    href ? (
                      <Link
                        className="article-archive-card__image-link"
                        href={href}
                        aria-label={`Leggi ${title}`}
                      >
                        <div className="article-archive-card__media">
                          <Image
                            src={urlFor(article.coverImage)
                              .width(index === 0 ? 1400 : 900)
                              .height(index === 1 ? 1200 : 900)
                              .fit('crop')
                              .auto('format')
                              .url()}
                            alt={article.coverImage.alt ?? title}
                            fill
                            priority={index === 0}
                            sizes={
                              index === 0
                                ? '(max-width: 767px) 100vw, 64vw'
                                : '(max-width: 767px) 100vw, 33vw'
                            }
                          />
                        </div>
                      </Link>
                    ) : (
                      <div className="article-archive-card__media">
                      <Image
                        src={urlFor(article.coverImage)
                          .width(index === 0 ? 1400 : 900)
                          .height(index === 1 ? 1200 : 900)
                          .fit('crop')
                          .auto('format')
                          .url()}
                        alt={article.coverImage.alt ?? title}
                        fill
                        priority={index === 0}
                        sizes={
                          index === 0
                            ? '(max-width: 767px) 100vw, 64vw'
                            : '(max-width: 767px) 100vw, 33vw'
                        }
                      />
                      </div>
                    )
                  ) : null}

                  <div className="article-archive-card__content">
                    <h3>{href ? <Link href={href}>{title}</Link> : title}</h3>
                    {article.excerpt ? <p className="article-archive-card__excerpt">{article.excerpt}</p> : null}
                    <p className="article-archive-card__meta type-meta">
                      {article.author?.name ?? 'Autore non disponibile'} ·{' '}
                      {formatDate(article.publishedAt)}
                      {article.readingTime ? ` · ${article.readingTime} min di lettura` : ''}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="article-archive__empty">
            <p className="type-meta">Nessun risultato</p>
            <p>Non ci sono ancora articoli pubblicati per questo filtro.</p>
            <Link className="type-meta" href="/articoli">
              Torna a tutti gli articoli ↗
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}
