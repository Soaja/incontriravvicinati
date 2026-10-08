import {ArticleTitle} from '@/app/components/ArticleTitle'
import {RubricaLabel, type Rubrica} from './RubricaLabel'
import {AuthorLinks, type ArticlePeople} from './AuthorLinks'
import {sectionLabel} from '@/app/lib/sections'
import Image from 'next/image'
import Link from 'next/link'

import homepageHeroImage from '@/public/editorial/homepage-hero.png'

import {ArrowIcon} from './ArrowIcon'

type FeaturedHeroProps = {
  article: ArticlePeople & {
    title: string | null
    slug: string | null
    articleType: string | null
    excerpt: string | null
    rubrica?: Rubrica | null
  }
  meta: string
}

export function FeaturedHero({article, meta}: FeaturedHeroProps) {
  const articleHref = article.slug ? `/articoli/${article.slug}` : null
  const heroImage = (
    <Image
      src={homepageHeroImage}
      alt="Copertina di Incontri Ravvicinati con ritratto in mezzatinta blu e verde"
      fill
      priority
      placeholder="blur"
      sizes="(max-width: 767px) 100vw, 46vw"
    />
  )

  return (
    <section className="featured-hero" aria-labelledby="featured-article-title">
      <div className="featured-hero__label">
        <p className="type-meta">Articolo in evidenza</p>
        <span aria-hidden="true">01</span>
      </div>

      <article className="featured-hero__layout">
        <div className="featured-hero__intro">
          {article.articleType ? (
            <p className="type-meta">
              {sectionLabel(article.articleType)}<RubricaLabel rubrica={article.rubrica} />
            </p>
          ) : null}
          <h2 id="featured-article-title" className="featured-hero__title">
            {articleHref ? <Link href={articleHref}><ArticleTitle text={article.title} /></Link> : <ArticleTitle text={article.title} />}
          </h2>
        </div>

        <div className="featured-hero__media">
          {articleHref ? (
            <Link
              href={articleHref}
              aria-label={`Leggi ${article.title ?? "l’articolo in evidenza"}`}
            >
              {heroImage}
            </Link>
          ) : (
            heroImage
          )}
        </div>

        <div className="featured-hero__supporting">
          {article.excerpt ? <p className="featured-hero__excerpt">{article.excerpt}</p> : null}
          <div className="featured-hero__footer">
            <p className="type-meta"><AuthorLinks article={article} /> · {meta}</p>
            {articleHref ? (
              <Link className="featured-hero__link type-meta" href={articleHref}>
                Leggi l’articolo <ArrowIcon />
              </Link>
            ) : null}
          </div>
        </div>
      </article>
    </section>
  )
}
