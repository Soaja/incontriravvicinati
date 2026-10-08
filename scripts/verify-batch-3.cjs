/* eslint-disable @typescript-eslint/no-require-imports -- Local CommonJS verification harness. */
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
  const pagination = load('app/lib/pagination.ts')
  const queries = load('sanity/lib/queries.ts', {'@/app/lib/pagination': pagination})
  const archive = load('sanity/lib/archive.ts', {'@/app/lib/pagination': pagination, './queries': queries})
  const search = load('app/lib/search.ts', {'./sections': load('app/lib/sections.ts')})
  assert.equal(pagination.ARTICLES_PER_PAGE, 12)
  for (const input of ['0', '-1', '2.5', 'abc', '02', ['2'], '9007199254740992']) assert.equal(pagination.pageNumber(input), null)
  assert.equal(pagination.pageNumber(undefined), 1)
  assert.equal(pagination.pageNumber('2'), 2)
  assert.equal(pagination.pageUrl('/articoli', {type: 'news', author: 'ada'}, 1), '/articoli?type=news&author=ada')
  assert.equal(pagination.pageUrl('/articoli', {type: 'news'}, 2, true), '/articoli?type=news&pagina=2#lista-articoli')
  assert.deepEqual(pagination.visiblePages(5, 9), [1, '…', 4, 5, 6, '…', 9])
  assert.throws(() => archive.archivePageQuery(1.5))
  assert.throws(() => archive.searchPageQuery(-1))
  const author = {_id: 'ada', _type: 'author', name: 'Ada Cinema', slug: {current: 'ada'}}
  const coauthor = {_id: 'co', _type: 'author', name: 'Tommaso Clementi', slug: {current: 'tommaso'}}
  const rubrica = {_id: 'rubrica', _type: 'rubrica', title: 'Some Like it Old', slug: {current: 'some-like-it-old'}}
  const dataset = [author, coauthor, rubrica, ...Array.from({length: 26}, (_, i) => ({
    _id: `article-${String(i).padStart(2, '0')}`, _type: 'article', slug: {current: `article-${i}`}, title: i === 0 ? 'Trainspotting: cinema' : `Storia ${i}`,
    articleType: 'recensione', publishedAt: `2020-01-${String(i + 1).padStart(2, '0')}T00:00:00Z`,
    author: {_ref: author._id}, authors: [{_ref: coauthor._id}], rubrica: {_ref: rubrica._id},
    excerpt: i === 25 ? 'Il cinema di Trainspotting' : '',
    body: [{_type: 'block', children: [{_type: 'span', text: 'Una parola segreta: pellicola.'}]}],
  }))]
  dataset.push({...dataset[3], _id: 'drafts.hidden', title: 'Trainspotting draft'}, {...dataset[3], _id: 'future', publishedAt: '2099-01-01T00:00:00Z'}, {...dataset[3], _id: 'no-slug', slug: undefined})
  const run = async (query, params = {}) => (await evaluate(parse(query), {dataset, params})).get()
  const filters = {articleType: 'recensione', authorSlug: 'tommaso', rubricaSlug: 'some-like-it-old'}
  assert.equal(await run(archive.ARCHIVE_COUNT_QUERY, filters), 26)
  const pages = await Promise.all([1, 2, 3].map(page => run(archive.archivePageQuery(page), filters)))
  assert.deepEqual(pages.map(page => page.length), [12, 12, 2])
  assert.equal(new Set(pages.flat().map(article => article._id)).size, 26)
  for (const q of ['Tommaso', 'Some Like', 'recensioni', 'pellicola']) {
    const params = search.searchParameters(q)
    assert.equal(await run(archive.SEARCH_COUNT_QUERY, params), 26, q)
  }
  const ranked = await run(archive.searchPageQuery(1), search.searchParameters('Trainspotting'))
  assert.equal(ranked.length, 2)
  assert.equal(ranked[0]._id, 'article-00', 'Title match ranks ahead of newer excerpt match')
  assert.equal(await run(archive.SEARCH_COUNT_QUERY, search.searchParameters('zzzznomatch')), 0)
  assert.deepEqual(search.searchParameters('* [ ]').terms, [])
  const sitemap = await run(archive.SITEMAP_CONTENT_QUERY)
  assert.equal(sitemap.articles.length, 26)
  assert.equal(sitemap.authors.length, 2)
  assert.equal(sitemap.rubriche[0].slug, 'some-like-it-old')

  const {NextRequest} = require('next/server')
  const {encodeSignatureHeader, SIGNATURE_HEADER_NAME} = await import('@sanity/webhook')
  const {parseBody} = await import('next-sanity/webhook')
  const calls = []
  const route = load('app/api/revalidate/route.ts', {
    'next/cache': {revalidateTag: (...args) => calls.push(['tag', ...args]), revalidatePath: (...args) => calls.push(['path', ...args])},
    'next-sanity/webhook': {parseBody: (request, secret) => parseBody(request, secret, false)},
    '@/sanity/lib/cache': load('sanity/lib/cache.ts'),
  })
  const previousSecret = process.env.SANITY_REVALIDATE_SECRET
  process.env.SANITY_REVALIDATE_SECRET = 'local-test-secret'
  const request = async (body, secret) => {
    const payload = JSON.stringify(body)
    return new NextRequest('https://example.com/api/revalidate', {method: 'POST', body: payload, headers: {[SIGNATURE_HEADER_NAME]: await encodeSignatureHeader(payload, Date.now(), secret)}})
  }
  assert.equal((await route.POST(await request({_id: 'article', _type: 'article'}, 'wrong'))).status, 401)
  assert.equal(calls.length, 0)
  assert.equal((await route.POST(await request({_id: 'drafts.article', _type: 'article'}, 'local-test-secret'))).status, 400)
  assert.equal(calls.length, 0)
  assert.equal((await route.POST(await request({_id: 'article', _type: 'article'}, 'local-test-secret'))).status, 200)
  assert.deepEqual(calls, [['tag', 'sanity-content', {expire: 0}], ['path', '/', 'layout'], ['path', '/sitemap.xml']])
  if (previousSecret === undefined) delete process.env.SANITY_REVALIDATE_SECRET
  else process.env.SANITY_REVALIDATE_SECRET = previousSecret
  console.log('PASS: 12-item slices/counts, all archive filters, invalid pages, URLs, title-first search/body/coauthors/sections/rubriche, sitemap exclusions, signed webhook authorization/invalidation. No network or Sanity writes.')
})().catch(error => {console.error(error); process.exitCode = 1})
