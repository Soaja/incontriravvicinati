import {NextRequest, NextResponse} from 'next/server'

export function proxy(request: NextRequest) {
  const response = NextResponse.next()
  const host = (request.headers.get('host') ?? request.nextUrl.host).split(':')[0].toLowerCase()
  if (host !== 'www.incontriravvicinatimag.it' || process.env.VERCEL_ENV === 'preview') {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }
  return response
}
