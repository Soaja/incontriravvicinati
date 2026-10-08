import {Analytics} from '@vercel/analytics/next'
import Script from 'next/script'

import {Footer} from '@/app/components/Footer'
import {Header} from '@/app/components/Header'
import {contactDetails} from '@/app/lib/contact'
import {SanityLive} from '@/sanity/lib/live'
import {siteUrl} from '@/app/lib/site-url'

const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID?.trim()

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
        url: siteUrl,
        sameAs: [contactDetails.instagramUrl, contactDetails.linkedinUrl, contactDetails.letterboxdUrl],
      }).replace(/</g, '\\u003c')}} />
      <Analytics />
      {process.env.NODE_ENV === 'production' && umamiWebsiteId ? <Script
        id="umami-analytics"
        src="https://cloud.umami.is/script.js"
        strategy="afterInteractive"
        data-website-id={umamiWebsiteId}
        data-domains="www.incontriravvicinatimag.it"
      /> : null}
    </>
  )
}
