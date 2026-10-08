export const ARTICLES_PER_PAGE = 12
export type QueryValue = string | string[] | undefined
export const firstValue = (value: QueryValue) => Array.isArray(value) ? value[0] : value

export function pageNumber(value: QueryValue) {
  if (value === undefined) return 1
  if (Array.isArray(value) || !/^[1-9]\d*$/.test(value)) return null
  const page = Number(value)
  return Number.isSafeInteger(page) ? page : null
}

export function pageUrl(path: string, params: Record<string, string>, page = 1, anchor = false) {
  const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== ''))
  if (page > 1) query.set('pagina', String(page))
  return path + (query.size ? `?${query}` : '') + (anchor ? '#lista-articoli' : '')
}

export function visiblePages(page: number, pages: number): (number | '…')[] {
  const numbers = [...new Set([1, pages, page - 1, page, page + 1])].filter(n => n >= 1 && n <= pages).sort((a, b) => a - b)
  return numbers.flatMap((n, i) => i && n - numbers[i - 1] > 1 ? ['…' as const, n] : [n])
}
