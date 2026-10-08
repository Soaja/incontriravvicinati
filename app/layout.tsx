import type {Metadata} from 'next'
import {Geist, Jura, Roboto_Mono} from 'next/font/google'
import {siteUrl} from '@/app/lib/site-url'

import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const jura = Jura({
  variable: '--font-jura',
  subsets: ['latin'],
  display: 'swap',
})

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Incontri Ravvicinati',
  description: 'Rivista indipendente di cinema',
  verification: {google: process.env.GOOGLE_SITE_VERIFICATION?.trim() || undefined},
  robots: {index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1},
  alternates: {types: {'application/rss+xml': [{url: `${siteUrl}/rss.xml`, title: 'Incontri Ravvicinati — ultimi articoli'}]}},
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: '/',
    siteName: 'Incontri Ravvicinati',
    title: 'Incontri Ravvicinati',
    description: 'Rivista indipendente di cinema',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Incontri Ravvicinati',
    description: 'Rivista indipendente di cinema',
  },
}

export default function RootLayout({children}: LayoutProps<'/'>) {
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${jura.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body>{children}</body>
    </html>
  )
}
