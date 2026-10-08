# INCONTRI RAVVICINATI — batch 1

## Stack / audit
- Next.js 16.3.1, React 19.2.8, App Router (`app/(site)`), Tailwind 4 + `app/globals.css`; embedded Sanity 5 Studio at `/studio` (`sanity.config.ts`).
- Schemas: `sanity/schemaTypes/{article,author,issue,siteSettings}.ts`; Studio navigation: `sanity/structure.ts`.
- GROQ: `sanity/lib/queries.ts`; `sanity/lib/live.ts` supplies `sanityFetch`/live updates. Articles reference authors; sections use the `articleType` enum, not category documents.
- Fonts: Geist (headings), Jura (UI), Roboto Mono (article reading text); `app/layout.tsx`, `app/globals.css`. Hosting: Vercel integration present, deployment account/config not checked in; canonical domain www.incontriravvicinatimag.it.

## Change map
| Item | Files / current behavior |
| --- | --- |
| 4, 13: redazione / author links | `app/(site)/redazione/page.tsx`: hardcoded roster; Sanity supplies biography/photo/slug via `EDITORIAL_TEAM_ASSETS_QUERY`. Exact name lookup and mandatory slug can suppress links. Author destinations are `/articoli?author=…`, not standalone profiles. |
| 6: contacts / socials | `app/lib/contact.ts`, `app/(site)/contatti/page.tsx`, `app/components/Footer.tsx`; no existing organization `sameAs`. |
| 9, 10: collaboration card / intro | `app/(site)/contatti/page.tsx`, `app/components/Footer.tsx`. |
| 11: tagline / metadata | `app/components/Footer.tsx` (Sanity `footerText` overrides fallback), `app/layout.tsx`. |
| 14: reading font | `app/layout.tsx`, `.article-body` in `app/globals.css`, `app/components/ArticleBody.tsx`. |
| 16: titles | `app/globals.css`; `app/(site)/{page,articoli/page,articoli/[slug]/page}.tsx`; `app/components/{FeaturedHero,ReviewsSection,LongformFeature}.tsx`. |
| Later: categories / sections / rubrica | `sanity/schemaTypes/article.ts`, `sanity/lib/queries.ts`, `app/(site)/articoli/page.tsx`, `app/components/{ArticleFilters,Header,ReviewsSection}.tsx`; no `rubrica` field exists. |
| Later: body images / author photos | `sanity/schemaTypes/{article,author}.ts`, `sanity/lib/{queries,image}.ts`, `app/components/ArticleBody.tsx`, article detail and redazione pages. |
| Later: clickable author names in articles | Article detail byline/profile and archive/home card bylines currently plain text; author references already queried. |
| Later: pagination / search | `ARTICLES_PAGE_QUERY` caps archive at 24; no pagination or full-text search UI/query implemented. Archive URL filters use `searchParams` (not site search). |
| Later: sitemap.xml | `app/sitemap.ts`, `ARTICLE_SLUGS_QUERY` in `sanity/lib/queries.ts`; `app/robots.ts`. |
| Later: analytics | `app/(site)/layout.tsx`: Vercel Analytics + optional GA (`NEXT_PUBLIC_GA_ID`); `.env.example`, `package.json`. |

## Sanity / verification
- Implemented 4, 6, 9, 10, 11, 13, 14, 16. Footer tagline now uses the exact requested copy directly, so existing Sanity `footerText` cannot override it. Social URLs are shared by contacts/footer/Organization JSON-LD.
- Cause confirmed through public, read-only Sanity query (`scripts/audit-authors.mjs`): Alessandro's published name is `Alessandro Ritrovato ` (trailing space), slug `alessandro-ritrovato`, 3 published articles. Normalize Unicode, whitespace and case when matching the roster; retrieve all author assets so exact GROQ name filtering cannot discard them. Missing slugs fall back to author IDs, supported by the archive filter.
- Lorenzo's published document already has exact name `Lorenzo Bertoldo`, slug `lorenzo-bertoldo`, 1 published article. The reported missing link was not reproducible against current published data; the local rendered link is verified at both widths. No unsupported data change made.
- Studio manual: optionally open **Autore → Alessandro Ritrovato**, remove the trailing space from **Nome**, publish (the code fix works without this cleanup). To give Yasmine a link, create **Autore**, **Nome** `Yasmine Pattaro`, **Ruolo** `Redattore`, generate **Slug** `yasmine-pattaro`, publish; assign her article's **Autore** reference when applicable. No published Yasmine author document currently exists. All other new redattori have published author documents. The roster itself needs no Studio edits.
- Visual checks: local dev server `http://localhost:3002`; screenshots only at 375×812 and 1440×900 in `artifacts/batch-1/` (ignored by Git). Contacts, footer, redazione and article inspected; one visual correction iteration (mobile email fit / social grouping). Font measured as Roboto Mono, 16px/27.2px mobile and 17px/28.9px desktop. Tested quoted TRAINSPOTTING, ADULTS and a long Italian title at 360/375/390px and desktop, plus all actual archive cards: no word overflow. Both author destinations return their expected 3/1 articles. Local browser connection unavailable; used headless local Chrome with temporary Playwright under ignored `.next/qa-tools`.
- Local Sanity Live CORS warning on port 3002 does not affect server-rendered published data. Existing ESLint warning in `app/opengraph-image.tsx` (`img`); no lint errors. No Sanity production mutations performed. Single final `npm run build` passed (TypeScript + 61 generated pages); no Lighthouse. Commit: `feat: client update batch 1 (contacts, copy, font, titles, redazione)`.
