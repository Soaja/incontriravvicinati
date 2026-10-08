import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2026-08-17',
  useCdn: false,
})

// Read-only: never create, patch or delete Sanity documents.
const result = await client.fetch(`{
  "authors": *[_type == "author"] | order(name asc) {
    _id, name, "slug": slug.current,
    "publishedArticles": count(*[_type == "article" && author._ref == ^._id && publishedAt <= now()])
  },
  "titles": *[_type == "article" && publishedAt <= now()] | order(publishedAt desc)[0...8] {title, "slug": slug.current}
}`)
console.log(JSON.stringify(result, null, 2))
