import type {SanityImageSource} from '@sanity/image-url'
import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'

import {ArrowIcon} from '@/app/components/ArrowIcon'
import {notFound} from 'next/navigation'
import type {PortableTextBlock} from 'next-sanity'

import {ArticleBody} from '@/app/components/ArticleBody'
import {client} from '@/sanity/lib/client'
import {urlFor} from '@/sanity/lib/image'
import {sanityFetch} from '@/sanity/lib/live'
import {
  ARTICLE_METADATA_QUERY,
  ARTICLE_PAGE_QUERY,
  ARTICLE_SLUGS_QUERY,
} from '@/sanity/lib/queries'

const siteUrl = 'https://www.incontriravvicinatimag.it'

type EditorialImage = SanityImageSource & {
  alt?: string | null
  caption?: string | null
  asset?: {
    metadata?: {
      dimensions?: {width?: number; height?: number}
      lqip?: string
    }
  }
}

type ArticleAuthor = {
  name: string | null
  slug: string | null
  role: string | null
  bio: string | null
  photo: EditorialImage | null
}

type ArticleIssue = {
  title: string | null
  issueNumber: number | null
}

type Article = {
  _id: string
  title: string | null
  slug: string | null
  excerpt: string | null
  articleType: string | null
  publishedAt: string | null
  readingTime: number | null
  tags: string[] | null
  coverImage: EditorialImage | null
  body: PortableTextBlock[] | null
  author: ArticleAuthor | null
  issue: ArticleIssue | null
}

type RelatedArticle = {
  _id: string
  title: string | null
  slug: string | null
  articleType: string | null
  publishedAt: string | null
  readingTime: number | null
  author: {name: string | null} | null
  coverImage: EditorialImage | null
}

type ArticlePageData = {
  article: Article | null
  related: RelatedArticle[]
}

type ArticleMetadata = Pick<Article, 'title' | 'excerpt' | 'publishedAt' | 'coverImage'> & {
  author: {name: string | null} | null
}

type ArticlePageProps = {
  params: Promise<{slug: string}>
}

const articleTypeLabels: Record<string, string> = {
  recensione: 'Recensione',
  intervista: 'Intervista',
  approfondimento: 'Approfondimento',
  retrospettiva: 'Retrospettiva',
  news: 'News',
  reportage: 'Reportage',
  selezione: 'Selezione',
}

