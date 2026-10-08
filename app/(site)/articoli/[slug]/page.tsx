import {AuthorLinks, articleAuthors, authorHref, type Author} from '@/app/components/AuthorLinks'
import {AuthorPhoto} from '@/app/components/AuthorPhoto'
import {RubricaLabel, type Rubrica} from '@/app/components/RubricaLabel'
import {sectionLabel, sections} from '@/app/lib/sections'
import {metaDescription, publisher, seoAlternates} from '@/app/lib/seo'
import {ArticleTitle} from '@/app/components/ArticleTitle'
import type {SanityImageSource} from '@sanity/image-url'
import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'

import {ArrowIcon} from '@/app/components/ArrowIcon'
import {notFound} from 'next/navigation'
import type {PortableTextBlock} from 'next-sanity'

import {ArticleBody} from '@/app/components/ArticleBody'
import {client} from '@/sanity/lib/client'
import {getSanityImageUrl, imageDimensions, urlFor} from '@/sanity/lib/image'
import {sanityFetch} from '@/sanity/lib/live'
import {
  ARTICLE_METADATA_QUERY,
  ARTICLE_PAGE_QUERY,
  ARTICLE_SLUGS_QUERY,
} from '@/sanity/lib/queries'

import {siteUrl} from '@/app/lib/site-url'

export const revalidate = 60
export const dynamicParams = true

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
  _id?: string
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
  rubrica?: Rubrica | null
  authors?: Author[] | null
  publishedAt: string | null
  _updatedAt: string | null
  readingTime: number | null
  tags: string[] | null
  coverImage: EditorialImage | null
  body: PortableTextBlock[] | null
  author: ArticleAuthor | null
  issue: ArticleIssue | null
}

