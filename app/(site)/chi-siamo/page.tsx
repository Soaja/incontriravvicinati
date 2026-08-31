import type {Metadata} from 'next'
import Link from 'next/link'

import {ArrowIcon} from '@/app/components/ArrowIcon'

export const metadata: Metadata = {
  title: 'Chi siamo',
  description: 'Il progetto editoriale di Incontri Ravvicinati.',
}

const principles = [
  {
    title: 'Oltre lo schermo',
    description:
      'Il film come veicolo di espressione e confronto.',
  },
  {
    title: 'Critica indipendente',
    description:
      'Uno spazio libero dove offrire analisi e riflessioni ragionate.',
  },
  {
    title: 'Nuove prospettive',
    description:
      'Attenzione alle nuove voci, ai linguaggi emergenti e all’evoluzione del mezzo cinematografico.',
  },
]

export default function ChiSiamoPage() {
  return (
    <main id="main-content" className="site-container about-page">
      <header className="about-hero">
        <div className="about-hero__label">
          <p className="type-meta">Manifesto / Il progetto</p>
          <span aria-hidden="true">03</span>
        </div>

        <h1>Chi siamo</h1>
        <p className="about-hero__intro">
          Incontri Ravvicinati è un progetto editoriale indipendente dedicato al cinema e al
          mondo dell&apos;audiovisivo. Uno spazio di condivisione dove sguardi diversi si
          incontrano.
        </p>
      </header>

      <section className="about-definition" aria-labelledby="about-definition-heading">
        <div className="about-section-label">
          <p className="type-meta">Identità / 01</p>
        </div>
        <h2 id="about-definition-heading">Cos&apos;è Incontri Ravvicinati</h2>
        <p>
          Nasce dal desiderio di parlare di cinema con un punto di vista libero e inedito e un
          approccio improntato alla qualità e all’approfondimento.
        </p>
      </section>

      <section className="about-principles" aria-labelledby="about-principles-heading">
        <header className="about-principles__header">
          <p className="type-meta">Principi editoriali / 02</p>
          <h2 id="about-principles-heading">Il nostro sguardo</h2>
        </header>

        <div className="about-principles__list">
          {principles.map((principle, index) => (
            <article key={principle.title} className="about-principle">
              <span aria-hidden="true">0{index + 1}</span>
              <h3>{principle.title}</h3>
              <p>{principle.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-magazine" aria-labelledby="about-magazine-heading">
        <div className="about-magazine__marker" aria-hidden="true">
          <span>PDF</span>
          <span>PRINT</span>
          <strong>01</strong>
        </div>

        <div className="about-magazine__content">
          <p className="type-meta">Edizioni / 03</p>
          <h2 id="about-magazine-heading">Dal digitale alla rivista</h2>
          <p>
            Il progetto prende forma anche attraverso numeri editoriali periodici, pensati come
            oggetti da leggere, conservare e attraversare. Ogni numero raccoglie articoli,
            immagini e percorsi tematici in una forma più lenta e curata.
          </p>
        </div>
      </section>

      <section className="about-editorial-cta" aria-labelledby="about-editorial-cta-heading">
        <p className="type-meta">Le persone / 04</p>
        <h2 id="about-editorial-cta-heading">
          Scopri chi c&apos;è dietro Incontri Ravvicinati
        </h2>
        <Link className="about-editorial-cta__link type-meta" href="/redazione">
          La redazione <ArrowIcon />
        </Link>
      </section>
    </main>
  )
}
