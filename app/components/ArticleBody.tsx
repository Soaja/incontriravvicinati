import type {SanityImageSource} from '@sanity/image-url'
import Image from 'next/image'
import {PortableText, type PortableTextBlock, type PortableTextComponents} from 'next-sanity'

import {getSanityImageUrl, hasValidImageReference, imageDimensions} from '@/sanity/lib/image'

type ArticleBodyImage = SanityImageSource & {
  alt?: string | null
  caption?: string | null
  credit?: string | null
  fullWidth?: boolean | null
  asset?: {
    metadata?: {
      dimensions?: {width?: number; height?: number}
      lqip?: string
    }
  }
}

function BodyImage({value}: {value: ArticleBodyImage}) {
  if (!hasValidImageReference(value)) {
    return null
  }

  const asset = value.asset

  if (!asset || typeof asset !== 'object') {
    return null
  }

  const {width, height} = imageDimensions(value)
  const lqip = asset.metadata?.lqip
  const imageUrl = getSanityImageUrl(value, (imageBuilder) =>
    imageBuilder.width(1400).auto('format').url(),
  )

  if (!imageUrl) {
    return null
  }

  return (
    <figure className={`article-body__figure${value.fullWidth ? ' article-body__figure--full-width' : ''}`}>
      <Image
        src={imageUrl}
        alt={value.alt ?? ''}
        width={width}
        height={height}
        sizes={value.fullWidth ? '(max-width: 767px) 100vw, 1200px' : '(max-width: 767px) 100vw, 740px'}
        loading="lazy"
        placeholder={lqip ? 'blur' : 'empty'}
        blurDataURL={lqip}
      />
      {value.caption || value.credit ? <figcaption>
        {value.caption ? <span>{value.caption}</span> : null}
        {value.credit ? <span className="article-body__credit">Foto: {value.credit}</span> : null}
      </figcaption> : null}
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
