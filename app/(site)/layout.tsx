import {GoogleAnalytics} from '@next/third-parties/google'
import {Analytics} from '@vercel/analytics/next'

import {Footer} from '@/app/components/Footer'
import {Header} from '@/app/components/Header'
import {SanityLive} from '@/sanity/lib/live'

const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_ID

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
      <SanityLive />
      <Analytics />
      {googleAnalyticsId ? <GoogleAnalytics gaId={googleAnalyticsId} /> : null}
    </>
  )
}
