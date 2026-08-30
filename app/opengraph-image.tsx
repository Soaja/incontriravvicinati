import {readFile} from 'node:fs/promises'
import {join} from 'node:path'

import {ImageResponse} from 'next/og'

const logoData = await readFile(join(process.cwd(), 'app', 'opengraph-logo.png'), 'base64')
const logoSrc = `data:image/png;base64,${logoData}`

export const alt = 'Incontri Ravvicinati — rivista indipendente di cinema e cultura visiva'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#000',
      }}
    >
      <img
        src={logoSrc}
        alt=""
        width="1200"
        height="849"
        style={{display: 'block', width: 1200, height: 849}}
      />
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 42,
          left: 0,
          display: 'flex',
          height: 4,
          background: '#c7ff1a',
        }}
      />
    </div>,
    size,
  )
}
