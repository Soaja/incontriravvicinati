import {sanityFetch} from '@/sanity/lib/live'
import {RSS_QUERY} from '@/sanity/lib/feeds'
import {rssXml, type FeedArticle} from '@/app/lib/feeds'
export const revalidate = 60
export async function GET() {
  const {data} = await sanityFetch<FeedArticle[]>({query: RSS_QUERY})
  return new Response(rssXml(data), {headers: {'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=60'}})
}
