import {defineQuery} from 'next-sanity'
import {ARTICLES_PER_PAGE} from '@/app/lib/pagination'

const articlePeopleFields = /* groq */ `
  author->{_id, name, "slug": slug.current, role, bio, photo{asset->{_id, url, metadata{dimensions, lqip}}, crop, hotspot, alt}},
  "authors": array::compact([author, ...coalesce(authors, [])])[]->{
    _id, name, "slug": slug.current, role, bio, photo{asset->{_id, url, metadata{dimensions, lqip}}, crop, hotspot, alt}
  }
`

export const articleSummaryFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  articleType,
  publishedAt,
  readingTime,
  rubrica->{title, "slug": slug.current},
  ${articlePeopleFields}
`

export const HOMEPAGE_QUERY = defineQuery(/* groq */ `
  {
    "latestArticles": *[
      _type == "article" &&
      defined(publishedAt) &&
      publishedAt <= now()
    ] | order(publishedAt desc, _id asc)[0...3] {
      ${articleSummaryFields},
      "coverImage": select(
        defined(coverImage.asset._ref) => coverImage {
          asset,
          crop,
          hotspot,
          alt
        },
        null
      )
    },
    "latestReviews": *[
      _type == "article" &&
      articleType == "recensione" &&
      defined(publishedAt) &&
      publishedAt <= now()
    ] | order(publishedAt desc, _id asc)[0...4] {
      ${articleSummaryFields},
      "coverImage": select(
        defined(coverImage.asset._ref) => coverImage {
          asset,
          crop,
          hotspot,
          alt
        },
        null
      )
    },
    "featuredLongform": *[
      _type == "article" &&
      articleType in ["intervista", "approfondimento"] &&
      defined(publishedAt) &&
      publishedAt <= now()
    ] | order(publishedAt desc, _id asc)[0] {
      ${articleSummaryFields},
      excerpt,
      "coverImage": select(
        defined(coverImage.asset._ref) => coverImage {
          asset,
          crop,
          hotspot,
          alt
        },
        null
      )
    }
  }
`)

export const FEATURED_ISSUE_QUERY = defineQuery(/* groq */ `
  *[
    _type == "issue" &&
    featured == true &&
    defined(publicationDate) &&
    publicationDate <= now()
  ] | order(publicationDate desc, issueNumber desc, _id asc)[0] {
    _id,
    title,
    issueNumber,
    publicationDate,
    description,
    pageCount,
    "coverImage": select(
      defined(coverImage.asset._ref) => coverImage {
        asset,
        crop,
        hotspot,
        alt
      },
      null
    ),
    "pdfUrl": pdfFile.asset->url
  }
`)

export const EDITORIAL_TEAM_QUERY = defineQuery(/* groq */ `
  *[
    _type == "author" &&
    showInEditorialTeam == true
  ] | order(coalesce(order, 9999) asc, name asc, _id asc) {
    _id,
    name,
    "slug": slug.current,
    role,
    bio,
    order,
    "photo": select(
      defined(photo.asset._ref) => photo {
        asset->{_id, url, metadata{dimensions, lqip}},
        crop,
        hotspot,
        alt
      },
      null
    )
  }
`)

export const EDITORIAL_TEAM_ASSETS_QUERY = defineQuery(/* groq */ `
  *[
    _type == "author"
  ] {
    _id,
    name,
    "slug": slug.current,
    role,
    bio,
    "photo": select(
      defined(photo.asset._ref) => photo {
        asset->{_id, url, metadata{dimensions, lqip}},
        crop,
        hotspot,
        alt
      },
      null
    )
  }
`)

export const SITE_SETTINGS_QUERY = defineQuery(/* groq */ `
  *[_type == "siteSettings"] | order(_updatedAt desc, _id asc)[0] {
    contactEmail,
    instagramUrl,
    footerText
  }
