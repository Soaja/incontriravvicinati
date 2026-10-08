import Link from 'next/link'
import type {SanityImageSource} from '@sanity/image-url'

export type Author = {
  _id?: string
  name: string | null
  slug?: string | null
  role?: string | null
  bio?: string | null
  photo?: (SanityImageSource & {alt?: string | null}) | null
}
export type ArticlePeople = {author?: Author | null; authors?: (Author | null)[] | null}

export function articleAuthors(article: ArticlePeople) {
  const seen = new Set<string>()
  return [article.author, ...(article.authors ?? [])].flatMap(author => {
    if (!author?.name) return []
    const key = author._id || author.slug || author.name.trim()
    if (seen.has(key)) return []
    seen.add(key)
    return [author]
  })
}

export function authorHref(author: Author) {
  const key = author.slug?.trim() || author._id
  return key ? `/articoli?author=${encodeURIComponent(key)}` : null
}

export function AuthorLinks({article}: {article: ArticlePeople}) {
  const authors = articleAuthors(article)
  if (!authors.length) return <>Autore non disponibile</>
  return <>{authors.map((author, index) => {
    const href = authorHref(author)
    return <span key={author._id || author.slug || author.name}>
      {index ? ' · ' : null}
      {href ? <Link className="author-link" href={href}>{author.name?.trim()}</Link> : author.name}
    </span>
  })}</>
}
