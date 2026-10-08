import Image from 'next/image'
import Link from 'next/link'
import type {SanityImageSource} from '@sanity/image-url'
import {getSanityImageUrl} from '@/sanity/lib/image'
import {sectionLabel} from '@/app/lib/sections'
import {ArticleTitle} from './ArticleTitle'
import type {ArticlePeople} from './AuthorLinks'
import {RubricaLabel, type Rubrica} from './RubricaLabel'

export type SearchHit = ArticlePeople & {
  _id: string; title: string; slug: string; articleType: string | null; publishedAt: string | null
  coverImage: (SanityImageSource & {alt?: string | null}) | null
  rubrica?: Rubrica | null
}
const date = new Intl.DateTimeFormat('it-IT', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'})

export function SearchResults({articles, selected = -1, interactive = false, onChoose, onSelect}: {
  articles: SearchHit[]; selected?: number; interactive?: boolean; onChoose?: () => void; onSelect?: (index: number) => void
}) {
  return <ul className="search-results" id={interactive ? 'search-suggestions' : undefined} role={interactive ? 'listbox' : undefined} aria-label="Risultati della ricerca">
    {articles.map((article, index) => {
      const image = getSanityImageUrl(article.coverImage, builder => builder.width(240).height(160).fit('crop').auto('format').url())
      return <li key={article._id}>
        <Link className={`search-result${selected === index ? ' search-result--selected' : ''}`} href={`/articoli/${encodeURIComponent(article.slug)}`}
          id={interactive ? `search-option-${index}` : undefined} role={interactive ? 'option' : undefined} aria-selected={interactive ? selected === index : undefined}
          onClick={onChoose} onMouseEnter={onSelect ? () => onSelect(index) : undefined}>
          <div className="search-result__image">{image ? <Image src={image} alt={article.coverImage?.alt ?? ''} width={120} height={80} sizes="(max-width: 767px) 72px, 120px" /> : <span aria-hidden="true">IR</span>}</div>
          <div className="search-result__text">
            <p className="type-meta">{sectionLabel(article.articleType)}</p>
            <h2><ArticleTitle text={article.title} /></h2>
            <p className="type-meta">{[article.author, ...(article.authors ?? [])].filter((author, i, authors) => author?.name && authors.findIndex(a => a?.name === author.name) === i).map(author => author?.name?.trim()).join(', ')}{article.publishedAt ? ` · ${date.format(new Date(article.publishedAt))}` : ''}</p>
          </div>
        </Link>
        {!interactive && article.rubrica ? <p className="search-result__rubrica type-meta"><RubricaLabel rubrica={article.rubrica} /></p> : null}
      </li>
    })}
  </ul>
}
