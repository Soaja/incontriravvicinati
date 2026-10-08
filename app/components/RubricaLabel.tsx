import Link from 'next/link'

export type Rubrica = {title: string | null; slug: string | null}

export function RubricaLabel({rubrica}: {rubrica?: Rubrica | null}) {
  if (!rubrica?.title) return null
  const label = <>“{rubrica.title}”</>
  return <span className="rubrica-label">
    <span aria-hidden="true"> · </span>
    {rubrica.slug ? <Link href={`/rubrica/${encodeURIComponent(rubrica.slug)}`}>{label}</Link> : label}
  </span>
}
