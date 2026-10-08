import Image from 'next/image'
import Link from 'next/link'
import type {SanityImageSource} from '@sanity/image-url'
import {urlFor} from '@/sanity/lib/image'
import {sectionLabel} from '@/app/lib/sections'
import {ArticleTitle} from './ArticleTitle'
import {ArrowIcon} from './ArrowIcon'
import {AuthorLinks, type ArticlePeople} from './AuthorLinks'
import {RubricaLabel, type Rubrica} from './RubricaLabel'

export type ArticleListItem = ArticlePeople & {
  _id: string
  title: string | null
  slug: string | null
  excerpt: string | null
  articleType: string | null
  publishedAt: string | null
  readingTime: number | null
  author: {name: string | null; slug: string | null} | null
  rubrica?: Rubrica | null
  coverImage: (SanityImageSource & {alt?: string | null}) | null
}

const dateFormatter = new Intl.DateTimeFormat('it-IT', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

function formatDate(value: string | null) {
  return value ? dateFormatter.format(new Date(value)) : 'Data non disponibile'
}


export function ArticleList({articles, heading = 'Tutte le storie'}: {articles: ArticleListItem[]; heading?: string}) {
  return (
      <section className="article-archive" aria-labelledby="article-archive-heading">
        <header className="article-archive__header">
          <h2 id="article-archive-heading">
            {heading}
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
                    <p className="type-meta">{sectionLabel(article.articleType)}<RubricaLabel rubrica={article.rubrica} /></p>
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
                    <h3>{href ? <Link href={href}><ArticleTitle text={title} /></Link> : <ArticleTitle text={title} />}</h3>
                    {article.excerpt ? <p className="article-archive-card__excerpt">{article.excerpt}</p> : null}
                    <p className="article-archive-card__meta type-meta">
                      <AuthorLinks article={article} /> ·{' '}
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
            <p>Presto nuovi articoli in questa sezione.</p>
            <Link className="type-meta" href="/articoli">
              Torna a tutti gli articoli <ArrowIcon />
            </Link>
          </div>
        )}
      </section>
  )
}
