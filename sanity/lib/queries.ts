import {defineQuery} from 'next-sanity'

const articleSummaryFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  articleType,
  publishedAt,
  readingTime,
  author->{name}
`

export const HOMEPAGE_QUERY = defineQuery(/* groq */ `
  {
    "latestArticles": *[
      _type == "article" &&
      defined(publishedAt) &&
      publishedAt <= now()
    ] | order(publishedAt desc, _id asc)[0...6] {
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
