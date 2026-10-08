/* eslint-disable @typescript-eslint/no-require-imports -- Local TypeScript/GROQ verification harness. */
const assert = require('node:assert/strict')
const fs = require('node:fs')
const ts = require('typescript')
const {parse, evaluate} = require('groq-js')
function load(file, imports = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022}}).outputText
  const result = {}
  new Function('exports', 'require', code)(result, name => imports[name] ?? require(name))
  return result
}
;(async () => {
  const site = {siteUrl: 'https://www.incontriravvicinatimag.it'}
  const seo = load('app/lib/seo.ts', {'./site-url': site, './contact': load('app/lib/contact.ts')})
  assert.ok(seo.metaDescription('Un testo italiano molto lungo. '.repeat(12)).length <= 155)
  assert.equal(seo.publisher['@type'], 'NewsMediaOrganization')
  assert.ok(!seo.jsonLd({headline: '</script>'}).includes('</script>'))
  const feeds = load('app/lib/feeds.ts', {'./site-url': site})
  assert.equal(feeds.xmlEscape('Cinema & "storie" <oggi>'), 'Cinema &amp; &quot;storie&quot; &lt;oggi&gt;')
  const pagination = load('app/lib/pagination.ts')
  const queries = load('sanity/lib/queries.ts', {'@/app/lib/pagination': pagination})
  const archive = load('sanity/lib/archive.ts', {'@/app/lib/pagination': pagination, './queries': queries})
  const feedQueries = load('sanity/lib/feeds.ts', {'./archive': archive})
  const now = new Date()
  const docs = Array.from({length: 35}, (_, i) => ({_id: `a${i}`, _type: 'article', title: `Film ${i}`, slug: {current: `film-${i}`}, publishedAt: new Date(now.getTime() - i * 3600000).toISOString(), articleType: i === 0 || i === 3 ? 'retrospettiva' : 'recensione', ...(i === 0 || i === 5 ? {rubrica: {_ref: 'rubrica'}} : {})}))
  docs.push({...docs[1], _id: 'old', publishedAt: new Date(now.getTime() - 72 * 3600000).toISOString()}, {...docs[0], _id: 'drafts.hidden'}, {...docs[0], _id: 'future', publishedAt: new Date(now.getTime() + 3600000).toISOString()})
  const run = async (query, params = {}) => (await evaluate(parse(query), {dataset: docs, params})).get()
  assert.equal((await run(feedQueries.RSS_QUERY)).length, 30)
  assert.equal((await run(feedQueries.NEWS_QUERY)).length, 35)
  const related = (await run(queries.ARTICLE_PAGE_QUERY, {slug: 'film-0'})).related
  assert.deepEqual(related.map(a => a._id), ['a5', 'a3', 'a1'])
  // Remove unpublished fixtures before checking latest fallback ranking.
  docs.pop()
  docs.pop()
  assert.deepEqual((await run(queries.ARTICLE_PAGE_QUERY, {slug: 'film-0'})).related.map(a => a._id), ['a5', 'a3', 'a1'])
  const {NextRequest} = require('next/server')
  const proxy = load('proxy.ts')
  const previous = process.env.VERCEL_ENV
  process.env.VERCEL_ENV = 'production'
  assert.equal(proxy.proxy(new NextRequest(site.siteUrl)).headers.get('x-robots-tag'), null)
  for (const host of ['preview.vercel.app', 'other.example.com', 'localhost:3002']) assert.match(proxy.proxy(new NextRequest(`https://${host}`)).headers.get('x-robots-tag'), /noindex/)
  process.env.VERCEL_ENV = 'preview'
  assert.match(proxy.proxy(new NextRequest(site.siteUrl)).headers.get('x-robots-tag'), /noindex/)
  if (previous === undefined) delete process.env.VERCEL_ENV
  else process.env.VERCEL_ENV = previous
  console.log('PASS: description length, safe JSON-LD/XML, 48-hour News window, 30 RSS items, related rubrica/section/latest ordering, duplicate-host and preview noindex. No network or data writes.')
})().catch(error => {console.error(error); process.exitCode = 1})
