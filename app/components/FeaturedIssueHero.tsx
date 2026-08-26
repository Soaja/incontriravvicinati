import type {SanityImageSource} from '@sanity/image-url'
import Image from 'next/image'

import {urlFor} from '@/sanity/lib/image'

export type FeaturedIssue = {
  _id: string
  title: string | null
  issueNumber: number | null
  publicationDate: string | null
  description: string | null
  pageCount: number | null
  coverImage: (SanityImageSource & {alt?: string | null}) | null
  pdfUrl: string | null
}

type FeaturedIssueHeroProps = {
  issue: FeaturedIssue | null
}

const dateFormatter = new Intl.DateTimeFormat('it-IT', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

export function FeaturedIssueHero({issue}: FeaturedIssueHeroProps) {
  if (!issue) {
    return null
  }

  const formattedDate = issue.publicationDate
    ? dateFormatter.format(new Date(`${issue.publicationDate}T00:00:00Z`))
    : 'Data non disponibile'
  const issueLabel =
    issue.issueNumber !== null ? `N. ${String(issue.issueNumber).padStart(2, '0')}` : 'Numero'

  return (
    <section className="issue-hero" aria-labelledby="featured-issue-title">
      <div className="issue-hero__label">
        <p className="type-meta">Numero in evidenza</p>
        <span className="type-meta">Edizione / 01</span>
      </div>

      <div className={`issue-hero__layout${issue.coverImage ? '' : ' issue-hero__layout--text-only'}`}>
        {issue.coverImage ? (
          <div className="issue-hero__media">
            <Image
              src={urlFor(issue.coverImage)
                .width(1200)
                .height(1600)
                .fit('crop')
                .auto('format')
                .url()}
              alt={issue.coverImage.alt ?? `Copertina ${issue.title ?? issueLabel}`}
              fill
              priority
              sizes="(max-width: 767px) 100vw, 58vw"
            />
          </div>
        ) : null}

        <div className="issue-hero__content">
          <p className="issue-hero__number" aria-label={`Numero ${issue.issueNumber ?? ''}`}>
            {issueLabel}
          </p>
          <h2 id="featured-issue-title" className="issue-hero__title">
            {issue.title ?? 'Incontri Ravvicinati'}
          </h2>

          <div className="issue-hero__details">
            {issue.description ? <p className="issue-hero__description">{issue.description}</p> : null}
            <p className="issue-hero__meta type-meta">
              {formattedDate}
              {issue.pageCount ? ` · ${issue.pageCount} pagine` : ''}
            </p>
          </div>

          {issue.pdfUrl ? (
            <a
              className="issue-hero__download type-meta"
              href={issue.pdfUrl}
              target="_blank"
              rel="noreferrer"
              download
            >
              Scarica PDF <span aria-hidden="true">↓</span>
            </a>
          ) : (
            <p className="issue-hero__pdf-missing type-meta">PDF non disponibile</p>
          )}
        </div>
      </div>
    </section>
  )
}
