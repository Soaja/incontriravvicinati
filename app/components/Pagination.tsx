import Link from 'next/link'
import {ARTICLES_PER_PAGE, pageUrl, visiblePages} from '@/app/lib/pagination'

export function Pagination({page, total, path, params = {}}: {
  page: number; total: number; path: string; params?: Record<string, string>
}) {
  const pages = Math.max(1, Math.ceil(total / ARTICLES_PER_PAGE))
  if (pages < 2) return null
  return <nav className="pagination type-meta" aria-label="Paginazione degli articoli">
    {page > 1 ? <Link href={pageUrl(path, params, page - 1, true)} rel="prev">← Precedente</Link> : <span aria-disabled="true">← Precedente</span>}
    <span className="pagination__numbers">
      {visiblePages(page, pages).map((n, i) => n === '…' ? <span key={`gap-${i}`} aria-hidden="true">…</span> :
        <Link key={n} href={pageUrl(path, params, n, true)} aria-label={`Pagina ${n}`} aria-current={n === page ? 'page' : undefined}>{n}</Link>)}
    </span>
    <span className="pagination__compact" aria-label={`Pagina ${page} di ${pages}`}>{page}/{pages}</span>
    {page < pages ? <Link href={pageUrl(path, params, page + 1, true)} rel="next">Successiva →</Link> : <span aria-disabled="true">Successiva →</span>}
  </nav>
}
