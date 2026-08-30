'use client'

import Link from 'next/link'
import {useRef, useState} from 'react'

import {BrandLogo} from './BrandLogo'

const navigation = [
  {href: '/', label: 'Homepage'},
  {href: '/articoli', label: 'Articoli'},
  {href: '/chi-siamo', label: 'Chi siamo'},
  {href: '/redazione', label: 'Redazione'},
  {href: '/contatti', label: 'Contatti'},
]

export function Header() {
  const navigationRef = useRef<HTMLUListElement>(null)
  const [isAtEnd, setIsAtEnd] = useState(false)

  function updateScrollState() {
    const navigationElement = navigationRef.current

    if (!navigationElement) return

    setIsAtEnd(
      navigationElement.scrollLeft + navigationElement.clientWidth >=
        navigationElement.scrollWidth - 2,
    )
  }

  function scrollNavigation() {
    const navigationElement = navigationRef.current

    if (!navigationElement) return

    if (isAtEnd) {
      navigationElement.scrollTo({left: 0, behavior: 'smooth'})
      return
    }

    navigationElement.scrollBy({left: navigationElement.clientWidth, behavior: 'smooth'})
  }

  return (
    <header className="site-header">
      <div className="site-container">
        <div className="site-header__utility">
          <p className="type-meta">Cinema indipendente · Cultura visiva</p>
          <nav className="site-nav-shell" aria-label="Navigazione principale">
            <ul className="site-nav" ref={navigationRef} onScroll={updateScrollState}>
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
            <button
              className={`site-nav__scroll${isAtEnd ? ' site-nav__scroll--back' : ''}`}
              type="button"
              onClick={scrollNavigation}
              aria-label={isAtEnd ? 'Torna all’inizio della navigazione' : 'Mostra altre pagine'}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </nav>
        </div>

        <Link className="site-brand" href="/" aria-label="Incontri Ravvicinati, home">
          <BrandLogo variant="positive" priority />
        </Link>
      </div>
    </header>
  )
}
