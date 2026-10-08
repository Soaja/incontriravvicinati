import Image from 'next/image'
import {getSanityImageUrl} from '@/sanity/lib/image'
import type {Author} from './AuthorLinks'

export function AuthorPhoto({author, size = 112}: {author: Author; size?: number}) {
  const url = getSanityImageUrl(author.photo, image => image.width(size * 2).height(size * 2).fit('crop').auto('format').url())
  const initials = (author.name ?? '').trim().split(/\s+/).filter(Boolean).map(word => Array.from(word)[0]).slice(0, 2).join('') || 'IR'
  return <span className="author-photo" style={{width: size, height: size}}>
    {url ? <Image src={url} alt={author.photo?.alt || `Ritratto di ${author.name?.trim()}`} width={size} height={size} loading="lazy" /> :
      <span className="author-photo__initials" role="img" aria-label={`Ritratto non disponibile: ${author.name?.trim() ?? 'Autore'}`}>{initials}</span>}
  </span>
}
