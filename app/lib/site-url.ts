const configured = process.env.SITE_URL ?? 'https://www.incontriravvicinatimag.it'
const parsed = new URL(configured)
if (parsed.protocol !== 'https:' || ['localhost', '127.0.0.1', '0.0.0.0'].includes(parsed.hostname)) {
  throw new Error('SITE_URL must be the HTTPS production domain')
}
export const siteUrl = parsed.origin
