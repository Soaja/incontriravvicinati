import type {Metadata} from 'next'

import {ArrowIcon} from '@/app/components/ArrowIcon'
import {contactDetails} from '@/app/lib/contact'

export const metadata: Metadata = {
  title: 'Contatti',
  description: 'Contatta Incontri Ravvicinati.',
}

const inquiries = [
  {
    number: '01',
    title: 'Proposte editoriali',
    description:
      'Articoli, interviste, recensioni e idee che attraversano il cinema e la cultura delle immagini.',
    subject: 'Proposta editoriale',
  },
  {
    number: '02',
    title: 'Festival e rassegne',
    description:
      'Segnalazioni, accrediti, incontri e collaborazioni con festival, sale e progetti culturali.',
    subject: 'Festival e rassegne',
  },
  {
    number: '03',
    title: 'Immagini e collaborazioni',
    description:
      'Fotografia, illustrazione, grafica, partnership e nuovi modi di costruire insieme il racconto visivo.',
    subject: 'Collaborazione visiva',
  },
]

export default async function ContattiPage() {
  return (
    <main id="main-content" className="site-container contact-page">
      <header className="contact-hero">
        <div className="contact-hero__label">
          <p className="type-meta">Contatti / Corrispondenze</p>
          <span aria-hidden="true">05</span>
        </div>

        <h1>Contatti</h1>
        <p className="contact-hero__intro">
          Per proposte editoriali, collaborazioni, festival, rassegne e progetti legati alla
          cultura visiva. Le conversazioni possono iniziare da qui.
        </p>
      </header>

      <section className="contact-direct" aria-labelledby="contact-direct-heading">
        <div className="contact-direct__label">
          <p className="type-meta">Canale diretto / 01</p>
          <span className="type-meta">Milano / Italia</span>
        </div>

        <h2 id="contact-direct-heading">Scrivici</h2>

        <a className="contact-direct__email" href={`mailto:${contactDetails.email}`}>
          {contactDetails.email}
        </a>

        <a className="contact-direct__phone" href={contactDetails.phoneHref}>
          {contactDetails.phoneDisplay}
        </a>

        <div className="contact-direct__footer">
          <p>
            Raccontaci chi sei, cosa immagini e perché pensi che il tuo progetto possa
            incontrare Incontri Ravvicinati.
          </p>
          <a
            className="contact-direct__instagram type-meta"
            href={contactDetails.instagramUrl}
            target="_blank"
            rel="noreferrer"
          >
            Instagram {contactDetails.instagramHandle} <ArrowIcon />
          </a>
        </div>
      </section>

      <section className="contact-inquiries" aria-labelledby="contact-inquiries-heading">
        <header className="contact-inquiries__header">
          <p className="type-meta">Di cosa possiamo parlare / 02</p>
          <h2 id="contact-inquiries-heading">Apriamo una conversazione</h2>
        </header>

        <div className="contact-inquiries__list">
          {inquiries.map((inquiry) => {
            const subjectHref = `mailto:${contactDetails.email}?subject=${encodeURIComponent(
              inquiry.subject,
            )}`

            return (
              <article key={inquiry.number} className="contact-inquiry">
                <span aria-hidden="true">{inquiry.number}</span>
                <h3>{inquiry.title}</h3>
                <p>{inquiry.description}</p>
                <a className="contact-inquiry__link type-meta" href={subjectHref}>
                  Scrivi ora <ArrowIcon />
                </a>
              </article>
            )
          })}
        </div>
      </section>

    </main>
  )
}
