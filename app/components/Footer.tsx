import Link from 'next/link'

import {contactDetails} from '@/app/lib/contact'
import {sanityFetch} from '@/sanity/lib/live'
import {SITE_SETTINGS_QUERY} from '@/sanity/lib/queries'

import {BrandLogo} from './BrandLogo'

type SiteSettings = {
  footerText: string | null
}

export async function Footer() {
  const {data} = await sanityFetch({query: SITE_SETTINGS_QUERY}).catch(() => ({data: null}))
  const settings = data as SiteSettings | null

  return (
    <footer className="site-footer">
      <section className="site-contact" aria-labelledby="site-contact-heading">
        <div className="site-container">
          <div className="site-contact__label">
            <p className="type-meta">Contatti / Collaborazioni</p>
            <span aria-hidden="true">C/01</span>
          </div>

          <div className="site-contact__composition">
            <h2 id="site-contact-heading">
              Parliamo
              <span>di cinema.</span>
            </h2>

            <div className="site-contact__details">
              <p>
                Proposte editoriali, festival, rassegne, immagini e nuove idee. Se hai una
                storia da raccontare, questo è il posto giusto da cui iniziare.
              </p>

              <a className="site-contact__email" href={`mailto:${contactDetails.email}`}>
                {contactDetails.email}
              </a>

              <div className="site-contact__links type-meta">
                <a href={contactDetails.phoneHref}>{contactDetails.phoneDisplay}</a>
                <Link href="/contatti">
                  Contatti <span aria-hidden="true">↗</span>
                </Link>
                <a href={contactDetails.instagramUrl} target="_blank" rel="noreferrer">
                  {contactDetails.instagramHandle} <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="site-container site-footer__grid">
        <div className="site-footer__brand" aria-label="Incontri Ravvicinati">
          <BrandLogo variant="negative" />
        </div>
        <p className="type-body site-footer__statement">
          {settings?.footerText ??
            'Una rivista indipendente dedicata al cinema e alla cultura visiva.'}
        </p>
        <p className="type-meta site-footer__edition">
          © {new Date().getFullYear()} · Italia
        </p>
      </div>
    </footer>
  )
}
