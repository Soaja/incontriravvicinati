import type {SanityImageSource} from '@sanity/image-url'
import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'

import {urlFor} from '@/sanity/lib/image'
import {sanityFetch} from '@/sanity/lib/live'
import {EDITORIAL_TEAM_ASSETS_QUERY} from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Redazione',
  description: 'La redazione di Incontri Ravvicinati.',
}

type RosterMember = {
  name: string
  role: string
}

type AuthorAsset = {
  _id: string
  name: string | null
  slug: string | null
  role: string | null
  bio: string | null
  photo: (SanityImageSource & {alt?: string | null}) | null
}

const direction: RosterMember[] = [
  {role: 'Direttore responsabile', name: 'Giorgio Centrella'},
  {role: 'Coordinatore editoriale', name: 'Alessandro Ritrovato'},
  {role: 'Caporedattore', name: 'Penelope Beltrami'},
]

const artDirection: RosterMember[] = [
  {role: 'Grafica / Art Direction', name: 'Martina Corbani'},
  {role: 'Grafica / Art Direction', name: 'Maria Vittoria Ferraioli'},
  {role: 'Grafica / Art Direction', name: 'Martina Piazza'},
  {role: 'Grafica / Art Direction', name: 'Pamela Vinciguerra'},
]

const editors: RosterMember[] = [
  {role: 'Redattore', name: 'Luca Barbantini'},
  {role: 'Redattore', name: 'Eugenio Begato'},
  {role: 'Redattore', name: 'Lorenzo Bertoldo'},
  {role: 'Redattore', name: 'Luca Dimauro'},
  {role: 'Redattore', name: 'Alessandro Lombardi'},
]

const communication: RosterMember[] = [
  {role: 'Comunicazione / Social', name: 'Lidiya Castiglioni'},
  {role: 'Comunicazione / Social', name: 'Letizia Giribaldi'},
  {role: 'Comunicazione / Social', name: 'Ludovica Romeo'},
  {role: 'Comunicazione / Social', name: 'Angelica Salerno'},
  {role: 'Comunicazione / Social', name: 'Francesca Suman'},
  {role: 'Comunicazione / Social', name: 'Simone Sgambetterra'},
]

const editorialNames = [...direction, ...artDirection, ...editors, ...communication].map(
  ({name}) => name,
)

function MemberName({member, asset}: {member: RosterMember; asset?: AuthorAsset}) {
  return asset?.slug ? (
    <Link href={`/articoli?author=${encodeURIComponent(asset.slug)}`}>{member.name}</Link>
  ) : (
    member.name
  )
}

function SocialMemberName({member, asset}: {member: RosterMember; asset?: AuthorAsset}) {
  const [firstName, ...surnameParts] = member.name.split(' ')
  const name = (
    <>
      <span className="social-member-name__line">{firstName}</span>
      <span className="social-member-name__line">{surnameParts.join(' ')}</span>
    </>
  )

  return asset?.slug ? (
    <Link href={`/articoli?author=${encodeURIComponent(asset.slug)}`}>{name}</Link>
  ) : (
    name
  )
}

export default async function RedazionePage() {
  const {data} = await sanityFetch({
    query: EDITORIAL_TEAM_ASSETS_QUERY,
    params: {names: editorialNames},
  })
  const authorAssets = data as AuthorAsset[]
  const assetsByName = new Map(
    authorAssets.flatMap((author) => (author.name ? [[author.name, author] as const] : [])),
  )

  return (
    <main id="main-content" className="site-container redazione-page masthead-page">
      <header className="redazione-hero">
        <div className="redazione-hero__label">
          <p className="type-meta">Persone / Ruoli / Prospettive</p>
          <span aria-hidden="true">04</span>
        </div>

        <h1>La redazione</h1>
      </header>

      <section className="masthead-direction" aria-labelledby="direction-heading">
        <header className="masthead-section-header">
          <p className="type-meta">Responsabilità / 01</p>
          <h2 id="direction-heading">Direzione</h2>
        </header>

        <div className="direction-list">
          {direction.map((member, index) => {
            const asset = assetsByName.get(member.name)

            return (
              <article key={member.name} className="direction-member">
                <span aria-hidden="true">0{index + 1}</span>
                <p className="type-meta">{member.role}</p>
                <h3>
                  <MemberName member={member} asset={asset} />
                </h3>
                {asset?.bio ? <p className="direction-member__bio">{asset.bio}</p> : null}
              </article>
            )
          })}
        </div>
      </section>

      <section className="masthead-art" aria-labelledby="art-direction-heading">
        <header className="masthead-section-header masthead-section-header--negative">
          <p className="type-meta">Immagine / 02</p>
          <h2 id="art-direction-heading">Grafica e Art Direction</h2>
        </header>

        <div className="art-roster">
          {artDirection.map((member, index) => {
            const asset = assetsByName.get(member.name)

            return (
              <article
                key={member.name}
                className={`art-roster-member${asset?.photo ? ' art-roster-member--with-photo' : ''}`}
              >
                <div className="art-roster-member__label">
                  <p className="type-meta">{member.role}</p>
                  <span aria-hidden="true">A/{String(index + 1).padStart(2, '0')}</span>
                </div>

                {asset?.photo ? (
                  <div className="art-roster-member__portrait">
                    <Image
                      src={urlFor(asset.photo)
                        .width(900)
                        .height(1125)
                        .fit('crop')
                        .auto('format')
                        .url()}
                      alt={asset.photo.alt ?? `Ritratto di ${member.name}`}
                      fill
                      sizes="(max-width: 767px) 100vw, 40vw"
                    />
                  </div>
                ) : null}

                <h3>
                  <MemberName member={member} asset={asset} />
                </h3>
                {asset?.bio ? <p className="art-roster-member__bio">{asset.bio}</p> : null}
              </article>
            )
          })}
        </div>
      </section>

      <section className="masthead-editors" aria-labelledby="editors-heading">
        <header className="masthead-section-header">
          <p className="type-meta">Testi / 03</p>
          <h2 id="editors-heading">Redattori</h2>
        </header>

        <ol className="editors-roster">
          {editors.map((member, index) => {
            const asset = assetsByName.get(member.name)

            return (
              <li key={member.name}>
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <p className="type-meta">{member.role}</p>
                <h3>
                  <MemberName member={member} asset={asset} />
                </h3>
              </li>
            )
          })}
        </ol>
      </section>

      <section className="masthead-social" aria-labelledby="social-heading">
        <header className="masthead-section-header">
          <p className="type-meta">Relazioni / 04</p>
          <h2 id="social-heading">Comunicazione e Social</h2>
        </header>

        <ul className="social-roster">
          {communication.map((member, index) => {
            const asset = assetsByName.get(member.name)

            return (
              <li key={member.name}>
                <span aria-hidden="true">S/{String(index + 1).padStart(2, '0')}</span>
                <h3>
                  <SocialMemberName member={member} asset={asset} />
                </h3>
                <p className="type-meta">{member.role}</p>
              </li>
            )
          })}
        </ul>
      </section>
    </main>
  )
}
