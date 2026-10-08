import {NextRequest, NextResponse} from 'next/server'
import {searchParameters} from '@/app/lib/search'
import {searchPageQuery} from '@/sanity/lib/archive'
import {sanityFetch} from '@/sanity/lib/live'
import type {SearchHit} from '@/app/components/SearchResults'

export async function GET(request: NextRequest) {
  const search = searchParameters(request.nextUrl.searchParams.get('q') ?? '')
  if (!search.searchable) return NextResponse.json({articles: []})
  try {
    const {data: articles} = await sanityFetch<SearchHit[]>({query: searchPageQuery(1, 6), params: {terms: search.terms, sectionKeys: search.sectionKeys}})
    return NextResponse.json({articles}, {headers: {'X-Robots-Tag': 'noindex', 'Cache-Control': 'no-store'}})
  } catch {
    return NextResponse.json({error: 'La ricerca non è disponibile. Riprova.'}, {status: 503})
  }
}
