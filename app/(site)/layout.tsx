import {Footer} from '@/app/components/Footer'
import {Header} from '@/app/components/Header'

export default function SiteLayout({children}: LayoutProps<'/'>) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Vai al contenuto
      </a>
      <div className="site-shell">
        <Header />
        {children}
        <Footer />
      </div>
    </>
  )
}
