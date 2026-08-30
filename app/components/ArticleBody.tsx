import type {SanityImageSource} from '@sanity/image-url'
import Image from 'next/image'
import {PortableText, type PortableTextBlock, type PortableTextComponents} from 'next-sanity'

import {urlFor} from '@/sanity/lib/image'

type ArticleBodyImage = SanityImageSource & {
  alt?: string | null
  caption?: string | null
  asset?: {
    metadata?: {
      dimensions?: {width?: number; height?: number}
      lqip?: string
    }
  }
}

function BodyImage({value}: {value: ArticleBodyImage}) {
  if (!value?.asset) {
    return null
  }

  const width = value.asset.metadata?.dimensions?.width ?? 1200
  const height = value.asset.metadata?.dimensions?.height ?? 800
  const lqip = value.asset.metadata?.lqip

  return (
    <figure className="article-body__figure">
      <Image
        src={urlFor(value).width(1400).auto('format').url()}
        alt={value.alt ?? ''}
        width={width}
        height={height}
        sizes="(max-width: 767px) 100vw, 760px"
        placeholder={lqip ? 'blur' : 'empty'}
        blurDataURL={lqip}
      />
      {value.caption ? <figcaption>{value.caption}</figcaption> : null}
    </figure>
  )
}

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({children}) => <p>{children}</p>,
    h2: ({children}) => <h2>{children}</h2>,
    h3: ({children}) => <h3>{children}</h3>,
    blockquote: ({children}) => <blockquote>{children}</blockquote>,
  },
  marks: {
    strong: ({children}) => <strong>{children}</strong>,
    em: ({children}) => <em>{children}</em>,
    link: ({children, value}) => {
      const href = typeof value?.href === 'string' ? value.href : '#'
      const isExternal = /^https?:\/\//i.test(href)

      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      )
    },
  },
  list: {
    bullet: ({children}) => <ul>{children}</ul>,
    number: ({children}) => <ol>{children}</ol>,
  },
  types: {
    image: ({value}) => <BodyImage value={value as ArticleBodyImage} />,
  },
}

export function ArticleBody({value}: {value: PortableTextBlock[]}) {
  if (!Array.isArray(value) || value.length === 0) {
    return null
  }

  return (
    <div className="article-body">
      <PortableText value={value} components={portableTextComponents} />
    </div>
  )
}
