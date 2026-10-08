import {GoogleAnalytics} from '@next/third-parties/google'
import {Analytics} from '@vercel/analytics/next'

import {Footer} from '@/app/components/Footer'
import {Header} from '@/app/components/Header'
import {contactDetails} from '@/app/lib/contact'
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Incontri Ravvicinati',
        url: 'https://www.incontriravvicinatimag.it',
        sameAs: [contactDetails.instagramUrl, contactDetails.linkedinUrl, contactDetails.letterboxdUrl],
      }).replace(/</g, '\\u003c')}} />
      <Analytics />
      {googleAnalyticsId ? <GoogleAnalytics gaId={googleAnalyticsId} /> : null}
    </>
  )
}
