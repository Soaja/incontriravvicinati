import {BrandLogo} from './BrandLogo'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container site-footer__grid">
        <div className="site-footer__brand" aria-label="Incontri Ravvicinati">
          <BrandLogo variant="negative" />
        </div>
        <p className="type-body site-footer__statement">
          Una rivista indipendente dedicata al cinema e alla cultura visiva.
        </p>
        <p className="type-meta site-footer__edition">
          © {new Date().getFullYear()} · Italia
        </p>
      </div>
    </footer>
  )
}
