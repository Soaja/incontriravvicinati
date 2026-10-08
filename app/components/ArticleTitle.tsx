import type {CSSProperties} from 'react'

/** Keep each word and its adjacent quotes/punctuation together at line breaks. */
export function ArticleTitle({text}: {text: string | null}) {
  const words = (text ?? '').trim().split(/\s+/)
  const longestWord = Math.max(1, ...words.map((word) => Array.from(word).length))

  return (
    <span className="article-title" style={{'--title-word-length': longestWord} as CSSProperties}>
      {words.map((word, index) => (
        <span key={index}>
          {index > 0 ? ' ' : null}
          <span className="article-title__word">{word}</span>
        </span>
      ))}
    </span>
  )
}
