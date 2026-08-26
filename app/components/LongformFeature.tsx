import type {SanityImageSource} from '@sanity/image-url'
import Image from 'next/image'
import Link from 'next/link'

import {urlFor} from '@/sanity/lib/image'

export type LongformArticle = {
  _id: string
  title: string | null
  slug: string | null
  articleType: string | null
  excerpt: string | null
  publishedAt: string | null
  readingTime: number | null
  author: {name: string | null} | null
  coverImage: (SanityImageSource & {alt?: string | null}) | null
}

type LongformFeatureProps = {
  article: LongformArticle | null
}

const dateFormatter = new Intl.DateTimeFormat('it-IT', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

function longformMeta(article: LongformArticle) {
  const parts = [
    article.author?.name ?? 'Autore non disponibile',
    article.publishedAt
      ? dateFormatter.format(new Date(article.publishedAt))
      : 'Data non disponibile',
  ]

  if (article.readingTime) {
    parts.push(`${article.readingTime} min di lettura`)
  }

  return parts.join(' · ')
}

export function LongformFeature({article}: LongformFeatureProps) {
  if (!article) {
    return null
  }

  const articleHref = article.slug ? `/articoli/${article.slug}` : null
  const articleTitle = article.title ?? 'Titolo non disponibile'
  const sectionLabel = article.articleType === 'intervista' ? 'Intervista' : 'Approfondimento'
  const featureImage = article.coverImage ? (
    <div className="longform-feature__media">
      <Image
        src={urlFor(article.coverImage)
          .width(1800)
          .height(900)
          .fit('crop')
          .auto('format')
          .url()}
        alt={article.coverImage.alt ?? articleTitle}
        fill
        sizes="(max-width: 767px) 100vw, 78vw"
      />
    </div>
  ) : null

  return (
    <section
      className={`longform-feature${featureImage ? '' : ' longform-feature--text-only'}`}
      aria-labelledby="longform-feature-title"
    >
      <header className="longform-feature__header">
        <p className="type-meta">{sectionLabel}</p>
        <span className="type-meta">Lettura lunga / 01</span>
      </header>

      {featureImage ? (
        articleHref ? (
          <Link
            className="longform-feature__image-link"
            href={articleHref}
            aria-label={`Leggi ${articleTitle}`}
          >
            {featureImage}
          </Link>
        ) : (
          featureImage
        )
      ) : null}

      <div className="longform-feature__spread">
        <h2 id="longform-feature-title" className="longform-feature__title">
          {articleHref ? <Link href={articleHref}>{articleTitle}</Link> : articleTitle}
        </h2>

        <div className="longform-feature__supporting">
          {article.excerpt ? <p className="longform-feature__excerpt">{article.excerpt}</p> : null}
          <p className="longform-feature__meta type-meta">{longformMeta(article)}</p>
          {articleHref ? (
            <Link className="longform-feature__link type-meta" href={articleHref}>
              Leggi l’articolo <span aria-hidden="true">↗</span>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  )
}
