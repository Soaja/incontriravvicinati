import type {Metadata} from 'next'

import {EditorialPage} from '../components/EditorialPage'

export const metadata: Metadata = {
  title: 'Redazione',
  description: 'La redazione di Incontri Ravvicinati.',
}

export default function RedazionePage() {
  return (
    <EditorialPage
      index="04"
      eyebrow="Persone e prospettive"
      title="Redazione"
      introduction="Una redazione plurale che racconta il cinema attraverso critica, ricerca e sperimentazione."
    >
      <section>
        <h2>Voci indipendenti</h2>
        <p>
          La pagina ospiterà autrici, autori e collaboratori della rivista, insieme
          ai loro percorsi e agli articoli pubblicati su Incontri Ravvicinati.
        </p>
      </section>
    </EditorialPage>
  )
}
