import {sanityFetch} from '@/sanity/lib/live'
import {NEWS_QUERY} from '@/sanity/lib/feeds'
import {newsXml, type FeedArticle} from '@/app/lib/feeds'
export const revalidate = 60
export async function GET() {
  const {data} = await sanityFetch<FeedArticle[]>({query: NEWS_QUERY})
  return new Response(newsXml(data), {headers: {'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=60'}})
}
