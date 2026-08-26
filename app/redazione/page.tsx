import type {SanityImageSource} from '@sanity/image-url'
import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'

import {client} from '@/sanity/lib/client'
import {urlFor} from '@/sanity/lib/image'
import {EDITORIAL_TEAM_QUERY} from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Redazione',
  description: 'La redazione di Incontri Ravvicinati.',
}

type EditorialTeamMember = {
  _id: string
  name: string | null
  slug: string | null
  role: string | null
  bio: string | null
  order: number | null
  photo: (SanityImageSource & {alt?: string | null}) | null
}

export default async function RedazionePage() {
  const team = await client.fetch<EditorialTeamMember[]>(EDITORIAL_TEAM_QUERY)

  return (
    <main id="main-content" className="site-container redazione-page">
      <header className="redazione-hero">
        <div className="redazione-hero__label">
          <p className="type-meta">Persone / Ruoli / Prospettive</p>
          <span aria-hidden="true">04</span>
        </div>

        <h1>La redazione</h1>
        <p className="redazione-hero__intro">
          Una redazione indipendente che osserva il cinema da prospettive diverse. Critica,
          ricerca, immagini e conversazioni per costruire uno spazio editoriale aperto e
          contemporaneo.
        </p>
      </header>

      <section className="editorial-team" aria-labelledby="editorial-team-heading">
        <header className="editorial-team__header">
          <h2 id="editorial-team-heading">Il team</h2>
          <p className="type-meta">Responsabilità editoriali</p>
        </header>

        {team.length > 0 ? (
          <div className="editorial-team__list">
            {team.map((member, index) => {
              const memberName = member.name ?? 'Nome non disponibile'
              const hasPhoto = Boolean(member.photo)

              return (
                <article
                  key={member._id}
                  className={`team-member${hasPhoto ? '' : ' team-member--no-photo'}`}
                >
                  <div className="team-member__index" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  {member.photo ? (
                    <div className="team-member__portrait">
                      <Image
                        src={urlFor(member.photo)
                          .width(900)
                          .height(1125)
                          .fit('crop')
                          .auto('format')
                          .url()}
                        alt={member.photo.alt ?? `Ritratto di ${memberName}`}
                        fill
                        sizes="(max-width: 767px) 100vw, 34vw"
                      />
                    </div>
                  ) : null}

                  <div className="team-member__content">
                    <p className="team-member__role type-meta">
                      {member.role ?? 'Redazione'}
                    </p>
                    <h3>{memberName}</h3>
                    {member.bio ? <p className="team-member__bio">{member.bio}</p> : null}
                    {member.slug ? (
                      <Link
                        className="team-member__articles type-meta"
                        href={`/articoli?author=${encodeURIComponent(member.slug)}`}
                      >
                        Articoli di {memberName} <span aria-hidden="true">↗</span>
                      </Link>
                    ) : null}
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="editorial-team__empty">
            <p className="type-meta">Redazione in aggiornamento</p>
            <p>
              Stiamo preparando i profili delle persone che costruiscono Incontri Ravvicinati.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}
