import Link from 'next/link'

import {BrandLogo} from './BrandLogo'

const navigation = [
  {href: '/', label: 'Homepage'},
  {href: '/articoli', label: 'Articoli'},
  {href: '/chi-siamo', label: 'Chi siamo'},
  {href: '/redazione', label: 'Redazione'},
  {href: '/contatti', label: 'Contatti'},
]

export function Header() {
  return (
    <header className="site-header">
      <div className="site-container">
        <div className="site-header__utility">
          <p className="type-meta">Cinema indipendente · Cultura visiva</p>
          <nav aria-label="Navigazione principale">
            <ul className="site-nav">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Link className="site-brand" href="/" aria-label="Incontri Ravvicinati, home">
          <BrandLogo variant="positive" priority />
        </Link>
      </div>
    </header>
  )
}
