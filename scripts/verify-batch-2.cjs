/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS harness for local TypeScript modules. */
const assert = require('node:assert/strict')
const fs = require('node:fs')
const ts = require('typescript')
const {parse, evaluate} = require('groq-js')

function loadTypeScript(file, imports = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022}}).outputText
  const result = {}
  new Function('exports', 'require', code)(result, name => imports[name] ?? require(name))
  return result
}

;(async () => {
  const {sections, orderedSections} = loadTypeScript('app/lib/sections.ts')
  assert.equal(orderedSections(['festival', 'selezione'])[0].label, 'Festival')
  assert.equal(orderedSections(['festival', 'selezione'])[1].slug, 'editoriali')
  assert.equal(orderedSections(['festival', 'festival']).length, 10)
  assert.equal(sections.find(section => section.value === 'selezione').label, 'Editoriali')

  const images = loadTypeScript('sanity/lib/image.ts', {'../env': {projectId: 'test1234', dataset: 'production'}})
  const asset = {_id: 'image-abcdef-1200x800-jpg', metadata: {dimensions: {width: 1200, height: 800}}}
  assert.equal(images.getSanityImageUrl({asset: {metadata: asset.metadata}}, image => image.url()), null)
  assert.ok(images.getSanityImageUrl({asset}, image => image.width(800).url()).includes('abcdef-1200x800.jpg'))
  assert.deepEqual(images.imageDimensions({asset, crop: {left: 0.1, right: 0.1, top: 0.25, bottom: 0}}), {width: 960, height: 600})
  assert.deepEqual(images.imageDimensions({asset: {_ref: asset._id}}), {width: 1200, height: 800})

  const pagination = loadTypeScript('app/lib/pagination.ts')
  const {ARTICLES_PAGE_QUERY, ARTICLE_PAGE_QUERY, SECTION_ORDER_QUERY} = loadTypeScript('sanity/lib/queries.ts', {'@/app/lib/pagination': pagination})
  const dataset = [
    {_id: 'main', _type: 'author', name: 'Autore Uno', slug: {current: 'autore-uno'}},
    {_id: 'coauthor', _type: 'author', name: 'Autrice Due', slug: {current: 'autrice-due'}},
    {_id: 'rubrica', _type: 'rubrica', title: 'Some Like it Old', slug: {current: 'some-like-it-old'}},
    {_id: 'sectionSettings', _type: 'sectionSettings', order: [{section: 'festival'}, {section: 'selezione'}]},
    {...asset, _type: 'sanity.imageAsset'},
    {_id: 'article', _type: 'article', title: 'Articolo di prova', slug: {current: 'test'}, articleType: 'selezione', publishedAt: '2020-01-01T00:00:00Z', author: {_ref: 'main'}, authors: [{_ref: 'coauthor'}], rubrica: {_ref: 'rubrica'}, body: [{_type: 'image', asset: {_ref: asset._id}, alt: 'Immagine di prova', credit: 'Archivio', fullWidth: true}]},
  ]
  const run = async (query, params) => (await evaluate(parse(query), {dataset, params})).get()
  for (const authorSlug of ['autore-uno', 'main', 'autrice-due', 'coauthor']) {
    const result = await run(ARTICLES_PAGE_QUERY, {articleType: 'selezione', authorSlug, rubricaSlug: 'some-like-it-old'})
    assert.equal(result.length, 1, authorSlug)
    assert.equal(result[0].authors.length, 2)
  }
  assert.equal((await run(ARTICLES_PAGE_QUERY, {articleType: 'festival', authorSlug: '', rubricaSlug: ''})).length, 0)
  assert.deepEqual((await run(SECTION_ORDER_QUERY, {})).order, ['festival', 'selezione'])
  const article = (await run(ARTICLE_PAGE_QUERY, {slug: 'test'})).article
  assert.equal(article.body[0].asset._id, asset._id)
  assert.equal(article.body[0].credit, 'Archivio')
  assert.equal(article.body[0].fullWidth, true)
  assert.equal(article.rubrica.slug, 'some-like-it-old')
  console.log('PASS: stable Editoriali identity, editable order, image identity/crop ratios, rubrica and primary/coauthor slug/ID filters. No network or data writes.')
})().catch(error => {console.error(error); process.exitCode = 1})
