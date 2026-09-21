import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Scroll Guard — Pause and Decide',
        short_name: 'Scroll Guard',
        description: 'A gentle pause between opening an app and losing an hour. Intentional scrolling, timers, and focus sessions.',
        start_url: '/app',
        scope: '/',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone', 'browser'],
        orientation: 'portrait',
        background_color: '#FDF8F1',
        theme_color: '#5B7A5F',
        categories: ['productivity', 'lifestyle', 'health'],
        lang: 'en',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/maskable-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/icons/apple-touch.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any'
          }
        ],
        shortcuts: [
          {
            name: 'Start a session',
            short_name: 'Start',
            url: '/app/home?action=start',
            description: 'Start an intentional scrolling session',
            icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }]
          },
          {
            name: 'View insights',
            url: '/app/insights',
            description: 'See your progress',
            icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }]
          }
        ],
        screenshots: [
          {
            src: '/screenshots/narrow.png',
            sizes: '540x720',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Home screen of Scroll Guard'
          },
          {
            src: '/screenshots/wide.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Desktop view'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/],
        cleanupOutdatedCaches: true
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  server: {
    host: true
  }
})
