'use client'
import {useEffect, useRef, useState} from 'react'
import {useRouter} from 'next/navigation'
import {SearchResults, type SearchHit} from './SearchResults'

export function SearchOverlay() {
  const router = useRouter()
  const dialog = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [articles, setArticles] = useState<SearchHit[]>([])
  const [selected, setSelected] = useState(-1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resolvedQuery, setResolvedQuery] = useState('')
  const term = query.trim().slice(0, 120)

  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !target?.closest('input, textarea, [contenteditable="true"]')) {
        event.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener('keydown', shortcut)
    return () => document.removeEventListener('keydown', shortcut)
  }, [])

  useEffect(() => {
    if (!open) return
    const dialogElement = dialog.current
    const triggerElement = trigger.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogElement?.showModal()
    input.current?.focus()
    return () => {
      dialogElement?.close()
      document.body.style.overflow = previousOverflow
      triggerElement?.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open || term.length < 2) return
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setLoading(true)
      setError('')
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`, {signal: controller.signal})
        if (!response.ok) throw new Error('Search unavailable')
        const result = await response.json() as {articles: SearchHit[]}
        if (!controller.signal.aborted) {
          setArticles(result.articles)
          setResolvedQuery(term)
          setSelected(-1)
        }
      } catch {
        if (!controller.signal.aborted) setError('La ricerca non è disponibile. Riprova.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, 250)
    return () => {clearTimeout(timer); controller.abort()}
  }, [open, term])

  const currentResults = resolvedQuery === term && term.length >= 2 ? articles : []
  function close() {setOpen(false)}
  function submit() {
    if (term.length < 2) return
    close()
    router.push(`/cerca?q=${encodeURIComponent(term)}`)
  }

  return <>
    <button className="search-trigger" type="button" ref={trigger} aria-label="Apri la ricerca" aria-haspopup="dialog" aria-keyshortcuts="/" onClick={() => setOpen(true)}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
    </button>
    <dialog ref={dialog} className="search-dialog" aria-labelledby="search-heading" onCancel={event => {event.preventDefault(); close()}}
      onKeyDown={event => {
        if (event.key === 'Escape') {event.preventDefault(); close(); return}
        if (event.key !== 'Tab') return
        const focusable = Array.from(dialog.current?.querySelectorAll<HTMLElement>('button, input, a[href]') ?? [])
        const first = focusable[0], last = focusable.at(-1)
        if (event.shiftKey && document.activeElement === first) {event.preventDefault(); last?.focus()}
        else if (!event.shiftKey && document.activeElement === last) {event.preventDefault(); first?.focus()}
      }}>
      <div className="search-dialog__inner site-container">
        <header className="search-dialog__header"><h2 id="search-heading" className="type-meta">Cerca in Incontri Ravvicinati</h2>
          <button className="search-close type-meta" type="button" aria-label="Chiudi la ricerca" onClick={close}>Chiudi <span aria-hidden="true">×</span></button>
        </header>
        <form className="search-form" role="search" onSubmit={event => {event.preventDefault(); submit()}}>
          <label className="sr-only" htmlFor="overlay-search">Cerca un film, un autore, una rubrica</label>
          <input id="overlay-search" ref={input} type="search" placeholder="Cerca un film, un autore, una rubrica…" value={query} maxLength={120} autoComplete="off"
            role="combobox" aria-autocomplete="list" aria-controls="search-suggestions" aria-expanded={currentResults.length > 0}
            aria-activedescendant={selected >= 0 && currentResults[selected] ? `search-option-${selected}` : undefined}
            onChange={event => {setQuery(event.target.value); setSelected(-1)}}
            onKeyDown={event => {
              if (event.key === 'ArrowDown' && currentResults.length) {event.preventDefault(); setSelected((selected + 1) % currentResults.length)}
              if (event.key === 'ArrowUp' && currentResults.length) {event.preventDefault(); setSelected(selected <= 0 ? currentResults.length - 1 : selected - 1)}
              if (event.key === 'Enter' && selected >= 0 && currentResults[selected]) {event.preventDefault(); close(); router.push(`/articoli/${encodeURIComponent(currentResults[selected].slug)}`)}
            }} />
          <button className="type-meta search-submit" type="submit">Cerca →</button>
        </form>
        <p className="search-status type-meta" aria-live="polite">{error || (term.length < 2 ? 'Scrivi almeno 2 caratteri.' : loading || resolvedQuery !== term ? 'Ricerca in corso…' : currentResults.length ? `${currentResults.length} risultati · Invio per vedere tutti` : `Nessun risultato per «${term}»`)}</p>
        <SearchResults articles={currentResults} selected={selected} interactive onChoose={close} onSelect={setSelected} />
      </div>
    </dialog>
  </>
}