type RelatedArticle = {
  rubrica?: Rubrica | null
  authors?: Author[] | null
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

type ArticleMetadata = Pick<Article, 'title' | 'excerpt' | 'publishedAt' | '_updatedAt' | 'coverImage' | 'articleType'> & {
  author: Author | null
  authors?: Author[] | null
}

type ArticlePageProps = {
  params: Promise<{slug: string}>
}

const dateFormatter = new Intl.DateTimeFormat('it-IT', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

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
  const title = article.title.trim()
  const description = metaDescription(article.excerpt?.trim() || article.title)
  const image =
    getSanityImageUrl(article.coverImage, (imageBuilder) =>
      imageBuilder.width(1200).height(630).fit('crop').auto('format').url(),
    ) ?? undefined

  return {
    title: `${title} | Incontri Ravvicinati`,
    description,
    alternates: seoAlternates(canonical),
    openGraph: {
      type: 'article',
      url: canonical,
      siteName: 'Incontri Ravvicinati',
      title,
      description,
      publishedTime: article.publishedAt ?? undefined,
      modifiedTime: article._updatedAt ?? undefined,
      authors: articleAuthors(article).flatMap(author => authorHref(author) ? [siteUrl + authorHref(author)] : []),
      section: sectionLabel(article.articleType),
      images: image ? [{url: image, width: 1200, height: 630, alt: article.coverImage?.alt?.trim() || article.title}] : undefined,
    },
    twitter: {card: 'summary_large_image', title, description,
      images: image ? [{url: image, width: 1200, height: 630, alt: article.coverImage?.alt?.trim() || article.title}] : undefined},
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
  const {width: heroWidth, height: heroHeight} = article.coverImage ? imageDimensions(article.coverImage) : {width: 1600, height: 1000}
  const heroLqip = article.coverImage?.asset?.metadata?.lqip
  const heroUrl = getSanityImageUrl(article.coverImage, (imageBuilder) =>
    imageBuilder.width(1800).auto('format').url(),
  )
  const issueLabel = article.issue?.issueNumber
    ? `N. ${String(article.issue.issueNumber).padStart(2, '0')}`
    : article.issue?.title
  const authors = articleAuthors(article)
  const section = sections.find(section => section.value === article.articleType)
  const sectionUrl = `${siteUrl}/articoli${section ? `?type=${section.slug}` : ''}`
  const breadcrumbs = [{name: 'Homepage', url: siteUrl}, {name: section?.label ?? 'Articoli', url: sectionUrl}, {name: article.title, url: articleUrl}]
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title.trim(),
    description: metaDescription(article.excerpt?.trim() || article.title),
    datePublished: article.publishedAt || undefined,
    dateModified: article._updatedAt || undefined,
    mainEntityOfPage: articleUrl,
    image: heroUrl ? [1200, 900, 675].flatMap(height => {
      const image = getSanityImageUrl(article.coverImage, builder => builder.width(1200).height(height).fit('crop').auto('format').url())
      return image ? [image] : []
    }) : undefined,
    author: authors.map(author => ({'@type': 'Person', name: author.name?.trim(), url: authorHref(author) ? `${siteUrl}${authorHref(author)}` : undefined})),
    publisher,
    articleSection: sectionLabel(article.articleType),
    inLanguage: 'it-IT',
  }

  return (
    <main id="main-content" className="article-page">
      <article>
        <header className="article-header site-container">
          <nav className="article-breadcrumbs type-meta" aria-label="Percorso di navigazione"><ol>{breadcrumbs.map((crumb, index) => <li key={crumb.url}>{index < breadcrumbs.length - 1 ? <Link href={crumb.url.replace(siteUrl, '') || '/'}>{crumb.name}</Link> : <span aria-current="page">{crumb.name}</span>}</li>)}</ol></nav>
          <div className="article-header__eyebrow type-meta">
            <span><Link href={sectionUrl.replace(siteUrl, '')}>{sectionLabel(article.articleType)}</Link><RubricaLabel rubrica={article.rubrica} /></span>
            {issueLabel ? <span>{issueLabel}</span> : null}
          </div>

          <h1><ArticleTitle text={article.title} /></h1>

          {article.excerpt ? <p className="article-header__excerpt">{article.excerpt}</p> : null}

          <div className="article-header__byline type-meta">
            <p>
              <AuthorLinks article={article} />
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
              alt={article.coverImage.alt?.trim() || article.title}
              width={heroWidth}
              height={heroHeight}
              sizes="(max-width: 767px) 100vw, 1200px"
              loading="eager"
              fetchPriority="high"
              quality={60}
              placeholder={heroLqip ? 'blur' : 'empty'}
              blurDataURL={heroLqip}
            />
            {article.coverImage.caption ? (
              <figcaption>{article.coverImage.caption}</figcaption>
            ) : null}
          </figure>
        ) : null}

        <div className="article-reading-column">
          {article.body ? <ArticleBody value={article.body} title={article.title} /> : null}

          {article.tags?.length ? (
            <ul className="article-tags type-meta" aria-label="Tag dell'articolo">
              {article.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          ) : null}

          {authors.map(author => (
            <aside className="article-author" key={author._id || author.slug || author.name} aria-label="Profilo autore">
              <AuthorPhoto author={author} />
              <div>
                <p className="type-meta">Scritto da</p>
                <h2><AuthorLinks article={{author}} /></h2>
                {author.role ? <p className="article-author__role type-meta">{author.role}</p> : null}
                {author.bio ? <p className="article-author__bio">{author.bio}</p> : null}
              </div>
            </aside>
          ))}
        </div>
      </article>

      <section className="related-articles site-container" aria-labelledby="related-heading">
        <header className="related-articles__header">
          <h2 id="related-heading">Leggi anche</h2>
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
                    <span>{sectionLabel(item.articleType)}<RubricaLabel rubrica={item.rubrica} /></span>
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
                            alt={item.coverImage.alt?.trim() || itemTitle}
                            fill
                            sizes="(max-width: 767px) 100vw, 33vw"
                          />
                        </div>
                      </Link>
                    ) : null
                  ) : null}
                  <h3>{itemHref ? <Link href={itemHref}><ArticleTitle text={itemTitle} /></Link> : <ArticleTitle text={itemTitle} />}</h3>
                  <p className="type-meta">
                    <AuthorLinks article={item} />
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
        dangerouslySetInnerHTML={{__html: JSON.stringify([jsonLd, {'@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: breadcrumbs.map((crumb, index) => ({'@type': 'ListItem', position: index + 1, name: crumb.name, item: crumb.url}))}]).replace(/</g, '\\u003c')}}
      />
    </main>
  )
}
