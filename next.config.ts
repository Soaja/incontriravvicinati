import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  trailingSlash: false,
  async headers() {
    return [{source: '/robots.txt', headers: [{key: 'Link', value: '<https://www.incontriravvicinatimag.it/rss.xml>; rel="alternate"; type="application/rss+xml"'}]}]
  },
  async redirects() {
    return [
      {
        source: '/articoli',
        has: [{type: 'query', key: 'type', value: 'selezione|altri-articoli'}],
        destination: '/articoli?type=editoriali',
        permanent: true,
      },
    ]
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [60, 75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },
}

export default nextConfig
