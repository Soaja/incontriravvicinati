'use client'

import Link from 'next/link'
import {useRef, useState} from 'react'

type ArticleFilter = {
  value: string
  label: string
}

type ArticleFiltersProps = {
  options: readonly ArticleFilter[]
  activeValue: string
  hasAuthorFilter: boolean
}

export function ArticleFilters({
  options,
  activeValue,
  hasAuthorFilter,
}: ArticleFiltersProps) {
  const filtersRef = useRef<HTMLUListElement>(null)
  const [isAtEnd, setIsAtEnd] = useState(false)

  function updateScrollState() {
    const filtersElement = filtersRef.current

    if (!filtersElement) return

    setIsAtEnd(
      filtersElement.scrollLeft + filtersElement.clientWidth >= filtersElement.scrollWidth - 2,
    )
  }

  function scrollFilters() {
    const filtersElement = filtersRef.current

    if (!filtersElement) return

    if (isAtEnd) {
      filtersElement.scrollTo({left: 0, behavior: 'smooth'})
      return
    }

    filtersElement.scrollBy({left: filtersElement.clientWidth, behavior: 'smooth'})
  }

  return (
    <nav className="article-filters" aria-label="Filtra gli articoli per tipologia">
      <p className="type-meta">Esplora per tipologia</p>
      <div className="article-filters__shell">
        <ul ref={filtersRef} onScroll={updateScrollState}>
          {options.map((type) => {
            const href = type.value ? `/articoli?type=${type.value}` : '/articoli'
            const isActive = type.value === activeValue && !hasAuthorFilter

            return (
              <li key={type.value || 'all'}>
                <Link href={href} aria-current={isActive ? 'page' : undefined}>
                  {type.label}
                </Link>
              </li>
            )
          })}
        </ul>
        <button
          className={`article-filters__scroll${
            isAtEnd ? ' article-filters__scroll--back' : ''
          }`}
          type="button"
          onClick={scrollFilters}
          aria-label={isAtEnd ? 'Torna ai primi filtri' : 'Mostra altri filtri'}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </nav>
  )
}