`)

export const ARTICLES_PAGE_QUERY = defineQuery(/* groq */ `
  *[
    _type == "article" &&
    defined(publishedAt) &&
    publishedAt <= now() &&
    ($articleType == "" || articleType == $articleType) &&
    ($authorSlug == "" || author->slug.current == $authorSlug || author._ref == $authorSlug ||
      count(authors[@._ref == $authorSlug || @->slug.current == $authorSlug]) > 0) &&
    ($rubricaSlug == "" || rubrica->slug.current == $rubricaSlug)
  ] | order(publishedAt desc, _id asc)[0...${ARTICLES_PER_PAGE}] {
    ${articleSummaryFields},
    excerpt,
    "coverImage": select(
      defined(coverImage.asset._ref) => coverImage {
        asset,
        crop,
        hotspot,
        alt
      },
      null
    )
  }
`)

export const ARTICLE_SLUGS_QUERY = defineQuery(/* groq */ `
  *[
    _type == "article" &&
    defined(slug.current) &&
    defined(publishedAt) &&
    publishedAt <= now()
  ]{"slug": slug.current}
`)

export const SITEMAP_ARTICLES_QUERY = defineQuery(/* groq */ `
  *[
    _type == "article" &&
    defined(slug.current) &&
    defined(publishedAt) &&
    publishedAt <= now()
  ] | order(publishedAt desc, _id asc) {
    "slug": slug.current,
    _updatedAt
  }
`)

export const ARTICLE_METADATA_QUERY = defineQuery(/* groq */ `
  *[
    _type == "article" &&
    slug.current == $slug &&
    defined(publishedAt) &&
    publishedAt <= now()
  ][0] {
    title,
    _updatedAt,
    excerpt,
    publishedAt,
    ${articlePeopleFields},
    "coverImage": select(
      defined(coverImage.asset._ref) => coverImage {
        asset,
        crop,
        hotspot,
        alt
      },
      null
    )
  }
`)

export const ARTICLE_PAGE_QUERY = defineQuery(/* groq */ `
  {
    "article": *[
      _type == "article" &&
      slug.current == $slug &&
      defined(publishedAt) &&
      publishedAt <= now()
    ][0] {
      _id,
      title,
      _updatedAt,
      "slug": slug.current,
      excerpt,
      articleType,
      publishedAt,
      readingTime,
      tags,
      "coverImage": select(
        defined(coverImage.asset._ref) => coverImage {
          asset->{_id, url, metadata{dimensions, lqip}},
          crop,
          hotspot,
          alt,
          caption
        },
        null
      ),
      body[]{
        ...,
        _type == "image" => {
          asset->{_id, url, metadata{dimensions, lqip}},
          crop,
          hotspot,
          alt,
          caption,
          credit,
          fullWidth
        }
      },
      rubrica->{title, "slug": slug.current},
      ${articlePeopleFields},
      "issue": *[
        _type == "issue" &&
        references(^._id)
      ] | order(publicationDate desc, issueNumber desc)[0] {
        title,
        issueNumber
      }
    },
    "related": *[
      _type == "article" &&
      slug.current != $slug &&
      defined(slug.current) &&
      defined(publishedAt) &&
      publishedAt <= now()
    ] | order(publishedAt desc, _id asc)[0...3] {
      ${articleSummaryFields},
      "coverImage": select(
        defined(coverImage.asset._ref) => coverImage {
          asset,
          crop,
          hotspot,
          alt
        },
        null
      )
    }
  }
`)

export const SECTION_ORDER_QUERY = defineQuery(/* groq */ `
  *[_type == "sectionSettings" && _id == "sectionSettings"][0]{"order": order[].section}
`)

export const RUBRICA_QUERY = defineQuery(/* groq */ `
  *[_type == "rubrica" && slug.current == $slug][0]{title, "slug": slug.current, description}
`)

export const AUTHOR_QUERY = defineQuery(/* groq */ `
  *[_type == "author" && (slug.current == $slug || _id == $slug)][0]{
    _id, name, "slug": slug.current, role, bio, photo{asset->{_id, url, metadata{dimensions, lqip}}, crop, hotspot, alt}
  }
`)
