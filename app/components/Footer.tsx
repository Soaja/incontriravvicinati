import {contactDetails} from '@/app/lib/contact'

import {BrandLogo} from './BrandLogo'
import {ArrowIcon} from './ArrowIcon'

export function Footer() {
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
                Proposte editoriali, eventi, festival e rassegne. Scrivici se hai un&apos;idea da raccontarci
              </p>

              <a className="site-contact__email" href={`mailto:${contactDetails.email}`}>
                {contactDetails.email}
              </a>

              <div className="site-contact__links type-meta">
                <a href={contactDetails.phoneHref}>{contactDetails.phoneDisplay}</a>
                <a href={contactDetails.instagramUrl} target="_blank" rel="noreferrer">
                  {contactDetails.instagramHandle} <ArrowIcon />
                </a>
                <a href={contactDetails.linkedinUrl} target="_blank" rel="noreferrer">
                  LinkedIn <ArrowIcon />
                </a>
                <a href={contactDetails.letterboxdUrl} target="_blank" rel="noreferrer">
                  Letterboxd <ArrowIcon />
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
          Rivista indipendente di cinema
        </p>
        <p className="type-meta site-footer__edition">
          © {new Date().getFullYear()} · Italia
        </p>
      </div>
    </footer>
  )
}
