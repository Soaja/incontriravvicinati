import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
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
