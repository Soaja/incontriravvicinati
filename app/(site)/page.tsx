import type {SanityImageSource} from '@sanity/image-url'
import Image from 'next/image'
import Link from 'next/link'

import {ArrowIcon} from '@/app/components/ArrowIcon'
import {FeaturedIssueHero, type FeaturedIssue} from '@/app/components/FeaturedIssueHero'
import {LongformFeature, type LongformArticle} from '@/app/components/LongformFeature'
import {ReviewsSection, type ReviewArticle} from '@/app/components/ReviewsSection'
import {SloganSection} from '@/app/components/SloganSection'
import {urlFor} from '@/sanity/lib/image'
import {sanityFetch} from '@/sanity/lib/live'
import {FEATURED_ISSUE_QUERY, HOMEPAGE_QUERY} from '@/sanity/lib/queries'

type ArticleSummary = {
  _id: string
  title: string | null
  slug: string | null
  articleType: string | null
  publishedAt: string | null
  readingTime: number | null
  author: {name: string | null} | null
  coverImage: (SanityImageSource & {alt?: string | null}) | null
}

type HomepageData = {
  latestArticles: ArticleSummary[]
  latestReviews: ReviewArticle[]
  featuredLongform: LongformArticle | null
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

function articleMeta(article: ArticleSummary) {
  const parts = [
    article.author?.name ?? 'Autore non disponibile',
    formatDate(article.publishedAt),
  ]

  if (article.readingTime) {
    parts.push(`${article.readingTime} min di lettura`)
  }

  return parts.join(' · ')
}

function articleTypeLabel(value: string | null) {
  return value === 'selezione' ? 'Altri articoli' : (value ?? 'Articolo')
}

export default async function Home() {
  const [homepageResult, featuredIssueResult] = await Promise.all([
    sanityFetch({query: HOMEPAGE_QUERY}),
    sanityFetch({query: FEATURED_ISSUE_QUERY}),
  ])
  const {latestArticles, latestReviews, featuredLongform} = homepageResult.data as HomepageData
  const featuredIssue = featuredIssueResult.data as FeaturedIssue | null

  return (
    <main id="main-content" className="site-container w-full py-12 md:py-16">
      <h1 className="sr-only">Incontri Ravvicinati</h1>
      <FeaturedIssueHero issue={featuredIssue} />

      <section id="ultimi-articoli" aria-labelledby="latest-heading">
        <header className="latest-articles__header">
          <h2 id="latest-heading">Ultimi articoli</h2>
          <Link className="latest-articles__all type-meta" href="/articoli">
            Vedi tutti <ArrowIcon />
          </Link>
        </header>

        {latestArticles.length > 0 ? (
          <div className="latest-articles__grid">
            {(() => {
              const cards = latestArticles.slice(0, 3).map((article, index) => {
              const articleHref = article.slug ? `/articoli/${article.slug}` : null
              const articleTitle = article.title ?? 'Titolo non disponibile'
              const coverImage = article.coverImage ? (
                <div className="latest-article__media">
                  <Image
                    src={urlFor(article.coverImage)
                      .width(index === 0 ? 1400 : 900)
                      .height(index === 0 ? 1050 : 1100)
                      .fit('crop')
                      .auto('format')
                      .url()}
                    alt={article.coverImage.alt ?? articleTitle}
                    fill
                    sizes={
                      index === 0
                        ? '(max-width: 767px) 100vw, 58vw'
                        : '(max-width: 767px) 100vw, (max-width: 1100px) 42vw, 30vw'
                    }
                  />
                </div>
              ) : null

              return (
                <article
                  key={article._id}
                  className={`latest-article latest-article--${index + 1}`}
                >
                  <div className="latest-article__label">
                    <p className="type-meta">{articleTypeLabel(article.articleType)}</p>
                    <span aria-hidden="true">{String(index + 2).padStart(2, '0')}</span>
                  </div>

                  {coverImage ? (
                    articleHref ? (
                      <Link
                        className="latest-article__image-link"
                        href={articleHref}
                        aria-label={`Leggi ${articleTitle}`}
                      >
                        {coverImage}
                      </Link>
                    ) : (
                      coverImage
                    )
                  ) : null}

                  <h3 className="latest-article__title">
                    {articleHref ? <Link href={articleHref}>{articleTitle}</Link> : articleTitle}
                  </h3>
                  <p className="latest-article__meta type-meta">{articleMeta(article)}</p>
                </article>
              )
              })

              return (
                <>
                  {cards[0]}
                  <div className="latest-articles__side">{cards.slice(1, 3)}</div>
                </>
              )
            })()}
          </div>
        ) : (
          <p className="latest-articles__empty">Nessun articolo pubblicato.</p>
        )}
      </section>

      <SloganSection />

      <ReviewsSection reviews={latestReviews} />

      <LongformFeature article={featuredLongform} />
    </main>
  )
}
