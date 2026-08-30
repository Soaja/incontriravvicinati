import type {Metadata} from 'next'
import {Geist, Jura} from 'next/font/google'

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

export const metadata: Metadata = {
  metadataBase: new URL('https://www.incontriravvicinatimag.it'),
  title: 'Incontri Ravvicinati',
  description: 'Rivista indipendente di cinema e cultura visiva.',
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: '/',
    siteName: 'Incontri Ravvicinati',
    title: 'Incontri Ravvicinati',
    description: 'Rivista indipendente di cinema e cultura visiva.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Incontri Ravvicinati',
    description: 'Rivista indipendente di cinema e cultura visiva.',
  },
}

export default function RootLayout({children}: LayoutProps<'/'>) {
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${jura.variable} h-full antialiased`}
    >
      <body>{children}</body>
    </html>
  )
}
