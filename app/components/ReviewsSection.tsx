import type {SanityImageSource} from '@sanity/image-url'
import Image from 'next/image'
import Link from 'next/link'

import {urlFor} from '@/sanity/lib/image'

import {ArrowIcon} from './ArrowIcon'

export type ReviewArticle = {
  _id: string
  title: string | null
  slug: string | null
  articleType: string | null
  publishedAt: string | null
  readingTime: number | null
  author: {name: string | null} | null
  coverImage: (SanityImageSource & {alt?: string | null}) | null
}

type ReviewsSectionProps = {
  reviews: ReviewArticle[]
}

const dateFormatter = new Intl.DateTimeFormat('it-IT', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

function reviewMeta(review: ReviewArticle) {
  const parts = [
    review.author?.name ?? 'Autore non disponibile',
    review.publishedAt
      ? dateFormatter.format(new Date(review.publishedAt))
      : 'Data non disponibile',
  ]

  if (review.readingTime) {
    parts.push(`${review.readingTime} min di lettura`)
  }

  return parts.join(' · ')
}

export function ReviewsSection({reviews}: ReviewsSectionProps) {
  return (
    <section className="reviews-section" aria-labelledby="reviews-heading">
      <header className="reviews-section__header">
        <h2 id="reviews-heading">Recensioni</h2>
        <Link className="reviews-section__all type-meta" href="/articoli?type=recensione">
          Vedi tutte <ArrowIcon />
        </Link>
      </header>

      {reviews.length > 0 ? (
        <div className="reviews-section__grid">
          {reviews.map((review, index) => {
            const reviewHref = review.slug ? `/articoli/${review.slug}` : null
            const reviewTitle = review.title ?? 'Titolo non disponibile'
            const reviewImage = review.coverImage ? (
              <div className="review-card__media">
                <Image
                  src={urlFor(review.coverImage)
                    .width(index === 0 ? 1400 : 800)
                    .height(index === 0 ? 1000 : 800)
                    .fit('crop')
                    .auto('format')
                    .url()}
                  alt={review.coverImage.alt ?? reviewTitle}
                  fill
                  sizes={
                    index === 0
                      ? '(max-width: 767px) 100vw, 56vw'
                      : '(max-width: 767px) 100vw, 20vw'
                  }
                />
              </div>
            ) : null

            return (
              <article key={review._id} className="review-card">
                <div className="review-card__label">
                  <p className="type-meta">Recensione</p>
                  <span aria-hidden="true">R/{String(index + 1).padStart(2, '0')}</span>
                </div>

                {reviewImage ? (
                  reviewHref ? (
                    <Link
                      className="review-card__image-link"
                      href={reviewHref}
                      aria-label={`Leggi ${reviewTitle}`}
                    >
                      {reviewImage}
                    </Link>
                  ) : (
                    reviewImage
                  )
                ) : null}

                <div className="review-card__body">
                  <h3 className="review-card__title">
                    {reviewHref ? <Link href={reviewHref}>{reviewTitle}</Link> : reviewTitle}
                  </h3>
                  <p className="review-card__meta type-meta">{reviewMeta(review)}</p>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <p className="reviews-section__empty">Nessuna recensione pubblicata.</p>
      )}
    </section>
  )
}
