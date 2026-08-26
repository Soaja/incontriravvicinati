import type {Metadata} from 'next'

import {EditorialPage} from '../components/EditorialPage'

export const metadata: Metadata = {
  title: 'Chi siamo',
  description: 'Il progetto editoriale di Incontri Ravvicinati.',
}

export default function ChiSiamoPage() {
  return (
    <EditorialPage
      index="03"
      eyebrow="Il progetto"
      title="Chi siamo"
      introduction="Incontri Ravvicinati è una rivista indipendente dedicata al cinema e alla cultura visiva."
    >
      <section>
        <h2>Immagini, idee, incontri</h2>
        <p>
          Osserviamo il cinema come un luogo di relazione: tra autori e pubblico,
          memoria e presente, immagini e trasformazioni culturali. Costruiamo uno
          spazio critico aperto, curioso e indipendente.
        </p>
      </section>
    </EditorialPage>
  )
}
