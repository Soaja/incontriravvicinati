import {NextRequest, NextResponse} from 'next/server'
import {revalidatePath, revalidateTag} from 'next/cache'
import {parseBody} from 'next-sanity/webhook'
import {SANITY_CACHE_TAG} from '@/sanity/lib/cache'

const types = ['article', 'author', 'rubrica', 'issue', 'siteSettings', 'sectionSettings', 'sanity.imageAsset']
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) return NextResponse.json({error: 'Webhook non configurato'}, {status: 503})
  try {
    const {body, isValidSignature} = await parseBody<{_id?: string; _type?: string}>(request, secret, true)
    if (!isValidSignature) return NextResponse.json({error: 'Firma non valida'}, {status: 401})
    if (!body?._id || !body._type || !types.includes(body._type) || /^(drafts|versions)\./.test(body._id)) {
      return NextResponse.json({error: 'Documento non valido'}, {status: 400})
    }
    revalidateTag(SANITY_CACHE_TAG, {expire: 0})
    revalidatePath('/', 'layout')
    revalidatePath('/sitemap.xml')
    return NextResponse.json({revalidated: true})
  } catch {
    return NextResponse.json({error: 'Richiesta non valida'}, {status: 400})
  }
}
