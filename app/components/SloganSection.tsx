import Link from 'next/link'

import {ArrowIcon} from './ArrowIcon'

export function SloganSection() {
  return (
    <section className="slogan-section" aria-labelledby="slogan-heading">
      <header className="slogan-section__header">
        <p className="type-meta">Manifesto</p>
        <span className="type-meta">Incontri Ravvicinati / 01</span>
      </header>

      <div className="slogan-section__composition">
        <h2 id="slogan-heading" className="slogan-section__title">
          <span className="sr-only">Il cinema si racconta meglio se ci si prende del tempo.</span>
          <span aria-hidden="true">
            <span className="slogan-section__line slogan-section__line--small">Il</span>
            <span className="slogan-section__line slogan-section__line--expressive">Cinema</span>
            <span className="slogan-section__line">si racconta</span>
            <span className="slogan-section__line">
              <span className="slogan-section__word--expressive">meglio</span> se
            </span>
            <span className="slogan-section__line">ci si prende</span>
            <span className="slogan-section__line">
              del <span className="slogan-section__word--expressive">tempo.</span>
            </span>
          </span>
        </h2>

        <div className="slogan-section__footer">
          <p className="type-meta">Cinema, cultura visiva, tempo per guardare.</p>
          <Link className="slogan-section__cta type-meta" href="/chi-siamo">
            Scopri chi siamo <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  )
}
