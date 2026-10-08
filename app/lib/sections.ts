// Stable storage keys keep existing articles associated without a data migration.
export const sections = [
  {value: 'recensione', slug: 'recensione', label: 'Recensioni', singular: 'Recensione'},
  {value: 'approfondimento', slug: 'approfondimento', label: 'Approfondimenti', singular: 'Approfondimento'},
  {value: 'retrospettiva', slug: 'retrospettiva', label: 'Retrospettive', singular: 'Retrospettiva'},
  {value: 'classifiche', slug: 'classifiche', label: 'Classifiche', singular: 'Classifica'},
  {value: 'anniversari', slug: 'anniversari', label: 'Anniversari', singular: 'Anniversario'},
  {value: 'intervista', slug: 'intervista', label: 'Interviste', singular: 'Intervista'},
  {value: 'festival', slug: 'festival', label: 'Festival', singular: 'Festival'},
  {value: 'reportage', slug: 'reportage', label: 'Reportage', singular: 'Reportage'},
  {value: 'news', slug: 'news', label: 'News', singular: 'News'},
  {value: 'selezione', slug: 'editoriali', label: 'Editoriali', singular: 'Editoriale'},
] as const

export function orderedSections(order?: string[] | null) {
  const keys = [...new Set([...(order ?? []), ...sections.map(section => section.value)])]
  return keys.flatMap(key => {
    const section = sections.find(section => section.value === key)
    return section ? [section] : []
  })
}

export function sectionLabel(value: string | null) {
  return sections.find(section => section.value === value)?.singular ?? 'Articolo'
}
