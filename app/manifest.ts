import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SubtextDecode',
    short_name: 'Subtext',
    description: 'Decode social subtext with AI',
    start_url: '/',
    display: 'standalone',
    background_color: '#05070a',
    theme_color: '#05070a',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}