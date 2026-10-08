import {createClient} from '@sanity/client'
import {createImageUrlBuilder} from '@sanity/image-url'

const client = createClient({projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET, apiVersion: '2026-08-17', useCdn: false})
const result = await client.fetch(`{
  "sections": array::unique(*[_type == "article"].articleType),
  "columns": count(*[_type == "rubrica"]),
  "images": *[_type == "article" && count(body[_type == "image"]) > 0][0...3]{title, "slug": slug.current, "image": body[_type == "image"][0]{..., asset->{_id, url, metadata{dimensions}}}},
  "photos": *[_type == "author" && defined(photo.asset)]{name, "slug": slug.current, photo},
  "asset": *[_type == "sanity.imageAsset"][0]{_id, url, metadata{dimensions}},
  "primary": *[_type == "article" && defined(publishedAt)][0]{title, "slug": slug.current, author->{_id, name, "slug": slug.current}}
}`)
console.log(JSON.stringify(result, null, 2))
const builder = createImageUrlBuilder(client)
if (result.asset) {
  try {builder.image({asset: {metadata: result.asset.metadata}}).url()} catch (error) {console.log('OLD PROJECTION FAILS:', error.message)}
  console.log('FIXED PROJECTION:', builder.image({asset: result.asset}).width(800).url())
}
// This script performs public reads only; it never patches or uploads content.