const dateFormatter = new Intl.DateTimeFormat('it-IT', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

function typeLabel(value: string | null) {
  return value ? (articleTypeLabels[value] ?? 'Articolo') : 'Articolo'
}

function formatDate(value: string | null) {
  return value ? dateFormatter.format(new Date(value)) : null
}

export async function generateStaticParams() {
  const slugs = await client.withConfig({useCdn: false}).fetch<{slug: string}[]>(ARTICLE_SLUGS_QUERY)

  return slugs.map(({slug}) => ({slug}))
}

export async function generateMetadata({params}: ArticlePageProps): Promise<Metadata> {
  const {slug} = await params
  const {data} = await sanityFetch({
    query: ARTICLE_METADATA_QUERY,
    params: {slug},
    stega: false,
  })
  const article = data as ArticleMetadata | null

  if (!article?.title) {
    return {title: 'Articolo non trovato'}
  }

  const canonical = `${siteUrl}/articoli/${encodeURIComponent(slug)}`
  const image = article.coverImage
    ? urlFor(article.coverImage).width(1200).height(630).fit('crop').auto('format').url()
    : undefined

  return {
    title: `${article.title} | Incontri Ravvicinati`,
    description: article.excerpt ?? undefined,
    alternates: {canonical},
    openGraph: {
      type: 'article',
      url: canonical,
      siteName: 'Incontri Ravvicinati',
      title: article.title,
      description: article.excerpt ?? undefined,
      publishedTime: article.publishedAt ?? undefined,
      authors: article.author?.name ? [article.author.name] : undefined,
      images: image ? [{url: image, alt: article.coverImage?.alt ?? article.title}] : undefined,
    },
  }
}

export default async function ArticlePage({params}: ArticlePageProps) {
  const {slug} = await params
  const {data} = await sanityFetch({query: ARTICLE_PAGE_QUERY, params: {slug}})
  const {article, related} = data as ArticlePageData

  if (!article?.title) {
    notFound()
  }

  const articleUrl = `${siteUrl}/articoli/${encodeURIComponent(slug)}`
  const publicationDate = formatDate(article.publishedAt)
  const heroWidth = article.coverImage?.asset?.metadata?.dimensions?.width ?? 1600
  const heroHeight = article.coverImage?.asset?.metadata?.dimensions?.height ?? 1000
  const heroLqip = article.coverImage?.asset?.metadata?.lqip
  const heroUrl = article.coverImage
    ? urlFor(article.coverImage).width(1800).auto('format').url()
    : null
  const issueLabel = article.issue?.issueNumber
    ? `N. ${String(article.issue.issueNumber).padStart(2, '0')}`
    : article.issue?.title
  const hasAuthorProfile = Boolean(article.author?.bio || article.author?.photo)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || undefined,
    datePublished: article.publishedAt || undefined,
    mainEntityOfPage: articleUrl,
    image: heroUrl ? [heroUrl] : undefined,
    author: article.author?.name
      ? {'@type': 'Person', name: article.author.name}
      : undefined,
    publisher: {'@type': 'Organization', name: 'Incontri Ravvicinati'},
  }

  return (
    <main id="main-content" className="article-page">
      <article>
        <header className="article-header site-container">
          <div className="article-header__eyebrow type-meta">
            <span>{typeLabel(article.articleType)}</span>
            {issueLabel ? <span>{issueLabel}</span> : null}
          </div>

          <h1>{article.title}</h1>

          {article.excerpt ? <p className="article-header__excerpt">{article.excerpt}</p> : null}

          <div className="article-header__byline type-meta">
            <p>
              {article.author?.name ? `Di ${article.author.name}` : 'Autore non disponibile'}
            </p>
            <p>
              {publicationDate}
              {article.readingTime ? ` · ${article.readingTime} min di lettura` : ''}
            </p>
          </div>
        </header>

        {article.coverImage && heroUrl ? (
          <figure className="article-hero">
            <Image
              src={heroUrl}
              alt={article.coverImage.alt ?? article.title}
              width={heroWidth}
              height={heroHeight}
              sizes="(max-width: 767px) 100vw, 1200px"
              priority
              placeholder={heroLqip ? 'blur' : 'empty'}
              blurDataURL={heroLqip}
            />
            {article.coverImage.caption ? (
              <figcaption>{article.coverImage.caption}</figcaption>
            ) : null}
          </figure>
        ) : null}

        <div className="article-reading-column">
          {article.body ? <ArticleBody value={article.body} /> : null}

          {article.tags?.length ? (
            <ul className="article-tags type-meta" aria-label="Tag dell'articolo">
              {article.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          ) : null}

          {hasAuthorProfile && article.author ? (
            <aside className="article-author" aria-labelledby="article-author-heading">
              {article.author.photo ? (
                <div className="article-author__photo">
                  <Image
                    src={urlFor(article.author.photo)
                      .width(240)
                      .height(240)
                      .fit('crop')
                      .auto('format')
                      .url()}
                    alt={article.author.photo.alt ?? article.author.name ?? ''}
                    fill
                    sizes="112px"
                  />
                </div>
              ) : null}
              <div>
                <p className="type-meta">Scritto da</p>
                <h2 id="article-author-heading">{article.author.name}</h2>
                {article.author.role ? <p className="article-author__role type-meta">{article.author.role}</p> : null}
                {article.author.bio ? <p className="article-author__bio">{article.author.bio}</p> : null}
              </div>
            </aside>
          ) : null}
        </div>
      </article>

      <section className="related-articles site-container" aria-labelledby="related-heading">
        <header className="related-articles__header">
          <h2 id="related-heading">Altri articoli</h2>
          <Link className="type-meta" href="/articoli">
            Tutti gli articoli <ArrowIcon />
          </Link>
        </header>

        {related.length ? (
          <div className="related-articles__grid">
            {related.map((item, index) => {
              const itemTitle = item.title ?? 'Titolo non disponibile'
              const itemHref = item.slug ? `/articoli/${item.slug}` : null

              return (
                <article className="related-article" key={item._id}>
                  <div className="related-article__label type-meta">
                    <span>{typeLabel(item.articleType)}</span>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  {item.coverImage ? (
                    itemHref ? (
                      <Link href={itemHref} aria-label={`Leggi ${itemTitle}`}>
                        <div className="related-article__media">
                          <Image
                            src={urlFor(item.coverImage)
                              .width(900)
                              .height(600)
                              .fit('crop')
                              .auto('format')
                              .url()}
                            alt={item.coverImage.alt ?? itemTitle}
                            fill
                            sizes="(max-width: 767px) 100vw, 33vw"
                          />
                        </div>
                      </Link>
                    ) : null
                  ) : null}
                  <h3>{itemHref ? <Link href={itemHref}>{itemTitle}</Link> : itemTitle}</h3>
                  <p className="type-meta">
                    {item.author?.name ?? 'Autore non disponibile'}
                    {item.readingTime ? ` · ${item.readingTime} min` : ''}
                  </p>
                </article>
              )
            })}
          </div>
        ) : null}

        <Link className="article-back-link type-meta" href="/articoli">
          <ArrowIcon direction="left" /> Torna agli articoli
        </Link>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')}}
      />
    </main>
  )
}
