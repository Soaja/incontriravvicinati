import {siteUrl} from './site-url'
import {contactDetails} from './contact'

export function metaDescription(text: string) {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= 155) return clean
  return clean.slice(0, 154).replace(/\s+\S*$/, '').trimEnd() + '…'
}
export const publisher = {
  '@type': 'NewsMediaOrganization', '@id': `${siteUrl}/#publisher`, name: 'Incontri Ravvicinati', url: siteUrl,
  logo: {'@type': 'ImageObject', url: `${siteUrl}/icon.png`},
  sameAs: [contactDetails.instagramUrl, contactDetails.linkedinUrl, contactDetails.letterboxdUrl],
}
export function jsonLd(value: unknown) {return JSON.stringify(value).replace(/</g, '\\u003c')}
export function seoAlternates(canonical: string) {
  return {canonical, types: {'application/rss+xml': [{url: `${siteUrl}/rss.xml`, title: 'Incontri Ravvicinati — ultimi articoli'}]}}
}
