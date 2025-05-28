[[import { MetadataRoute } from 'next'
import { config } from '@/lib/config'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: config.pwa.name,
    short_name: config.pwa.short_name,
    description: config.pwa.description,
    start_url: config.pwa.start_url,
    display: config.pwa.display,
    background_color: config.pwa.background_color,
    theme_color: config.pwa.theme_color,
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
