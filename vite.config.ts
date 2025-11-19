import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icon-192.svg', 'icon-512.svg', 'screenshot-desktop.svg', 'screenshot-mobile.svg'],
        manifest: {
          short_name: "LyricScroll",
          name: "Songtext Teleprompter",
          icons: [
            {
              src: "icon-192.svg",
              type: "image/svg+xml",
              sizes: "192x192",
              purpose: "any"
            },
            {
              src: "icon-512.svg",
              type: "image/svg+xml",
              sizes: "512x512",
              purpose: "any"
            }
          ],
          screenshots: [
            {
              src: "screenshot-desktop.svg",
              sizes: "1280x720",
              type: "image/svg+xml",
              form_factor: "wide",
              label: "Desktop-Anwendungs-Screenshot"
            },
            {
              src: "screenshot-mobile.svg",
              sizes: "540x720",
              type: "image/svg+xml",
              form_factor: "narrow",
              label: "Mobile Anwendungs-Screenshot"
            }
          ],
          start_url: ".",
          scope: ".",
          display: "standalone",
          theme_color: "#111827",
          background_color: "#111827"
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        }
      })
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
