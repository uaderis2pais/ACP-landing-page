import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'LogoApp.jpg'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'Agarrame como puedas',
        short_name: 'ACP',
        description: 'El mejor sushi de Concepción del Uruguay',
        theme_color: '#155E5D',
        background_color: '#155E5D',
        display: 'standalone',
        start_url: '/',
        id: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        screenshots: [ // <-- Esto soluciona las advertencias de la "IU más completa"
          {
            src: 'captura-pc.png',
            sizes: '1344x633',
            type: 'image/png',
            form_factor: 'wide' // Le dice a Chrome que es para Desktop
          },
          {
            src: 'captura-movil.png',
            sizes: '515x632',
            type: 'image/png' // Sin el form_factor asume que es móvil
          }
        ]
      }
    })
  ],
})
