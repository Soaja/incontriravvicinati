import type {ReactNode} from 'react'

type EditorialPageProps = {
  index: string
  eyebrow: string
  title: string
  introduction: string
  children: ReactNode
}

export function EditorialPage({
  index,
  eyebrow,
  title,
  introduction,
  children,
}: EditorialPageProps) {
  return (
    <main id="main-content" className="site-container editorial-page">
      <header className="editorial-page__header">
        <div className="editorial-page__label">
          <p className="type-meta">{eyebrow}</p>
          <span className="editorial-page__index" aria-hidden="true">
            {index}
          </span>
        </div>

        <h1 className="editorial-page__title">{title}</h1>
        <p className="editorial-page__introduction">{introduction}</p>
      </header>

      <div className="editorial-page__content type-body">{children}</div>
    </main>
  )
}
