import type {Metadata} from 'next'

import {EditorialPage} from '../components/EditorialPage'

export const metadata: Metadata = {
  title: 'Articoli',
  description: 'Articoli, recensioni e approfondimenti di Incontri Ravvicinati.',
}

export default function ArticoliPage() {
  return (
    <EditorialPage
      index="02"
      eyebrow="Archivio editoriale"
      title="Articoli"
      introduction="Recensioni, interviste, reportage e percorsi nella cultura cinematografica contemporanea."
    >
      <section>
        <h2>Uno spazio per il cinema</h2>
        <p>
          Qui confluiscono gli sguardi, le conversazioni e gli approfondimenti della
          rivista. L&apos;archivio completo verrà organizzato per rendere ogni articolo
          facile da ritrovare e attraversare.
        </p>
      </section>
    </EditorialPage>
  )
}
