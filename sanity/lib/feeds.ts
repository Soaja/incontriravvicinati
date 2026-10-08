import {defineQuery} from 'next-sanity'
import {publishedFilter} from './archive'
export const RSS_QUERY = defineQuery(`*[${publishedFilter}] | order(publishedAt desc, _id asc)[0...30]{title, "slug": slug.current, excerpt, publishedAt, _updatedAt, "authorNames": array::compact([author->name, ...coalesce(authors[]->name, [])])}`)
export const NEWS_QUERY = defineQuery(`*[${publishedFilter} && dateTime(publishedAt) >= dateTime(now()) - 172800] | order(publishedAt desc, _id asc)[0...1000]{title, "slug": slug.current, publishedAt}`)
