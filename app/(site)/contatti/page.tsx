import type {Metadata} from 'next'

import {client} from '@/sanity/lib/client'
import {SITE_SETTINGS_QUERY} from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Contatti',
  description: 'Contatta Incontri Ravvicinati.',
}

type ContactSettings = {
  contactEmail: string | null
  instagramUrl: string | null
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
  const settings = await client
    .fetch<ContactSettings | null>(SITE_SETTINGS_QUERY)
    .catch(() => null)
  const contactEmail = settings?.contactEmail?.trim() || null

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

        {contactEmail ? (
          <a className="contact-direct__email" href={`mailto:${contactEmail}`}>
            {contactEmail}
          </a>
        ) : (
          <p className="contact-direct__email contact-direct__email--missing">
            Email in aggiornamento
          </p>
        )}

        <div className="contact-direct__footer">
          <p>
            Raccontaci chi sei, cosa immagini e perché pensi che il tuo progetto possa
            incontrare Incontri Ravvicinati.
          </p>
          {settings?.instagramUrl ? (
            <a
              className="contact-direct__instagram type-meta"
              href={settings.instagramUrl}
              target="_blank"
              rel="noreferrer"
            >
              Instagram <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>
      </section>

      <section className="contact-inquiries" aria-labelledby="contact-inquiries-heading">
        <header className="contact-inquiries__header">
          <p className="type-meta">Di cosa possiamo parlare / 02</p>
          <h2 id="contact-inquiries-heading">Apriamo una conversazione</h2>
        </header>

        <div className="contact-inquiries__list">
          {inquiries.map((inquiry) => {
            const subjectHref = contactEmail
              ? `mailto:${contactEmail}?subject=${encodeURIComponent(inquiry.subject)}`
              : null

            return (
              <article key={inquiry.number} className="contact-inquiry">
                <span aria-hidden="true">{inquiry.number}</span>
                <h3>{inquiry.title}</h3>
                <p>{inquiry.description}</p>
                {subjectHref ? (
                  <a className="contact-inquiry__link type-meta" href={subjectHref}>
                    Scrivi ora <span aria-hidden="true">↗</span>
                  </a>
                ) : null}
              </article>
            )
          })}
        </div>
      </section>

      <aside className="contact-note" aria-label="Indicazioni per contattarci">
        <p className="type-meta">Una nota prima di scrivere</p>
        <p>
          Preferiamo messaggi chiari e proposte curate. Non serve avere tutto già definito:
          basta una buona idea, il tempo per raccontarla e la voglia di costruire un dialogo.
        </p>
      </aside>
    </main>
  )
}
