import type {Metadata} from 'next'

import {EditorialPage} from '../components/EditorialPage'

export const metadata: Metadata = {
  title: 'Contatti',
  description: 'Contatta Incontri Ravvicinati.',
}

export default function ContattiPage() {
  return (
    <EditorialPage
      index="05"
      eyebrow="Scrivici"
      title="Contatti"
      introduction="Per proposte editoriali, collaborazioni, festival, rassegne e progetti legati alla cultura visiva."
    >
      <section>
        <h2>Entriamo in contatto</h2>
        <p>
          I riferimenti ufficiali della rivista saranno pubblicati qui. Nel
          frattempo questa pagina definisce lo spazio dedicato a proposte,
          segnalazioni e collaborazioni.
        </p>
      </section>
    </EditorialPage>
  )
}
