import type {Metadata} from 'next'
import {Geist, Jura, Roboto_Mono} from 'next/font/google'

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
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.incontriravvicinatimag.it'),
  title: 'Incontri Ravvicinati',
  description: 'Rivista indipendente di cinema',
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
